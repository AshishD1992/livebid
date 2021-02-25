import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.scss'],
  providers: [DatePipe]

})
export class CasinoComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  loader: boolean;
  startformat: any;
  endformat: any;
  Data: any;
  filter: any;
  gtype: '1';

  constructor(private reportService: ReportService, private dateformat: DatePipe) {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate());
  }
  ngOnInit(): void {
    this.GetCaisnoResults();

  }

  GetCaisnoResults() {
    // this.loader = true;
    this.startformat = this.dateformat.transform(this.startDate, 'yyyy-MM-dd 00:00:00');
    this.endformat = this.dateformat.transform(this.endDate, 'yyyy-MM-dd 23:59:00');
    // let fromDate = "2020-07-01 00:00:00";
    // let toDate = "2020-08-10 00:00:00";
    this.gtype="1";
    this.reportService.GetCaisnoResults(this.startformat, this.endformat,this.gtype).subscribe(data => {
      this.Data = data.data
      // this.loader = false;

    })
  }


}
