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
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse,
} from '@awesome-cordova-plugins/background-geolocation/ngx';

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
  loc_permission = 'off';
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
    private apiService: ApiService,
    private translate: TranslateService,
    private backgroundGeolocation: BackgroundGeolocation
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
    // this.checkPermission();
    localStorage.getItem('loc_per') == 'off'
      ? (this.loc_permission = 'off')
      : (this.loc_permission = 'on');
  }

  // checkPermission() {
  //   Geolocation.checkPermissions().then((status) => {
  //     console.log(status);
  //     if (status.location == 'granted' || status.coarseLocation == 'granted') {
  //       this.loc_permission = 'on';
  //     } else {
  //       this.loc_permission = 'off';
  //     }
  //   });
  // }

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
        header: this.translate.instant('App Language'),
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
            label: 'ଓଡିଆ',
            value: 'od',
            checked: this.lHelper.lang == 'od' ? true : false,
          },
        ],
        buttons: [
          {
            text: this.lHelper.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: this.lHelper.lang == 'en' ? 'Done' : 'ସମାପ୍ତ',
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
        header: this.translate.instant('Notification Language'),
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
            label: 'ଓଡିଆ',
            value: 'od',
            checked: this.noti_lang == 'od' ? true : false,
          },
        ],
        buttons: [
          {
            text: this.lHelper.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: this.lHelper.lang == 'en' ? 'Done' : 'ସମାପ୍ତ',
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
        header: this.translate.instant('Custom notification sound'),
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
            text: this.lHelper.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
            handler: (data) => {
              console.log('Cancel clicked');
            },
          },
          {
            text: this.lHelper.lang == 'en' ? 'Done' : 'ସମାପ୍ତ',
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
          // this.loc_data.gps_tracker == 'off'
          //   ? (this.loc_permission = 'off')
          //   : (this.loc_permission = 'on');
        } else {
          this.loc_data = null;
          console.log('loca data', this.loc_data);
        }
      });
  }

  ///enable or disable background tracking
  getbackgroundGeolocation1(e) {
    Geolocation.requestPermissions().then((permissionStatus) => {
      if (
        permissionStatus.location == 'denied' ||
        permissionStatus.coarseLocation == 'denied'
      ) {
        this.loc_data.gps_tracker = 'off';
      } else {
        this.loc_data.gps_tracker = 'off';
      }
    });
    // Geolocation.requestPermissions()
    //   .then((permissionStatus) => {
    //   console.log(permissionStatus);
    //   if (
    //     permissionStatus.location == 'denied' ||
    //     permissionStatus.coarseLocation == 'denied'
    //   ) {
    //     this.loc_data.gps_tracker = 'off';
    //   } else {
    //     console.log('checked...', e.detail.checked);
    //     var checked = e.detail.checked;
    //     Geolocation.checkPermissions().then((status) => {
    //       console.log(status);
    //       if (
    //         status.location == 'granted' ||
    //         status.coarseLocation == 'granted'
    //       ) {
    //         if (checked == true) {
    //           this.startBackgroundGeolocation();
    //           // alert('start');
    //         } else {
    //           this.stopBackgroundGeolocation();
    //           // alert('stop');
    //         }
    //       } else {
    //         this.loc_data.gps_tracker = 'off';
    //         // checked
    //         //   ? (this.loc_data.gps_tracker = 'off')
    //         //   : (this.loc_data.gps_tracker = 'on');
    //       }
    //     });
    //   }
    // })
    // .catch(() => {
    //   this.loc_data.gps_tracker = 'off';
    // });
  }

  getbackgroundGeolocation(e) {
    this.requestPermission();
    console.log('checked...', e.detail.checked);
    var checked = e.detail.checked;
    Geolocation.checkPermissions().then((status) => {
      console.log(status);
      if (status.location == 'granted' || status.coarseLocation == 'granted') {
        if (checked == true) {
          this.loc_permission = 'on';
          localStorage.setItem('loc_per', 'on');
          this.startBackgroundGeolocation();
          // alert('start');
        } else {
          this.loc_permission = 'off';
          localStorage.setItem('loc_per', 'off');
          this.stopBackgroundGeolocation();
          // alert('stop');
        }
      } else {
        checked ? (this.loc_permission = 'off') : (this.loc_permission = 'on');
        // checked
        //   ? (this.loc_data.gps_tracker = 'off')
        //   : (this.loc_data.gps_tracker = 'on');
      }
    });
  }

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: 60000,
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          // this.presentToast("Location based notification enabled");
          console.log(location);
          this.sendGPS(location);
          let param = {
            lat: location.latitude,
            long: location.longitude,
            user_id: this.user_id,
          };
          this.apiService.getGpsLightningData(param).subscribe((data) => {
            console.log('get_gps_lightning_data', data);
          });
        });
    });
    // start recording location
    this.backgroundGeolocation.start();
    this.authService.showErrorToast('Location based notification enabled');

    //   let option = {
    //     frequency: 3000,
    //     enableHighAccuracy: true
    //   };

    // this.watch = this.geolocation.watchPosition(option).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

    // console.log(position);

    //   // Run update inside of Angular's zone
    //   this.zone.run(() => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //   });
    // })
  }

  stopBackgroundGeolocation() {
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      user_id: this.user_id,
      deviceid: this.deviceid,
      gps_tracker: 'off',
      extra_param: 'stopbackgroundGeolocation',
    });
    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      (data) => {
        console.log('post data', data);
      },
      (err) => {
        console.log('ERROR!: ', err);
        this.authService.showErrorToast('Network Error!');
      }
    );
    this.backgroundGeolocation.stop();
    // this.watch.unsubscribe();
    this.authService.showErrorToast('Location based notification disabled');
  }

  sendGPS(location) {
    if (location.speed == undefined) {
      location.speed = 0;
    }
    let timestamp = new Date(location.time);
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      lat: location.latitude,
      lng: location.longitude,
      speed: location.speed,
      timestamp: timestamp,
      user_id: this.user_id,
      deviceid: this.deviceid,
      gps_tracker: 'on',
      extra_param: 'startbackgroundGeolocation',
    });
    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      (data) => {
        console.log('post data', data);
      },
      (err) => {
        console.log('ERROR!: ', err);
        this.authService.showErrorToast('Network Error!');
      }
    );
    // this.http
    //   .post(
    //     this.gps_update_link, // backend api to post
    //     {
    //       lat: location.latitude,
    //       lng: location.longitude,
    //       speed: location.speed,
    //       timestamp: timestamp
    //     },
    //     {}
    //   )
    //   .then(data => {
    //     console.log("POST Request is successful ", data);
    //     this.backgroundGeolocation.finish(); // FOR IOS ONLY
    //     // BackgroundGeolocation.endTask(taskKey);
    //   })
    //   .catch(error => {
    //     this.backgroundGeolocation.finish(); // FOR IOS ONLY
    //     console.log(error);
    //   });
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
