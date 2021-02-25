import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MarqueeComponent } from './marquee/marquee.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
]

@NgModule({
  declarations: [
    HeaderComponent,
    MarqueeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    HeaderComponent,
    RouterModule
  ]
})
export class HeaderModule { }
