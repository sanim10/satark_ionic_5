import { Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { FavModalComponent } from '../fav-modal/fav-modal.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
    private authService: AuthService
  ) {
    this.lHelper = langHelper;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.display();
  }

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
          this.getFavLocations(this.user_id);
          this.get10DaysImdForecast(this.block_id);
          this.getRainfallValueAdditionForBlock(this.block_id);
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
          if (this.value_addtion_forecast_data?.length == 0) {
            this.value_addtion_forecast_data = null;
          } else {
          }
          this.loading = false;
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
}
