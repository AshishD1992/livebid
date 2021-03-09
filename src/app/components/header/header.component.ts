import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReportService } from 'src/app/services/report.service';
import { DataFormatService} from 'src/app/services/data-format.service';
import { HomeSignalrService } from "../../services/signalr/home.signalr";
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
  isLoggedIn: boolean = false;



  constructor(private reportService: ReportService,
    private authService: AuthService,
    private dfservice:DataFormatService,
    private homeSignalR: HomeSignalrService,) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;

    })
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
      this.username=data.data.uName;
      this.dfservice.shareUserDescription(data.data);
      this.homeSignalR.connectHome(data.data.add);

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


