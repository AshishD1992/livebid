import { Component, OnInit ,Input} from '@angular/core';
import { DataFormatService } from '../services/data-format.service';
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
  constructor(private dataFormat: DataFormatService) {
  }

  ngOnInit(): void {
    // console.log(this._sportsList)
    this.dataFormat.RemoveFavourites();
  }
  toggleFavourite(event) {
    this.dataFormat.ToggleFavourite(event.matchBfId, false);
  }
  trackById(index: number, item: any) {
    return item.id;
  }
  trackByIdx(index: number, item: any) {
    return item.id;
  }
}
