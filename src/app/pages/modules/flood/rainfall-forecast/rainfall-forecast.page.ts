import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { AuthService } from './../../../../guard/auth.service';
import { LoadingController } from '@ionic/angular';
import { ApiService } from './../../../../providers/api.service';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { mapKey } from '../../../../config/key';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-rainfall-forecast',
  templateUrl: './rainfall-forecast.page.html',
  styleUrls: ['./rainfall-forecast.page.scss'],
})
export class RainfallForecastPage implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  map;
  date_options;
  date;
  lang;
  length;
  timeout;
  arr = [];
  run = false;
  scrollTo = null;
  current = 0;
  public wrf_basin_data: any;
  public ecmwf_basin_data: any;
  forecast_wrf: any = null;
  forecast_ecmwf: any = null;
  days = 'three';
  time = [];
  stn_name: any;
  raw_data: any;
  bias_data: any;
  fcst_date: any;
  q5: any;
  q25: any;
  q50: any;
  q75: any;
  q95: any;
  fabState = false;
  ECMWF = false;
  WRF = true;
  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('language');
    let today = moment().format('YYYY-MM-DD');
    this.date_options = [today];
    this.date = today;
    console.log('today date', this.date);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.mapIt();
    this.arr = this.content.nativeElement.children;
  }

  mapIt() {
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        cssClass: 'loader-css-class',
        mode: 'ios',
        duration: 10000,
      })
      .then((loadingEl) => {
        loadingEl.present();
        mapboxgl.accessToken = mapKey;

        this.map = new mapboxgl.Map({
          container: 'map',
          attributionControl: false,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [84.5121, 20.5012],
          zoom: 5,
        });

        this.map.on('load', () => {
          this.map.addSource('Mahanadi_basin', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Mahanadi_basin.geojson',
          });

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
          this.map.addLayer({
            id: 'Mahanadi_basin-layer',
            type: 'fill',
            source: 'Mahanadi_basin',
            paint: {
              'fill-color': 'white',
              'fill-opacity': 0.5,
            },
          });
          this.map.addLayer({
            id: 'Mahanadi_basin-layer1',
            type: 'line',
            source: 'Mahanadi_basin',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#000',
              'line-width': 1,
            },
          });

          // this.map.addLayer({
          //   id: 'Mahanadi_basin-layer2',
          //   type: 'fill',
          //   source: 'Mahanadi_basin',
          //   paint: {
          //     'fill-color': [
          //       'match',
          //       ['get', 'Name'], // get the property
          //       'W2150',
          //       'black',
          //       'white',
          //     ],
          //     'fill-opacity': 0.5,
          //   },
          // });

          // this.scrollTo = 0;
          this.map.on('click', 'Mahanadi_basin-layer', (e) => {
            let name = e.features[0].properties.Name;
            console.log('basin name', name);
            let param = {
              date: this.date,
              basin_name: name,
            };
            if (this.days == 'three') {
              this.apiService
                .getWrfRainfallForecastByBasinName(param)
                .subscribe(
                  (data) => {
                    this.wrf_basin_data = data;
                    console.log('basin data', this.wrf_basin_data);
                    if (this.wrf_basin_data.length == 0) {
                      if (this.lang == 'en') {
                        this.authService.showAlert(
                          'Sub-Basin ' + name,
                          'Data not available',
                          'Close'
                        );
                      } else {
                        this.authService.showAlert(
                          'ଉପ ଅବବାହିକା ' + name,
                          'ତଥ୍ୟାବଳୀ ଉପଲବ୍ଧ ନାହିଁ',
                          'ବନ୍ଦକର'
                        );
                      }
                    } else {
                      this.stn_name = this.wrf_basin_data[0].basin_name;
                      this.raw_data = this.wrf_basin_data[0].raw_forecast;
                      this.bias_data =
                        this.wrf_basin_data[0].bias_corrected_forecast;
                      this.fcst_date = this.wrf_basin_data[0].fcst_date;
                      if (this.lang == 'en') {
                        this.authService.showAlert(
                          'Sub-Basin ' + this.stn_name,
                          '<p class="custom-title"><span class="header"> this.stn_name</span><span class="headervalue">' +
                            ' ' +
                            this.raw_data +
                            'mm</span></br><span class="header">Bias Corrected:</span><span class="headervalue">' +
                            ' ' +
                            this.bias_data +
                            'mm</span></br><span class="header">Forecast Date:</span><span class="headervalue">' +
                            ' ' +
                            this.fcst_date +
                            '</span></p>',
                          'Close'
                        );
                      } else {
                        this.authService.showAlert(
                          'ଉପ ଅବବାହିକା ' + this.stn_name,
                          '<p class="custom-title"><span class="header">ଆନୁମାନିକ ସୂଚନା:</span><span class="headervalue">' +
                            ' ' +
                            this.raw_data +
                            'mm</span></br><span class="header">ବିଆଈଏସ ସଂଶୋଧିତ:</span><span class="headervalue">' +
                            ' ' +
                            this.bias_data +
                            'mm</span></br><span class="header">ପୂର୍ବାନୁମାନ ତାରିଖ:</span><span class="headervalue">' +
                            ' ' +
                            this.fcst_date +
                            '</span></p>',
                          'ବନ୍ଦକର'
                        );
                      }
                    }
                  },
                  (Error) => {
                    this.authService.showErrorToast(
                      'Network Error. Please reload the page.'
                    );
                  }
                );
            } else {
              this.apiService
                .getEcmwfRainfallForecastByBasinName(param)
                .subscribe(
                  (data) => {
                    this.ecmwf_basin_data = data;
                    console.log('basin data', this.ecmwf_basin_data);
                    if (this.ecmwf_basin_data.length == 0) {
                      if (this.lang == 'en') {
                        this.authService.showAlert(
                          'Sub-Basin ' + name,
                          'Data not available',
                          'Close'
                        );
                      } else {
                        this.authService.showAlert(
                          'ଉପ ଅବବାହିକା ' + name,
                          'ତଥ୍ୟାବଳୀ ଉପଲବ୍ଧ ନାହିଁ',
                          'ବନ୍ଦକର'
                        );
                      }
                    } else {
                      this.stn_name = this.ecmwf_basin_data[0].basin_name;
                      this.q5 = this.ecmwf_basin_data[0].q5;
                      this.q25 = this.ecmwf_basin_data[0].q25;
                      this.q50 = this.ecmwf_basin_data[0].q50;
                      this.q75 = this.ecmwf_basin_data[0].q75;
                      this.q95 = this.ecmwf_basin_data[0].q95;
                      this.fcst_date = this.ecmwf_basin_data[0].fcst_date;
                      if (this.lang == 'en') {
                        this.authService.showAlert(
                          'Sub-Basin ' + this.stn_name,

                          '<p class="custom-title"><span class="header">Q5:</span><span class="headervalue">' +
                            ' ' +
                            this.q5 +
                            'mm</span></br><span class="header">Q25:</span><span class="headervalue">' +
                            ' ' +
                            this.q25 +
                            'mm</span></br><span class="header">Q50:</span><span class="headervalue">' +
                            ' ' +
                            this.q50 +
                            'mm</span></br><span class="header">Q75:</span><span class="headervalue">' +
                            ' ' +
                            this.q95 +
                            'mm</span></br><span class="header">Q25:</span><span class="headervalue">' +
                            ' ' +
                            this.q95 +
                            'mm</span></br><span class="header">Forecast Date:</span><span class="headervalue">' +
                            ' ' +
                            this.fcst_date +
                            '</span></p>',
                          'Close'
                        );
                      } else {
                        this.authService.showAlert(
                          'ଉପ ଅବବାହିକା ' + this.stn_name,
                          '<p class="custom-title"><span class="header">Q5:</span><span class="headervalue">' +
                            ' ' +
                            this.q5 +
                            'mm</span></br><span class="header">Q25:</span><span class="headervalue">' +
                            ' ' +
                            this.q25 +
                            'mm</span></br><span class="header">Q50:</span><span class="headervalue">' +
                            ' ' +
                            this.q50 +
                            'mm</span></br><span class="header">Q75:</span><span class="headervalue">' +
                            ' ' +
                            this.q95 +
                            'mm</span></br><span class="header">Q25:</span><span class="headervalue">' +
                            ' ' +
                            this.q95 +
                            'mm</span></br><span class="header">ପୂର୍ବାନୁମାନ ତାରିଖ:</span><span class="headervalue">' +
                            ' ' +
                            this.fcst_date +
                            '</span></p>',
                          'ବନ୍ଦକର'
                        );
                      }
                    }
                  },
                  (Error) => {
                    this.authService.showErrorToast(
                      'Network Error. Please reload the page.'
                    );
                  }
                );
            }
          });
          this.map.once('idle', () => {
            this.loadForecast();
          });
        });
      });
  }

  loadForecast() {
    let wrf_rainfall = this.apiService.getWrfRainfallForMap();
    let ecmwf_rainfall = this.apiService.getRcmwfRainfallForMap();
    forkJoin([wrf_rainfall, ecmwf_rainfall]).subscribe((results) => {
      (this.forecast_wrf = results[0]),
        (this.forecast_ecmwf = results[1]),
        console.log('WRF Forecast', this.forecast_wrf);
      console.log('ECMWF Forecast', this.forecast_ecmwf);
      if (this.forecast_wrf.length != 0 || this.forecast_ecmwf.length != 0) {
        this.updateDates();
      } else {
        this.map.setPaintProperty('Mahanadi_basin-layer', 'fill-opacity', 0.6);
        this.map.setPaintProperty(
          'Mahanadi_basin-layer',
          'fill-color',
          'black'
        );
        console.log('error');
        this.authService.showErrorToast('Data is not available currently!');
      }
    });
  }

  updateDates() {
    if (this.forecast_wrf.length != 0 || this.forecast_ecmwf.length != 0) {
      if (this.days == 'ten') {
        if (this.forecast_ecmwf.length != 0) {
          this.date_options = Object.keys(this.forecast_ecmwf);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.updateMapFeature();

          this.authService.showErrorToast(
            this.translate.instant(
              'Loading data for next 10 days Rainfall Forecast. Please wait..'
            )
          );
        } else {
          this.date_options = Object.keys(this.forecast_ecmwf);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      } else if (this.days == 'three') {
        if (this.forecast_wrf.length != 0) {
          this.date_options = Object.keys(this.forecast_wrf);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.updateMapFeature();
          this.authService.showErrorToast(
            this.translate.instant(
              'Loading data for next 3 days Rainfall Forecast. Please wait..'
            )
          );
        } else {
          this.date_options = Object.keys(this.forecast_wrf);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      }
      this.date = this.date_options[0];
    } else {
      this.authService.showErrorToast('Data is not available currently!');
    }
  }

  updateMapFeature() {
    var fcst: any;

    const matchExpression = ['match', ['get', 'Name']];
    const features = this.map.queryRenderedFeatures({
      layers: ['Mahanadi_basin-layer'],
    });
    console.log(features);

    if (features.length != 0) {
      features.forEach((element) => {
        console.log(element.properties.Name);
        if (this.days == 'ten') {
          fcst = this.forecast_ecmwf[this.date];
          let basin_name = element.properties.Name;
          if (!fcst[basin_name]) {
            console.log('not there');
            matchExpression.push(element.properties.Name, 'black');
            return;
          }
          let rainfall = fcst[basin_name].q50;
          console.log('Basin name' + basin_name + ' Rainfall: ' + rainfall);
          if (rainfall >= 0.0 && rainfall <= 1.0)
            matchExpression.push(element.properties.Name, '#46C646');
          else if (rainfall > 1.0 && rainfall <= 5.0)
            matchExpression.push(element.properties.Name, '#DAF7A6');
          else if (rainfall > 5.0 && rainfall <= 10.0)
            matchExpression.push(element.properties.Name, 'yellow');
          else if (rainfall > 10.0 && rainfall <= 25.0)
            matchExpression.push(element.properties.Name, 'orange');
          else if (rainfall > 25.0 && rainfall <= 50.0)
            matchExpression.push(element.properties.Name, '#FF8C00');
          else if (rainfall > 50.0 && rainfall <= 75.0)
            matchExpression.push(element.properties.Name, 'red');
          else if (rainfall > 75.0 && rainfall <= 100.0)
            matchExpression.push(element.properties.Name, 'red');
          else if (rainfall > 100)
            matchExpression.push(element.properties.Name, '#CCD1D1');
        } else if (this.days == 'three') {
          console.log(this.forecast_wrf[this.date]);
          fcst = this.forecast_wrf[this.date];
          let basin_name = element.properties.Name;
          if (!fcst[basin_name]) {
            console.log('not there');
            matchExpression.push(element.properties.Name, 'black');
            return;
          }
          let rainfall = fcst[basin_name].bias_corrected_forecast;
          console.log('Basin name' + basin_name + ' Rainfall: ' + rainfall);
          if (rainfall >= 0.0 && rainfall <= 1.0)
            matchExpression.push(element.properties.Name, '#46C646');
          else if (rainfall > 1.0 && rainfall <= 5.0)
            matchExpression.push(element.properties.Name, '#DAF7A6');
          else if (rainfall > 5.0 && rainfall <= 10.0)
            matchExpression.push(element.properties.Name, 'yellow');
          else if (rainfall > 10.0 && rainfall <= 25.0)
            matchExpression.push(element.properties.Name, 'orange');
          else if (rainfall > 25.0 && rainfall <= 50.0)
            matchExpression.push(element.properties.Name, '#FF8C00');
          else if (rainfall > 50.0 && rainfall <= 75.0)
            matchExpression.push(element.properties.Name, 'red');
          else if (rainfall > 75.0 && rainfall <= 100.0)
            matchExpression.push(element.properties.Name, 'red');
          else if (rainfall > 100)
            matchExpression.push(element.properties.Name, '#CCD1D1');
        }
        matchExpression.push(element.properties.Name, 'black');
      });
      if (this.map.getSource('Mahanadi_basin') != null && matchExpression) {
        this.map.addLayer({
          id: 'Mahanadi_basin-layer2',
          type: 'fill',
          source: 'Mahanadi_basin',
          paint: {
            'fill-color': matchExpression,
            'fill-opacity': 0.7,
          },
        });
      }
    }
  }

  play() {
    this.run = true;
    var i;
    if (this.current != this.arr.length) {
      i = this.current;
      let item = this.arr[i];
      this.date = item;
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      let item = this.arr[i];
      this.date = item;
      this.scrollTo = i;
      this.updateMapFeature();
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }
    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        let item = this.arr[i];
        this.date = item;
        this.scrollTo = i;
        this.updateMapFeature();
        item.scrollIntoView({ behavior: 'smooth' });
        this.current = i;
        i = i + 1;
      } else if (i >= this.arr.length) {
        this.current = i;
        clearInterval(this.timeout);
        setTimeout(() => {
          this.scrollTo = null;
          this.run = false;
          this.date = moment().format('YYYY-MM-DD');
          this.updateMapFeature();
          this.scrollTo = 0;
          this.arr[0].scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
    }, 2000);
  }

  pause() {
    this.run = false;
    if (!this.run) {
      clearInterval(this.timeout);
      return;
    }
  }

  showHideBackdrop() {
    this.fabState = !this.fabState;
  }

  showData(index) {
    if (this.forecast_wrf.length != 0 || this.forecast_ecmwf.length != 0) {
      this.scrollTo = index;
      let item = this.arr[index];
      this.date = item;
      item.scrollIntoView({ behavior: 'smooth' });
      this.updateMapFeature();
    } else {
      this.authService.showErrorToast('Data not available');
    }
  }

  updateDatesFAB(fc) {
    if (fc == 'three') {
      this.WRF = true;
      this.ECMWF = false;
    } else {
      this.ECMWF = true;
      this.WRF = false;
    }
    this.days = fc;
    this.updateDates();
  }

  ionViewWillLeave() {
    this.loadingCtrl.dismiss();
  }
}
