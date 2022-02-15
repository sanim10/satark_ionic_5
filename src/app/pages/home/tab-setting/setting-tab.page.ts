import { take } from 'rxjs/operators';
import { ApiService } from './../../../providers/api.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../guard/auth.service';
import { ProfilePage } from './profile/profile.page';
import { Component, OnInit } from '@angular/core';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {
  displayText;
  options;
  lHelper;
  token;
  noti_lang;
  geo;
  public user_data: any;
  public loc_data: any;
  public success_data: any;
  user_id: string;
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  deviceid: string;
  customized_sound_lightning: string;
  customized_sound_ocean: string;

  constructor(
    private languageHelper: LanguageHelperService,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    translateService: TranslateService,
    private httpClient: HttpClient,
    private apiService: ApiService
  ) {
    this.lHelper = languageHelper;
    translateService.setDefaultLang(translateService.getBrowserLang());
    this.token = localStorage.getItem('token');
    this.deviceid = localStorage.getItem('deviceid');
    this.noti_lang = localStorage.getItem('notification_lang');
  }

  ngOnInit() {
    this.requestPermission();
    this.checklogin(this.token);
  }

  requestPermission() {
    Geolocation.requestPermissions().then((permissionStatus) => {
      console.log(permissionStatus);
    });
  }

  logout() {
    this.authService.logout();
  }

  selectAppLang() {
    this.alertController
      .create({
        header: 'App Language',
        inputs: [
          {
            name: 'appE',
            type: 'radio',
            label: 'English',
            value: 'en',
            checked: this.lHelper.lang == 'en' ? true : false,
          },
          {
            name: 'appO',
            type: 'radio',
            label: 'Oriya',
            value: 'od',
            checked: this.lHelper.lang == 'od' ? true : false,
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Done',
            handler: (data) => {
              this.languageHelper.setDisplayLanguage(data);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  selectNotificationLang() {
    this.alertController
      .create({
        header: 'Notification Language',
        inputs: [
          {
            name: 'notiE',
            type: 'radio',
            label: 'English',
            value: 'en',
            checked: this.noti_lang == 'en' ? true : false,
          },
          {
            name: 'notiO',
            type: 'radio',
            label: 'Oriya',
            value: 'od',
            checked: this.noti_lang == 'od' ? true : false,
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Done',
            handler: (data) => {
              console.log(data);
              this.setNotificationLanguage(data);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  setNotification() {
    this.alertController
      .create({
        header: 'Notification',
        inputs: [
          {
            name: 'checkN',
            type: 'checkbox',
            label: this.lHelper.lang == 'en' ? 'Lightning' : 'ବଜ୍ରପାତ',
            value: 'l',
            checked: this.customized_sound_lightning == 'on' ? true : false,
          },
          {
            name: 'checkO',
            type: 'checkbox',
            label: this.lHelper.lang == 'en' ? 'Ocean' : 'ସମୁଦ୍ର',
            value: 'o',
            checked: this.customized_sound_ocean == 'on' ? true : false,
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Done',
            handler: (data) => {
              switch (data.length) {
                case 2:
                  this.getCustomizedAlertLightning(true);
                  this.getCustomizedAlertOcean(true);
                  break;

                case 1:
                  if (data[0] == 'l') {
                    this.getCustomizedAlertLightning(true);
                    this.getCustomizedAlertOcean(false);
                  } else {
                    this.getCustomizedAlertLightning(false);
                    this.getCustomizedAlertOcean(true);
                  }
                  break;
                case 0:
                  this.getCustomizedAlertLightning(false);
                  this.getCustomizedAlertOcean(false);
              }
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
  async presentProfileModal() {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: ProfilePage,
    });
    return await modal.present();
  }

  setNotificationLanguage(notiLang) {
    var lang = notiLang;
    console.log('selected language for notification is:', lang);
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      lng: lang,
      token: this.token,
      extra_param: 'update_notification_lang',
    });
    console.log('params', params);
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
          this.noti_lang = notiLang;
        },
        (err) => {
          console.log('error', err);
        }
      );
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log(data);
        this.user_id = this.user_data[0].id;
        this.noti_lang = this.user_data[0].notification_lng;
        this.customized_sound_lightning =
          this.user_data[0].lightning_siren_alert_on_off;
        this.customized_sound_ocean =
          this.user_data[0].ocean_siren_alert_on_off;
        if (this.noti_lang == null) {
          this.noti_lang = 'en';
        }
        this.getTempLocation();
      });
  }

  getTempLocation() {
    let param = {
      id: this.user_id,
    };
    this.apiService
      .getTempLocation(param) //call api to check token
      .pipe(take(1))
      .subscribe((data) => {
        // alert(JSON.stringify(data));
        this.success_data = data['success'];
        console.log('success', this.success_data);
        this.loc_data = data['result'];
        if (this.success_data) {
          console.log('loca data', this.loc_data);
        } else {
          this.loc_data = null;
          console.log('loca data', this.loc_data);
        }
      });
  }

  ///enable or disable background tracking
  getbackgroundGeolocation(e) {
    this.requestPermission();
    console.log('checked...', e.detail.checked);
    var checked = e.detail.checked;
    Geolocation.checkPermissions().then((status) => {
      console.log(status);
      if (status.location == 'granted' || status.coarseLocation == 'granted') {
        if (checked == true) {
          this.startBackgroundGeolocation();
          // alert('start');
        } else {
          this.stopBackgroundGeolocation();
          // alert('stop');
        }
      } else {
        checked
          ? (this.loc_data.gps_tracker = 'off')
          : (this.loc_data.gps_tracker = 'on');
      }
    });
  }

  startBackgroundGeolocation() {
    const positionOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 60000,
      timeout: 60000,
    };

    Geolocation.watchPosition(positionOptions, (position) => {
      console.log(position);
      this.sendGPS(position);
      let param = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        user_id: this.user_id,
      };
      console.log(param);
      this.apiService
        .getGpsLightningData(param)
        .pipe(take(1))
        .subscribe((data) => {
          console.log('get_gps_lightning_data', data);
        });
    }).then((watchId) => {
      this.geo = watchId;
    });
    console.log(this.geo);
  }

  stopBackgroundGeolocation() {
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      user_id: this.user_id,
      deviceid: this.deviceid,
      gps_tracker: 'off',
      extra_param: 'stopbackgroundGeolocation',
    });
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
        },
        (err) => {
          console.log('ERROR!: ', err);
          this.authService.showErrorToast('Network Error!');
        }
      );
    Geolocation.clearWatch({ id: this.geo });
    this.authService.showErrorToast('Location based notification disabled');
  }

  sendGPS(location) {
    let timestamp = new Date(location.timestamp);
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      speed: location.speed == null ? 0 : location.speed,
      timestamp: timestamp,
      user_id: this.user_id,
      deviceid: this.deviceid,
      gps_tracker: 'on',
      extra_param: 'startbackgroundGeolocation',
    });

    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
        },
        (err) => {
          console.log('ERROR!: ', err);
          // this.presentToast('Network Error!');
        }
      );
  }

  ///enable or disable customized alert sound
  getCustomizedAlertLightning(val) {
    var checked = val;
    if (checked == true) {
      this.customized_sound_lightning = 'on';
    } else {
      this.customized_sound_lightning = 'off';
    }
    console.log('sound..', this.customized_sound_lightning);
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      token: this.token,
      siren_alert_on_off: this.customized_sound_lightning,
      extra_param: 'customized_sound_lightning',
    });
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
        },
        (err) => {
          console.log('ERROR!: ', err);
          this.authService.showErrorToast('Network Error!');
        }
      );
  }

  ///enable or disable customized alert sound
  getCustomizedAlertOcean(val) {
    var checked = val;
    if (checked == true) {
      this.customized_sound_ocean = 'on';
    } else {
      this.customized_sound_ocean = 'off';
    }
    console.log('sound..', this.customized_sound_ocean);
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      token: this.token,
      siren_alert_on_off: this.customized_sound_ocean,
      extra_param: 'customized_sound_ocean',
    });
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
        },
        (err) => {
          console.log('ERROR!: ', err);
          this.authService.showErrorToast('Network Error!');
        }
      );
  }
}
