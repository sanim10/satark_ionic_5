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
  selector: 'app-lightning-report',
  templateUrl: './lightning-report.page.html',
  styleUrls: ['./lightning-report.page.scss'],
})
export class LightningReportPage implements OnInit {
  lang;
  img: any;
  today: string;
  now_time: string;
  public user_data: any;
  address;
  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController
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
    Geolocation.requestPermissions().then((permissionStatus) => {
      console.log(permissionStatus);
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

  async getPhoto() {
    var buttons = [
      {
        text: 'Camera',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: 'Photos',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {},
      },
    ];

    (await this.actionSheetCtrl.create({ buttons: buttons })).present();
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
  }

  Submit_form(loc, strike, date, time, msg) {
    var url = 'https://satark.rimes.int/api_lightning/false_report_post';
    var params = JSON.stringify({
      user: this.user_data[0].id,
      district: this.user_data[0].district_id,
      block: this.user_data[0].block_id,
      district_name: this.user_data[0].district_name,
      block_name: this.user_data[0].block_name,
      loc: loc,
      strike: strike,
      date: this.createDateObject(date),
      time: this.createTimeObject(time),
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
              'ରିପୋର୍ଟ ଦାଖଲ ହେଲା ',
              'ଆପଣଙ୍କର ରିପୋର୍ଟ ସଫଳତାର ସହିତ ଉପସ୍ଥାପିତ ହୋଇଛି | ଧନ୍ୟବାଦ।',
              'ଠିକ୍'
            );
          }
          this.navCtrl.navigateBack('home', { replaceUrl: true });
        },
        (err) => {
          console.log('ERROR!: ', err);
          if (this.lang == 'en') {
            this.authService.showAlert(
              'ଦାଖଲ ବିଫଳ !',
              'ଆପଣଙ୍କର ରିପୋର୍ଟ ଦାଖଲ ହୋଇନାହିଁ | ଦୟାକରି ପରେ ଚେଷ୍ଟା କରନ୍ତୁ |',
              'ଠିକ୍'
            );
          } else {
            this.authService.showAlert(
              'Submission Fail!',
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
