import { ApiService } from './../../../providers/api.service';
import { AuthService } from './../../../guard/auth.service';
import {
  AlertController,
  NavController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.page.html',
  styleUrls: ['./email-login.page.scss'],
})
export class EmailLoginPage implements OnInit {
  constructor(
    private navController: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private api: ApiService
  ) {}
  ngOnInit() {}

  lang: any;

  toPhoneLogin() {
    this.navController.navigateBack('/login', {
      replaceUrl: true,
    });
  }

  forgotPassword() {
    this.lang = localStorage.getItem('language');

    if (this.lang === 'en' || this.lang === null) {
      this.alertCtrl
        .create({
          header: 'Forgot Password',
          message:
            "Enter your email address and we'll help you reset your password",
          backdropDismiss: false,
          inputs: [
            {
              name: 'email',
              placeholder: 'E-mail',
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
              text: 'Reset',
              handler: (data) => {
                this.loadingCtrl
                  .create({ keyboardClose: true, mode: 'ios' })
                  .then((loadingEl) => {
                    if (!data.email) {
                      this.authService.showErrorToast('Please enter email');
                      return false;
                    } else if (!this.authService.mailFormat(data.email)) {
                      this.authService.showErrorToast('Email is invaild');
                      return false;
                    } else {
                      loadingEl.present();

                      this.api
                        .resetPassword(data.email)
                        .then((res) => {
                          this.authService.showAlert(
                            'Email Sent',
                            'Please check your mailbox.'
                          );
                          loadingEl.dismiss();
                        })
                        .catch((error) => {
                          this.authService.showAlert(
                            'Please register',
                            'You have not registered yet. Please register to log in.'
                          );
                          loadingEl.dismiss();
                        });
                    }
                  });
              },
            },
          ],
        })
        .then((alertEl) => alertEl.present());
    } else {
      this.alertCtrl
        .create({
          header: '??????????????????????????? ???????????????????????????????????? ??????',
          message:
            '???????????? id ?????????????????????, ????????? ?????????????????? ??????????????????????????? ??????????????????????????? ????????????????????? ???????????????',
          inputs: [
            {
              name: 'email',
              placeholder: '????????????',
            },
          ],
          buttons: [
            {
              text: '??????????????? ??????????????????',
              handler: (data) => {},
            },

            {
              text: '??????????????????',
              handler: (data) => {
                this.loadingCtrl
                  .create({ keyboardClose: true, mode: 'ios' })
                  .then((loadingEl) => {
                    if (!data.email) {
                      this.authService.showErrorToast(
                        '???????????? id ?????????????????????/Please enter email'
                      );
                      return false;
                    } else if (!this.authService.mailFormat(data.email)) {
                      this.authService.showErrorToast(
                        '????????????id ??????????????? ???????????????/Email is invaild'
                      );
                      return false;
                    } else {
                      loadingEl.present();
                      this.api
                        .resetPassword(data.email)
                        .then((res) => {
                          this.authService.showAlert(
                            '???????????? ??????????????????',
                            '?????????????????? ????????? ???????????? ?????????????????????.',
                            '?????????'
                          );
                          loadingEl.dismiss();
                        })
                        .catch((error) => {
                          this.authService.showAlert(
                            'Please register',
                            '???????????????????????? ?????????????????????????????????, ????????????????????????????????????????????????????????????|',
                            '?????????'
                          );
                        });
                      loadingEl.dismiss();
                    }
                  });
              },
            },
          ],
        })
        .then((alertEl) => alertEl.present());
    }
  }

  showErrorToastEmail(email) {
    this.lang = localStorage.getItem('language');
    if (this.authService.mailFormat(email)) {
      return;
    } else {
      if (this.lang === 'en' || this.lang === null) {
        this.toastCtrl
          .create({
            message: 'Email is invaild',
            duration: 3000,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      } else {
        this.toastCtrl
          .create({
            message: '????????????id ??????????????? ???????????????/Email is invaild',
            duration: 3000,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      }
    }
  }

  showErrorToastPassword(password) {
    this.lang = localStorage.getItem('language');
    if (password.length >= 6) {
      return;
    } else {
      if (this.lang === 'en' || this.lang === null) {
        this.toastCtrl
          .create({
            message: 'Minimum six characters',
            duration: 1500,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      } else {
        this.toastCtrl
          .create({
            message: 'Minimum six characters',
            duration: 1500,
            position: 'bottom',
          })
          .then((toastEl) => {
            toastEl.present();
          });
      }
    }
  }

  login(email, password) {
    this.authService.loginEmail(email, password);
  }

  openCapacitorSite = async () => {
    await Browser.open({ url: 'http://capacitorjs.com/' });
  };
}
