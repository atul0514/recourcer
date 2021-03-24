import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { first } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "@app/_models";
import { UserService, AuthenticationService } from "@app/_services";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "@environments/environment";
import { DataTableDirective } from "angular-datatables";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CatalogService } from "@app/_services/catalog.service";

import Swal from "sweetalert2";
// import * as $ from 'jquery';
declare var $: any;

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.less"],
})
export class ProductsComponent implements OnDestroy, OnInit {
  //dtOptions: DataTables.Settings = {};
  loading = false;
  loadingData = false;
  products: any;
  productslist: any;
  listView: boolean = false;
  gridView: boolean = true;
  image_base_path: any = "";
  productInfo: any = "";
  dtOptions: any;
  projectobj: any;
  filterData: any;
  project_count: any;
  projects: any;
  customers: any;
  customer_count: any;
  filterProject = [];
  finalProject = [];
  customer_filter = [];
  project_filter = [];
  status_filter = [];
  category_filter = [];

  customer_filter_text = [];
  project_filter_text = [];
  status_filter_text = [];
  category_filter_text = [];
  showSearchKeys: boolean = false;
  product_category: any;
  product_category_count: any;
  status_types: any;
  term: string;
  filter_record;
  totalrecord;
  PDFProduct = [];
  productPDFCategory: FormGroup;
  PDFProductProject = [];
  filterFlag = true;
  pagenumber: any = 1;
  loadmoreflag: boolean = true;
  selectAll: boolean = false;

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  constructor(
    private userService: UserService,
    public router: Router,
    private catalogService: CatalogService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loadingData = true;
    this.userService
      .getFilterData()
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        this.customer_count = data.customer_count;
        this.customers = data.customers;
        this.project_count = data.project_count;
        this.projects = data.projects;
        this.status_types = data.status_type;
        this.product_category_count = data.product_category_count;
        this.product_category = data.product_category;
        //this.image_base_path = data.image_base_path;
      });
    this.projectobj = this.route.snapshot.queryParams["param_id"];
    console.log(this.projectobj);
    $(".dataTables_filter").hide();
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 50,
      serverSide: true,
      processing: true,
      scrollX: true,
      dom: '<"top"lr>rt<"bottom"ip><"clear">',
      // Configure the buttons
      //   buttons: [{
      //     extend: 'pdfHtml5',
      //     text: 'PDF',
      //     exportOptions: {
      //         modifier: {
      //             page: 'current'
      //         }
      //     }
      // }, 'print'],
      ajax: (dataTablesParameters: any, callback) => {
        //console.log(this.projectobj);
        //dataTablesParameters.search.value = this.projectobj;
        if (this.projectobj) {
          dataTablesParameters.project = this.projectobj;
        }
        if (this.project_filter.length > 0) {
          dataTablesParameters.project_filter = this.project_filter;
        }
        if (this.customer_filter.length > 0) {
          dataTablesParameters.customer_filter = this.customer_filter;
        }
        if (this.category_filter.length > 0) {
          dataTablesParameters.category_filter = this.category_filter;
        }
        if (this.status_filter.length > 0) {
          dataTablesParameters.status_filter = this.status_filter;
        }
        that.http
          .post<DataTablesResponse>(
            `${environment.apiUrl}/products`,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            that.products = resp.data;

            this.loading = false;
            this.loadingData = false;
            if (resp.data.length > 0) {
              this.totalrecord = resp.data[0].total_count;
              this.filter_record = resp.recordsFiltered;
              this.image_base_path = resp.data[0].image_base_path;
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },
      columns: [
        {
          data: "checkbox",
          name: "checkbox",
          orderable: false,
          searchable: false,
          render: function (data: any, type: any, full: any) {
            //console.log(full);
            var link =
              "<div class='round'><input type='checkbox' id='checkbox" +
              full.id +
              "' name='prod_id' class='redirect' data-project-id= " +
              full.project_id +
              " view-attribute-id=" +
              full.id +
              "><label for='checkbox" +
              full.id +
              "'></label></div>";
            return link;
          },
        },
        { data: "product_id", name: "product_id" },
        { data: "product_name", name: "product_name" },
        { name: "product_categories.category_name", data: "category_name" },
        { data: "price_new_product" },
        { data: "quantity" },
        { data: "dimention" },
        { data: "description" },
        { data: "status" },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $(".redirect", row).unbind("click");
        $(".redirect", row).bind("click", (event) => {
          if (event.target.checked) {
            let project_id = $(event.target).attr("data-project-id");
            let product_id = $(event.target).attr("view-attribute-id");
            this.PDFProduct.push(product_id);
            this.PDFProductProject.push(project_id);
          } else {
            let project_id = $(event.target).attr("data-project-id");
            let product_id = $(event.target).attr("view-attribute-id");
            this.PDFProduct = this.PDFProduct.filter(function (s) {
              return s !== product_id;
            });
            this.PDFProductProject = this.PDFProductProject.filter(function (
              s
            ) {
              return s !== project_id;
            });
          }
          console.log(this.PDFProduct);
          console.log(this.PDFProductProject);
        });
        return row;
      },
    };
    this.getgridData();
  }
  onSelectHead() {
    this.selectAll = !this.selectAll;
    $("input[type=checkbox]").prop("checked", this.selectAll);
    if (this.selectAll) {
      this.products.forEach((product) => {
        this.PDFProduct.push(product.id);
        this.PDFProductProject.push(product.project_id);
      });
      console.log(this.PDFProduct);
    } else {
      this.PDFProduct = [];
      this.PDFProductProject = [];
    }
  }
  viewType(type) {
    if (type == "list") {
      this.listView = true;
      this.gridView = false;
      this.filterFlag = true;
    } else {
      this.listView = false;
      this.gridView = true;
      this.filterFlag = false;
    }
  }

  search(value) {
    this.listView = true;
    this.gridView = false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value);
      dtInstance.draw();
    });
    // this.userService.searchProduct(value).pipe(first()).subscribe(data => {
    //     this.loading = false;
    //     this.loadingData = false;
    //     this.products = data.products;
    //     this.image_base_path = data.image_base_path;
    // });
  }

  viewProduct(data) {
    this.productInfo = data;
  }

  back() {
    this.productInfo = "";
    this.listView = true;
  }

  deleteProduct(product_id) {
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
            .deleteProduct(product_id)
            .pipe(first())
            .subscribe((data) => {
              this.loading = false;
              if (data.status == "1") {
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

  ngOnDestroy(): void {}

  filter() {
    var $slider = $(".mydiv");
    $slider.animate({
      right: parseInt($slider.css("right"), 0) == -250 ? 0 : -250,
    });
  }

  closeFilter() {
    var $slider = $(".mydiv");
    $slider.animate({
      right: parseInt($slider.css("right"), 0) == 0 ? -250 : 0,
    });
  }

  showProject(event) {
    this.showSearchKeys = false;
    if (event.target.checked) {
      this.projects[event.target.value].forEach((element) => {
        this.filterProject.push(element);
      });
      this.customer_filter.push(event.target.value);
      this.customer_filter_text.push(event.path[1].innerText);
    } else {
      console.log(event.target.value);
      this.filterProject = this.filterProject.filter(function (eachdata) {
        return eachdata.customer_id != event.target.value;
      });
      this.customer_filter = this.customer_filter.filter(function (s) {
        return s != event.target.value;
      });
      this.customer_filter_text = this.customer_filter_text.filter(function (
        s
      ) {
        return s != event.path[1].innerText;
      });
      //console.log(this.filterProject);
    }
  }

  custmerSelect(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.customers.length; i++) {
        this.customers[i].isChecked = 1;
        this.customer_filter.push(this.customers[i].id);

        console.log(this.customers[i].id);
        console.log(this.projects);
        if (this.projects[this.customers[i].id]) {
          this.projects[this.customers[i].id].forEach((element) => {
            this.filterProject.push(element);
          });
        }
      }
    } else {
      console.log("remove");
      for (let i = 0; i < this.customers.length; i++) {
        this.customers[i].isChecked = 0;
        this.filterProject = [];
        this.customer_filter = [];
      }
    }
  }

  projectSelect(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.filterProject.length; i++) {
        this.filterProject[i].isChecked = 1;
        this.project_filter.push(this.filterProject[i].id);
        this.project_filter_text.push(event.path[1].innerText);
      }
    } else {
      for (let i = 0; i < this.filterProject.length; i++) {
        this.filterProject[i].isChecked = 0;
        this.project_filter = [];
      }
    }
  }

  categorySelect(event) {
    if (event.target.checked) {
      for (let i = 0; i < this.product_category.length; i++) {
        this.product_category[i].isChecked = 1;
        this.category_filter.push(this.product_category.id);
      }
    } else {
      for (let i = 0; i < this.product_category.length; i++) {
        this.product_category[i].isChecked = 0;
      }
      this.category_filter = [];
    }
  }
  addProject(event) {
    this.showSearchKeys = false;
    if (event.target.checked) {
      this.project_filter.push(event.target.value);
      this.project_filter_text.push(event.path[1].innerText);
      console.log(event);
    } else {
      this.project_filter = this.project_filter.filter(function (s) {
        return s !== event.target.value;
      });
      this.project_filter_text = this.project_filter_text.filter(function (s) {
        return s != event.path[1].innerText;
      });
    }
  }

  addStatus(event) {
    this.showSearchKeys = false;
    if (event.target.checked) {
      this.status_filter.push(event.target.value);
      this.status_filter_text.push(event.path[1].innerText);
    } else {
      this.status_filter = this.status_filter.filter(function (s) {
        return s !== event.target.value;
      });
      this.status_filter_text = this.status_filter_text.filter(function (s) {
        return s != event.path[1].innerText;
      });
    }
  }
  addCategory(event) {
    this.showSearchKeys = false;
    if (event.target.checked) {
      this.category_filter.push(event.target.value);
      this.category_filter_text.push(event.path[1].innerText);
    } else {
      this.category_filter = this.category_filter.filter(function (s) {
        return s !== event.target.value;
      });
      this.category_filter_text = this.category_filter_text.filter(function (
        s
      ) {
        return s != event.path[1].innerText;
      });
    }
  }
  applyFilter() {
    console.log(this.customer_filter);
    console.log(this.project_filter);
    console.log(this.status_filter);
    console.log(this.category_filter);
    this.showSearchKeys = true;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.search(value);
      dtInstance.draw();
    });
  }

  resetFilter() {
    this.customer_filter = [];
    this.project_filter = [];
    this.status_filter = [];
    this.category_filter = [];
    this.customer_filter_text = [];
    this.project_filter_text = [];
    this.status_filter_text = [];
    this.category_filter_text = [];
    this.showSearchKeys = false;
    for (let i = 0; i < this.customers.length; i++) {
      this.customers[i].isChecked = 0;
    }
    for (let i = 0; i < this.filterProject.length; i++) {
      this.filterProject[i].isChecked = 0;
    }
    for (let i = 0; i < this.product_category.length; i++) {
      this.product_category[i].isChecked = 0;
    }
    for (let i = 0; i < this.status_types.length; i++) {
      this.status_types[i].isChecked = 0;
    }

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      //dtInstance.search(value);
      dtInstance.draw();
    });
  }

  pdf() {
    // if(this.PDFProduct.length == 0) {
    //   Swal.fire('', 'Please select Product', 'error');
    //   return false;
    // }
    ($("#PDFModal") as any).modal("show");
  }

  viewpdf(product_id, event) {
    console.log(product_id);
    console.log(event);
    if (event.target.checked) {
      this.PDFProduct.push(event.target.value);
    } else {
      this.PDFProduct = this.PDFProduct.filter(function (s) {
        return s !== event.target.value;
      });
    }
  }

  genratePDF() {
    //this.PDFProduct = [28,23];
    //this.PDFProductProject = [17];
    this.catalogService
      .getpdfData(this.PDFProduct, this.PDFProductProject)
      .pipe(first())
      .subscribe((data) => {
        //this.image_base_path = data.image_base_path;
        console.log(data);
        localStorage.setItem("pdfData", data.html);
        //this.router.navigate(['/download-catalog']);
        window.open("/download-catalog", "_blank");
      });
  }

  loadMore() {
    this.pagenumber++;
    this.getgridData();
  }

  getgridData() {
    this.userService
      .getproductsgrid(this.pagenumber)
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        if (this.pagenumber == "1") {
          if (data.products.length < 12) {
            this.loadmoreflag = false;
          }
          this.productslist = data.products;
          console.log(this.productslist); // ---> No Project_id is present
        } else {
          if (data.products.length > 0) {
            data.products.forEach((element) => {
              //console.log(element);
              this.productslist.push(element);
            });
            if (data.products.length < 12) {
              this.loadmoreflag = false;
            }
            //this.projectslist.push(data.projects);
            console.log(this.productslist);
          } else {
            this.loadmoreflag = false;
          }
        }

        this.image_base_path = data.image_base_path;
      });
  }
}
