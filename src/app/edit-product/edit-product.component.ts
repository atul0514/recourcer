import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { User } from "@app/_models";
import { UserService, AuthenticationService } from "@app/_services";
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.less"],
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
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
  projects: any;
  filesmulti: string[] = [];
  status: any;
  editId: any;
  productInfo: any;
  editimgUrl: any = "";
  categories: any;
  projectcategories: any;
  filecat: string[] = [];
  filecattext: string[] = [];
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
    this.loadingData = true;
    //this.status = 1;
    this.userService
      .getprojects()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.projects = data.projects;
      });
    this.userService
      .getProductCategories()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.categories = data.categories;
      });
    this.userService
      .getProjectCategories()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.projectcategories = data.categories;
      });
    this.productForm = this.formBuilder.group({
      product_name: ["", Validators.required],
      project_id: ["", Validators.required],
      product_id: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      category: [""],
      building_part: [""],
      unit: [""],
      unitqnt: [""],
      quantity: ["", [Validators.max(999999999), Validators.min(0)]],
      length: ["", [Validators.max(999999999), Validators.min(0)]],
      width: ["", [Validators.max(999999999), Validators.min(0)]],
      height: ["", [Validators.max(999999999), Validators.min(0)]],
      production_year: [""],
      location_building: [""],
      brand_name: [""],
      documentation: [""],
      product_info: [""],
      color: [""],
      hazardous: [""],
      evaluvation: [""],
      precondition: [""],
      reuse: [""],
      recommendation: [""],
      price_new_product: ["", [Validators.max(999999999), Validators.min(0)]],
      price_used_product: ["", [Validators.max(999999999), Validators.min(0)]],
      price_sold_product: ["", [Validators.max(999999999), Validators.min(0)]],
    });
    this.loading = true;
    this.loadingData = true;
    this.editId = this.route.snapshot.paramMap.get("id");
    this.userService
      .getProductinfo(this.editId)
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.productInfo = data.product;
        this.productForm = this.formBuilder.group({
          product_name: this.productInfo.product_name,
          project_id: this.productInfo.project_id,
          product_id: this.productInfo.product_id,
          description: this.productInfo.description,
          category: this.productInfo.category,
          building_part: this.productInfo.building_part,
          unit: this.productInfo.unit,
          unitqnt: this.productInfo.unitqnt,
          quantity: this.productInfo.quantity,
          length: this.productInfo.length,
          width: this.productInfo.width,
          height: this.productInfo.height,
          production_year: this.productInfo.production_year,
          location_building: this.productInfo.location_building,
          brand_name: this.productInfo.brand_name,
          documentation: this.productInfo.documentation,
          product_info: this.productInfo.product_info,
          color: this.productInfo.color,
          hazardous: this.productInfo.hazardous,
          evaluvation: this.productInfo.evaluvation,
          precondition: this.productInfo.precondition,
          reuse: this.productInfo.reuse,
          recommendation: this.productInfo.recommendation,
          price_new_product: this.productInfo.price_new_product,
          status: this.productInfo.status,
          price_used_product: this.productInfo.price_used_product,
          price_sold_product: this.productInfo.price_sold_product,
        });
        if (this.productInfo.product_image) {
          this.editimgUrl =
            data.image_base_path + "/" + this.productInfo.product_image;
        }
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

  // convenience getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    // this.productForm = this.formBuilder.group({
    //   product_name: ['', Validators.required],
    //   project_id: ['', Validators.required],
    //   product_id: ['', Validators.required],
    //   description: ['', Validators.required],
    //   status: ['', Validators.required],
    //   quantity: ['', [Validators.max(999999999), Validators.min(0)]],
    //   length: ['', [Validators.max(999999999), Validators.min(0)]],
    //   width: ['', [Validators.max(999999999), Validators.min(0)]],
    //   height: ['', [Validators.max(999999999), Validators.min(0)]],
    //   price_new_product: ['', [Validators.max(999999999), Validators.min(0)]],
    //   price_used_product: ['', [Validators.max(999999999), Validators.min(0)]],
    //   price_sold_product: ['', [Validators.max(999999999), Validators.min(0)]]
    // });
    this.submitted = true;

    // stop here if form is invalid
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    this.loadingData = true;
    console.log(this.productForm.value);
    console.log(JSON.stringify(this.productForm.value));
    //this.formData.append('data', JSON.stringify(this.customerForm.value));
    console.log(this.filemultiUpload);
    var formData = new FormData();
    if (this.fileToUpload) {
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
    formData.append(
      "project_id",
      this.productForm.controls["project_id"].value
    );
    formData.append(
      "product_id",
      this.productForm.controls["product_id"].value
    );
    formData.append("id", this.editId);
    formData.append(
      "description",
      this.productForm.controls["description"].value
    );
    formData.append(
      "product_name",
      this.productForm.controls["product_name"].value
    );
    formData.append("category", this.productForm.controls["category"].value);
    formData.append(
      "building_part",
      this.productForm.controls["building_part"].value
    );
    formData.append("unit", this.productForm.controls["unit"].value);
    formData.append("unitqnt", this.productForm.controls["unitqnt"].value);
    formData.append("quantity", this.productForm.controls["quantity"].value);
    formData.append("height", this.productForm.controls["height"].value);
    formData.append("width", this.productForm.controls["width"].value);
    formData.append("length", this.productForm.controls["length"].value);
    formData.append("production_year", $("#production_year").val());
    formData.append(
      "location_building",
      this.productForm.controls["location_building"].value
    );
    formData.append(
      "brand_name",
      this.productForm.controls["brand_name"].value
    );
    formData.append(
      "documentation",
      this.productForm.controls["documentation"].value
    );
    formData.append("color", this.productForm.controls["color"].value);
    formData.append("hazardous", this.productForm.controls["hazardous"].value);
    formData.append(
      "product_info",
      this.productForm.controls["product_info"].value
    );
    formData.append(
      "evaluvation",
      this.productForm.controls["evaluvation"].value
    );
    formData.append(
      "precondition",
      this.productForm.controls["precondition"].value
    );
    formData.append("reuse", this.productForm.controls["reuse"].value);
    formData.append(
      "recommendation",
      this.productForm.controls["recommendation"].value
    );
    formData.append(
      "price_new_product",
      this.productForm.controls["price_new_product"].value
    );
    formData.append("status", this.productForm.controls["status"].value);
    formData.append(
      "price_used_product",
      this.productForm.controls["price_used_product"].value
    );
    formData.append(
      "price_sold_product",
      this.productForm.controls["price_sold_product"].value
    );

    console.log(formData);

    this.userService
      .editProduct(formData)
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
          this.router.navigate(["/products"]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
          this.loadingData = false;
        }
      );
  }
}
