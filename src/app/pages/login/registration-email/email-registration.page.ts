import { ApiService } from './../../../providers/api.service';
import { AuthService } from '../../../guard/auth.service';
import { Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { SwiperComponent } from 'swiper/angular';
import { Component, ViewChild, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation } from 'swiper';
import {
  IonBackButtonDelegate,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-email-registration',
  templateUrl: './email-registration.page.html',
  styleUrls: ['./email-registration.page.scss'],
})
export class EmailRegistrationPage implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButton: IonBackButtonDelegate;
  backPriorityBtn;

  mail;
  password;
  activeSlide = 0;
  constructor(
    private languageHelper: LanguageHelperService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private apiService: ApiService,
    private platform: Platform
  ) {}

  ngOnInit() {}

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    allowTouchMove: false,
  };

  slideNext() {
    this.swiper.swiperRef.slideNext(300);
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev(300);
  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    this.activeSlide = this.swiper.swiperRef.activeIndex;
  }

  moveToPassword(email) {
    if (!this.authService.mailFormat(email)) {
      this.authService.showErrorToast('Enter a valid email id');
      return;
    } else {
      this.mail = email;
      this.slideNext();
    }
  }

  signUp(password) {
    var email = this.mail;
    console.log(email);

    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();
        createUserWithEmailAndPassword(getAuth(), email, password)
          .then((data) => {
            console.log(data);
            localStorage.setItem('token', data.user.uid);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('new_user', 'yes_email');
            this.authService.isAuthenticated.next(true);
            this.authService.setLoginState('true');
            this.navCtrl.navigateForward('setup-profile-email', {
              replaceUrl: true,
            });
            loadingEl.dismiss();
          })
          .catch((error) => {
            console.log('got error', error);
            this.authService.showAlert(
              'Registration Fail!',
              'Email already in use!!'
            );
            loadingEl.dismiss();
            this.authService.isAuthenticated.next(false);
            this.authService.setLoginState('false');
          });
      });
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
    this.backPriorityBtn = this.platform.backButton.subscribeWithPriority(
      2,
      () => {
        if (this.activeSlide != 0) {
          this.slidePrev();
        } else {
          this.navCtrl.navigateBack('login'), { replaceUrl: true };
        }
      }
    );
  }

  ionViewWillLeave() {
    this.backPriorityBtn.unsubscribe();
  }
}
