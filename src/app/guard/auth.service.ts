import { RegistrationPage } from './../pages/login/registration-phone/registration.page';
import { ApiService } from './../providers/api.service';
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, take } from 'rxjs/operators';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { keys } from 'highcharts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  loading: any;
  userData: any;

  public success: Array<any>;
  lang: string;
  device_id: string;
  user_token: string;

  constructor(
    private router: Router,
    private httpClinet: HttpClient,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private api: ApiService,
    private navController: NavController
  ) {
    this.loadAuth();
    this.device_id = localStorage.getItem('deviceid');
    // console.log("deviceid....", this.device_id);
  }

  async getToken(){
    const ret = await Storage.get({ key: 'deviceid' });
    const user = ret.value;
    console.log("<<<<<<<<deviceid....", ret);
  }

  async loadAuth() {
    console.log("is auth...>>>>");
    const authState = await Storage.get({ key: 'authenticated' });
    console.log("is auth...>>>>", authState.value);
    if (authState && authState.value) {
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async cleanAuth(){
    await Storage.set({
      key: 'authenticated',
      value: "",
    });
  }

  //Login using phone number
  login(phone: String = 'number') {
    this.lang = localStorage.getItem('language');
    this.device_id = localStorage.getItem('deviceid');

    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();

        let new_mobile_number = '91' + phone + '@rimes.int';
        console.log('1');

        const auth = getAuth();
        console.log('2');

        signInWithEmailAndPassword(auth, new_mobile_number, 'rimes@123')
          .then((data) => {
            localStorage.setItem('token', data.user.uid);
            console.log(data);

            this.api
              .checklogin(data.user.uid)
              .pipe(take(1))
              .subscribe((response) => {
                this.success = response['success'];
                console.log('success', this.success);

                if (this.success) {
                  this.router.navigateByUrl('/home', { replaceUrl: true });
                  this.isAuthenticated.next(true);
                  this.setLoginState('true');
                  this.user_token = localStorage.getItem('token');
                  var usr_data = response.result[0];
                  console.log('success', usr_data);

                  localStorage.setItem('block_id', usr_data.block_id);
                  localStorage.setItem('district_id', usr_data.district_id);
                  localStorage.setItem('block_name', usr_data.block_name);
                  localStorage.setItem(
                    'block_name_ory',
                    usr_data.block_name_ory
                  );
                  localStorage.setItem('district_name', usr_data.district_name);
                  localStorage.setItem(
                    'notification_lang',
                    usr_data.notification_lng
                  );
                  localStorage.setItem(
                    'district_name_ory',
                    usr_data.district_name_ory
                  );
                  if (this.lang == 'en' || this.lang === null) {
                    this.showAlert(
                      'Login Success!',
                      'You have successfully logged in'
                    );
                  } else {
                    this.showAlert(
                      'ଲଗ ଇନ କୃତକାର୍ଯ୍ୟ ହେଲା!',
                      'ଆପଣଙ୍କ ଲଗ ଇନ ସଫଳ ହେଲା',
                      'ଠିକ'
                    );
                  }

                  var url = 'https://satark.rimes.int/api_user/users_post';
                  var params = JSON.stringify({
                    token_id: this.user_token,
                    device: this.device_id,
                    extra_param: 'update_device_id',
                  });
                  console.log("params...", params);
                  this.httpClinet.post(url, params).subscribe(
                    (data) => {
                      // console.log(data);
                      // alert(data);
                    },
                    (err) => {
                      console.log('ERROR!: ', err);
                    }
                  );
                } else {
                  // this.router.navigateByUrl('login/registration');
                  this.isAuthenticated.next(false);
                  this.setLoginState('false');
                  if (this.lang === 'en' || this.lang === null) {
                    this.showAlert(
                      'Login Fail!',
                      'You have not registered yet. Please register to log in.'
                    );
                  } else {
                    this.showAlert(
                      'ଲଗ ଇନ ଅକୃତକାର୍ଯ୍ୟ ହେଲା!',
                      'ପଞ୍ଜୀକୃତ ହେଇନାହାନ୍ତି, ଦୟାକରିପଞ୍ଜିକରଣକରନ୍ତୁ|',
                      'ଠିକ'
                    );
                  }
                }
                loadingEl.dismiss();
              });
          })
          .catch((err) => {
            console.log(err);
            loadingEl.dismiss;
            this.isAuthenticated.next(false);
            this.setLoginState('false');
            loadingEl.dismiss();

            if (this.lang === 'en' || this.lang === null) {
              this.showAlert(
                'Login Fail!',
                'You have not registered yet. Please register to log in.'
              );
            } else {
              this.showAlert(
                'ଲଗ ଇନ ଅକୃତକାର୍ଯ୍ୟ ହେଲା!',
                'ପଞ୍ଜୀକୃତ ହେଇନାହାନ୍ତି, ଦୟାକରିପଞ୍ଜିକରଣକରନ୍ତୁ|',
                'ଠିକ'
              );
            }
          });
      });
  }

  //Login using email
  loginEmail(email: String, password: String) {
    this.lang = localStorage.getItem('language');
    this.device_id = localStorage.getItem('deviceid');
    this.getToken();
    // console.log(".....device",Storage.get({ key: 'deviceid'}));
    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();

        let new_email = email.trim();
        let new_password = password.trim();
        signInWithEmailAndPassword(getAuth(), new_email, new_password)
          .then((data) => {
            localStorage.setItem('token', data.user.uid);
            this.user_token = localStorage.getItem('token');

            this.api
              .checklogin(data.user.uid)
              .pipe(take(1))
              .subscribe((response) => {
                this.success = response['success'];
                console.log('success......', this.success);

                if (this.success) {
                  this.router.navigateByUrl('home', { replaceUrl: true });
                  this.isAuthenticated.next(true);
                  this.setLoginState('true');
                  loadingEl.dismiss();
                  var usr_data = response.result[0];
                  console.log('.....success', usr_data);

                  localStorage.setItem('block_id', usr_data.block_id);
                  localStorage.setItem('district_id', usr_data.district_id);
                  localStorage.setItem('block_name', usr_data.block_name);
                  localStorage.setItem(
                    'block_name_ory',
                    usr_data.block_name_ory
                  );
                  localStorage.setItem('district_name', usr_data.district_name);
                  localStorage.setItem(
                    'district_name_ory',
                    usr_data.district_name_ory
                  );
                  localStorage.setItem(
                    'notification_lang',
                    usr_data.notification_lng
                  );

                  if (this.lang == 'en' || this.lang === null) {
                    this.showAlert(
                      'Login Success!',
                      'You have successfully logged in'
                    );
                  } else {
                    this.showAlert(
                      'ଲଗ ଇନ କୃତକାର୍ଯ୍ୟ ହେଲା!',
                      'ଆପଣଙ୍କ ଲଗ ଇନ ସଫଳ ହେଲା',
                      'ଠିକ'
                    );
                  }

                  var url = 'https://satark.rimes.int/api_user/users_post';
                  var params = JSON.stringify({
                    token_id: this.user_token,
                    device: this.device_id,
                    extra_param: 'update_device_id',
                  });

                  console.log("params...", params);
                  this.httpClinet
                    .post(url, params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                      },
                      (err) => {
                        console.log('ERROR!: ', err);
                      }
                    );
                } else {
                  console.log('in', 'else');

                  // this.router.navigateByUrl('login/registration');
                  this.isAuthenticated.next(false);
                  this.setLoginState('false');
                  loadingEl.dismiss();

                  if (this.lang === 'en' || this.lang === null) {
                    this.showAlert(
                      'Login Fail!',
                      'Please check if you have entered the correct email/password'
                    );
                  } else {
                    this.showAlert(
                      'ଲଗ ଇନ ଅକୃତକାର୍ଯ୍ୟ ହେଲା',
                      'ଦୟାକରି ଆପଣ ଦେଇଥିବା ଇମେଲ/ ପାସୱାର୍ଡ ସଠିକ ନା ନୁହେଁ ପରଖି ନିଅନ୍ତୁ.',
                      'ଠିକ'
                    );
                  }
                }
              });
          })
          .catch((error) => {
            console.log('in', error);

            // this.router.navigateByUrl('login/registration');
            this.isAuthenticated.next(false);
            this.setLoginState('false');
            loadingEl.dismiss();

            if (this.lang == 'en' || this.lang === null) {
              this.showAlert(
                'Login Fail!',
                'Please check if you have entered the correct email/password'
              );
            } else {
              this.showAlert(
                'ଲଗ ଇନ ଅକୃତକାର୍ଯ୍ୟ ହେଲା',
                'ଦୟାକରି ଆପଣ ଦେଇଥିବା ଇମେଲ/ ପାସୱାର୍ଡ ସଠିକ ନା ନୁହେଁ ପରଖି ନିଅନ୍ତୁ.',
                'ଠିକ'
              );
            }
          });
      });
    // return;
  }

  getLoginState() {
    var value = '';
    Storage.get({ key: 'authenticated' }).then((res) => {
      value = JSON.stringify(res.value);
    });
    return value;
  }

  async setLoginState(state: string = 'false') {
    await Storage.set({
      key: 'authenticated',
      value: state,
    });
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    // Storage.clear();
    // localStorage.clear();
    this.cleanAuth();
    this.router.navigateByUrl('/login', { replaceUrl: true });
    return;
  }

  showAlert(header, message, button = 'Ok') {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: [button],
      })
      .then((alertEl) => alertEl.present());
  }

  private showAlertWithHandler(header, message, button = 'Ok') {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: [
          {
            text: button,
            handler: () => {
              console.log('Buy clicked');
            },
          },

          {
            text: button,
            handler: () => {
              console.log('Buy clicked');
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  showErrorToast(txt) {
    this.toastCtrl
      .create({
        message: txt,
        duration: 1500,
        position: 'bottom',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }
  showErrorToastTop(txt) {
    this.toastCtrl
      .create({
        message: txt,
        duration: 1500,
        position: 'top',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }

  mailFormat(email) {
    var EMAIL_REGEXP =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (email.length > 5 && EMAIL_REGEXP.test(email)) return true;
    else return false;
  }

  passwordFormat(password) {
    var PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (password.length > 12 && PASSWORD_REGEXP.test(password)) return true;
    else false;
  }

  routeToHome() {
    this.navController.navigateBack('/home/home-tab');
  }
}
