import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { take } from 'rxjs/operators';
import {
  ActionSheetController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from './../../../../guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../../providers/api.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Geolocation } from '@capacitor/geolocation';
import { ReportMapComponent } from '../report-map/report-map.component';

@Component({
  selector: 'app-flood-report',
  templateUrl: './flood-report.page.html',
  styleUrls: ['./flood-report.page.scss'],
})
export class FloodReportPage implements OnInit {
  lang;
  img: any;
  today: string;
  now_time: string;
  public user_data: any;
  address;
  permission = false;
  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('language');
    this.today = moment().format('YYYY-MM-DD');
    this.now_time = moment().format('HH:mm');
  }

  ngOnInit() {
    this.requestPermission();
    this.checklogin(localStorage.getItem('token'));
  }

  requestPermission() {
    Geolocation.checkPermissions().then((status) => {
      if (status.location == 'granted' && status.coarseLocation === 'granted')
        this.permission = true;
      else this.permission = false;
    });
    Geolocation.requestPermissions().then((permissionStatus) => {
      console.log(permissionStatus);
      if (
        permissionStatus.location == 'granted' &&
        permissionStatus.coarseLocation == 'granted'
      )
        this.permission = true;
      else this.permission = false;
    });
  }
  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
      });
  }

  async getPhoto() {
    var buttons = [
      {
        text: this.lang == 'en' ? 'Camera' : '????????????????????????',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: this.lang == 'en' ? 'Gallery' : '????????????????????????',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: this.lang == 'en' ? 'CANCEL' : '?????????????????? ?????????????????? ',
        role: 'cancel',
        handler: () => {},
      },
    ];

    (
      await this.actionSheetCtrl.create({ buttons: buttons, mode: 'ios' })
    ).present();
  }
  getCamera = (src) => {
    Camera.checkPermissions().then((status) => {
      if (status.camera == 'granted' && status.photos == 'granted') {
        switch (src) {
          case 1:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Camera,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
            });
            break;

          case 2:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Photos,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
            });
            break;
        }
      } else {
        this.authService.showErrorToast('Please enable camera access');
        Camera.requestPermissions().then((permissionStatus) => {
          console.log(permissionStatus);
          if (
            permissionStatus.camera == 'granted' &&
            permissionStatus.photos == 'granted'
          ) {
            this.getPhoto();
          }
        });
      }
    });
  };

  async presentMapModal() {
    if (this.permission) {
      const modal = await this.modalController.create({
        swipeToClose: true,
        component: ReportMapComponent,
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          this.address = dataReturned.data;
          console.log(this.address);
        }
      });
      return await modal.present();
    } else {
      this.requestPermission();
    }
  }

  Submit_form(loc, waterlevel, depth, date, time, msg) {
    var url = 'https://satark.rimes.int/api_user/fllood_report_post';
    var params = JSON.stringify({
      user: this.user_data[0].id,
      district: this.user_data[0].district_id,
      block: this.user_data[0].block_id,
      district_name: this.user_data[0].district_name,
      block_name: this.user_data[0].block_name,
      loc: loc,
      date: this.createDateObject(date),
      time: this.createTimeObject(time),
      waterlevel: waterlevel,
      depth: depth,
      msg: msg != null || msg != '' ? msg : '',
      pic: this.img != null ? this.img : '',
    });

    console.log('params', params);

    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('data', data);

          if (this.lang == 'en') {
            this.authService.showAlert(
              'Report Submitted',
              'You report has been sucessfully submitted. Thank you.'
            );
          } else {
            this.authService.showAlert(
              '????????????????????? ???????????? ???????????? ',
              '????????????????????? ????????????????????? ?????????????????? ???????????? ??????????????????????????? ??????????????? | ????????????????????????',
              '????????????'
            );
          }
          this.navCtrl.navigateBack('home', { replaceUrl: true });
        },
        (err) => {
          console.log('ERROR!: ', err);
          if (this.lang == 'od') {
            this.authService.showAlert(
              '???????????? ???????????? !',
              '????????????????????? ????????????????????? ???????????? ???????????????????????? | ?????????????????? ????????? ?????????????????? ?????????????????? |',
              '????????????'
            );
          } else {
            this.authService.showAlert(
              this.translate.instant('Submission Fail!'),
              'You report has not been submitted. Please try later.'
            );
          }
          this.navCtrl.navigateBack('home', { replaceUrl: true });
        }
      );
  }

  createDateObject(stringDate) {
    var temp = stringDate.split('-');
    const date = {
      year: +temp[0],
      month: +temp[1],
      day: +temp[2],
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };
    return date;
  }

  createTimeObject(stringTime) {
    var temp = stringTime.split(':');
    const time = {
      year: null,
      month: null,
      day: null,
      hour: +temp[0],
      minute: +temp[1],
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    return time;
  }
}
