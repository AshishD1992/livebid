import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  Input
} from '@angular/core';
declare const videojs: any;
@Component({
  selector: 'sxm-video',
  templateUrl: './video-live.component.html',
  styleUrls: ['./video-live.component.scss']
})
export class VideoLiveComponent implements OnInit,AfterViewInit,OnDestroy {
  @Input() public tvurl : string;
  private _elementRef: ElementRef

  seekbarTracker: any = {
    duration: 0,
    time: 0,
    seekPercent: 0,
    hasDVR: false,
  };

  seekTime: number;

  private player: any;

  constructor(elementRef: ElementRef) {

    this.player = false;
  }

  ngOnInit() { }


  ngAfterViewInit() {
    const self = this;
    this.player = videojs(document.getElementById('sxmvideo'));
    // console.log(this.player);
    this.player.muted(true);
    // this.player.on('timeupdate', () => {
    //   let hasDVR = false;
    //   let duration = Math.floor(this.getDuration(this.player) * 1000);
    //   let time;
    //   let seekPercent;
    //   // console.log(this.player.currentTime(), this.getDuration(this.player));


    // });
  }

  getDuration(player) {
    var seekable = player.seekable();
    return seekable && seekable.length ? seekable.end(0) - seekable.start(0) : 0;
  }

  onSeekPercentChange(player, seekPercent, duration) {
    var seekable = player.seekable();

    if (seekable && seekable.length) {
      // constrain currentTime
      player.currentTime(Math.max(0, Math.min(seekable.end(0), seekable.start(0) + (seekPercent * duration))));
    }
  }

  isLive() {
    if (!isFinite(this.player.duration())) {
      return true;
    }

    var acceptableDelay = 30;
    var seekable = this.player.seekable();
    return seekable && seekable.length && seekable.end(0) - this.player.currentTime() < acceptableDelay;
  }
  ngOnDestroy(): void {
    if (this.player != null) {
      this.player.dispose();
    }
  }



}
