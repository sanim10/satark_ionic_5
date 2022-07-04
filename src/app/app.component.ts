import { take } from 'rxjs/operators';
import { Market } from '@ionic-native/market/ngx';
import { ApiService } from 'src/app/providers/api.service';
import { Router } from '@angular/router';
import { AuthService } from './guard/auth.service';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  AlertController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { Storage } from '@capacitor/storage';
import { Network } from '@capacitor/network';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  alertIsShowing = false;
  data_content;
  lang: string;
  firebaseAuth = {
    apiKey: 'AIzaSyAz73qdaC__6oksWTMXQd9tmjpx_GpZ73w',
    authDomain: 'satark-1088e.firebaseapp.com',
    databaseURL: 'https://satark-1088e.firebaseio.com',
    projectId: 'satark-1088e',
    storageBucket: 'satark-1088e.appspot.com',
    messagingSenderId: '488937344040',
  };

  constructor(
    private platform: Platform,
    private location: Location,
    private screenOrientation: ScreenOrientation,
    private navController: NavController,
    private modalController: ModalController,
    public translate: TranslateService,
    private lHelper: LanguageHelperService,
    private AuthService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private httpClient: HttpClient,
    private apiService: ApiService
  ) {
    const app = initializeApp(this.firebaseAuth);
    initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });

    translate.setDefaultLang('en');
    // lHelper.setDisplayLanguage('en');
    this.lang = localStorage.getItem('language');
    if (this.lang === null || this.lang === 'en') {
      translate.setDefaultLang('en');
      lHelper.setDisplayLanguage('en');
      localStorage.setItem('language', 'en');
    } else {
      translate.setDefaultLang('od');
      lHelper.setDisplayLanguage('od');
      localStorage.setItem('language', 'od');
    }

    this.initializeApp();
  }

  async setToken(token) {
    console.log("settoken....",token);
    await Storage.set({
      key: 'deviceid',
      value: token,
    });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      StatusBar.setBackgroundColor({ color: '#ffffff' });
      StatusBar.setStyle({ style: Style.Light });

      if (localStorage.getItem('new_user') === 'yes_ph') {
        this.navController.navigateForward('setup-profile-phone');
      } else if (localStorage.getItem('new_user') === 'yes_email') {
        this.navController.navigateForward('setup-profile-email');
      }

      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          PushNotifications.register();

          var channedID = 'satark_lightning';
          var channedID_1 = 'satark_ocean';
          PushNotifications.createChannel({
            id: channedID,
            description: 'this is satark lightning',
            sound: 'lightning.mp3',
            vibration: true,
            visibility: 1,
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            importance: 5,
            name: channedID,
          }).then(() => console.log('Channel created'));

          PushNotifications.createChannel({
            id: channedID_1,
            description: 'this is satark ocean',
            sound: 'ocean.mp3',
            vibration: true,
            visibility: 1,
            // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
            name: channedID_1,
            importance: 5,
          }).then(() => console.log('Channel created'));

          PushNotifications.listChannels().then((channels) =>
            console.log('List of channels', channels)
          );
        } else {
          console.log('Permission error');
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        console.log("registration token.....",token.value);
        localStorage.setItem('deviceid', token.value);
        console.log("deviceid.....",localStorage.getItem('deviceid'));
        this.setToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          console.log('Push received: ' + JSON.stringify(notification));
          this.data_content = notification.data.content;
          let alert = this.alertCtrl.create({
            header: notification.title,
            message: notification.body,
            buttons: this.lHelper.lang == 'en' ? ['OK'] : ['ଠିକ'],
          });
          (await alert).present();
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        async (data: any) => {
          console.log('Push action performed: ' + JSON.stringify(data));
          this.navController.navigateForward('/home/home-tab');

          this.data_content = data.notification.data.content;
          if (data.notification.data.content == 'Lightning') {
            let alert1 = this.alertCtrl.create({
              header: 'SATARK Alert Feedback',
              message: 'Have you experienced lightning in past 30 min?',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('yes clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'yes',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
                {
                  text: 'No',
                  handler: () => {
                    console.log('no clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'no',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
              ],
            });
            (await alert1).present();

            let alert = this.alertCtrl.create({
              header: 'SATARK Alert Feedback',
              message: 'Did you experience lightning just now?',
              cssClass: 'fav_loc_prompt',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('yes clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'yes',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
                {
                  text: 'No',
                  handler: () => {
                    console.log('no clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'no',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
              ],
            });
            (await alert).present();
          } else if (data.notification.data.content == 'Rainfall') {
            let alert = this.alertCtrl.create({
              header: 'SATARK Alert Feedback',
              cssClass: 'fav_loc_prompt',
              message: 'Did it rain yesterday?',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('yes clicked');
                    this.yes_did_rain();
                  },
                },
                {
                  text: 'No',
                  handler: () => {
                    console.log('no clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'no',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
              ],
            });
            (await alert).present();
          } else if (data.notification.data.content == 'Heatwave') {
            let alert = this.alertCtrl.create({
              header: 'SATARK Alert Feedback',
              message: 'Did you experience heatwave?',
              cssClass: 'fav_loc_prompt',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    console.log('yes clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'yes',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
                {
                  text: 'No',
                  handler: () => {
                    console.log('no clicked');
                    var url =
                      'https://satark.rimes.int/api_user/users_ios_post';
                    var params = JSON.stringify({
                      deviceid: localStorage.getItem('deviceid'),
                      field: data.notification.data.content,
                      received: 'no',
                      extra_param: 'notification_feedback',
                    });
                    this.httpClient
                      .post(url, params, { responseType: 'text' })
                      .subscribe(
                        (data) => {
                          console.log('post data', data);
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                        }
                      );
                  },
                },
              ],
            });
            (await alert).present();
          }
          // else if(data.content == "Ocean"){
          //   this.nav.setRoot(OceanPage);
          // }

          // alert('background');
        }

        // else {
        //     let alert = this.alertCtrl.create({
        //       header: data.title,
        //       cssClass: 'fav_loc_prompt',
        //       message: data.body,
        //       buttons: ['OK'],
        //     });
        //     alert.present();
        //   }
        // }
      );

      PushNotifications.removeAllDeliveredNotifications();

      Network.addListener('networkStatusChange', async (status) => {
        console.log('Network status changed', status);
        if (
          !this.location.isCurrentPathEqualTo('/splash') &&
          !status.connected
        ) {
          this.navController.navigateForward('no-connection');
        } else {
          this.location.isCurrentPathEqualTo('/no-connection')
            ? this.navController.pop()
            : null;
        }
      });

      this.platform.backButton.subscribeWithPriority(1, () => {
        console.log('Back press handler!');
        if (this.location.isCurrentPathEqualTo('/no-connection')) {
        } else if (this.location.isCurrentPathEqualTo('/home/home-tab')) {
          console.log('Show Exit Alert!');
          this.showExitConfirm();
        } else if (
          this.location.isCurrentPathEqualTo('/home/feedback-tab') ||
          this.location.isCurrentPathEqualTo('/home/setting-tab')
        ) {
          this.navController.navigateBack('/home/home-tab');
        } else if (this.location.isCurrentPathEqualTo('/login')) {
          navigator['app'].exitApp();
        } else {
          // this.navController.back();
          this.navController.pop();
        }
      });
    });
  }

  ngOnInit() {
    this.initializeApp();
  }

  showExitConfirm() {
    if (!this.alertIsShowing) {
      this.alertIsShowing = true;
      this.alertCtrl
        .create({
          message:
            this.lHelper.lang == 'en'
              ? 'Do you want to close the app?'
              : 'ଆପଣ ଆପ୍ ବନ୍ଦ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
          backdropDismiss: false,
          buttons: [
            {
              text: this.lHelper.lang == 'en' ? 'No' : 'ନାଁ',
              role: 'cancel',
              handler: () => {
                this.alertIsShowing = false;
                console.log('Application exit stoped!');
              },
            },
            {
              text: this.lHelper.lang == 'en' ? 'Exit' : 'ପ୍ରସ୍ଥାନ',
              handler: () => {
                this.alertIsShowing = false;
                navigator['app'].exitApp();
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

  ///generate alert if it did rain
  private async yes_did_rain() {
    console.log('yes it did rain');
    let alert = this.alertCtrl.create({
      header: 'SATARK Alert Feedback',
      cssClass: 'fav_loc_prompt',
      message: 'Did it rain at night or day?',
      buttons: [
        {
          text: 'Day',
          handler: () => {
            console.log('yes clicked');
            var url = 'https://satark.rimes.int/api_user/users_ios_post';
            var params = JSON.stringify({
              deviceid: localStorage.getItem('deviceid'),
              field: 'Rainfall',
              received: 'day',
              extra_param: 'notification_feedback',
            });
            this.httpClient
              .post(url, params, { responseType: 'text' })
              .subscribe(
                (data) => {
                  console.log('post data', data);
                },
                (err) => {
                  console.log('ERROR!: ', err);
                }
              );
          },
        },
        {
          text: 'Night',
          handler: () => {
            console.log('no clicked');
            var url = 'https://satark.rimes.int/api_user/users_ios_post';
            var params = JSON.stringify({
              deviceid: localStorage.getItem('deviceid'),
              field: 'Rainfall',
              received: 'night',
              extra_param: 'notification_feedback',
            });
            this.httpClient
              .post(url, params, { responseType: 'text' })
              .subscribe(
                (data) => {
                  console.log('post data', data);
                },
                (err) => {
                  console.log('ERROR!: ', err);
                }
              );
          },
        },
      ],
    });
    (await alert).present();
  }
}
