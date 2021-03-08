import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
selector: 'app-game',
templateUrl: './game.component.html',
styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit,AfterViewInit,OnDestroy {
bodyElement: any;
matchedbets: any;

constructor(private reportService: ReportService) { }

ngOnInit(): void {
this.GetCurrentBets();
this.bodyElement = document.querySelector('body');
}

GetCurrentBets(){
this.reportService.GetCurrentBets().subscribe(data=>{
this.matchedbets=data.matchedbets;
})
}
ngAfterViewInit(){
(this.bodyElement as HTMLElement).classList.add('clsbetshow');
}

ngOnDestroy(){
(this.bodyElement as HTMLElement).classList.remove('clsbetshow');
}


openBet() {
document.getElementById("mybet").style.width = "100%";
}

closebet() {
document.getElementById("mybet").style.width = "0";
}


}