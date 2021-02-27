import { Component, OnInit } from '@angular/core';
import {DataFormatService} from '../../services/data-format.service';
import {Sport} from '../../shared/models/sport.model';
import {Highlight} from '../../shared/models/highlight';
import { Subscription } from 'rxjs';
import { SharedataService } from '../../services/sharedata.service';
import { UserData } from '../../shared/models/user-data.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-matchlist',
  templateUrl: './matchlist.component.html',
  styleUrls: ['./matchlist.component.scss']
})
export class MatchlistComponent implements OnInit {
  sportsData!: Sport[];
  _sportsList!: Highlight[];
  subSink = new Subscription();

  tourWise!: any;
  sportlist:any=[];
  sportBfId: any;
  spbfid:string;
  trbfid:string;
  matchId:any;
  tourbfId: number;
  tourname:string;
  matchname:string;
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
      this.tourbfId = +this.route.snapshot.paramMap.get('tourBfId')!;
      this.trbfid=this.tourbfId.toString();
      this.matchId = +this.route.snapshot.paramMap.get('matchId')!;
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
          this.tourname = this.dataFormat.sportsDataById(
            userData!.sportsData
          )[this.sportBfId!].tournaments[this.tourbfId!].name
          this.matchname = this.dataFormat.sportsDataById(
            userData!.sportsData
          )[this.sportBfId!].tournaments[this.tourbfId!].matches[this.matchId!].name
        }
        catch (e) { }
      if (userData) {
        this.sportlist=userData.sportsData;
          userData.sportsData.forEach((sport:Sport) => {
            if(this.spbfid === sport.bfId) {
              sport.tournaments.forEach((tour:any)=>{
                if(this.trbfid === tour.bfId){

                  this.tourWise = this.dataFormat.tournamentWise(sport);
                  // console.log(this.tourWise);
                  const key = 'tourBfId';
                  this.tourlist = [...new Map(this.tourWise.map(item =>
                    [item[key], item])).values()];

                  // console.log(this.tourlist);
                }

              });

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
