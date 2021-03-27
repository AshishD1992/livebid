import { Component, OnInit, Input } from '@angular/core';
import { Sport } from '../shared/models/sport.model';
import { DataFormatService } from '../services/data-format.service';
import { UserData } from '../shared/models/user-data.model';
import { SharedataService } from '../services/sharedata.service';
import { Highlight } from '../shared/models/highlight';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.scss']
})
export class InplayComponent implements OnInit {

  @Input() sportsData!: Sport[];
  subSink = new Subscription();

  inplayListWise: {
    id: number,
    name: string,
    bfId:string;
    highlights: Highlight[];
  }[] = [];


  eventsCount = [];

  constructor(private dataFormat: DataFormatService, private shareData: SharedataService,) { }

  ngOnInit(): void {

    this.subSink.add(
      this.shareData.userData$.subscribe((userData: UserData | null) => {
        if (userData) {
          let inplayList: {
            id: number;
            name: string;
            bfId:string;
            highlights: Highlight[];
          }[] = [];
          this.eventsCount = [];
          userData.sportsData.forEach((sport) => {
            // console.log(sport)
            let highlight = this.dataFormat.inplaylistwise(sport);
            if (highlight.length) {
              inplayList.push({
                id: sport.id,
                name: sport.name,
                bfId:sport.bfId,
                highlights: this.dataFormat.inplaylistwise(sport),
              });
            }
            else{
              inplayList.push({
               id: sport.id,
               name: sport.name,
               bfId:sport.bfId,
               highlights: this.dataFormat.inplaylistwise(sport),
             });
           }
            this.eventsCount = this.eventsCount.concat(highlight)
          });
          this.inplayListWise = inplayList;
          // console.log(this.inplayListWise)
        }
      })
    );

  }
  getSportsList(sport: Sport) {
    if (sport.id === 1) {
      return this.dataFormat.highlightwise1(sport);
    } else if (sport.id === 2) {
      return this.dataFormat.highlightwise1(sport);
    } else if (sport.id === 4) {
      return this.dataFormat.highlightwise1(sport);

    } else if (sport.id === 3) {
      return this.dataFormat.highlightwise1(sport);
    }
  }

  toggleFavourite(event) {
    this.dataFormat.ToggleFavourite(event.matchBfId, false);
  }
  trackByIdx(index: number, item: any) {
    return item.id;
  }

  trackById(idx: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

}
