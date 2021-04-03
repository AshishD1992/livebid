import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from 'src/app/services/setting.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DataFormatService } from 'src/app/services/data-format.service';


@Component({
  selector: 'app-edit-stake',
  templateUrl: './edit-stake.component.html',
  styleUrls: ['./edit-stake.component.scss']
})
export class EditStakeComponent implements OnInit {
  editForm: FormGroup;
  submitted = false;
  betStakes: any = {};
  subSink = new Subscription();


  defaultBetStakes!: {
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
  };

  constructor(
    private settingService: SettingService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private dfService: DataFormatService,

  ) {

  }
  ngOnInit(): void {

    this.defaultBetStakes = {
      stake1: 100,
      stake2: 500,
      stake3: 1000,
      stake4: 2000,
      stake5: 5000,
      stake6: 10000,
    };
    this.betStakes = this.defaultBetStakes;
    console.log(this.betStakes)
    this.editForm = this.formBuilder.group({
      stake1: [this.defaultBetStakes.stake1, Validators.required],
      stake2: [this.defaultBetStakes.stake2, Validators.required],
      stake3: [this.defaultBetStakes.stake3, Validators.required],
      stake4: [this.defaultBetStakes.stake4, Validators.required],
      stake5: [this.defaultBetStakes.stake5, Validators.required],
      stake6: [this.defaultBetStakes.stake6, Validators.required],
    });

}

// convenience getter for easy access to form fields
get f() { return this.editForm.controls; }

GetBetStakeSetting() {
  this.subSink.add(
    this.settingService.GetBetStakeSetting().subscribe((data) => {
      console.log(data)

      if (data.data.stake1 && data.data.stake2) {
        this.editForm.controls['stake1'].setValue(data.data.stake1);
        this.editForm.controls['stake2'].setValue(data.data.stake2);
        this.editForm.controls['stake3'].setValue(data.data.stake3);
        this.editForm.controls['stake4'].setValue(data.data.stake4);
        this.editForm.controls['stake5'].setValue(data.data.stake5);
        this.editForm.controls['stake6'].setValue(data.data.stake6);

        for (let i = 1; i <= 6; i++) {
          this.betStakes[`stake${i}`] = data.data[`stake${i}`];
        }
      } else {
        this.betStakes = this.defaultBetStakes;
        this.dfService.shareBetStake(this.betStakes.value);
      }
    })
  );
}
SaveBetStakeSetting() {
  {
    this.submitted = true;
    if (this.editForm.invalid) {


      return;
    }
    this.subSink.add(
      this.settingService.SaveBetStakeSetting(this.editForm.value).subscribe((data) => {
          this.GetBetStakeSetting();

          if(data.status="Success"){
            this.toastr.success(data.result);
            this.dfService.shareBetStake(this.betStakes.value);
          }else{
            this.toastr.error(data.result);
          }
          // console.log(data);
          // this.openEditStake();
        })
    );
  }
}
}
