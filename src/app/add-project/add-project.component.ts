import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import Swal from "sweetalert2";
import { User } from "@app/_models";
import { UserService, AuthenticationService } from "@app/_services";
import { AuthGuard } from "@app/_helpers";
declare var $: any;

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.less"],
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;
  yearOptions = [];
  currentUser: User;
  loading = false;
  loadingData = false;
  submitted = false;
  returnUrl: string;
  error = "";
  info: string;
  public imagePath;
  imgURL: any = "";
  public message: string;
  fileToUpload: File = null;
  filemultiUpload: File = null;
  formData = new FormData();
  customers: any;
  filesmulti: string[] = [];
  fdv_document: any;
  env_report: any;
  title = "appBootstrap";
  categories: any;
  filecat: string[] = [];
  filecattext: string[] = [];
  closeResult: string;
  changesCounter: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private authGuard: AuthGuard
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.yearOptions = this.generateYears(1900);
    this.loadingData = true;
    this.fdv_document = 0;
    this.env_report = 0;

    this.userService
      .getcustomers()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.customers = data.customers;
      });
    this.userService
      .getProjectCategories()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.categories = data.categories;
      });
    this.projectForm = this.formBuilder.group({
      project_name: ["", Validators.required],
      customer: this.route.snapshot.queryParams["param_id"]
        ? this.route.snapshot.queryParams["param_id"]
        : ["", Validators.required],
      project_address: [""],
      postal_code: ["", Validators.pattern("[0-9]{4,6}")],
      postal_area: [""],
      project_mang_name: [""],
      project_mang_mobile: ["", Validators.pattern("[0-9]{8,12}")],
      project_mang_email: [
        "",
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ],
      onsite_name: [""],
      onsite_mobile: ["", Validators.pattern("[0-9]{8,12}")],
      onsite_email: [
        "",
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ],
      project_type: [""],
      project_status: [""],
      property_area: ["", Validators.pattern("[0-9]*")],
      no_of_floors: ["", Validators.pattern("[0-9]{2}")],
      building_year: [""],
      last_refurbished: [""],
      env_report: [""],
      fdv_document: [""],
      ambition: [""],
      project_start_date: [""],
      project_catalog_date: [""],
      project_avail_date: [""],
      project_avail_end_date: [""],
      note: [""],
      billing_project_company: [""],
      billing_orgno: [""],
      billing_project_number: [""],
      billing_customer_ref: [""],
      billing_address: [""],
      billing_postal_code: ["", Validators.pattern("[0-9]{4,6}")],
      billing_postal_area: [""],
      credit_period: [""],
    });
    $(".only_year").datetimepicker({
      format: "yyyy",
      startView: "decade",
      minView: "decade",
      viewSelect: "decade",
      autoclose: true,
      pickerPosition: "bottom-left",
      fontAwesome: true,
    });
    $(".fulldate").datetimepicker({
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0,
      pickerPosition: "bottom-left",
      fontAwesome: true,
    });
    // get return url from route parameters or default to '/'
    this.projectForm.statusChanges.subscribe((status) => {
      console.log(this.projectForm);
      this.changesCounter++;
      if (this.changesCounter > 4) AuthGuard.blocked = true;
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  generateYears(start: number) {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let i = start; i < currentYear + 3; i++) {
      years.push(i);
    }
    return years.reverse();
  }
  preview(files) {
    console.log(files);
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.fileToUpload = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  addcategory() {
    let category_name = $("#categories option:selected").val();
    if (category_name == "") {
      Swal.fire("Please select Category", "", "error");
      return false;
    }
    var files = $("#fileupload")[0].files;
    console.log(files);
    if (files.length === 0) return;
    var reader = new FileReader();
    for (let i = 0; i < files.length; i++) {
      this.filesmulti.push(files[i]);
    }
    this.filecat.push($("#categories option:selected").val());
    this.filecattext.push($("#categories option:selected").text());
    $("#categories").val("");
    $("#fileupload").val(null);
  }

  delete_add(key) {
    this.filesmulti.forEach((element, index) => {
      if (key == index) this.filesmulti.splice(index, 1);
    });
    this.filecat.forEach((element, index) => {
      if (key == index) this.filecat.splice(index, 1);
    });
    this.filecattext.forEach((element, index) => {
      if (key == index) this.filecattext.splice(index, 1);
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.projectForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.projectForm.invalid) {
      return;
    }

    this.loading = true;
    this.loadingData = true;
    console.log(this.projectForm.value);
    console.log(JSON.stringify(this.projectForm.value));
    //this.formData.append('data', JSON.stringify(this.customerForm.value));
    console.log(this.filemultiUpload);
    var formData = new FormData();
    if (this.filesmulti) {
      for (var i = 0; i < this.filesmulti.length; i++) {
        formData.append("imagemultiFile[]", this.filesmulti[i]);
        formData.append("filecategory[]", this.filecat[i]);
      }
    }
    if (this.fileToUpload) {
      formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
    }
    formData.append("customer", this.projectForm.controls["customer"].value);
    formData.append(
      "project_address",
      this.projectForm.controls["project_address"].value
    );
    formData.append(
      "project_name",
      this.projectForm.controls["project_name"].value
    );
    formData.append(
      "postal_code",
      this.projectForm.controls["postal_code"].value
    );
    formData.append(
      "postal_area",
      this.projectForm.controls["postal_area"].value
    );
    formData.append(
      "project_mang_name",
      this.projectForm.controls["project_mang_name"].value
    );
    formData.append(
      "project_mang_mobile",
      this.projectForm.controls["project_mang_mobile"].value
    );
    formData.append(
      "project_mang_email",
      this.projectForm.controls["project_mang_email"].value
    );
    formData.append(
      "onsite_name",
      this.projectForm.controls["onsite_name"].value
    );
    formData.append(
      "onsite_mobile",
      this.projectForm.controls["onsite_mobile"].value
    );
    formData.append(
      "onsite_email",
      this.projectForm.controls["onsite_email"].value
    );
    formData.append(
      "project_type",
      this.projectForm.controls["project_type"].value
    );
    formData.append(
      "project_status",
      this.projectForm.controls["project_status"].value
    );
    formData.append(
      "property_area",
      this.projectForm.controls["property_area"].value
    );
    formData.append(
      "no_of_floors",
      this.projectForm.controls["no_of_floors"].value
    );
    formData.append("building_year", $("#building_year").val());
    formData.append("last_refurbished", $("#last_refurbished").val());
    formData.append(
      "env_report",
      this.projectForm.controls["env_report"].value
    );
    formData.append(
      "fdv_document",
      this.projectForm.controls["fdv_document"].value
    );
    formData.append("ambition", this.projectForm.controls["ambition"].value);
    formData.append("project_start_date", $("#project_start_date").val());
    formData.append("project_catalog_date", $("#project_catalog_date").val());
    formData.append("project_avail_date", $("#project_avail_date").val());
    formData.append(
      "project_avail_end_date",
      $("#project_avail_end_date").val()
    );
    formData.append("note", this.projectForm.controls["note"].value);
    formData.append(
      "billing_project_company",
      this.projectForm.controls["billing_project_company"].value
    );
    formData.append(
      "billing_orgno",
      this.projectForm.controls["billing_orgno"].value
    );
    formData.append(
      "billing_project_number",
      this.projectForm.controls["billing_project_number"].value
    );
    formData.append(
      "billing_customer_ref",
      this.projectForm.controls["billing_customer_ref"].value
    );
    formData.append(
      "billing_address",
      this.projectForm.controls["billing_address"].value
    );
    formData.append(
      "billing_postal_code",
      this.projectForm.controls["billing_postal_code"].value
    );
    formData.append(
      "billing_postal_area",
      this.projectForm.controls["billing_postal_area"].value
    );
    formData.append("credit_period", $("#credit_period").val());

    console.log(formData);

    this.userService
      .addProject(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loading = false;
          this.loadingData = false;
          if (data.status == "1") {
            Swal.fire(data.project_id, "Project Added Sucessfully", "success");
            this.info = data.message;
          } else {
            this.error = data.message;
          }
          this.router.navigate(["/projects"]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
          this.loadingData = false;
        }
      );
  }

  credit_period(obj) {
    if (obj == 1) {
      $("#credit_period").val("");
      $("#credit_period").show();
      $("#credit_period").removeAttr("readonly");
    } else {
      $("#credit_period").attr("readonly", "true");
      $("#credit_period").hide();
      $("#credit_period").val(obj);
    }
  }
}
