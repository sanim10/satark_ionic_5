import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { FavModalComponent } from '../fav-modal/fav-modal.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  loading = true;
  public user_data: any = [];
  public forecast_data: any = [];
  public value_addtion_forecast_data: any = [];
  rainfall_data: any = [];
  new_forecast_data: any = [];
  public successData: any = [];
  public favLocData: any = [];
  ioncard_data: any = [];
  block_id: string;
  user_id: string;
  today: string;
  current_location_block: string;
  current_location_block_ory: string;
  current_location_district: string;
  current_location_district_ory: string;
  lHelper;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private langHelper: LanguageHelperService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.lHelper = langHelper;
    this.display();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  display() {
    this.loading = true;
    this.checklogin(localStorage.getItem('token'));
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async openFavLoc(weather: any) {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FavModalComponent,
      componentProps: { weatherData: weather },
    });
    return await modal.present();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.user_data = data['result'];
          this.block_id = this.user_data[0].block_id;
          this.user_id = this.user_data[0].id;
          this.current_location_block = this.user_data[0].block_name;
          this.current_location_block_ory = this.user_data[0].block_name_ory;
          this.current_location_district = this.user_data[0].district_name;
          this.current_location_district_ory =
            this.user_data[0].district_name_ory;
          this.getRainfallValueAdditionForBlock(this.block_id);

          this.getFavLocations(this.user_id);
          // this.get10DaysImdForecast(this.block_id);
        },
        (Error) => {
          console.log(Error);
          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
        }
      );
  }

  //get 10days IMD value addition
  getRainfallValueAdditionForBlock(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      // .get10DaysImdValueAdditionDataForWeather(param)
      .getUpdatedValueAdditionDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.value_addtion_forecast_data = data;
          this.loading = false;
          if (this.value_addtion_forecast_data?.length == 0) {
            this.value_addtion_forecast_data = null;
          } else {
            console.log(this.value_addtion_forecast_data);
          }
        },
        (Error) => {
          console.log(Error);
          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
          this.loading = false;
        }
      );
  }

  getFavLocations(id: string) {
    this.apiService
      .getFavLocations(id)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.favLocData = data['result'];
          this.successData = data['success'];
          if (!this.successData) {
            this.favLocData = null;
          } else {
            this.favLocData.forEach(async (element, index) => {
              this.getTempMax(element.block_id)
                .pipe(take(1))
                .subscribe((data) => {
                  this.favLocData[index].forecast = data;
                });
            });
          }
        },
        (Error) => {
          console.log(Error);

          this.authService.showErrorToast(
            'Error while getting location. Please try again.'
          );
        }
      );
  }

  get10DaysImdForecast(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      .get10DaysImdDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.forecast_data = data;
          if (this.forecast_data?.length == 0) {
            this.forecast_data = null;
          } else {
            this.current_location_block = this.forecast_data[0].block_name;
            this.current_location_block_ory =
              this.forecast_data[0].block_name_ory;
            this.current_location_district =
              this.forecast_data[0].district_name;
            this.current_location_district_ory =
              this.forecast_data[0].district_name_ory;
          }
        },
        (Error) => {
          console.log(Error);

          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
        }
      );
  }

  getTempMax(block_id) {
    let param = {
      block_id: block_id,
    };
    return this.apiService.get10DaysImdDataForWeather(param);
  }

  async openLegendInfo() {
    let alert = this.alertCtrl.create({
      header: this.lHelper.lang == 'en' ? `Info` : `ସୂଚନା`,
      cssClass: 'info-legend',
      message:
        `
          <ion-grid>
            <ion-row>
              <ion-col class="icon">
                <ion-icon class="ion-padding-start" src="../../../../../assets/modules/weather/day.svg">
                </ion-icon>
              </ion-col>
              <ion-col >
                <ion-label> ` +
        (this.lHelper.lang == 'en' ? `Day` : `ଦିନ`) +
        `</ion-label>
              </ion-col>
            </ion-row>
            <ion-row >
              <ion-col class="icon">
                <ion-icon class="ion-padding-start" src="../../../../../assets/modules/weather/rain.svg">
                </ion-icon>
              </ion-col>
                <ion-col >
                <ion-label>` +
        (this.lHelper.lang == 'en' ? `Rainfall` : `ବର୍ଷା`) +
        `</ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="icon" >
                <ion-icon class="ion-padding-start" src="../../../../../assets/modules/weather/t_high_b.svg">
                </ion-icon>
              </ion-col>
              <ion-col>
                <ion-label > ` +
        (this.lHelper.lang == 'en'
          ? `Maximum Temperature`
          : `ସର୍ବାଧିକ ତାପମାତ୍ରା`) +
        `
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="icon">
                <ion-icon class="ion-padding-start" src="../../../../../assets/modules/weather/t_low_b.svg">
                </ion-icon>
              </ion-col>
                 <ion-col>
                <ion-label> ` +
        (this.lHelper.lang == 'en'
          ? `Minimum Temperature`
          : `ସର୍ବନିମ୍ନ ତାପମାତ୍ରା`) +
        ` </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col class="icon">
                <ion-icon class="ion-padding-start"  src="../../../../../assets/modules/weather/humidity_b.svg">
                </ion-icon>
              </ion-col>
                 <ion-col>
                <ion-label> 
                 ` +
        (this.lHelper.lang == 'en' ? `Humidity` : `ଆର୍ଦ୍ରତା`) +
        `  </ion-label>
              </ion-col>
            </ion-row>
          </ion-grid>`,
      buttons: this.lHelper.lang == 'en' ? ['OK'] : ['ଠିକ'],
    });
    (await alert).present();

    // this.alertCtrl.create({
    //   header: card.title,
    //   message: <img src="${card.imageUrl}" style = "border-radius: 2px" >,
    //   // message: <img src="${card.imageUrl}" style="height: 10px;width: 10px">,
    //   //message: <img src="${card.imageUrl}" alt="g-maps" style="border-radius: 2px" width="100" height="100" crop="fill">,
    //   buttons: [’’]
    // }).then(alertEl => {
    //   alertEl.present();
    //   setTimeout(() => {
    //     alertEl.dismiss();
    //   }, 1000)

    // }
  }
}
