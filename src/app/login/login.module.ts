import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../services/token-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login/login.component';
import { SportsTypesComponent } from './sports-types/sports-types.component';
import { SocialFooterComponent } from './social-footer/social-footer.component';
import { LoginFooterComponent } from './login-footer/login-footer.component';
import { HeaderModule } from '../components/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';//

const routes: Routes = [
  {
    path: '', component: LoginComponent
  }
]

@NgModule({
  declarations: [
    LoginComponent,
    SportsTypesComponent,
    SocialFooterComponent,
    LoginFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    HeaderModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  exports: [
    RouterModule
  ]
})
export class LoginModule { }
