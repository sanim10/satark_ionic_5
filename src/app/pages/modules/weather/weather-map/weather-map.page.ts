import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-weather-map',
  templateUrl: './weather-map.page.html',
  styleUrls: ['./weather-map.page.scss'],
})
export class WeatherMapPage implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  fabState = false;
  fab = 'pr';
  arr;
  run = false;
  wave = false;
  timeout;
  scrollTo = 0;
  current = 0;
  lang;
  date = null;
  yesterday = null;
  yesterdayminus1 = null;
  yesterdayminus2 = null;
  now_date = null;
  date_options = null;
  selected_date: any;
  new_index = 0;
  rainfall_updated_date: string;
  cloud_updated_date: string;
  tmax_updated_date: string;
  tmin_updated_date: string;
  humidity_updated_date: string;
  windspeed_updated_date: string;
  geojson_file: string;
  footer_file: string;
  public date_10_data: any;
  public updated_date_data: any;
  public updated_data: any;
  footer_image: any;
  index = null;

  map;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private loadingCtrl: LoadingController
  ) {
    this.lang = localStorage.getItem('language');
    let today = moment().format('YYYY-MM-DD');
    this.date_options = [today];
    this.date = today;
    this.selected_date = today;
    this.now_date = today;
    this.yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.yesterdayminus1 = moment().subtract(2, 'day').format('YYYY-MM-DD');
    this.yesterdayminus2 = moment().subtract(3, 'day').format('YYYY-MM-DD');
    console.log('today date', this.date);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getDates();
    this.mapIt();
  }

  getDates() {
    this.apiService.get10DaysDate().subscribe((data) => {
      this.date_10_data = data;
      console.log('10 dates', this.date_10_data[0]);
    });
  }

  getLatestDateWeatherForecast() {
    this.apiService.weatherUpdatedDate().subscribe((data) => {
      this.updated_date_data = data;
      this.rainfall_updated_date = this.updated_date_data[0].imd_pr_dly_update;
      this.cloud_updated_date = this.updated_date_data[0].imd_cloud_dly_update;
      this.tmax_updated_date = this.updated_date_data[0].imd_tmax_dly_update;
      this.tmin_updated_date = this.updated_date_data[0].imd_tmin_dly_update;
      this.humidity_updated_date = this.updated_date_data[0].imd_rh_dly_update;
      this.windspeed_updated_date = this.updated_date_data[0].imd_ws_dly_update;
      console.log('dates', data);
      this.loadWeatherData(this.fab, this.new_index);
    });
  }

  loadWeatherData(selected_fab: string, selected_index: number) {
    if (this.now_date === this.rainfall_updated_date) {
      let param = {
        date: this.now_date,
        fab: selected_fab,
      };
      this.apiService.getLatestWeatherForecastData(param).subscribe(
        (data) => {
          this.updated_data = data;
          console.log('weather data', this.updated_data.fdata);
          console.log('selected index', selected_index);
          this.geojson_file = this.updated_data.fdata[selected_index].geojson;
          this.footer_file = this.updated_data.fdata[selected_index].cbar;
          this.loadForecast(
            this.geojson_file,
            this.fab,
            this.now_date,
            this.footer_file
          );
        },
        (Error) => {
          this.authService.showErrorToast(
            'Error while getting data. Please reload the page.'
          );
        }
      );
    } else if (this.yesterday === this.rainfall_updated_date) {
      let param = {
        date: this.yesterday,
        fab: this.fab,
      };
      this.apiService.getLatestWeatherForecastData(param).subscribe(
        (data) => {
          this.updated_data = data;
          console.log('weather data for yesterday', this.updated_data.fdata);
          selected_index = selected_index + 1;
          this.geojson_file = this.updated_data.fdata[selected_index].geojson;
          this.footer_file = this.updated_data.fdata[selected_index].cbar;

          this.loadForecast(
            this.geojson_file,
            this.fab,
            this.yesterday,
            this.footer_file
          );
        },
        (Error) => {
          this.authService.showErrorToast(
            'Error while getting data. Please reload the page.'
          );
        }
      );
    } else if (this.yesterdayminus1 === this.rainfall_updated_date) {
      let param = {
        date: this.yesterdayminus1,
        fab: this.fab,
      };
      this.apiService.getLatestWeatherForecastData(param).subscribe(
        (data) => {
          this.updated_data = data;
          console.log(
            'weather data for yesterday minus 1',
            this.updated_data.fdata
          );
          selected_index = selected_index + 2;
          this.geojson_file = this.updated_data.fdata[selected_index].geojson;
          this.footer_file = this.updated_data.fdata[selected_index].cbar;
          this.loadForecast(
            this.geojson_file,
            this.fab,
            this.yesterdayminus1,
            this.footer_file
          );
        },
        (Error) => {
          this.authService.showErrorToast(
            'Error while getting data. Please reload the page.'
          );
        }
      );
    } else if (this.yesterdayminus2 === this.rainfall_updated_date) {
      let param = {
        date: this.yesterdayminus2,
        fab: this.fab,
      };
      this.apiService.getLatestWeatherForecastData(param).subscribe(
        (data) => {
          this.updated_data = data;
          console.log(
            'weather data for yesterday minus 2',
            this.updated_data.fdata
          );
          selected_index = selected_index + 3;
          this.geojson_file = this.updated_data.fdata[selected_index].geojson;
          this.footer_file = this.updated_data.fdata[selected_index].cbar;
          this.loadForecast(
            this.geojson_file,
            this.fab,
            this.yesterdayminus2,
            this.footer_file
          );
        },
        (Error) => {
          this.authService.showErrorToast(
            'Error while getting data. Please reload the page.'
          );
        }
      );
    } else {
      console.log('data not updated');

      this.authService.showAlert(
        'Updating..',
        'The latest weather forecast will be updated at 3pm local time'
      );
    }
  }

  ///update map
  loadForecast(
    file: string,
    selected_fab: string,
    new_date: string,
    cbar: string
  ) {
    console.log('updating forecast', file);
    var new_url =
      'https://satark.rimes.int/DATA/forecast_data/imd/' +
      selected_fab +
      '/' +
      new_date +
      '/' +
      file;

    this.footer_image =
      'https://satark.rimes.int/DATA/forecast_data/imd/' +
      selected_fab +
      '/' +
      new_date +
      '/' +
      cbar;

    this.map.addSource('geojson', {
      type: 'geojson',
      data: new_url,
    });

    this.map.addLayer({
      id: 'geojson-layer',
      type: 'fill',
      source: 'geojson',
      paint: {
        'fill-color': ['get', 'fill'],
        'fill-opacity': 0.6,
      },
    });

    this.map.on('click', 'geojson-layer', (e) => {
      var value = e.features[0].properties['title'];

      new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setHTML(value)
        .addTo(this.map);
    });

    console.log('completed');
  }

  updateFAB(fc) {
    this.fab = fc;
    console.log('forecast', this.fab);
    if (this.map.getLayer('geojson-layer') != null) {
      this.map.removeLayer('geojson-layer');
      this.map.removeSource('geojson');
    }

    this.authService.showErrorToast('Fetching new data....');
    this.loadWeatherData(this.fab, this.new_index);
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
          // style: {
          //   version: 8,
          //   sources: {
          //     'raster-tiles': {
          //       type: 'raster',
          //       tiles: ['https://tiles.rimes.int/satark/{z}/{x}/{y}.png'],
          //       tileSize: 256,
          //     },
          //   },
          //   layers: [
          //     {
          //       id: 'simple-tiles',
          //       type: 'raster',
          //       source: 'raster-tiles',
          //       minzoom: 0,
          //       maxzoom: 22,
          //     },
          //   ],
          // },
          style: 'mapbox://styles/mapbox/light-v10',
          center: [84.978903, 19.468185],
          zoom: 4.2,
        });
        this.map.on('load', () => {
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
              'line-color': '#000',
              'line-width': 1,
            },
          });

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
          // this.getOverviewData();
          this.getLatestDateWeatherForecast();
        });
      });
  }

  fcDateClicked(event, index) {
    this.index = index;
    console.log('index value', this.index);
    this.selected_date = event.srcElement.innerText;
    console.log('date clicked', this.selected_date);
    this.new_index = this.index;
    console.log('new index after date changed', this.new_index);
    if (this.map.getLayer('geojson-layer') != null) {
      this.map.removeLayer('geojson-layer');
      this.map.removeSource('geojson');
    }

    this.loadWeatherData(this.fab, this.new_index);
  }

  play() {
    this.arr = this.content.nativeElement.children;
    this.run = true;
    var i;
    if (this.current != this.arr.length) {
      i = this.current;
      let item = this.arr[i];
      this.scrollTo = i;

      this.index = i;
      this.new_index = this.index;
      this.selected_date = item.innerText;
      // if (this.map.getLayer('geojson-layer') != null) {
      //   this.map.removeLayer('geojson-layer');
      //   this.map.removeSource('geojson');
      // }
      // this.loadWeatherData(this.fab, this.new_index);

      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      let item = this.arr[i];

      this.index = i;
      this.new_index = this.index;
      this.selected_date = item.innerText;
      // if (this.map.getLayer('geojson-layer') != null) {
      //   this.map.removeLayer('geojson-layer');
      //   this.map.removeSource('geojson');
      // }
      // this.loadWeatherData(this.fab, this.new_index);

      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }

    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        let item = this.arr[i];
        this.scrollTo = i;

        this.index = i;
        this.new_index = this.index;
        this.selected_date = item.innerText;
        if (this.map.getLayer('geojson-layer') != null) {
          this.map.removeLayer('geojson-layer');
          this.map.removeSource('geojson');
        }
        this.loadWeatherData(this.fab, this.new_index);

        item.scrollIntoView({ behavior: 'smooth' });
        this.current = i;
        i = i + 1;
      } else if (i >= this.arr.length) {
        this.current = i;
        clearInterval(this.timeout);
        setTimeout(() => {
          this.scrollTo = null;
          this.run = false;

          this.index = 0;
          this.new_index = this.index;
          this.selected_date = this.arr[0].innerText;
          if (this.map.getLayer('geojson-layer') != null) {
            this.map.removeLayer('geojson-layer');
            this.map.removeSource('geojson');
          }
          this.loadWeatherData(this.fab, this.new_index);

          this.scrollTo = 0;
          this.arr[0].scrollIntoView({ behavior: 'smooth' });
        }, 3000);
      }
    }, 3000);
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
