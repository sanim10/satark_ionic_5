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
  selector: 'app-report-snakebite',
  templateUrl: './report-snakebite.page.html',
  styleUrls: ['./report-snakebite.page.scss'],
})
export class ReportSnakebitePage implements OnInit {
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
        text: this.lang == 'en' ? 'Camera' : 'କ୍ୟାମେରା',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: this.lang == 'en' ? 'Gallery' : 'ଗ୍ୟାଲେରୀ',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: this.lang == 'en' ? 'CANCEL' : 'ବାତିଲ୍ କରନ୍ତୁ ',
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

  Submit_form(
    loc,
    loc_type,
    date,
    time,
    msg,
    name,
    age,
    gender,
    firstaid,
    condition
  ) {
    var url = 'https://satark.rimes.int/api_snakebite/snakebite_report_post';

    var params = JSON.stringify({
      user: this.user_data[0].id,
      loc: loc,
      type_loc: loc_type,
      msg: msg,
      date: this.createDateObject(date),
      time: this.createTimeObject(time),
      victim_name: name,
      victim_age: age,
      victim_gender: gender,
      victim_con: condition,
      first_aid: firstaid,
      lati: this.lat,
      lng: this.lng,
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
          this.navCtrl.navigateBack('road-accident');
        },
        (err) => {
          console.log('ERROR!: ', err);
          if (this.lang == 'od') {
            this.authService.showAlert(
              'ଦାଖଲ ବିଫଳ !',
              'ଆପଣଙ୍କର ରିପୋର୍ଟ ଦାଖଲ ହୋଇନାହିଁ | ଦୟାକରି ପରେ ଚେଷ୍ଟା କରନ୍ତୁ |',
              'ଠିକ୍'
            );
          } else {
            this.authService.showAlert(
              this.translate.instant('Submission Fail!'),
              'You report has not been submitted. Please try later.'
            );
          }
          this.navCtrl.navigateBack('snake-bite');
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
