import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DepositComponent } from './deposit/deposit.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { PaymentRequestComponent } from './payment-request/payment-request.component';
import { CancelRequestComponent } from './cancel-request/cancel-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: 'deposit',
    component: DepositComponent
  },
  {
    path: 'withdrawal',
    component: WithdrawalComponent
  },
  {
    path: 'payment-request',
    component: PaymentRequestComponent
  },
  {
    path: 'cancel-request',
    component: CancelRequestComponent
  }
];

@NgModule({
  declarations: [
    DepositComponent,
    WithdrawalComponent,
    PaymentRequestComponent,
    CancelRequestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]

})
export class PaymentsModule { }
