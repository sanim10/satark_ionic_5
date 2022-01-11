import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, HttpResponse } from '@capacitor-community/http';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClinet: HttpClient) {}

  checklogin(token): Observable<any> {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/users_new_get?token=' + token
    );
    // .pipe(
    //   map((response: any) => {
    //     console.log(response);
    //     // alert(response + 'response');
    //   })
    // );
  }

  async checkLogin(token) {
    const options = {
      url: 'https://satark.rimes.int/api_user/users_new_get?token=orfuX45qVjP9jKASCji4d9O9FTm2',
      // headers: { 'X-Fake-Header': 'Max was here' },
      // params: { size: 'XL' },
    };

    return Http.get(options);
    const response: HttpResponse = await Http.get(options);
    // console.log(JSON.stringify(response));
    // alert(response);

    // or...
    // const response = await Http.request({ ...options, method: 'GET' })
  }

  resetPassword(email: string): any {
    console.log(email);
    return sendPasswordResetEmail(getAuth(), email);
  }

  getOtp(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/otp_get?phone=' + param.phone
    );
  }

  verifyOtp(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/verifyotp_get?otp=' +
        param.otp +
        '&ph=' +
        param.phone
    );
  }

  getDistrict() {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/district_get'
    );
  }

  getBlocks(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/block_get?id=' + param.id
    );
  }

  /////get favourite location of user by userid
  getFavLocations(id) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_user/fav_loc_by_user_get?id=' + id
    );
  }

  ///get 10 days IMD data for weather forecast home page
  get10DaysImdDataForWeather(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_weather/imd_for_each_block_data_get?id=' +
        param.block_id
    );
  }

  ///get 10 days IMD value addition data for weather forecast home page
  get10DaysImdValueAdditionDataForWeather(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_weather/imd_rainfall_value_addition_for_block_get?id=' +
        param.block_id
    );
  }

  //fetch IMD heatwave Alerts
  getImdHeatwaveAlerts() {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_heatwave/imd_heatwave_alerts_get'
    );
  }

  getImdHeatwaveAlertsDissemintationForEachBlock(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_heatwave/heatwave_alerts_dissemintation_block_get?id=' +
        param.id
    );
  }

  getImdHeatwaveAlertsDissemintationForFavBlock(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/api_heatwave/heatwave_alerts_dissemintation_fav_block_get?id=' +
        param.id
    );
  }

  getRegisteredLocLightningData(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/Api_lightning/block_advisory_new?block_id=' +
        param.id
    );
  }

  //get lightning thunderstorm data for registered location of user
  getFavLocLightningData(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/Api_lightning/fav_block_advisory?user_id=' +
        param.id
    );
  }

  //get dta blocks for potential
  getDtaBlockNames(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/Api_lightning/dta_block_advisory?block_id=' +
        param.block_id
    );
  }

  //get dta fav blocks for potential
  getDtaFavBlockNames(param) {
    return this.httpClinet.get(
      'https://satark.rimes.int/Api_lightning/dta_fav_block_advisory?user_id=' +
        param.user_id
    );
  }
}
