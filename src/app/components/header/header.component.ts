import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  bodyElement: any;
  isNav:boolean=false;
  Data: any;
  username:string;
 


  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.Fund();
    this.userdescription()
    this.bodyElement = document.querySelector('body');

  }
  

  Fund(){
    this.reportService.Fund().subscribe(data=>{
      this.Data = data.data
    })
  }
  userdescription(){
    this.reportService.UserDescription().subscribe(data=>{
      this.username=data.data.uName
    })
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "70%";
    (this.bodyElement as HTMLElement).classList.add('overlay-menu');
    this.isNav=true;
  }
  closeNav() {
    if(!this.isNav){
      return;
    }
    document.getElementById("mySidenav").style.width = "0";
    (this.bodyElement as HTMLElement).classList.remove('overlay-menu');
    this.isNav=false;
  }

  openUserDash() {
    (this.bodyElement as HTMLElement).classList.add('dash-show');
  }
  closeUserDash() {
    (this.bodyElement as HTMLElement).classList.remove('dash-show');
  }
 
  }


