import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss'],
  providers: [ DatePipe ]
})
export class BetHistoryComponent implements OnInit {
  filter = "1"
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
    this.GetBetHistory();
  }
  GetBetHistory() {
    this.startformat = this.dateformat.transform(this.startDate, 'yyyy-MM-dd 00:00:00');
    this.endformat = this.dateformat.transform(this.endDate, 'yyyy-MM-dd 23:59:00');
    this.reportService.GetBetHistory( this.startformat, this.endformat,this.filter).subscribe(data => {
      this.Data = data.data
      console.log("GetBetHistory",this.Data)
     

    })
  }

}
