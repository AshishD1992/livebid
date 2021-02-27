import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentWebAreaComponent } from './components/content-web-area/content-web-area.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GameComponent } from './components/game/game.component';
import { InplayComponent } from './components/inplay/inplay.component';
import { MarketAnalysisComponent } from './components/market-analysis/market-analysis.component';
import { EditStakeComponent } from './components/edit-stake/edit-stake.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
// import { TeenpattiComponent } from './teenpatti/teenpatti.component';
// import { TwentyteenpattiComponent } from './teenpatti/twentyteenpatti/twentyteenpatti.component';
// import { ThreecardjudgeComponent } from './teenpatti/threecardjudge/threecardjudge.component';
// import { Lucky7Component } from './lucky7/lucky7.component';
// import { AndarbaharComponent } from './andarbahar/andarbahar.component';



const routes: Routes = [
  {
    path:'login',
    loadChildren:()=>import('./login/login.module').then((m) => m.LoginModule)
  },

  // {
  //   path: 'teenpatti',
  //   component: TeenpattiComponent,
  // },
  {
    path: '',
    component: ContentWebAreaComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'inplay', component: InplayComponent },
      { path: 'game', component: GameComponent },
      { path: 'market-analysis', component: MarketAnalysisComponent },
      { path: 'edit-stake', component: EditStakeComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'view-profile', component: ViewProfileComponent },
      // { path: 'teenpatti', component: TeenpattiComponent },
      // { path: 'twentyteenpatti', component: TwentyteenpattiComponent },
      // { path: 'threecardjudge', component: ThreecardjudgeComponent },
      // { path: 'andarbahar', component: AndarbaharComponent },
      // { path: 'lucky7', component: Lucky7Component },

      {
        path: 'events',
        loadChildren: () =>
          import('./fullmarket/fullmarket.module').then((m) => m.FullmarketModule),
      },

      {
        path:'report',
        loadChildren:()=>import('./reports/reports.module').then((m) => m.ReportsModule)
      },
      {
        path:'payment',
        loadChildren:()=>import('./payments/payments.module').then((m) => m.PaymentsModule)
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
