import { Component, OnInit,ViewChild } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import _ from 'lodash';

@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.scss'],
  providers: [DatePipe]

})
export class CasinoComponent implements OnInit {
  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;
  casinoreportData = [];

  startDate: Date;
  endDate: Date;
  
  startformat: any;
  endformat: any;
  Data: any;
 filter = "1";
  gtype: '1';


  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  loader: boolean = false;

 

  constructor(private reportService: ReportService,private toastr: ToastrService, private dateformat: DatePipe) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate());
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
    this.GetCaisnoResults();

  }

  initDatatable() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      responsive: true,
    };
  }

  GetCaisnoResults() {
   
    this.casinoreportData = [];
    this.rerender();
     this.loader = true;

     let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }
    localStorage.setItem("ReportDates", JSON.stringify(pnldates));
    
    this.gtype="1";
    this.reportService.GetCaisnoResults(pnldates.fromdate, pnldates.todate, this.filter).subscribe(resp => {
      this.Data = resp.data.reverse();
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
