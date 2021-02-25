import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
@Component({
  selector: 'app-market-analysis',
  templateUrl: './market-analysis.component.html',
  styleUrls: ['./market-analysis.component.scss']
})
export class MarketAnalysisComponent implements OnInit {
  dataa: any=[];
  data: any;
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.MyMarket()
  }
  MyMarket(){
    this.reportService.MyMarket().subscribe(data=>{
      this.dataa = data.data;
      this.data = data.data;
      console.log(this.dataa)
    })
  }

}
