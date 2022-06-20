import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageHelperService {
  lang = localStorage.getItem('language');
  od = this.getDisplayLanguage() === 'od' ? true : false;

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
