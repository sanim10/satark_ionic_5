import { take } from 'rxjs/operators';
import { ReportMapComponent } from './../../report/report-map/report-map.component';
import { TranslateService } from '@ngx-translate/core';
import {
  NavController,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from './../../../../guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-report-condition',
  templateUrl: './report-condition.page.html',
  styleUrls: ['./report-condition.page.scss'],
})
export class ReportConditionPage implements OnInit {
  lang;
  img: any;
  today: string;
  now_time: string;
  public user_data: any;
  address;
  lat;
  lng;
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
      else {
        this.permission = false;
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
    });
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
        console.log('full name', this.user_data[0].full_name);
      });
  }

  async presentMapModal() {
    this.requestPermission();

    if (this.permission) {
      const modal = await this.modalController.create({
        swipeToClose: true,
        component: ReportMapComponent,
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          this.address = dataReturned.data.current_loc;
          this.lat = dataReturned.data.coords.latitude;
          this.lng = dataReturned.data.coords.longitude;
          console.log(this.address);
        }
      });
      return await modal.present();
    }
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

  Submit_form(loc, date, time, issue, msg) {
    var url =
      'https://satark.rimes.int/api_road_accident/road_cond_report_post';

    var params = JSON.stringify({
      user: this.user_data[0].id,
      district: this.user_data[0].district_id,
      block: this.user_data[0].block_id,
      loc: loc,
      date: this.createDateObject(date),
      time: this.createTimeObject(time),
      lati: this.lat,
      lng: this.lng,
      msg: msg != null || msg != '' ? msg : '',
      issue: issue,
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
          this.navCtrl.navigateBack('road-accident');
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
          this.navCtrl.navigateBack('road-accident');
        }
      );
  }

  createDateObject(stringDate) {
    var temp = stringDate.split('-');
    const date = {
      day: +temp[2],
      month: +temp[1],
      year: +temp[0],
    };
    return date;
  }

  createTimeObject(stringTime) {
    var temp = stringTime.split(':');
    const time = {
      hour: +temp[0],
      minute: +temp[1],
    };

    return time;
  }
}
