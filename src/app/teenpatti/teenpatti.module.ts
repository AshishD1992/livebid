import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from "ag-grid-angular";
import { TwentyteenpattiComponent } from './twentyteenpatti/twentyteenpatti.component';
// import { Lucky7Component } from './lucky7/lucky7.component';
import { ThreecardjudgeComponent } from './threecardjudge/threecardjudge.component';
import { AndarbaharComponent } from './andarbahar/andarbahar.component';
import { OnedayComponent } from './oneday/oneday.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [

    
      {
        path: 'twenty-teepatti',
        component: TwentyteenpattiComponent,
      },
      // {
      //   path: 'Lucky7',
      //   component: Lucky7Component,
      // },
      {
        path: 'threecards',
        component: ThreecardjudgeComponent,
      },
      {
        path: 'andarbahar',
        component: AndarbaharComponent,
      },
      {
        path: 'oneday',
        component: OnedayComponent,
      },


];

@NgModule({
  declarations: [TwentyteenpattiComponent,ThreecardjudgeComponent ,OnedayComponent,AndarbaharComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class TeenpattiModule { }
