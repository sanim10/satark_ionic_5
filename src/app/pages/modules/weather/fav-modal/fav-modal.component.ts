import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { SwiperComponent } from 'swiper/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
@Component({
  selector: 'app-fav-modal',
  templateUrl: './fav-modal.component.html',
  styleUrls: ['./fav-modal.component.scss'],
})
export class FavModalComponent implements OnInit {
  @Input() weatherData: any;

  loading = true;
  public user_data: any;
  public forecast_data: any;
  public value_addtion_forecast_data: any;
  rainfall_data: any = [];
  new_forecast_data: any = [];
  public successData: Array<any>;
  ioncard_data: any = [];
  block_id: string;
  user_id: string;
  today: string;
  lng: string;
  current_location_block: string;
  current_location_block_ory: string;
  current_location_district: string;
  current_location_district_ory: string;
  lHelper;
  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private apiService: ApiService,
    private authService: AuthService,
    private langHelper: LanguageHelperService
  ) {
    this.back();
    this.lHelper = langHelper;
  }

  ngOnInit() {
    this.display();
    console.log(this.weatherData);
    this.forecast_data = this.weatherData.forecast;
  }

  display() {
    this.loading = true;
    this.getImdRainfallValueAdditionForBlock(this.weatherData.block_id);
    this.get10DaysImdForecast(this.weatherData.block_id);
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  back() {
    this.platform.backButton.subscribeWithPriority(5, () => {});
    this.modalController.dismiss();
  }

  getImdRainfallValueAdditionForBlock(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      .get10DaysImdValueAdditionDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log(data);
          this.value_addtion_forecast_data = data;
          if (this.value_addtion_forecast_data.length == 0) {
            this.value_addtion_forecast_data = null;
          } else {
          }
          this.loading = false;
        },
        (Error) => {
          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
          this.loading = false;
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
          console.log('newww', this.forecast_data);
          if (this.forecast_data.length == 0) {
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
          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
        }
      );
  }
}
