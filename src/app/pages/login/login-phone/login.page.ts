import { TranslateService } from '@ngx-translate/core';
import { filter, take, map } from 'rxjs/operators';
import { AuthService } from '../../../guard/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import {
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  isLogin = true;
  displayLanguage;
  lHelper;
  loader: any;
  lang;
  constructor(
    private router: Router,
    private languageHelper: LanguageHelperService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    translateService: TranslateService
  ) {
    this.lHelper = languageHelper;
    translateService.setDefaultLang(translateService.getBrowserLang());
  }

  ngOnInit() {}

  changeLang() {
    this.languageHelper.changeLanguage();
    // this.displayText = this.languageHelper.loginPageText();
    // console.log();
  }

  toEmailLogin() {
    this.router.navigateByUrl('/login/email-login', {
      replaceUrl: true,
    });
  }

  toPhoneRegistration() {
    this.router.navigateByUrl('/login/registration');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const phone = form.value.phone;
    this.authenticate(phone);
  }

  authenticate(phone: string) {
    this.isLoading = true;
    // this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
    //   this.loader = loadingEl;
    // loadingEl.present();
    this.authService.login(phone);
    // loadingEl.dismiss();
    // });
  }

  // ngOnDestory() {
  //   this.loader.dismiss();
  // }

  showErrorToast(phone) {
    this.lang = localStorage.getItem('language');
    if (phone.length === 10) {
      return;
    } else {
      if (this.lang === 'en') {
        this.toastCtrl
          .create({
            message: 'Enter a valid 10 digit phone number.',
            duration: 3000,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      } else {
        this.toastCtrl
          .create({
            message: 'ଏକ ବୈଧ 10 ଅଙ୍କ ଫୋନ୍ ପ୍ରବେଶ କରନ୍ତୁ ନମ୍ଵର୍।',
            duration: 3000,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      }
    }
  }
}
