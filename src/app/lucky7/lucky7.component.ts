import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-lucky7',
  templateUrl: './lucky7.component.html',
  styleUrls: ['./lucky7.component.scss']
})
export class Lucky7Component implements OnInit,AfterViewInit ,OnDestroy{

  clock: any;
  bodyElement: any;
  matchedbets: any;

  constructor() { }
  

  ngOnInit(): void {
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    this.bodyElement = document.querySelector('body');

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
