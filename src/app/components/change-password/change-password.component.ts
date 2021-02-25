import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  ChangePwdForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void 
  {
    this.ChangePwdForm = this.formBuilder.group({
      context: ['Web', Validators.required],
      changeBy: ['navcl', Validators.required],
      confirmpassword: ['', Validators.required],
      newPwd: ['', Validators.required],
      oldPwd: ['', Validators.required],
    },);
}

// convenience getter for easy access to form fields
get f() { return this.ChangePwdForm.controls; }

changePwd() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.ChangePwdForm.invalid) {
    return;
  }

  console.log(this.ChangePwdForm.value);
  this.authService.changePwd(this.ChangePwdForm.value).subscribe((data) => {
    console.log(data)
    if (data.status == 'Success') {
      this.toastr.success(data.result);
      this.ChangePwdForm.reset();
      this.submitted = false
    } else {
      this.toastr.error(data.result);
    }
  });
}

}
