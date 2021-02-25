import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from "ag-grid-angular";
import { HeaderModule } from "./components/header/header.module";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentWebAreaComponent } from './components/content-web-area/content-web-area.component';
import { SlickSliderComponent } from './components/slick-slider/slick-slider.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GameComponent } from './components/game/game.component';
import { CookieService } from 'ngx-cookie-service';
import { InplayComponent } from './components/inplay/inplay.component';
import { MarketAnalysisComponent } from './components/market-analysis/market-analysis.component';
import { EditStakeComponent } from './components/edit-stake/edit-stake.component';
import { ReviewComponent } from './components/review/review.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { TeenpattiComponent } from './teenpatti/teenpatti.component';
import { TwentyteenpattiComponent } from './twentyteenpatti/twentyteenpatti.component';
import { ThreecardjudgeComponent } from './threecardjudge/threecardjudge.component';
import { AndarbaharComponent } from './andarbahar/andarbahar.component';
import { Lucky7Component } from './lucky7/lucky7.component';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ContentWebAreaComponent,
    SlickSliderComponent,
    DashboardComponent,
    GameComponent,
    InplayComponent,
    MarketAnalysisComponent,
    EditStakeComponent,
    ReviewComponent,
    ChangePasswordComponent,
    ViewProfileComponent,
    TeenpattiComponent,
    TwentyteenpattiComponent,
    ThreecardjudgeComponent,
    AndarbaharComponent,
    Lucky7Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule ,
    AgGridModule.withComponents([]),
    ToastrModule.forRoot()
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
