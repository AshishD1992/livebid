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

 
  constructor(private reportService: ReportService,private dateformat:DatePipe) { 
 
  }

  ngOnInit(): void {
    this.GetCurrentBets();
  }
  GetCurrentBets() {
  
    this.reportService.GetCurrentBets().subscribe(data => {
      this.Data = data.matchedbets
      console.log("GetCurrentBets",this.Data)
     

    })
  }

}
