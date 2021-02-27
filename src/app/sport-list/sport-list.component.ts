import { Component, OnInit ,Input} from '@angular/core';
import { Highlight } from '../shared/models/highlight';
@Component({
  selector: 'app-sport-list',
  templateUrl: './sport-list.component.html',
  styleUrls: ['./sport-list.component.scss']
})
export class SportListComponent implements OnInit {
  private _sportsList!: Highlight[];
  showLoader: boolean = true;
  @Input() first;
  @Input() header;
  @Input() public set sportsList(sportsList: Highlight[]) {
    this._sportsList = sportsList;
    if (sportsList) {this.showLoader = false;}
  }
  public get sportsList() {
    return <[]>this._sportsList;
  }
  constructor() {
  }

  ngOnInit(): void {
    // console.log(this._sportsList)
  }
  trackById(index: number, item: any) {
    return item.id;
  }
}
