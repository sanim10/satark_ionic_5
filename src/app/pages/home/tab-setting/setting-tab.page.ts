import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../guard/auth.service';
import { ProfilePage } from './profile/profile.page';
import { Component, OnInit } from '@angular/core';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { AlertController, ModalController } from '@ionic/angular';

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
  constructor(
    private languageHelper: LanguageHelperService,
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    translateService: TranslateService,
    private httpClient: HttpClient
  ) {
    this.lHelper = languageHelper;
    translateService.setDefaultLang(translateService.getBrowserLang());
    this.token = localStorage.getItem('language');
  }

  ngOnInit() {
    this.noti_lang = localStorage.getItem('notification_lang');
  }

  logout() {
    this.authService.logout();
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
            checked: this.lHelper.lang == 'en' ? true : false,
          },
          {
            name: 'notiO',
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

  setNotiSound() {
    this.alertController
      .create({
        header: 'Notification Sound',
        inputs: [
          {
            name: 'radioE',
            type: 'radio',
            label: 'Default',
            value: 'en',
            checked: true,
          },
          {
            name: 'radioE',
            type: 'radio',
            label: 'Default',
            value: 'en',
            checked: true,
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
    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      (data) => {
        console.log('post data', data);
      },
      (err) => {
        console.log('error', err);
      }
    );
  }
}
