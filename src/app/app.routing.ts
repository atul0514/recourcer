import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { AddClientComponent } from "./add-client/add-client.component";
import { ClientsComponent } from "./clients/clients.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { AddCustomerComponent } from "./add-customer/add-customer.component";
import { CustomersComponent } from "./customers/customers.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { EditClientComponent } from "./edit-client/edit-client.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ProjectsComponent } from "./projects/projects.component";
import { AddProjectComponent } from "./add-project/add-project.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { ProductsComponent } from "./products/products.component";
import { EditCustomerComponent } from "./edit-customer/edit-customer.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { EditProjectComponent } from "./edit-project/edit-project.component";
import { ViewCustomerComponent } from "./view-customer/view-customer.component";
import { ViewProductComponent } from "./view-product/view-product.component";
import { ProductCategoryComponent } from "./product-category/product-category.component";
import { ProjectCategoryComponent } from "./project-category/project-category.component";
import { ViewProjectComponent } from "./view-project/view-project.component";
import { DownloadPdfComponent } from "./download-pdf/download-pdf.component";
import { AuthGuard } from "./_helpers";

const routes: Routes = [
  { path: "users", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  {
    path: "user-register",
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-client",
    component: AddClientComponent,
    canActivate: [AuthGuard],
  },
  { path: "clients", component: ClientsComponent, canActivate: [AuthGuard] },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-customer",
    component: AddCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "customers",
    component: CustomersComponent,
    canActivate: [AuthGuard],
  },
  { path: "forget-password", component: ForgetPasswordComponent },
  { path: "reset-password/:id", component: ResetPasswordComponent },
  {
    path: "edit-client/:id",
    component: EditClientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-user/:id",
    component: EditUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-project",
    component: AddProjectComponent,
    canActivate: [AuthGuard],
  },
  { path: "projects", component: ProjectsComponent, canActivate: [AuthGuard] },
  {
    path: "add-product",
    component: AddProductComponent,
    canActivate: [AuthGuard],
  },
  { path: "products", component: ProductsComponent, canActivate: [AuthGuard] },
  {
    path: "edit-customer/:id",
    component: EditCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-product/:id",
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-project/:id",
    component: EditProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view-customer/:id",
    component: ViewCustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view-product/:id",
    component: ViewProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "categories",
    component: ProductCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "file-categories",
    component: ProjectCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view-project/:id",
    component: ViewProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "download-catalog",
    component: DownloadPdfComponent,
    canActivate: [AuthGuard],
  },

  // otherwise redirect to home
  { path: "**", redirectTo: "login" },
];

export const appRoutingModule = RouterModule.forRoot(routes, {
  onSameUrlNavigation: "reload",
  enableTracing: false,
});
