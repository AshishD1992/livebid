import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  data: any;
  Data: any;


  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.UserDescription();
  }

  logout(){
    this.authService.logout({}).subscribe((data)=>{
      this.tokenService.removeToken()
      window.location.href="/login";
      this.toastr.success("logout success");
    },err=>{
      this.tokenService.removeToken()
    window.location.href="";
    console.log("",this.data)

    })
  }
  UserDescription(){
    this.reportService.UserDescription().subscribe(data=>{
      this.Data = data.data;
    })
  }
}
