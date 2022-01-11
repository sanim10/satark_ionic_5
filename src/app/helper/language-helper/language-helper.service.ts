import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageHelperService {
  lang = localStorage.getItem('language');
  od = this.getDisplayLanguage() === 'od' ? true : false;
  // displayText = {
  //   //en
  //   en: {
  //     settingPage: {
  //       option1: 'Profile',
  //       sectionHeader1: 'User preferences',
  //       option2: 'App language',
  //       option3: 'Notification language',
  //       option4: 'Manage locations',
  //       sectionHeader2: 'Notifications',
  //       option5: 'Location-based notification',
  //       option6: 'Custom notifcation sound',
  //       option7: 'Logout',
  //     },
  //   },
  //   //od
  //   od: {
  //     settingPage: {
  //       option1: 'Profile',
  //       sectionHeader1: 'User preferences',
  //       option2: 'App language',
  //       option3: 'Notification language',
  //       option4: 'Manage locations',
  //       sectionHeader2: 'Notifications',
  //       option5: 'Location-based notification',
  //       option6: 'Custom notifcation sound',
  //       option7: 'Logout',
  //     },
  //   },
  // };

  constructor(public translate: TranslateService) {}

  setDisplayLanguage(lang) {
    console.log('lang set ' + lang);
    localStorage.setItem('language', lang);
    Storage.set({
      key: 'language',
      value: lang,
    });
    this.lang = lang;
    this.translate.use(lang);
  }

  getDisplayLanguage() {
    const value = Storage.get({ key: 'language' });
    return value.toString();
  }

  changeLanguage() {
    this.od = !this.od;
    this.setDisplayLanguage(this.od ? 'od' : 'en');
  }
}
