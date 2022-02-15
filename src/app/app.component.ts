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
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/Device';
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
    private alertController: AlertController,
    private modalController: ModalController,
    public translate: TranslateService,
    private lHelper: LanguageHelperService,
    private AuthService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
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
            importance: 3,
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
            importance: 3,
          }).then(() => console.log('Channel created'));

          PushNotifications.listChannels().then((channels) =>
            console.log('List of channels', channels)
          );
        } else {
          console.log('Permission error');
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        localStorage.setItem('deviceid', token.value);
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
            buttons: ['OK'],
          });
          (await alert).present();
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
        }
      );

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

      this.platform.backButton.subscribeWithPriority(10, () => {
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
      this.alertController
        .create({
          message: 'Do you want to close the app?',
          backdropDismiss: false,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                this.alertIsShowing = false;
                console.log('Application exit stoped!');
              },
            },
            {
              text: 'Exit',
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
}
