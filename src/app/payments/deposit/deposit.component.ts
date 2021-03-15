import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { ReportService } from 'src/app/services/report.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  DWform:FormGroup;
  submitted = false;
  constructor(private reportService:ReportService,private fb:FormBuilder,private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.GetDepositInfo();
    this.DWform = this.fb.group({
      accHolderName: [""],
      accNo: [""],
      amount: ["", Validators.required],
      bankName: [""],
      branch: [""],
      description: [""],
      ifscCode: [""],
      mobileNo: [0],
      receiverName: ["", Validators.required],
      senderName: ["", Validators.required],
      transtype: [1],
      walletType: [""],
      refCode: ["", Validators.required]
  })

  }

get f() { return this.DWform.controls }

  GetDepositInfo(){
    this.reportService.GetDepositInfo().subscribe(data=>{


    })
  }

  setPaymentOption(walltype){
    this.DWform.controls.walletType.setValue(walltype);
  }


  SaveDepositWithdrawalReq() {
   let depoform=this.DWform.value
    let depositdata=JSON.stringify(depoform)
    console.log(depositdata)
    this.reportService.SaveDepositWithdrawalReq(depositdata).subscribe(data => {
    console.log(data)
    if (data.status == 'Success') {
      this.toastr.success(data.result);
      this.DWform.reset();
      this.submitted = false
    } else {
      this.toastr.error(data.result);
    }
    })
  }


}
