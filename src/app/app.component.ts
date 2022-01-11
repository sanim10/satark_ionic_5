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
import { Http, HttpResponse } from '@capacitor-community/http';
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
    private router: Router
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
      StatusBar.setBackgroundColor({ color: '#ffffff' });
      StatusBar.setStyle({ style: Style.Light });

      if (localStorage.getItem('new_user') === 'yes_ph') {
        this.navController.navigateForward('setup-profile-phone');
      } else if (localStorage.getItem('new_user') === 'yes_email') {
        this.navController.navigateForward('setup-profile-email');
      }

      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
          // alert('permission grant');
        } else {
          // Show some error
          // alert('permission error');
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        // alert('Push registration success, token: ' + token.value);
        localStorage.setItem('deviceid', token.value);
        this.setToken(token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          alert('Push received: ' + JSON.stringify(notification));
          // alert('Push received: ' + JSON.stringify(notification));
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
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
