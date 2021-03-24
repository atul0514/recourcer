import { Component, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

import { AuthenticationService } from "./_services";
import { User } from "./_models";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent implements OnInit {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }
  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
  onActivate(event) {
    console.log(event);
  }
  onDeactivate(event) {}
}
