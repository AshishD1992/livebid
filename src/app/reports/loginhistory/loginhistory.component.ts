import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-loginhistory',
  templateUrl: './loginhistory.component.html',
  styleUrls: ['./loginhistory.component.scss']
})
export class LoginhistoryComponent implements OnInit {
  [x: string]: any;

  constructor(private reportService:ReportService) { }

  ngOnInit(): void {
    this.ActivityLog();
  }
  ActivityLog(){
    this.reportService.ActivityLog().subscribe(data=>{
      this.Data=data.data
    })
  }

}
