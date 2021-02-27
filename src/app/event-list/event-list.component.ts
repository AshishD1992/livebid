import { Component, OnInit } from '@angular/core';
import {DataFormatService} from '../services/data-format.service';
import {Sport} from '../shared/models/sport.model';
import {Highlight} from '../shared/models/highlight';
import { Subscription } from 'rxjs';
import { SharedataService } from '../services/sharedata.service';
import { UserData } from '../shared/models/user-data.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  sportsData!: Sport[];
  _sportsList!: Highlight[];
  subSink = new Subscription();

  sportWise!: any;
  sportlist:any=[];
  tournamentlist:any=[];
  sportBfId: any;
  spbfid:string;
  trbfid:string
  tourbfId: number;
  Highlight:[];
  sportname:string;
  tourlist:any;
  constructor(
    private dataFormat: DataFormatService,
    private shareData: SharedataService,
    private route: ActivatedRoute,
   ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sportBfId = +this.route.snapshot.paramMap.get('sportBfId')!;
      this.spbfid=this.sportBfId.toString();

     this.gethightlight();
    });

  }

  gethightlight(){
    this.subSink.add(
      this.shareData.userData$.subscribe((userData: UserData | null) => {
        try {
          this.sportname = this.dataFormat.sportsDataById(
            userData!.sportsData
          )[this.sportBfId!].name
        }
        catch (e) { }
        if (userData) {
          this.sportlist=userData.sportsData;
          userData.sportsData.forEach((sport:Sport) => {

            if(this.spbfid === sport.bfId) {
              this.sportWise = this.dataFormat.tournamentWise(sport);
              console.log(this.sportWise);
              const key = 'tourBfId';
                  this.tourlist = [...new Map(this.sportWise.map(item =>
                    [item[key], item])).values()];
            }
            });


        }

      })
    );
  }
  trackById(idx: number, item: any) {
    return item.id;
  }
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  }

