import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  [x: string]: any;

  constructor(private reportService:ReportService,) { 
    
  }

  ngOnInit(): void {
    this.GetDepositInfo();
    this.SaveDepositWithdrawalReq();
 
  }

//   initDWForm() {
//     this.DWform = this.fb.group({
//         accHolderName: [""],
//         accNo: [""],
//         amount: [""],
//         bankName: [""],
//         branch: [""],
//         description: [""],
//         ifscCode: [""],
//         mobileNo: ["0"],
//         receiverName: [""],
//         senderName: [""],
//         transtype: ["1"],
//         walletType: [""],
//         refCode: [""]
//     })
// }
// get f() {
//     return this.DWform.controls
// }

  GetDepositInfo(){
    this.reportService.GetDepositInfo().subscribe(data=>{
      this.Data = data.data,
      console.log(this.Data)

    })
  }

  // SaveDepositWithdrawalReq(data){
  //   this.reportService.SaveDepositWithdrawalReq(data).subscribe(data=>{
  //     this.Data=data.data
  //   })
  // }
  
  SaveDepositWithdrawalReq() {

    this.reportService.SaveDepositWithdrawalReq(data).subscribe(data => {
      this.Data=data.data;
    })
  }


}
