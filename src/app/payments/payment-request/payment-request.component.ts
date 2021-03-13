import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.scss']
})
export class PaymentRequestComponent implements OnInit {
  [x: string]: any;
  constructor(private reportService:ReportService) { }

  ngOnInit(): void {
    this.GetPaymentHistory();
  }

  GetPaymentHistory(){
    this.reportService.GetPaymentHistory().subscribe(data=>{
      this.Data=data.data
      console.log(this.Data)
    })
  }

}
