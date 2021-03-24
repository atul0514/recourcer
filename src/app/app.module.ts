import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// used to create fake backend
// import { fakeBackendProvider } from './_helpers';
import { AppComponent } from "./app.component";
import { appRoutingModule } from "./app.routing";

import { JwtInterceptor, ErrorInterceptor } from "./_helpers";
import { HomeComponent } from "./home";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { DataTablesModule } from "angular-datatables";
import { LeftNavComponent } from "./left-nav/left-nav.component";
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
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DownloadPdfComponent } from "./download-pdf/download-pdf.component";
import { PriceDelimiterPipe } from "./_pipes/price-delimiter.pipe";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    DataTablesModule,
    Ng2SearchPipeModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    LeftNavComponent,
    AddClientComponent,
    ClientsComponent,
    ChangePasswordComponent,
    AddCustomerComponent,
    CustomersComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    EditClientComponent,
    EditUsersComponent,
    UserProfileComponent,
    AddProjectComponent,
    ProjectsComponent,
    AddProductComponent,
    ProductsComponent,
    EditCustomerComponent,
    EditProjectComponent,
    EditProductComponent,
    ViewCustomerComponent,
    ViewProductComponent,
    ProductCategoryComponent,
    ProjectCategoryComponent,
    ViewProjectComponent,
    DownloadPdfComponent,
    PriceDelimiterPipe,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
