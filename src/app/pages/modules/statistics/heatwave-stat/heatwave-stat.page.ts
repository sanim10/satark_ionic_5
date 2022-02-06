import { AlertController } from '@ionic/angular';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import SwiperCore, { Navigation, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-heatwave-stat',
  templateUrl: './heatwave-stat.page.html',
  styleUrls: ['./heatwave-stat.page.scss'],
})
export class HeatwaveStatPage implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  graphData;
  activeTab: string;
  public user_data: any;
  backgroundColors: any = [];
  map: any;
  district_id: string;
  district_nam: string;
  period: any = [];
  deaths: any = [];
  total_deaths: any = [];
  district_name: any = [];
  public death_data: any;
  public total_death_data: any;
  public totalDeathDataForMap: any = [];
  public district_data: any;
  public district_data_by_id: any;
  lang;

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

  updateMap() {
    var fcst: any;
    fcst = this.totalDeathDataForMap;
    this.map.data.setStyle(function (feature) {
      let district_id = feature.getProperty('id');
      if (!fcst[district_id]) {
        console.log('not there');
        return { fillColor: 'white', fillOpacity: 0.6, strokeWeight: 0.0 };
      }
      let total_deaths = fcst[district_id].total_deaths;
      console.log(
        'district_id: ' + district_id + ' total_deaths: ' + total_deaths
      );
      if (total_deaths >= 1 && total_deaths <= 5)
        return { fillColor: 'gold', fillOpacity: 0.8, strokeWeight: 0.0 };
      else if (total_deaths > 5.1 && total_deaths <= 10.0)
        return { fillColor: 'yellow', fillOpacity: 0.5, strokeWeight: 0.0 };
      else if (total_deaths > 10.1 && total_deaths <= 15.0)
        return { fillColor: 'orange', fillOpacity: 0.6, strokeWeight: 0.0 };
      else if (total_deaths > 15.1 && total_deaths <= 20.0)
        return { fillColor: 'darkorange', fillOpacity: 0.6, strokeWeight: 0.0 };
      else if (total_deaths > 20.1 && total_deaths <= 25.0)
        return { fillColor: 'coral', fillOpacity: 0.6, strokeWeight: 0.0 };
      else return { fillColor: 'red', fillOpacity: 0.6, strokeWeight: 0.0 };
    });
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private alertCtrl: AlertController
  ) {
    this.lang = localStorage.getItem('language');
    this.activeTab = 'map';
  }

  ngAfterViewInit() {
    this.checklogin(localStorage.getItem('token'));
    // setTimeout(() => this.map.invalidateSize(), 0);
  }

  ngOnInit() {
    this.lang = localStorage.getItem('language');
    this.getDistrict();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
        this.district_id = this.user_data[0].district_id;
        this.district_nam = this.user_data[0].district_name;
        console.log('user_district_id', this.district_id);
        this.getDeathData(this.district_id);
        // this.getTotalDeathData(); //not used
        this.getTotalDeathDataForMap();
      });
  }

  getDistrict() {
    this.apiService.getDistrict().subscribe((data) => {
      (this.district_data = data),
        console.log('districts_data', this.district_data);
    });
  }

  getDeathData(dis_id: string) {
    let param = {
      id: dis_id,
    };
    this.apiService.getDeathByHeatwave(param).subscribe((data) => {
      this.death_data = data;
      console.log('death data', this.death_data);

      for (var i = 0; i < this.death_data.length; ++i) {
        var period = this.death_data[i].period;
        var deaths = this.death_data[i].deaths;
        this.period.push(period);
        this.deaths.push(deaths);
        // var death = +deaths;
        // switch (true) {
        //   case death == 0:
        //     this.backgroundColors.push('#fff');
        //     break;
        //   case death >= 1 && death <= 5:
        //     this.backgroundColors.push('#FBD702');
        //     break;
        //   case death >= 6 && death <= 10:
        //     this.backgroundColors.push('#FDFF01');
        //     break;
        //   case death >= 11 && death <= 15:
        //     this.backgroundColors.push('#FCA607');
        //     break;
        //   case death >= 16 && death <= 20:
        //     this.backgroundColors.push('#FC8B01');
        //     break;
        //   case death >= 21 && death <= 25:
        //     this.backgroundColors.push('#FD8050');
        //     break;
        //   case death >= 26:
        //     this.backgroundColors.push('#FF0503');
        //     break;
        // }
      }
      // console.log('periods', this.period);
      // console.log('deaths', this.deaths);
      var dataObj = {
        period: this.period,
        deaths: this.deaths,
        districtName: this.death_data[0].district_name,
        districtNameOry: this.death_data[0].district_name_ory,
      };

      this.graphData = dataObj;
    });
  }

  getTotalDeathData() {
    this.apiService.getTotalDeathByHeatwave().subscribe((data) => {
      this.total_death_data = data;
      console.log('total death data', this.total_death_data);
      for (var i = 0; i < 6; ++i) {
        var arr = this.total_death_data[i].dis_name;
        var arr1 = this.total_death_data[i].total_deaths;
        this.district_name.push(arr);
        this.total_deaths.push(arr1);
      }
      console.log('district_name', this.district_name);
      console.log('total deaths', this.total_deaths);
    });
  }

  getTotalDeathDataForMap() {
    this.apiService.getTotalDeathByHeatwaveForMap().subscribe((data) => {
      this.totalDeathDataForMap = data;
      console.log('total death data for map', this.totalDeathDataForMap);
    });
  }

  async showLocationDialog() {
    let locInputs = [];
    for (var loc of this.district_data) {
      locInputs.push({
        type: 'radio',
        label: this.lang == 'en' ? loc.district_name : loc.district_name_ory,
        value: loc.id,
      });
    }
    let locationDialog = this.alertCtrl.create({
      inputs: locInputs,
      buttons: [
        {
          text: this.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
          handler: (data) => {
            console.log('cancel clicked');
          },
        },
        {
          text: this.lang == 'en' ? 'Ok' : 'ଠିକ',
          handler: (data) => {
            console.log('id...', data);
            let param = {
              id: data,
            };
            console.log('params..', param),
              this.apiService.getDeathByHeatwave(param).subscribe((data) => {
                this.authService.showErrorToast('Fetching new location data');

                this.death_data = data;
                console.log('death data', this.death_data);
                this.period.length = 0;
                this.deaths.length = 0;
                for (var i = 0; i < this.death_data.length; ++i) {
                  var period = this.death_data[i].period;
                  var death = this.death_data[i].deaths;
                  this.period.push(period);
                  this.deaths.push(death);
                  var dataObj = {
                    period: this.period,
                    deaths: this.deaths,
                    districtName: this.death_data[0].district_name,
                    districtNameOry: this.death_data[0].district_name_ory,
                  };

                  this.graphData = dataObj;
                }
                console.log('periods new loc', this.period);
                console.log('deaths new loca', this.deaths);
              });

            this.apiService.getDistrictById(param).subscribe((data) => {
              this.district_data_by_id = data;
              console.log('dis data by id', this.district_data_by_id);
            });
          },
        },
      ],
    });
    (await locationDialog).present();
  }
}