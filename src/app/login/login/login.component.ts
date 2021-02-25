import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  IsmodelShow: boolean = false;



  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      context: ['Web', Validators.required],
      username: ['', Validators.required],
      pwd: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe((data) => {
      console.log(data)
      if (data.description.status == "Success") {

        this.authService.setLoggedIn(true);
        this.toastr.success(data.description.result);
        this.tokenService.setToken(data.response.AuthToken);
        this.loginForm.reset();
        this.router.navigate(['/dashboard/']);
        this.IsmodelShow = true
        $('.modal-backdrop').remove();
        this.submitted = true;
      } else {
        this.toastr.error(data.description.result);
      }
    });
  }

}
