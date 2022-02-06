import { ModalController, Platform } from '@ionic/angular';
import { ApiService } from './../../../../providers/api.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import * as HighCharts from 'highcharts';
@Component({
  selector: 'app-ocean-overview-details',
  templateUrl: './ocean-overview-details.component.html',
  styleUrls: ['./ocean-overview-details.component.scss'],
})
export class OceanOverviewDetailsComponent implements OnInit, AfterViewInit {
  station_id: any;
  lang;
  default_date = null;
  chartOptions: any;
  date;
  public ocean_station_data: any;
  public wave_data: any;
  public wind_data: any;
  public swell_data: any;
  public overview_data: any;
  station_name: string;
  district_name_ory: string;
  district_name: string;
  block_name: string;
  block_name_ory: string;
  wind_value = [];
  wave_value = [];
  f_date_time: any = [];
  swell_value = [];
  loading = true;
  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private platform: Platform
  ) {
    this.lang = localStorage.getItem('language');
    let today = moment().format('YYYY-MM-DD');
    this.date = today;
    this.default_date = moment(this.date).format('YYYYMMDD');
    this.back();
  }

  ngOnInit() {
    console.log(this.station_id);
    this.getOverviewData(this.station_id, this.default_date);
  }

  ngAfterViewInit(): void {}

  ////get overview data
  getOverviewData(station: any, newdate: any) {
    let param = {
      id: station,
      date: newdate,
    };
    // let swell = this.api.get_swell_data_by_stations(param);
    // let wave = this.api.get_wave_data_by_stations(param);
    // let wind =  this.api.get_wind_data_by_stations(param);
    let swell = this.apiService.getSwellDataOverview(param);
    let wave = this.apiService.getWaveDataOverview(param);
    let wind = this.apiService.getWindDataOverview(param);
    forkJoin([swell, wave, wind]).subscribe((results) => {
      (this.swell_data = results[0]),
        (this.wave_data = results[1]),
        (this.wind_data = results[2]);
      console.log('swell value....', this.swell_value);

      if (this.swell_data.length != 0) {
        console.log('swell...', this.swell_data);
        this.station_name = this.swell_data[0].location;
        this.district_name = this.swell_data[0].district_name;
        this.district_name_ory = this.swell_data[0].district_name_ory;
        this.block_name = this.swell_data[0].block_name;
        this.block_name_ory = this.swell_data[0].block_name_ory;
        for (var i = 0; i < this.swell_data.length; ++i) {
          var swell_v = this.swell_data[i].value;
          var fdate = this.swell_data[i].forecast_time;
          this.swell_value.push(Number(swell_v));
          this.f_date_time.push(fdate);
        }
        console.log('swell value....', this.swell_value);
      } else {
        this.swell_data = null;
        console.log('swell value....', null);
      }
      if (this.wave_data.length != 0) {
        console.log('wave...', this.wave_data);
        this.station_name = this.wave_data[0].location;
        this.district_name = this.wave_data[0].district_name;
        this.district_name_ory = this.wave_data[0].district_name_ory;
        this.block_name = this.wave_data[0].block_name;
        this.block_name_ory = this.wave_data[0].block_name_ory;
        for (var i = 0; i < this.wave_data.length; ++i) {
          var wave_v = this.wave_data[i].value;
          var fdate = this.wave_data[i].forecast_time;
          this.wave_value.push(Number(wave_v));
          this.f_date_time.push(fdate);
        }
        console.log('wave value....', this.wave_value);
      } else {
        this.wave_data = null;
      }
      if (this.wind_data.length != 0) {
        console.log('wind...', this.wind_data);
        this.station_name = this.wind_data[0].location;
        this.district_name = this.wind_data[0].district_name;
        this.district_name_ory = this.wind_data[0].district_name_ory;
        this.block_name = this.wind_data[0].block_name;
        this.block_name_ory = this.wind_data[0].block_name_ory;
        for (var i = 0; i < this.wind_data.length; ++i) {
          var wind_v = this.wind_data[i].value;
          var fdate = this.wind_data[i].forecast_time;
          this.wind_value.push(Number(wind_v));
          this.f_date_time.push(fdate);
        }
        console.log('wind value....', this.wind_value);
      } else {
        this.wind_data = null;
      }
      // this.load_liner_graph();
      this.loadLinearHighchart();
      this.loading = false;
    });
  }
  loadLinearHighchart() {
    if (this.lang == 'en') {
      var myChart = HighCharts.chart({
        //   this.chartOptions);
        // this.chartOptions =  HighCharts.setOptions({
        chart: {
          renderTo: 'container',
        },
        title: {
          text: 'Overview',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: true,
        },
        plotOptions: {
          area: {
            showInLegend: true,
          },
        },
        xAxis: {
          type: 'datetime',
          categories: this.f_date_time,
          offset: 60,
          labels: {
            formatter: function () {
              return HighCharts.dateFormat('%b/%e', this.value);
            },
          },
          title: {
            text: '',
            style: {
              fontWeight: 'bold',
              color: '#000000',
            },
          },
          visible: false,
          crosshair: {
            width: 2,
            color: '#3168DA',
            dashStyle: 'ShortDash',
          },
        },
        // xAxis: {
        //   categories: this.f_date_time,
        //   // type: 'datetime',
        //   //   offset: 60,
        //   //   labels: {
        //   //     formatter: function(){
        //   //       return HighCharts.dateFormat('%b/%e', this.f_date_time);
        //   //     }
        //   //   },
        //     title: {
        //       text: 'Date/Time',
        //       style: {
        //         fontWeight: 'bold',
        //         color: '#000000'
        //       }
        //     },
        // },
        // yAxis: [{
        //   title: {
        //     text: 'Meter(m)'
        //   }
        // }, {
        //     title: {
        //       text: 'Wind Speed(km/h)'
        //     },
        //     gridLineWidth: 0,
        //     opposite: true
        // }],
        yAxis: [
          {
            min: 0,
            title: {
              text: 'Meter(m)',
              style: {
                fontWeight: 'bold',
                color: '#000000',
              },
            },
            labels: {
              format: '{value} ' + 'm',
              style: {
                color: '#5368f5',
              },
            },
          },
          {
            title: {
              text: 'Km/hr',
              style: {
                fontWeight: 'bold',
                color: '#000000',
              },
            },
            opposite: true,
          },
        ],
        series: [
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'Significant Wave Height(m)',
            data: this.wave_value,
          },
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'Wind speed(km/hr)',
            data: this.wind_value,
            yAxis: 1,
          },
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'Swell wave height(m)',
            data: this.swell_value,
          },
        ],
      });
    } else if (this.lang == 'od') {
      var myChart = HighCharts.chart({
        //   this.chartOptions);
        // this.chartOptions =  HighCharts.setOptions({
        chart: {
          renderTo: 'container',
        },
        title: {
          text: 'ସାଧାରଣ ବର୍ଣ୍ଣନା',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: true,
        },
        plotOptions: {
          area: {
            showInLegend: true,
          },
        },
        xAxis: {
          type: 'datetime',
          categories: this.f_date_time,
          offset: 60,
          labels: {
            formatter: function () {
              return HighCharts.dateFormat('%b/%e', this.value);
            },
          },
          title: {
            text: '',
            style: {
              fontWeight: 'bold',
              color: '#000000',
            },
          },
          visible: false,
          crosshair: {
            width: 2,
            color: '#3168DA',
            dashStyle: 'ShortDash',
          },
        },
        // xAxis: {
        //   categories: this.f_date_time,
        //   // type: 'datetime',
        //   //   offset: 60,
        //   //   labels: {
        //   //     formatter: function(){
        //   //       return HighCharts.dateFormat('%b/%e', this.f_date_time);
        //   //     }
        //   //   },
        //     title: {
        //       text: 'Date/Time',
        //       style: {
        //         fontWeight: 'bold',
        //         color: '#000000'
        //       }
        //     },
        // },
        // yAxis: [{
        //   title: {
        //     text: 'Meter(m)'
        //   }
        // }, {
        //     title: {
        //       text: 'Wind Speed(km/h)'
        //     },
        //     gridLineWidth: 0,
        //     opposite: true
        // }],
        yAxis: [
          {
            min: 0,
            title: {
              text: 'Meter(m)',
              style: {
                fontWeight: 'bold',
                color: '#000000',
              },
            },
            labels: {
              format: '{value} ' + 'm',
              style: {
                color: '#5368f5',
              },
            },
          },
          {
            title: {
              text: 'Km/hr',
              style: {
                fontWeight: 'bold',
                color: '#000000',
              },
            },
            opposite: true,
          },
        ],
        series: [
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'ଉଲ୍ଲେଖନୀୟ ଉଚ୍ଚ ତରଙ୍ଗ(m)',
            data: this.wave_value,
          },
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'ପବନ ବେଗ(km/hr)',
            data: this.wind_value,
            yAxis: 1,
          },
          {
            type: 'spline',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 4,
              states: {
                hover: {
                  fillColor: 'white',
                  radius: 8,
                  lineColor: '#3168DA',
                  lineWidth: 2,
                },
              },
            },
            name: 'ଉଲ୍ଲେଖନୀୟ ସ୍ଵେଲ ଉଚ୍ଚତା(m)',
            data: this.swell_value,
          },
        ],
      });
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  back() {
    this.platform.backButton.subscribeWithPriority(5, () => {});
    this.modalController.dismiss();
  }
}
