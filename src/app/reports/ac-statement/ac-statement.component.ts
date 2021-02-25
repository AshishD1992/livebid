import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ac-statement',
  templateUrl: './ac-statement.component.html',
  styleUrls: ['./ac-statement.component.scss'],
  providers: [ DatePipe ]

})
export class AcStatementComponent implements OnInit {
  filter = "0"
  data: any;
  Data: any;
  startDate: Date;
  endDate: Date;
  startformat: any;
  endformat: any;
 

  constructor(private reportService: ReportService,private dateformat:DatePipe) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate());
  }
  ngOnInit(): void {
    this.AccountStatement();
  }

  AccountStatement(){
    this.startformat = this.dateformat.transform(this.startDate, 'yyyy-MM-dd 00:00:00');
    this.endformat = this.dateformat.transform(this.endDate, 'yyyy-MM-dd 23:59:00');
    // let fromDate="2020-07-01 00:00:00";
    // let toDate="2020-08-10 00:00:00";

    this.reportService.AccountStatement(this.startformat,this.endformat).subscribe(data=>{
      this.Data=data.data;
    })

  }

}
