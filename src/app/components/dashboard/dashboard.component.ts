import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import {SharedataService} from '../../services/sharedata.service';
import { Sport } from '../../shared/models/sport.model';
import { DataFormatService } from '../../services/data-format.service';
import { Highlight } from '../../shared/models/highlight';
import { ReportService} from '../../services/report.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sportsData!: Sport[];
  loader: boolean;
  nextEvents!: Highlight[];
  sportName!: string;

  constructor(

    private auth: AuthService,
    private shareData:SharedataService,
    private dataFormat: DataFormatService,
    private reportservice:ReportService
  ) {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 2000)
   }

  ngOnInit(): void {

    localStorage.removeItem("favourite");


    this.shareData.userData$.subscribe((userData) => {

      if (userData) {
        this.sportsData = userData.sportsData;
        // console.log(this.sportsData)
        if (this.sportsData.length != 0) {
          this.getSportsList(this.sportsData[0]);
          this.sportName = this.sportsData[0].name;
        }

      }
    });

  }

  getSportsList(sport: Sport) {
    if (sport.id === 1) {
      this.nextEvents = this.dataFormat.nextEventsWise(sport);
    } else if (sport.id === 2) {
      this.nextEvents = this.dataFormat.nextEventsWise(sport);
    } else if (sport.id === 4) {
      this.nextEvents = this.dataFormat.nextEventsWise(sport);
    } else if (sport.id === 3) {
      this.nextEvents = this.dataFormat.nextEventsWise(sport);
    }

    // console.log(this.nextEvents);
  }
  trackById(index: number, item: any) {
    return item.id;
  }

}
