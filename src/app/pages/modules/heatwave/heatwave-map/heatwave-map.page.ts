import { take } from 'rxjs/operators';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

import { mapKey } from '../../../../config/key';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-heatwave-map',
  templateUrl: './heatwave-map.page.html',
  styleUrls: ['./heatwave-map.page.scss'],
})
export class HeatwaveMapPage implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  fabState = false;
  map;
  lang;
  date_options;
  date;
  public heatwave_alert_data: any;
  forecast_ensemble: any = [];
  forecast_ten: any = [];
  forecast_imd: any = [];
  forecast: any = null;

  days = 'ensemble';
  arr;
  run = false;
  wave = false;
  timeout;
  scrollTo = 0;
  current = 0;
  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private apiService: ApiService,
    private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('language');
    let today = moment().format('YYYY-MM-DD');
    this.date_options = [today];
    this.date = today;
    console.log('today date', this.date);
  }

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.mapIt();
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
          style: 'mapbox://styles/rimes/cl0menxra00c415qloucxsvtj',
          center: [84.5121, 20.5012],
          zoom: 5.5,
        });
        this.map.on('load', () => {
          this.map.addSource('block', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Blocklevel.geojson',
          });

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';
          const bounds = [
            [79.39243244478365, 12.15088515068841], // [west, south]
            [89.33612155521956, 28.622447876268296], // [east, north]
          ];
          this.map.setMaxBounds(bounds);

          this.map.addLayer({
            id: 'block-layer',
            type: 'fill',
            source: 'block',
            paint: {
              'fill-color': 'white',
              'fill-opacity': 0.5,
            },
          });

          this.map.once('idle', () => {
            this.loadForecast();
            loadingEl.dismiss();
          });

          this.map.on('click', 'block-layer', (e) => {
            console.log(e.features[0].properties);
            this.onClick(e.features[0].properties.SlNo);
          });
        });
      });
  }

  onClick(block_id) {
    console.log('block_id', block_id);
    let param = {
      date: this.date,
      block_id: block_id,
    };
    if (this.days == 'ensemble') {
      this.apiService
        .getImdHeatwaveAlertsByBlockAndDate(param)
        .subscribe((data) => {
          this.heatwave_alert_data = data;
          console.log('heat wave data', this.heatwave_alert_data);
          if (this.heatwave_alert_data.length == 0) {
            if (this.lang == 'en') {
            } else {
              this.authService.showAlert(
                'ତଥ୍ୟାବଳୀ ଉପଲବ୍ଧ ନାହିଁ',
                null,
                'ବନ୍ଦକର'
              );
            }
          } else {
            var fcst = this.heatwave_alert_data[0].fcst_date;
            var temp = this.heatwave_alert_data[0].temp_max;
            if (this.heatwave_alert_data[0].heat_wave_status == 1) {
              var status = 'Normal Day';
              var status_or = 'ସ୍ୱାଭାବିକ ଦିନ';
            } else if (this.heatwave_alert_data[0].heat_wave_status == 2) {
              var status = 'Heatwave Alert';
              var status_or = 'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ ପ୍ରତି ସାବଧାନ';
            } else if (this.heatwave_alert_data[0].heat_wave_status == 3) {
              var status = 'Severe Heatwave Alert';
              var status_or =
                'ଆଜିର ପ୍ରଚଣ୍ଡ ତାପମାତ୍ରା ପ୍ରତି ସତର୍କତା ଅବଲମ୍ବନ କରନ୍ତୁ ।';
            } else if (this.heatwave_alert_data[0].heat_wave_status == 4) {
              var status = 'Extreme Heatwave Alert';
              var status_or = 'ଆଜିର ତାପମାତ୍ରା ପ୍ରତି ସାବଧାନ ରୁହନ୍ତୁ ।';
            }
            var blk_name = this.heatwave_alert_data[0].block_name;
            var blk_name_ory = this.heatwave_alert_data[0].block_name_ory;
            if (this.lang == 'en') {
              this.authService.showAlert(
                `Block: ` + blk_name,
                `Maximum Temperature: <span style="font-weight:500;color:var(--ion-color-primary)!important">` +
                  temp +
                  `</span><br>
                Status: <span style="font-weight:500;color:var(--ion-color-primary)!important">` +
                  status +
                  `</span>`,
                'Close'
              );
            } else {
              this.authService.showAlert(
                `ବ୍ଲକ: ` + blk_name_ory,
                `ସର୍ବାଧିକ ତାପମାତ୍ରା: <span style="font-weight:500;color:var(--ion-color-primary)!important">` +
                  temp +
                  `</span><br>
                ଅବସ୍ଥା: <span style="font-weight:500;color:var(--ion-color-primary) !important">` +
                  status_or +
                  `</span>`,
                'ବନ୍ଦକର'
              );
            }
          }
        });
    }
  }
  loadForecast() {
    let ten_days_ensemble_index =
      this.apiService.getHeatIndexEnsembleDataAllBlock();
    let ten_days_ensemble = this.apiService.getEnsembleData();

    forkJoin([ten_days_ensemble_index, ten_days_ensemble])
      .pipe(take(1))
      .subscribe((results) => {
        (this.forecast_ten = results[0]),
          (this.forecast_ensemble = results[1]),
          console.log('TenDaysForecast', this.forecast_ten);
        console.log('TenDaysForecastEnsemble', this.forecast_ensemble);

        if (this.forecast_ten != null || this.forecast_ensemble != null) {
          this.updateDates();
        } else {
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      });
  }

  updateDatesFAB(fc) {
    this.map.easeTo({
      center: [84.5121, 20.5012],
      zoom: 5.5,
      duration: 0,
    });
    this.days = fc;

    this.map.once('idle', () => {
      this.updateDates();
    });
  }

  updateDates() {
    if (this.forecast_ensemble != null && this.forecast_ten != null) {
      if (this.days == 'ten') {
        for (var k in this.forecast_ten) {
          if (k != this.date) {
            this.date = k;
            console.log(this.date);
          }
          break;
        }

        if (this.forecast_ten.length != 0) {
          this.date_options = Object.keys(this.forecast_ten);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);

          this.updateMapFeature();

          this.authService.showErrorToast(
            this.translate.instant(
              'Loading data for next 10 days Heat Stress Forecast. Please wait..'
            )
          );
        } else {
          this.date_options = Object.keys(this.forecast);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      } else if (this.days == 'ensemble') {
        for (var k in this.forecast_ensemble) {
          if (k != this.date) {
            this.date = k;
            console.log(this.date);
          }
          break;
        }

        if (this.forecast_ensemble.length != 0) {
          this.date_options = Object.keys(this.forecast_ensemble);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.authService.showErrorToast(
            this.translate.instant(
              'Loading data for next 5 days Heatwave Forecast. Please wait..'
            )
          );

          this.updateMapFeature();
        } else {
          this.date_options = Object.keys(this.forecast);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      }
      this.date = this.date_options[0];
    }
  }

  fcDateClicked(e) {
    this.date = e.srcElement.innerText;
    console.log(e);
    this.updateMapFeature();
  }

  updateMapFeature() {
    var matchExpression = null;
    matchExpression = ['match', ['get', 'SlNo']];

    const features = this.map.queryRenderedFeatures({
      layers: ['block-layer'],
    });

    const unique = [...new Set(features.map((item) => item.properties.SlNo))];
    console.log(unique);

    var fcst: any;
    var f1: any = [];
    f1 = unique;
    if (f1.length != 0) {
      unique.forEach((element) => {
        console.log(element);
        if (this.days == 'ten') {
          fcst = this.forecast_ten[this.date];
          console.log(fcst);
          let block_id: any = element;
          console.log('Town Id: ' + block_id);

          if (!fcst[block_id]) {
            console.log('not there');
            matchExpression.push(element, 'black');
          } else {
            let heat_index = fcst[block_id].HeatIndex;
            console.log('Town Id: ' + block_id + ' heatindex::::: ' + heat_index);
            // if (heat_index <= 90) {
            //   matchExpression.push(element, 'green');
            // } else if (heat_index > 90 && heat_index <= 103)
            //   matchExpression.push(element, 'yellow');
            // else if (heat_index > 103 && heat_index <= 125)
            //   matchExpression.push(element, 'orange');
            // else if (heat_index > 125) matchExpression.push(element, 'red');
            if (heat_index <= 27) {
              matchExpression.push(element, '#BAF1FF');
            } else if (heat_index > 27 && heat_index <= 32)
              matchExpression.push(element, '#BFF781');
            else if (heat_index > 32 && heat_index <= 41)
              matchExpression.push(element, '#FFDE02');
            else if (heat_index > 41 && heat_index <= 54)
              matchExpression.push(element, '#FE9A2E');  
            else if (heat_index > 54) matchExpression.push(element, '#FF0000');
          }
        } else if (this.days == 'ensemble') {
          fcst = this.forecast_ensemble[this.date];
          let block_id: any = element;
          console.log('Town Id: ' + block_id);
          // console.log(this.forecast_ensemble);

          if (!fcst[block_id]) {
            matchExpression.push(element, 'black');
          } else {
            let heat_fcst = fcst[block_id].heat_wave_status;
            console.log(
              'Town Id: ' + block_id + ' heatwave status: ' + heat_fcst
            );
            if (heat_fcst == 1) {
              matchExpression.push(element, 'green');
            } else if (heat_fcst == 2) matchExpression.push(element, '#ffda05');
            else if (heat_fcst == 3) matchExpression.push(element, '#e48400');
            else if (heat_fcst == 4) matchExpression.push(element, '#red');
          }
        }
      });
      matchExpression.push('black');
      if (this.map.getSource('block') != null && matchExpression) {
        if (this.map.getLayer('block-layer2') != null) {
          this.map.removeLayer('block-layer2');
        }

        this.map.addLayer({
          id: 'block-layer2',
          type: 'fill',
          source: 'block',
          paint: {
            'fill-color': matchExpression,
            'fill-opacity': 0.6,
          },
        });
      }
    }
  }

  play() {
    this.arr = this.content.nativeElement.children;
    this.run = true;
    var i;
    if (this.current != this.arr.length) {
      i = this.current;
      let item = this.arr[i];
      this.scrollTo = i;
      this.date = item.innerText;
      this.updateMapFeature();
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      let item = this.arr[i];
      this.date = item.innerText;
      this.updateMapFeature();
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }
    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        let item = this.arr[i];
        this.scrollTo = i;
        this.date = item.innerText;
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
          this.date = this.arr[0].innerText;
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

  ionViewWillLeave() {
    this.loadingCtrl.dismiss();
  }
}
