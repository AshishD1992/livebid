import { Component, OnInit } from '@angular/core';
import {DataFormatService} from '../../services/data-format.service';
import {Sport} from '../../shared/models/sport.model';
import {Highlight} from '../../shared/models/highlight';
import { Subscription } from 'rxjs';
import { SharedataService } from '../../services/sharedata.service';
import { UserData } from '../../shared/models/user-data.model';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../shared/models/tournament';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
@Component({
  selector: 'app-tournamentlist',
  templateUrl: './tournamentlist.component.html',
  styleUrls: ['./tournamentlist.component.scss']
})
export class TournamentlistComponent implements OnInit {
  sportsData!: Sport[];
  _sportsList!: Highlight[];
  subSink = new Subscription();
  tourWise!: any;
  sportlist:any=[];
  sportBfId: any;
  spbfid:string;
  trbfid:string
  tourbfId: number;
  tourname:string;
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

        }
        catch (e) { }
      if (userData) {
        this.sportlist=userData.sportsData;
          userData.sportsData.forEach((sport:Sport) => {
            if(this.spbfid === sport.bfId) {
              sport.tournaments.forEach((tour:any)=>{
                if(this.trbfid === tour.bfId){

                  this.tourWise = this.dataFormat.tournamentWise(sport);

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
