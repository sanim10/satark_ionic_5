import { take } from 'rxjs/operators';
import { AuthService } from './../../../guard/auth.service';
import { ApiService } from './../../../providers/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
import { Component, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation } from 'swiper';
import {
  IonBackButtonDelegate,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButton: IonBackButtonDelegate;
  @ViewChild('otp1Ctrl') otp1;
  @ViewChild('otp2Ctrl') otp2;
  @ViewChild('otp3Ctrl') otp3;
  @ViewChild('otp4Ctrl') otp4;
  @ViewChild('otp5Ctrl') otp5;
  @ViewChild('otp6Ctrl') otp6;

  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private httpClinet: HttpClient,
    private apiService: ApiService
  ) {}
  lang;
  device_id;
  phone;
  public success: Array<any>;

  activeSlide = 0;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    allowTouchMove: false,
  };

  slideNext() {
    this.swiper.swiperRef.slideNext();
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    this.activeSlide = this.swiper.swiperRef.activeIndex;
  }

  verifyNumber(phone) {
    var res = this.requestOtp(phone);
    console.log('result ' + JSON.stringify(res));
  }

  done() {
    this.authService.login();
    this.router.navigateByUrl('home'), { replaceUrl: true };
  }

  ionViewDidEnter() {
    this.setUIBackButtonAction();
  }

  setUIBackButtonAction() {
    this.backButton.onClick = (ev) => {
      if (this.activeSlide != 0) {
        this.slidePrev();
      } else {
        this.navCtrl.navigateBack('login'), { replaceUrl: true };
      }
    };
  }

  shiftFocus(focus) {
    switch (focus) {
      case 1:
        this.otp1.value == null || this.otp1.value == ''
          ? this.otp1.setFocus()
          : this.otp2.setFocus();
        break;

      case 2:
        this.otp2.value == null || this.otp2.value == ''
          ? this.otp1.setFocus()
          : this.otp3.setFocus();
        break;

      case 3:
        this.otp3.value == null || this.otp3.value == ''
          ? this.otp2.setFocus()
          : this.otp4.setFocus();
        break;

      case 4:
        this.otp4.value == null || this.otp4.value == ''
          ? this.otp3.setFocus()
          : this.otp5.setFocus();
        break;

      case 5:
        this.otp5.value == null || this.otp5.value == ''
          ? this.otp4.setFocus()
          : this.otp6.setFocus();
        break;

      case 6:
        this.otp6.value == null || this.otp6.value == ''
          ? this.otp5.setFocus()
          : this.otp6.setFocus();
        break;
    }
  }

  //generate OTP for new registration
  requestOtp(phone) {
    this.lang = localStorage.getItem('language');
    this.device_id = localStorage.getItem('deviceid');
    this.phone = phone;
    let fullMobileNumber = '91' + phone;

    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();
        var url = 'https://satark.rimes.int/api_user/users_ios_post';
        var params = JSON.stringify({
          phone: fullMobileNumber,
          device: this.device_id,
          lng: this.lang,
          extra_param: 'sendotp',
        });
        this.httpClinet
          .post(url, params, { responseType: 'text' })
          .pipe(take(1))
          .subscribe(
            (data) => {
              this.slideNext();
              console.log(data);
              loadingEl.dismiss();
            },
            (err) => {
              loadingEl.dismiss();
              console.log('ERROR!: ', err);
              this.authService.showErrorToast(
                'Error getting OTP. Please try again'
              );
            }
          );
      });
  }

  ///verify the OTP recceived through SMS
  verifyOtp() {
    const fullMobileNumber = '91' + this.phone;
    var param = {
      otp:
        this.otp1.value +
        this.otp2.value +
        this.otp3.value +
        this.otp4.value +
        this.otp5.value +
        this.otp6.value,
      phone: fullMobileNumber,
    };
    console.log(param.otp);
    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();
        this.apiService
          .verifyOtp(param)
          .pipe(take(1))
          .subscribe(
            (response) => {
              this.success = response['success'];
              if (this.success) {
                let new_mobile_number = fullMobileNumber + '@rimes.int';
                console.log('changed phone to email', new_mobile_number);
                createUserWithEmailAndPassword(
                  getAuth(),
                  new_mobile_number,
                  'rimes@123'
                )
                  .then((data) => {
                    console.log(data);
                    localStorage.setItem('token', data.user.uid);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('new_user', 'yes_ph');
                    this.authService.isAuthenticated.next(true);
                    this.authService.setLoginState('true');
                    this.navCtrl.navigateForward('setup-profile-phone', {
                      replaceUrl: true,
                    });
                    loadingEl.dismiss();
                  })
                  .catch((error) => {
                    console.log('got error', error);
                    this.authService.showAlert(
                      'Login Failed!',
                      'Please check phone number or the number is already registered '
                    );
                    loadingEl.dismiss();
                    this.authService.isAuthenticated.next(false);
                    this.authService.setLoginState('false');
                  });
              } else {
                loadingEl.dismiss();
                this.authService.showErrorToast(
                  'Incorrect OTP. Please try again'
                );
              }
            },
            (err) => {
              console.log(err);
              loadingEl.dismiss();
              this.authService.showErrorToast(
                'Error verifying OTP. Please try again'
              );
            }
          );
      });
  }
}
