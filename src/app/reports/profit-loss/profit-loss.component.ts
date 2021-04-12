import { Component, OnInit, ViewChild, AfterViewInit, } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss'],
  providers: [DatePipe]
})
export class ProfitLossComponent implements OnInit {


  ProfitLoss = [];
  totalPnl = 0;
  bets: any
  STYPE = "0";


  selectfromdate: Date;
  selecttodate: Date;
  selecttotime: Date;
  selectfromtime: Date;

  @ViewChild(DataTableDirective, { static: true }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  params: any;
  loader: boolean = false;

  constructor(private reportService: ReportService, private dateformat: DatePipe,private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.params = params;

      if (this.params.mtid) {
        this.GetProfitLossfromAS(this.params.mtid, this.params.mktid, this.params.type);
      }
    })
  
  }
 
  ngOnInit() {
    // this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    // this.selecttodate = new Date();
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

    if (!this.params.mtid) {
      this.GetProfitLoss();
    }
  }

  GetProfitLoss() {
    // let FROM = "2020-6-10 00:00:00";
    // let TO = "2020-7-11 23:59:00";

    this.ProfitLoss = [];
    this.rerender();

    this.loader = true;
    let pnldates = {
      "fromdate": this.getFromDateAndTime(),
      "todate": this.getToDateAndTime()
    }

    localStorage.setItem("ReportDates", JSON.stringify(pnldates));

    this.reportService.GetProfitLoss(pnldates.fromdate, pnldates.todate).subscribe(
      resp => {
        this.ProfitLoss = resp.data;
        this.totalPnl = resp.total;
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

  GetProfitLossfromAS(mtid, mktid, type) {
    this.ProfitLoss = [];
    this.rerender();

    this.loader = true;

    this.reportService.GetProfitLossfromAS(mtid, mktid, type).subscribe(
      resp => {
        this.ProfitLoss = resp.data;
        this.totalPnl = resp.total;
        // console.log(this.totalPnl);
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

  ShowBet(pnl) {
    this.bets = pnl.bets;
  }
  removeBet(event) {
    this.bets = event;
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
