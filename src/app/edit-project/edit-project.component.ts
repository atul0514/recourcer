import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import Swal from "sweetalert2";
import { User } from "@app/_models";
import { UserService, AuthenticationService } from "@app/_services";
declare var $: any;

@Component({
  selector: "app-edit-project",
  templateUrl: "./edit-project.component.html",
  styleUrls: ["./edit-project.component.less"],
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
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
  status: any;
  editId: any;
  projectInfo: any;
  editimgUrl: any = "";
  fdv_document: any;
  env_report: any;
  title = "appBootstrap";
  categories: any;
  filecat: string[] = [];
  filecattext: string[] = [];
  closeResult: string;
  doc_path: any;
  yearOptions = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.yearOptions = this.generateYears(1900);
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
    this.loadingData = true;
    this.status = 1;
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
      customer: ["", Validators.required],
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
    this.loading = true;
    this.loadingData = true;
    this.editId = this.route.snapshot.paramMap.get("id");
    this.userService
      .getProjectinfo(this.editId)
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.projectInfo = data.project;
        (this.env_report = this.projectInfo.env_report),
          (this.fdv_document = this.projectInfo.fdv_document),
          (this.projectForm = this.formBuilder.group({
            project_name: this.projectInfo.project_name,
            customer: this.projectInfo.customer_id,
            project_address: this.projectInfo.project_address,
            postal_code: [
              this.projectInfo.postal_code,
              [Validators.pattern("[0-9]{4,6}")],
            ],
            postal_area: this.projectInfo.postal_area,
            project_mang_name: this.projectInfo.project_mang_name,
            project_mang_mobile: [
              this.projectInfo.project_mang_mobile,
              [Validators.pattern("[0-9]{8,12}")],
            ],
            project_mang_email: [
              this.projectInfo.project_mang_email,
              [
                Validators.pattern(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
              ],
            ],
            onsite_name: this.projectInfo.onsite_name,
            onsite_mobile: [
              this.projectInfo.onsite_mobile,
              [Validators.pattern("[0-9]{8,12}")],
            ],
            onsite_email: [
              this.projectInfo.onsite_email,
              [
                Validators.pattern(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
              ],
            ],
            project_type: this.projectInfo.project_type,
            project_status: this.projectInfo.project_status,
            property_area: [
              this.projectInfo.property_area,
              [Validators.pattern("[0-9]*")],
            ],
            no_of_floors: [
              this.projectInfo.no_of_floors,
              [Validators.pattern("[0-9]{2}")],
            ],
            building_year: this.projectInfo.building_year,
            last_refurbished: this.projectInfo.last_refurbished,
            env_report: this.projectInfo.env_report,
            fdv_document: this.projectInfo.fdv_document,
            ambition: this.projectInfo.ambition,
            project_start_date: this.projectInfo.project_start_date,
            project_catalog_date: this.projectInfo.project_catalog_date,
            project_avail_date: this.projectInfo.project_avail_date,
            project_avail_end_date: this.projectInfo.project_avail_end_date,
            note: this.projectInfo.note,
            billing_project_company: this.projectInfo.billing_project_company,
            billing_project_number: this.projectInfo.billing_project_number,
            billing_customer_ref: this.projectInfo.billing_customer_ref,
            billing_address: this.projectInfo.billing_address,
            billing_orgno: this.projectInfo.billing_orgno,
            billing_postal_code: [
              this.projectInfo.billing_postal_code,
              [Validators.pattern("[0-9]{4,6}")],
            ],
            billing_postal_area: this.projectInfo.billing_postal_area,
            credit_period: this.projectInfo.credit_period,
          }));
        if (this.projectInfo.project_image) {
          this.editimgUrl =
            data.image_base_path + "/" + this.projectInfo.project_image;
        }
        this.doc_path = data.image_base_path;
      });
    // get return url from route parameters or default to '/'
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

  deletedoc(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.userService
            .deleteProjectDoc(id)
            .pipe(first())
            .subscribe((data) => {
              this.loading = false;
              if (data.status == "1") {
                this.projectInfo.pr;
                this.projectInfo.projectdocs.forEach((item, index) => {
                  if (item.id === id)
                    this.projectInfo.projectdocs.splice(index, 1);
                });
                Swal.fire("", data.message, "success");
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
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
      if (this.filesmulti.length > 0) {
        for (var i = 0; i < this.filesmulti.length; i++) {
          formData.append("imagemultiFile[]", this.filesmulti[i]);
          formData.append("filecategory[]", this.filecat[i]);
        }
      }
    }
    if (this.fileToUpload) {
      formData.set("imageFile", this.fileToUpload, this.fileToUpload.name);
    }
    formData.append("customer", this.projectForm.controls["customer"].value);
    formData.append("id", this.editId);
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
      .editProject(formData)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loading = false;
          this.loadingData = false;
          if (data.status == "1") {
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
