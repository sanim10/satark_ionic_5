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
    private apiService: ApiService
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
        mapboxgl.accessToken =
          'pk.eyJ1Ijoic3VwZXJkb3plIiwiYSI6ImNreWk0bGJ5YTI4dGIycW84dDU1emw2eG8ifQ.zUCe5RZtHPSqBo6vKneGdQ';

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
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

          loadingEl.dismiss();
          this.map.addLayer({
            id: 'block-layer',
            type: 'fill',
            source: 'block',
            paint: {
              'fill-color': 'white',
              'fill-opacity': 0.5,
            },
          });
          // this.map.addLayer({
          //   id: 'block-outline',
          //   type: 'line',
          //   source: 'block',
          //   paint: {
          //     'line-color': 'black',
          //     'line-width': 1,
          //   },
          // });

          this.map.addSource('india', {
            type: 'geojson',
            data: '../../../../../assets/geojson/India_Map.geojson',
          });

          this.map.addLayer({
            id: 'india-layer',
            type: 'line',
            source: 'india',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#3589ff',
              'line-width': 0.5,
            },
          });

          this.map.on('click', 'block-layer', (e) => {
            console.log(e.features[0].properties);
            this.onClick(e.features[0].properties.SlNo);
          });

          this.loadForecast();
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
                `ବ୍ଲକ: ` + blk_name,
                `ସର୍ବାଧିକ ତାପମାତ୍ରା: <span style="font-weight:500;color:var(--ion-color-primary)!important">` +
                  temp +
                  `</span><br>
                ଅବସ୍ଥା: <span style="font-weight:500;color:var(--ion-color-primary) !important">` +
                  status +
                  `</span>`,
                'ବନ୍ଦକର'
              );
            }
          }
        });
    }
  }
  loadForecast() {
    // this.loadingCtrl.create().then((loadingEl) => {
    // loadingEl.present();
    let ten_days_ensemble_index =
      this.apiService.getHeatIndexEnsembleDataAllBlock();
    let ten_days_ensemble = this.apiService.getEnsembleData();

    forkJoin([ten_days_ensemble_index, ten_days_ensemble]).subscribe(
      (results) => {
        (this.forecast_ten = results[0]),
          (this.forecast_ensemble = results[1]),
          console.log('TenDaysForecast', this.forecast_ten);
        console.log('TenDaysForecastEnsemble', this.forecast_ensemble);
        // loadingEl.dismiss();
        if (this.forecast_ten != null || this.forecast_ensemble != null) {
          this.updateDates();
        } else {
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      }
    );
    // });
  }

  updateDatesFAB(fc) {
    this.days = fc;
    this.updateDates();
  }

  updateDates() {
    if (this.forecast_ensemble != null && this.forecast_ten != null) {
      if (this.days == 'ten') {
        if (this.forecast_ten.length != 0) {
          this.date_options = Object.keys(this.forecast_ten);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.updateMapFeature();
          this.authService.showErrorToast(
            'Loading data for next 10 days HeatIndex Forecast. Please wait..'
          );
        } else {
          this.date_options = Object.keys(this.forecast);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      } else if (this.days == 'ensemble') {
        if (this.forecast_ensemble.length != 0) {
          this.date_options = Object.keys(this.forecast_ensemble);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.updateMapFeature();
          this.authService.showErrorToast(
            'Loading data for next 5 days Heatwave Forecast. Please wait..'
          );
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
          }
          let heat_index = fcst[block_id].HeatIndex;
          console.log('Town Id: ' + block_id + ' Rainfall: ' + heat_index);
          if (heat_index <= 90) {
            matchExpression.push(element, 'green');
          } else if (heat_index > 90 && heat_index <= 103)
            matchExpression.push(element, 'yellow');
          else if (heat_index > 103 && heat_index <= 125)
            matchExpression.push(element, 'orange');
          else if (heat_index > 125) matchExpression.push(element, 'red');
        } else if (this.days == 'ensemble') {
          fcst = this.forecast_ensemble[this.date];
          let block_id: any = element;
          console.log('Town Id: ' + block_id);
          console.log(fcst);

          if (!fcst[block_id]) {
            matchExpression.push(element, 'black');
          }
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
            'fill-opacity': 0.7,
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
}
