import { Market } from '@ionic-native/market/ngx';
import { Network } from '@capacitor/network';
import { take } from 'rxjs/operators';
import { ApiService } from './../../../providers/api.service';
import { AuthService } from './../../../guard/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { HomeTabService } from './home-tab.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import * as moment from 'moment';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.page.html',
  styleUrls: ['./home-tab.page.scss'],
})
export class HomeTabPage implements OnInit, OnDestroy {
  backdropVisible = false;
  modules;
  modules_od;
  connected = false;
  lHelper;
  public value_addtion_forecast_data: any;
  public user_data: any;
  block_id;
  user_id;
  current_location_block;
  current_location_block_ory;
  current_location_district;
  current_location_district_ory;
  forecast_data;
  imd_alert_data;
  registered_loc_data;
  date;
  routeState;
  flash_msg_data: any;
  current_version_android: any = '25.0';
  current_version_ios: any = '29.0';

  current_version_from_db_android: any;
  current_version_from_db_ios: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private router: Router,
    private homeTabService: HomeTabService,
    private langHelper: LanguageHelperService,
    private translateService: TranslateService,
    private authService: AuthService,
    private apiService: ApiService,
    private market: Market,
    private platform: Platform,
    private alertCtrl: AlertController,
    private iab: InAppBrowser
  ) {
    this.checklogin(localStorage.getItem('token'));
    this.lHelper = langHelper;
    translateService.setDefaultLang(translateService.getBrowserLang());
    var day = new Date();
    var dayWrapper = moment(day);
    this.date = dayWrapper.format('H:mm D-MMM-YY');
  }
  ngOnDestroy() {
    Network.removeAllListeners();
  }

  toggleBackdrop(isVisible) {
    this.backdropVisible = isVisible;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.apiService
      .get_check_app_version()
      .pipe(take(1))
      .subscribe(async (data) => {
        console.log('versions...', data);
        if (this.platform.is('android')) {
          this.current_version_from_db_android = data[0].current_version;
          console.log(
            'android version....',
            this.current_version_from_db_android
          );
          if (
            this.current_version_android < this.current_version_from_db_android
          ) {
            let alert = this.alertCtrl.create({
              header: 'Update Available',

              message:
                'New version of the app is available, to make use of the latest features please update now',
              buttons: [
                {
                  text: 'Update',
                  handler: () => {
                    console.log('update clicked');
                    this.market.open('satark.app.io.ionic');
                  },
                },
                {
                  text: 'Cancel',
                  handler: () => {},
                },
              ],
            });
            (await alert).present();
          }
        } else if (this.platform.is('ios')) {
          this.current_version_from_db_ios = data[1].current_version;
          console.log('ios version....', this.current_version_from_db_ios);
          if (this.current_version_ios < this.current_version_from_db_ios) {
            let alert = this.alertCtrl.create({
              header: 'Update Available',

              message:
                'New version of the app is available, to make use of the latest features please update now',
              buttons: [
                {
                  text: 'Update',
                  handler: () => {
                    console.log('update clicked');
                    this.market.open('1470204757');
                  },
                },
                {
                  text: 'Cancel',
                  handler: () => {},
                },
              ],
            });
            (await alert).present();
          }
        }
      });

    Network.getStatus().then((status) => {
      status.connected ? (this.connected = true) : (this.connected = false);
    });

    Network.addListener('networkStatusChange', async (status) => {
      console.log('Network status changed', status);
      if (status.connected) {
        this.checklogin(localStorage.getItem('token'));
        this.connected = true;
      } else {
        this.connected = true;
      }
    });
    this.modules = this.homeTabService.modules;
    this.modules_od = this.homeTabService.modules_od;
    // this.rain_status_value_addition = localStorage.getItem('rain_status');
  }

  popAlert() {
    if (this.lHelper.lang == 'en') {
      this.alertController
        .create({
          header: 'Thank you for your interest',
          message: 'The page will be available soon',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    } else {
      this.alertController
        .create({
          header: 'ଆପଣଙ୍କ ଆଗ୍ରହ ପାଇଁ ଧନ୍ୟବାଦ',
          message: 'ଏହି ପୃଷ୍ଠା ଖୁବଶୀଘ୍ର ଉପଲବ୍ଧ ହେବ',
          buttons: [
            {
              text: 'ଠିକ',
              role: 'cancel',
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

  routeTo(url) {
    if (this.connected == true) {
      switch (url) {
        case 'ପାଣିପାଗ':
          url = 'weather';
          break;

        case 'ବଜ୍ରପାତ':
          url = 'lightning';
          break;

        case 'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ':
          url = 'heatwave';
          break;

        case 'କୃଷି':
          url = 'agriculture';
          break;

        case 'ବନ୍ୟା':
          url = 'flood';
          break;

        case 'ସମୁଦ୍ର':
          url = 'ocean';
          break;

        // case 'ସଡକ ସୁରକ୍ଷା':
        case 'ସଡକ ଦୁର୍ଘଟଣା':
          url = 'road-accident';
          break;

        case 'ସର୍ପାଘାତ':
          url = 'snake-bite';
          break;

        case 'ବିବରଣୀ':
          url = 'report';
          break;

        case 'ପରିସଂଖ୍ୟାନ':
          url = 'statistics';
          break;

        case 'road accident':
          url = 'road-accident';
          break;
        case 'snakebite':
          url = 'snake-bite';
          break;
      }
      this.router.navigateByUrl(url).catch((err) => {
        console.log(err);
        this.popAlert();
      });
    } else {
      this.authService.showErrorToast('No internet connection');
    }
  }

  changeLang() {
    this.langHelper.changeLanguage();
    console.log(this.translateService.getDefaultLang());
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.user_data = data['result'];
          this.block_id = this.user_data[0].block_id;
          this.user_id = this.user_data[0].id;
          this.current_location_block = this.user_data[0].block_name;
          this.current_location_block_ory = this.user_data[0].block_name_ory;
          this.current_location_district = this.user_data[0].district_name;
          this.current_location_district_ory =
            this.user_data[0].district_name_ory;

          localStorage.setItem('block_id', this.user_data[0].block_id);
          localStorage.setItem('district_id', this.user_data[0].district_id);
          localStorage.setItem('block_name', this.user_data[0].block_name);
          localStorage.setItem('id', this.user_data[0].id);
          localStorage.setItem(
            'block_name_ory',
            this.user_data[0].block_name_ory
          );
          localStorage.setItem(
            'district_name',
            this.user_data[0].district_name
          );
          localStorage.setItem(
            'district_name_ory',
            this.user_data[0].district_name_ory
          );
          localStorage.setItem(
            'notification_lang',
            this.user_data[0].notification_lng
          );
          this.getFlashMsg();
          this.getImdRainfallValueAdditionForBlock(this.block_id);
          // this.getHeatwaveForEachBlock();
          this.getLightningAdvRegisteredLocData(this.block_id);
        },
        (Error) => {
          console.log(Error);
        }
      );
  }

  getFlashMsg() {
    this.apiService.getFlashAlertMsg().subscribe((data) => {
      this.flash_msg_data = data;
      if (this.flash_msg_data.length != 0) {
        console.log('flash msg data..', data);
      } else {
        this.flash_msg_data = null;
      }
    });
  }

  //get 5days IMD value addition
  getImdRainfallValueAdditionForBlock(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      .getUpdatedValueAdditionDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.value_addtion_forecast_data = data;
          if (this.value_addtion_forecast_data.length == 0) {
            this.value_addtion_forecast_data = null;
          } else {
          }

          this.imd_alert_data = data;
          if (this.imd_alert_data.length != 0) {
            console.log(this.imd_alert_data);
          } else {
            this.imd_alert_data = null;
          }
        },
        (Error) => {
          console.log(Error);
        }
      );
  }

  convertDate(date): string {
    var newData = date.split('-');

    switch (newData[1]) {
      case '01':
        return newData[2] + ' Jan';

      case '02':
        return newData[2] + ' Feb';

      case '03':
        return newData[2] + ' Mar ';

      case '04':
        return newData[2] + ' Apr ';

      case '05':
        return newData[2] + ' May ';

      case '06':
        return newData[2] + ' Jun';

      case '07':
        return newData[2] + ' Jul ';

      case '08':
        return newData[2] + ' Aug ';

      case '09':
        return newData[2] + ' Sep ';

      case '10':
        return newData[2] + ' Oct ';

      case '11':
        return newData[2] + ' Nov ';

      case '12':
        return newData[2] + ' Dec ';
    }
  }

  get10DaysImdForecast(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      .get10DaysImdDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.forecast_data = data;
          if (this.forecast_data.length == 0) {
            this.forecast_data = null;
          } else {
          }
        },
        (Error) => {
          console.log(Error);
        }
      );
  }

  getHeatwaveForEachBlock() {
    let param = {
      block_id: this.block_id,
    };
    this.apiService
      // .getImdHeatwaveAlertsDissemintationForEachBlock(param)
      .getUpdatedValueAdditionDataForWeather(param)
      .subscribe(
        (data) => {
          this.imd_alert_data = data;
          if (this.imd_alert_data.length != 0) {
            console.log(this.imd_alert_data);
          } else {
            this.imd_alert_data = null;
          }
        },
        (Error) => {}
      );
  }

  /////get lightning data for user registered location
  getLightningAdvRegisteredLocData(blk_id: string) {
    let param = {
      id: blk_id,
    };
    this.apiService.getRegisteredLocLightningData(param).subscribe(
      (data) => {
        this.registered_loc_data = data['advisory'];
        if (this.registered_loc_data.length != 0) {
          console.log('registered_loc_data', this.registered_loc_data);
        } else {
          // this.registered_loc_data = null;
          this.registered_loc_data.l_type = null;
          console.log('no registered_loc_data', this.registered_loc_data);
        }
      },
      (Error) => {}
    );
  }

  refresh() {
    this.imd_alert_data = null;
    this.value_addtion_forecast_data = null;
    this.registered_loc_data.l_type = null;
    this.flash_msg_data = null;
    this.current_location_block = null;
    this.current_location_block_ory = null;
    this.current_location_district = null;
    this.current_location_district_ory = null;

    this.checklogin(localStorage.getItem('token'));
  }

  openHyperlink() {
    if (this.platform.is('android')) {
      if (this.lHelper.lang == 'en') {
        const browser = this.iab.create(
          this.flash_msg_data[0].alert_link_en,
          '_system',
          'location=yes,enableViewportScale=yes,hidden=no'
        );
      } else {
        const browser = this.iab.create(
          this.flash_msg_data[0].alert_link_or,
          '_system',
          'location=yes,enableViewportScale=yes,hidden=no'
        );
      }
    } else if (this.platform.is('ios')) {
      if (this.lHelper.lang == 'en') {
        const browser = this.iab.create(
          this.flash_msg_data[0].alert_link_en,
          '_self',
          'location=no'
        );
        browser.show();
      } else {
        const browser = this.iab.create(
          this.flash_msg_data[0].alert_link_or,
          '_self',
          'location=no'
        );
        browser.show();
      }
    }
  }
}
