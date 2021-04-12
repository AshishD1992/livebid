import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BetHistoryComponent } from './bet-history/bet-history.component';
import { AcStatementComponent } from './ac-statement/ac-statement.component';
import { LiveGameBetHistoryComponent } from './live-game-bet-history/live-game-bet-history.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { ReportService } from '../services/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginhistoryComponent } from './loginhistory/loginhistory.component';
import { CasinoComponent } from './casino/casino.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DataTablesModule } from 'angular-datatables';
const routes: Routes = [
  {
    path: 'bet-history',
    component: BetHistoryComponent
  },
  {
    path: 'profit-loss',
    component: ProfitLossComponent
  },
  {
    path: 'ac-statement',
    component: AcStatementComponent
  },
  {
    path: 'live-game',
    component: LiveGameBetHistoryComponent
  },
  {
    path: 'loginhistory',
    component: LoginhistoryComponent
  },

  {
    path: 'casino',
    component: CasinoComponent
  }
];

@NgModule({
  declarations: [
    BetHistoryComponent, 
    AcStatementComponent, 
    LiveGameBetHistoryComponent, 
    ProfitLossComponent, 
    LoginhistoryComponent, 
    CasinoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule ,
    CommonModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
    DataTablesModule.forRoot(),
  ],
  providers:[ReportService],
  exports: [RouterModule]
})
export class ReportsModule { }
