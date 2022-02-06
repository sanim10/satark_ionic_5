import { AlertController } from '@ionic/angular';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-lightning-stat',
  templateUrl: './lightning-stat.page.html',
  styleUrls: ['./lightning-stat.page.scss'],
})
export class LightningStatPage implements OnInit, AfterViewInit {
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
    this.apiService.getDeathByLightning(param).subscribe((data) => {
      this.death_data = data;
      console.log('death data', this.death_data);
      for (var i = 0; i < this.death_data.length; ++i) {
        var period = this.death_data[i].period;
        var deaths = this.death_data[i].deaths;
        this.period.push(period);
        this.deaths.push(deaths);
      }

      // this.ionViewDidLoad();
      // this.loadGraph();
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
    this.apiService.getTotalDeathByLightning().subscribe((data) => {
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
      // this.updateMap();
      // this.ionViewDidLoad();
      // this.loadGraph();
    });
  }

  getTotalDeathDataForMap() {
    this.apiService.getTotalDeathByLightningForMap().subscribe((data) => {
      this.totalDeathDataForMap = data;
      console.log('total death data for map', this.totalDeathDataForMap);
      // this.updateMap();
      // this.loading.dismiss();
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
              this.apiService.getDeathByLightning(param).subscribe((data) => {
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
