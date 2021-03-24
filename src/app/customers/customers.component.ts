import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { first } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";

import { User } from "@app/_models";
import { UserService, AuthenticationService } from "@app/_services";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "@environments/environment";
import { DataTableDirective } from "angular-datatables";
import Swal from "sweetalert2";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.less"],
})
export class CustomersComponent implements OnDestroy, OnInit {
  loading = false;
  loadingData = false;
  customers: any;
  listView: boolean = false;
  gridView: boolean = true;
  image_base_path: any = "";
  currentUser: User;
  customerInfo: any = "";
  products_count: any;
  dtOptions: any;
  pagenumber: any = 1;
  loadmoreflag: boolean = true;
  customerslists: any;
  countries = {
    1: "India",
    2: "Norway",
    3: "France",
    4: "Italy",
    5: "UK",
    6: "Sweden",
    7: "Germany",
    8: "Poland",
  };
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loading = true;
    this.loadingData = true;
    $(".dataTables_filter").hide();
    const that = this;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 50,
      serverSide: true,
      processing: true,
      scrollX: true,
      dom: '<"top"lr>rt<"bottom"ip><"clear">',
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            `${environment.apiUrl}/customers`,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            that.customers = resp.data;
            this.customers.forEach((customer) => {
              customer.country = this.countries[customer.country];
            });
            this.loading = false;
            this.loadingData = false;
            if (resp.data.length > 0) {
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
        { data: "DT_RowIndex", orderable: false, searchable: false },
        { data: "customer_name", name: "customer_name" },
        { data: "projects_count", name: "projects_count", searchable: false },
        { name: "products_count", data: "products_count", searchable: false },
        { name: "country", data: "country" },
        { data: "postal_area" },
      ],
    };
    this.getgridData();
  }

  viewType(type) {
    if (type == "list") {
      this.listView = true;
      this.gridView = false;
    } else {
      this.listView = false;
      this.gridView = true;
    }
  }

  search(value) {
    //this.loading = true;
    //this.loadingData = true;
    this.listView = true;
    this.gridView = false;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value);
      dtInstance.draw();
    });
    // this.userService.search(value).pipe(first()).subscribe(data => {
    //     this.loading = false;
    //     this.loadingData = false;
    //     this.customers = data.customers;
    //     this.image_base_path = data.image_base_path;
    // });
  }

  viewCustomer(data) {
    this.customerInfo = data;
  }

  back() {
    this.customerInfo = "";
    this.listView = true;
  }

  deleteCustomer(customer_id) {
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
            .deleteCustomer(customer_id)
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

  loadMore() {
    this.pagenumber++;
    this.getgridData();
  }

  getgridData() {
    this.userService
      .getcustomerssgrid(this.pagenumber)
      .pipe(first())
      .subscribe((data) => {
        this.loading = false;
        this.loadingData = false;
        if (this.pagenumber == "1") {
          if (data.customers.length < 12) {
            this.loadmoreflag = false;
          }
          this.customerslists = data.customers;
          console.log(this.customerslists);
        } else {
          if (data.customers.length > 0) {
            data.customers.forEach((element) => {
              //console.log(element);
              this.customerslists.push(element);
            });
            //this.projectslist.push(data.projects);
            console.log(this.customerslists);
            if (data.customers.length < 12) {
              this.loadmoreflag = false;
            }
          } else {
            this.loadmoreflag = false;
          }
        }

        this.image_base_path = data.image_base_path;
      });
  }
}
