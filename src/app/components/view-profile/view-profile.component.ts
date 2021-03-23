import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../services/report.service'

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  data: any;
  username:any;

  constructor(private reportService:ReportService) {}

  ngOnInit(): void {
    this.UserDescription();
  }

  UserDescription(){
    this.reportService.UserDescription().subscribe(data=>{
     this.username= data.data.uName;
     console.log(data)
    })
  }

}
