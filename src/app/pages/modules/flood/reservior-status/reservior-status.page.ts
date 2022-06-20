import { LanguageHelperService } from './../../../../helper/language-helper/language-helper.service';
import { ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-reservior-status',
  templateUrl: './reservior-status.page.html',
  styleUrls: ['./reservior-status.page.scss'],
})
export class ReserviorStatusPage implements OnInit, AfterViewInit {
  public user_data: any;
  user_id: string;
  block_id: string;
  public resvr_data: any;
  resvr_id: string;
  public resvr_detail_data: any;
  public rsvr_storage_data: any;
  resvr_value: string;
  private _CANVAS: any;
  private _CONTEXT: any;
  a: any;
  storage_percentage: number;
  buttons;
  lang;
  loading = true;
  @ViewChild('resvr_name') resvr_name;
  lHelper;
  resvrname;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private LanguageHelperService: LanguageHelperService
  ) {
    this.lang = localStorage.getItem('language');
  }
  ngAfterViewInit(): void {
    this.display();
  }
  display() {
    this.loading = true;
    this.setDefault();
    this.checklogin(localStorage.getItem('token'));
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  ngOnInit() {}

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        // this.block_id = this.user_data[0].block_id;
        this.user_id = this.user_data[0].id;
        console.log('block', this.user_data[0].block_id);
        this.loading = false;
      });
    this.getAllReservoirs();
  }

  setDefault() {
    if (this.lang == 'en') {
      this.resvrname = 'HIRAKUD';
      // this.getResvId();
    } else {
      this.resvrname = 'ହୀରାକୁଦ';
      // this.getResvId();
    }
  }

  //get all reservoir names
  getAllReservoirs() {
    this.apiService.getAllReservoirNames().subscribe(
      (data) => {
        this.resvr_data = data;
        console.log('resvr_data', this.resvr_data);
        // this.getResvId();
        this.getDefault(this.resvrname);
      },
      (Error) => {
        this.authService.showErrorToast(
          'Network Error. Please reload the page.'
        );
      }
    );
  }

  //get reservoir id
  getResvId() {
    console.log('resvr name', this.resvr_name.value);
    var rsvr_name = this.resvr_name.value;
    for (var i = 0; i < this.resvr_data.length; ++i) {
      if (
        this.resvr_data[i].location_name == rsvr_name ||
        this.resvr_data[i].location_name_ory == rsvr_name
      ) {
        console.log('rsvr id', this.resvr_data[i].id);
        this.resvr_id = this.resvr_data[i].id;
      }
    }
    this.getResvrDetails(this.resvr_id);
    this.getResvrStorage(this.resvr_id);
  }

  //get reservoir storage perentage by id
  getResvrStorage(rs_id: string) {
    let param = {
      id: rs_id,
    };
    this.apiService.getReservoirStorageById(param).subscribe(
      (data) => {
        this.rsvr_storage_data = data;
        console.log('resovir storage data', this.rsvr_storage_data);
        if (this.rsvr_storage_data.length == 0) {
          this.rsvr_storage_data = null;
        } else {
          this.resvr_value = this.rsvr_storage_data[0].percentage + '%';
          this.storage_percentage = Math.floor(
            this.rsvr_storage_data[0].percentage
          );
        }
      },
      (Error) => {
        this.authService.showErrorToast(
          'Network Error. Please reload the page.'
        );
      }
    );
  }

  //get reservoir data by id
  getResvrDetails(rs_id: string) {
    let param = {
      id: rs_id,
    };
    this.apiService.getReservoirDataById(param).subscribe(
      (data) => {
        this.resvr_detail_data = data;
        console.log('resovir detail data', this.resvr_detail_data);
        if (this.resvr_detail_data.length == 0) {
          this.resvr_detail_data = null;
        }
      },
      (Error) => {
        this.authService.showErrorToast(
          'Network Error. Please reload the page.'
        );
      }
    );
  }
  splitLevel(str) {
    // var tmp = str.split('m');
    // return tmp[0];
  }

  splitDate(str, option) {
    // var tmp = str.split('on');
    // return tmp[1];
  }

  showResSelector = async () => {
    this.buttons = [
      {
        text: this.lang == 'en' ? 'CANCEL' : 'ବାତିଲ କରନ୍ତୁ',
        role: 'cancel',
      },
    ];

    this.resvr_data.forEach((element) => {
      var tmpButton = {
        text:
          this.lang == 'en' ? element.location_name : element.location_name_ory,
        handler: () => {
          this.resvrname =
            this.lang == 'en'
              ? element.location_name
              : element.location_name_ory;
        },
      };

      this.buttons.push(tmpButton);
    });

    (
      await this.actionSheetController.create({
        buttons: this.buttons,
        mode: 'ios',
      })
    ).present();
  };

  getLevelColor() {
    var color;
    if (this.rsvr_storage_data[0].percentage != null) {
      if (
        Math.floor(this.rsvr_storage_data[0].percentage) >= 10 &&
        Math.floor(this.rsvr_storage_data[0].percentage) < 20
      ) {
        color = '_10';
      }
      if (
        Math.floor(this.rsvr_storage_data[0].percentage) >= 20 &&
        Math.floor(this.rsvr_storage_data[0].percentage) < 75
      ) {
        color = '_20';
      } else if (
        Math.floor(this.rsvr_storage_data[0].percentage) >= 75 &&
        Math.floor(this.rsvr_storage_data[0].percentage) < 90
      ) {
        color = '_75';
      } else if (
        Math.floor(this.rsvr_storage_data[0].percentage) >= 90 &&
        Math.floor(this.rsvr_storage_data[0].percentage) <= 100
      ) {
        color = '_90';
      } else {
        color = '_20';
      }
    } else {
      alert('this');
    }

    return color;
  }

  getLevel = () => {
    var height;

    if (this.rsvr_storage_data[0].percentage != null) {
      height = +this.rsvr_storage_data[0].percentage;

      // console.log(Math.round(height.toFixed(2) / 10) * 10);
      return height >= 10 ? height : 10;
    } else {
      return 50;
    }
  };
  getDefault(res) {
    var rsvr_name = res;
    for (var i = 0; i < this.resvr_data.length; ++i) {
      if (
        this.resvr_data[i].location_name == rsvr_name ||
        this.resvr_data[i].location_name_ory == rsvr_name
      ) {
        console.log('rsvr id', this.resvr_data[i].id);
        this.resvr_id = this.resvr_data[i].id;
      }
    }
    this.getResvrDetails(this.resvr_id);
    this.getResvrStorage(this.resvr_id);
  }
}
