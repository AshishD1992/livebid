import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import _ from 'lodash';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ac-statement',
  templateUrl: './ac-statement.component.html',
  styleUrls: ['./ac-statement.component.scss'],
  providers: [ DatePipe ]

})
export class AcStatementComponent implements OnInit {

  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  filter = "0"
  statementsData = [];
  data: any;
  Data: any;


 
  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  loader: boolean = false;

  constructor(private reportService: ReportService,private dateformat:DatePipe,private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.initDatatable();
    this.selectfromdate = new Date(new Date().setHours(0,0,0));
    this.selecttodate = new Date(new Date().setHours(23, 59, 59));

    this.selectfromtime = new Date(new Date().setHours(0, 0, 0, 0));
    this.selecttotime = new Date(new Date().setHours(23, 59, 0, 0));
    let ReportDates;
    if (localStorage.getItem("ReportDates")) {
      ReportDates = JSON.parse(localStorage.getItem("ReportDates"));
      this.selectfromdate = new Date(ReportDates.fromdate);
      this.selecttodate = new Date(ReportDates.todate);
    }
    this.AccountStatement();
  }

  initDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      responsive: true,
    };
  }

  AccountStatement(){
    this.statementsData = [];
    this.rerender();
    this.loader = true;

    let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }

    localStorage.setItem("ReportDates", JSON.stringify(pnldates));


    // let fromDate="2020-07-01 00:00:00";
    // let toDate="2020-08-10 00:00:00";

    this.reportService.AccountStatement(pnldates.fromdate, pnldates.todate).subscribe(resp=>{
      this.Data=resp.data.reverse();
      this.rerender();
        this.loader = false;
    },
    err => {
      if (err.status == 401) {
        //this.toastr.error("Error Occured");
      }
    }
    );

  }

  
  getFromDateAndTime() {
    // return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;

  }
  getToDateAndTime() {
    // return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
  }


  ngAfterViewInit() {
    this.dtTrigger.next();
  }


  rerender() {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        // dtInstance.column('7').visible(false);
      });
    }
  }

}
