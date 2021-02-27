import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {FullmarketComponent} from './fullmarket.component'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {EventListComponent} from '../event-list/event-list.component';
import {TournamentlistComponent} from '../event-list/tournamentlist/tournamentlist.component';
import {MatchlistComponent} from '../event-list/matchlist/matchlist.component';
const routes: Routes = [
  { path: ':sportBfId', component: EventListComponent},
  { path: ':sportBfId/:tourBfId', component: TournamentlistComponent},
  { path: ':sportBfId/:tourBfId/:matchId',component:MatchlistComponent},
  { path: ':sportBfId/:tourBfId/:matchBfId/:matchId/:marketId',component:FullmarketComponent}
];
@NgModule({
  declarations: [
    FullmarketComponent,
    EventListComponent,
    TournamentlistComponent,
    MatchlistComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule

  ],
  exports: [RouterModule],
})
export class FullmarketModule { }
