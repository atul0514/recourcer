import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "@app/_services";
@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  static blocked: boolean = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (AuthGuard.blocked) {
      let res = confirm(
        "You have unsaved changes. Do you still want to continue??"
      );
      console.log(res);
      if (!res) {
        console.log("Navigation rejected");
        return false;
      } else AuthGuard.blocked = false;
    }
    if (currentUser) {
      if (
        (state.url.includes("users") ||
          state.url.includes("clients") ||
          state.url.includes("client") ||
          state.url.includes("user") ||
          state.url.includes("categories") ||
          state.url.includes("file-categories")) &&
        currentUser.role == 1
      ) {
        localStorage.removeItem("currentUser");
        location.reload(true);
        return false;
      } else if (
        (state.url.includes("customers") ||
          state.url.includes("customer") ||
          state.url.includes("projects") ||
          state.url.includes("project") ||
          state.url.includes("products") ||
          state.url.includes("product") ||
          state.url.includes("download-catalog")) &&
        currentUser.role == 0
      ) {
        localStorage.removeItem("currentUser");
        location.reload(true);
        return false;
      } else {
        // logged in so return true
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
