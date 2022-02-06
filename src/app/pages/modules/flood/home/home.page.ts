import { LanguageHelperService } from './../../../../helper/language-helper/language-helper.service';
import { ActionSheetController } from '@ionic/angular';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Auth } from 'firebase/auth';
import { async } from '@firebase/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('river_name') river_name;
  @ViewChild('station_name') station_name;
  public user_data: any;
  user_id: string;
  block_id: string;
  river_id: string;
  station_id: string;
  public river_data: any;
  public station_data: any;
  rivername: any;
  stationname: any;
  public stn_waterlvl_data: any;
  lang: string;
  loading = true;
  buttons = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private actionSheetController: ActionSheetController
  ) {
    this.lang = localStorage.getItem('language');
    this.setDefaultRivers();
  }

  ngOnInit() {
    this.display();
  }

  ngAfterViewInit() {}
  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  display() {
    this.loading = true;
    this.getRiverIdForDefault();
    this.checklogin(localStorage.getItem('token'));
    this.getAllRiver();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
        this.block_id = this.user_data[0].block_id;
        this.user_id = this.user_data[0].id;
        console.log('block', this.user_data[0].block_id);
      });
  }

  setDefaultRivers() {
    if (this.lang == 'en') {
      this.stationname = 'KHAIRMAL';
      this.rivername = 'MAHANADI River';
    } else {
      this.rivername = 'ମହାନଦୀ';
      this.stationname = 'ଖଇରମାଳ';
    }
  }

  //get all river names
  getAllRiver() {
    this.apiService.getAllRivers().subscribe(
      (data) => {
        this.river_data = data;
        console.log('river names', this.river_data);
        this.loading = false;
      },
      (Error) => {
        this.authService.showErrorToast(
          'Network Error. Please reload the page.'
        );
      }
    );
  }

  //get river id and display station name
  getRiverId() {
    var riv_name = this.river_name.value;
    for (var i = 0; i < this.river_data.length; ++i) {
      if (
        this.river_data[i].river_name == riv_name ||
        this.river_data[i].river_name_ory == riv_name
      ) {
        console.log('river id', this.river_data[i].id);
        this.river_id = this.river_data[i].id;
      }
    }
    let param = {
      id: this.river_id,
    };
    this.apiService.getStationByRiver(param).subscribe((data) => {
      (this.station_data = data),
        console.log('station_data', this.station_data);
    });
    // this.stationname = null;
  }

  getStationId() {
    if (this.station_name.value) {
      var stat_name = this.station_name.value;
      for (var i = 0; i < this.station_data.length; ++i) {
        if (
          this.station_data[i].location_name == stat_name ||
          this.station_data[i].location_name_ory == stat_name
        ) {
          console.log('station id', this.station_data[i].id);
          this.station_id = this.station_data[i].id;
        }
      }
      this.getWaterlvlByStation(this.station_id);
    }
  }

  ////get stations for mahanadi river by default on page load
  getRiverIdForDefault() {
    var riv_name = this.rivername;
    let param = {
      id: 1,
    };
    this.apiService.getStationByRiver(param).subscribe((data) => {
      (this.station_data = data),
        console.log('station_data', this.station_data);
    });
    // this.stationname =  null;
    this.getWaterlvlForDefault();
  }

  //get water level data for default station
  getWaterlvlForDefault() {
    let param = {
      id: '80',
    };
    console.log('default param', param);
    this.apiService.getWaterlevelByStationId(param).subscribe((data) => {
      this.stn_waterlvl_data = data;
      console.log('water level data', this.stn_waterlvl_data);
      if (this.stn_waterlvl_data.length == 0) {
        this.stn_waterlvl_data = null;
      }
    });
  }

  //get water level data of the station
  getWaterlvlByStation(stn_id: string) {
    let param = {
      id: stn_id,
    };
    this.apiService.getWaterlevelByStationId(param).subscribe((data) => {
      this.stn_waterlvl_data = data;
      console.log('water level data', this.stn_waterlvl_data);
      if (this.stn_waterlvl_data.length == 0) {
        this.stn_waterlvl_data = null;
      }
    });
  }

  splitLevel(str) {
    var tmp = str.split('m');
    return tmp[0];
  }

  splitDate(str, option) {
    var tmp = str.split('on');
    return tmp[1];
  }

  async showRiverSelector() {
    this.buttons = [
      {
        text: this.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
        role: 'cancel',
      },
    ];

    this.river_data.forEach((element) => {
      var tmpButton = {
        text: this.lang == 'en' ? element.river_name : element.river_name_ory,
        handler: () => {
          this.rivername =
            this.lang == 'en' ? element.river_name : element.river_name_ory;
          this.stationname = null;
        },
      };
      this.buttons.push(tmpButton);
    });

    (
      await this.actionSheetController.create({ buttons: this.buttons })
    ).present();
  }

  showStationSelector = async () => {
    this.buttons = [
      {
        text: this.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
        role: 'cancel',
      },
    ];

    this.station_data.forEach((element) => {
      var tmpButton = {
        text:
          this.lang == 'en' ? element.location_name : element.location_name_ory,
        handler: () => {
          this.stationname =
            this.lang == 'en'
              ? element.location_name
              : element.location_name_ory;
        },
      };

      this.buttons.push(tmpButton);
    });

    (
      await this.actionSheetController.create({ buttons: this.buttons })
    ).present();
  };

  getLevelColor = () => {
    var color;

    if (
      this.stn_waterlvl_data[0].value != null &&
      this.stn_waterlvl_data[0].danger_lvl != null
    ) {
      if (
        +this.stn_waterlvl_data[0].value >=
        +this.stn_waterlvl_data[0].danger_lvl
      ) {
        color = 'danger';
      } else if (
        +this.stn_waterlvl_data[0].value >=
        +this.stn_waterlvl_data[0].warning_lvl
      ) {
        color = 'warning';
      } else {
        color = 'normal';
      }
    } else {
      color = 'normal';
    }

    return color;
  };

  getLevel = () => {
    var height;

    if (
      this.stn_waterlvl_data[0].value != null &&
      this.stn_waterlvl_data[0].danger_lvl != null
    ) {
      height =
        (+this.stn_waterlvl_data[0].value * 100) /
        +this.stn_waterlvl_data[0].danger_lvl;

      return Math.round(height.toFixed(2) / 10) * 10 - 20 >= 10
        ? Math.round(height.toFixed(2) / 10) * 10 - 20
        : 10;
    } else {
      return 50;
    }
  };
}
