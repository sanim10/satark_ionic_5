import { take } from 'rxjs/operators';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { FavModalComponent } from './../fav-modal/fav-modal.component';
import {
  LoadingController,
  Platform,
  ModalController,
  IonBackButtonDelegate,
  NavController,
} from '@ionic/angular';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import * as moment from 'moment';

import { mapKey } from '../../../../config/key';
import { newArray } from '@angular/compiler/src/util';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButton: IonBackButtonDelegate;
  backPriorityBtn;
  loader;
  dist_name;
  fab = 'rainfall';
  date_options;
  date;
  forecast_data: any = [];
  fabState = false;
  arr;
  run = false;
  timeout;
  scrollTo = 0;
  current = 0;
  district = true;
  blocks = false;
  block_loading = false;
  LoadingC = false;
  center = [
    [84.834006, 21.195716],
    [86.9439, 21.53791],
    [83.2071, 21.1403],
    [86.64997, 20.98074],
    [83.145646, 20.54662],
    [84.10032, 20.68269],
    [85.76815, 20.49185],
    [84.799228, 21.454488],
    [85.5854465, 20.81455],
    [84.1848827, 19.144999],
    [84.694353, 19.62937],
    [86.307213, 20.24608],
    [86.158178, 20.8448234],
    [83.92724, 21.779063],
    [83.08621, 19.84187],
    [84.04533, 20.15055],
    [86.64265, 20.55055],
    [85.77372, 21.569222],
    [85.579418, 20.128193],
    [82.73035, 18.71799],
    [81.976323, 18.322709],
    [86.462772, 21.882162],
    [82.38769, 19.5397002],
    [85.06648, 20.1961549],
    [82.59584, 20.47772],
    [85.863276, 19.982144],
    [83.546811, 19.34704556],
    [84.249525, 21.4268765],
    [83.8175, 20.929479],
    [84.47666, 22.22876],
  ];
  map;
  lang;
  features: any = [];
  presented = false;
  current_location_block;
  current_location_block_ory;
  current_location_district;
  current_location_district_ory;
  block_forecast_data: any = null;
  block_data: any = [];

  current_district;
  constructor(
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private navCtrl: NavController,
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

  ngAfterViewInit() {
    this.setUIBackButtonAction();
    this.mapIt();
  }

  ngOnInit() {
    this.loadForecastData();
  }

  mapIt() {
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        cssClass: 'loader-css-class',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        mapboxgl.accessToken = mapKey;

        this.map = new mapboxgl.Map({
          container: 'map',
          attributionControl: false,
          style: 'mapbox://styles/rimes/cl0menxra00c415qloucxsvtj',

          center: [84.364277, 20.60871],
          zoom: 5.5,
        });
        this.map.on('load', () => {
          this.map.addSource('district', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
          });
          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          this.map.addLayer({
            id: 'district-layer',
            type: 'fill',
            source: 'district',
            paint: {
              'fill-color': 'white',
              'fill-opacity': 0.0,
            },
          });

          this.map.addLayer({
            id: 'district-outline',
            type: 'line',
            source: 'district',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#505050',
              'line-width': 1,
            },
          });

          const bounds = [
            [79.39243244478365, 12.15088515068841], // [west, south]
            [89.33612155521956, 28.622447876268296], // [east, north]
          ];
          this.map.setMaxBounds(bounds);

          this.map.once('idle', () => {
            this.updateDates();
            loadingEl.dismiss();
          });

          this.map.on('click', 'district-layer', (e) => {
            if (this.map.getSource('blocks') == null) {
              this.loadBlocks(e.features[0].properties.id);
            }
          });
        });
      });
  }

  loadForecastData() {
    this.apiService
      .get10daysImdDistrictHeatwave()
      .pipe(take(1))
      .subscribe((data) => {
        this.forecast_data = data;
        console.log(this.forecast_data);
      });
  }

  getImdValueAdditionForBlock(block: string) {
    let param = {
      block_id: block,
    };
    this.apiService
      // .get10DaysImdDataForWeather(param)
      .getUpdatedValueAdditionDataForWeather(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.blocks == true
            ? (this.block_forecast_data = data)
            : (this.block_forecast_data = null);

          if (
            this.block_forecast_data?.length == 0 ||
            this.block_forecast_data == null
          ) {
            this.block_forecast_data = null;
          } else {
            this.current_location_block =
              this.block_forecast_data[0].block_name;
            this.current_location_block_ory =
              this.block_forecast_data[0].block_name_ory;
            this.current_location_district =
              this.block_forecast_data[0].district_name;
            this.current_location_district_ory =
              this.block_forecast_data[0].district_name_ory;
            console.log('newww ', this.block_forecast_data);
          }
          this.block_loading = false;
        },
        (Error) => {
          this.authService.showErrorToast(
            'Network Error. Please refresh the page'
          );
        }
      );
  }

  async loadBlocks(district_id) {
    this.current_district = district_id;
    //
    // line-color': '#505050',
    // 'line-width': 1,

    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
      mode: 'ios',
    });
    (await this.loader).present();
    this.LoadingC = true;

    this.district = false;
    this.blocks = true;

    // this.map.setPaintProperty('district-layer', 'fill-opacity', 0.0);
    // this.map.removeLayer('district-layer');
    // this.map.removeLayer('district-outline');
    // this.map.addLayer({
    //   id: 'district-fade',
    //   type: 'fill',
    //   source: 'district',
    //   paint: {
    //     'fill-color': '#001235',
    //     'fill-opacity': 0,
    //   },
    // });
    this.map.setPaintProperty('district-layer', 'fill-opacity', 0.35);

    // this.map.addLayer({
    //   id: 'district-fade',
    //   type: 'fill',
    //   source: 'district',
    //   paint: {
    //     'fill-color': '#001235',
    //     'fill-opacity': 0,
    //   },
    // });

    this.map.addSource('blocks', {
      type: 'geojson',
      data:
        '../../../../../assets/geojson/Odisha_block_id' +
        district_id +
        '.geojson',
    });

    this.map.easeTo({
      center: this.center[district_id - 1],
      zoom: 7.0,
      duration: 1500,
    });

    this.map.addLayer({
      id: 'blocks-layer',
      type: 'fill',
      source: 'blocks',
      paint: {
        'fill-color': 'white',
        'fill-opacity': 1,
      },
    });

    this.map.addLayer({
      id: 'blocks-outline',
      type: 'line',
      source: 'blocks',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#02075d ',
        'line-width': 1,
      },
    });

    this.map.addLayer({
      id: 'district-layer-selected',
      type: 'line',
      source: 'district',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': ['match', ['get', 'id'], district_id, 'red', 'black'],
        'line-width': ['match', ['get', 'id'], district_id, 2.5, 0],
      },
    });

    this.map.addLayer({
      id: 'blocks-layer-selected',
      type: 'line',
      source: 'blocks',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 0,
      },
    });

    // this.map.setPaintProperty('district-layer-selected', 'line-color', [
    //   'match',
    //   ['get', 'id'],
    //   district_id,
    //   'red',
    //   'black',
    // ]);
    // this.map.setPaintProperty('district-layer-selected', 'line-width', [
    //   'match',
    //   ['get', 'id'],
    //   district_id,
    //   2.5,
    //   0.9,
    // ]);

    this.map.on('click', 'blocks-layer', this.onClickBlock);

    this.map.on('sourcedata', () => {
      const features = this.map.querySourceFeatures('blocks', {
        sourceLayer: 'blocks',
      });
      if (this.map.getSource('blocks') && this.map.isSourceLoaded('blocks')) {
        this.dist_name = features[0]?.properties.DIST_NAME;
      }
    });

    this.map.once('idle', () => {
      this.loadBlockData(district_id);
    });
  }

  closeForecast() {
    // this.map.setPaintProperty('blocks-layer', 'fill-color', 'white');
    this.district = true;
    this.blocks = false;
    this.dist_name = null;
    this.map.off('click', 'blocks-layer', this.onClickBlock);
    // this.map.removeLayer('district-fade');
    this.map.removeLayer('district-layer-selected');
    this.map.removeLayer('blocks-layer-selected');
    this.map.removeLayer('blocks-layer');
    this.map.removeLayer('blocks-outline');
    this.map.removeSource('blocks');
    this.map.setPaintProperty('district-layer', 'fill-opacity', 1);

    this.block_forecast_data = null;

    this.map.easeTo({
      center: [84.364277, 20.60871],
      zoom: 5.5,
      duration: 1000,
    });
  }

  // resetMap() {
  //   // this.closeForecast();
  //   this.block_forecast_data = null;
  //   this.district = true;
  //   this.blocks = false;
  //   this.dist_name = null;
  //   // this.map.removeLayer('district-fade');
  //   this.map.removeLayer('district-layer-selected');
  //   this.map.removeLayer('blocks-layer-selected');
  //   this.map.removeLayer('blocks-layer');
  //   this.map.removeLayer('blocks-outline');
  //   this.map.removeSource('blocks');

  //   this.map.addSource('district', {
  //     type: 'geojson',
  //     data: '../../../../../assets/geojson/Odisha_Dist.geojson',
  //   });
  //   this.map.addLayer({
  //     id: 'district-layer',
  //     type: 'fill',
  //     source: 'district',
  //     paint: {
  //       'fill-color': 'white',
  //       'fill-opacity': 0.7,
  //     },
  //   });

  //   this.map.addLayer({
  //     id: 'district-outline',
  //     type: 'line',
  //     source: 'district',
  //     layout: {
  //       'line-cap': 'round',
  //       'line-join': 'round',
  //     },
  //     paint: {
  //       'line-color': '#000',
  //       'line-width': 1,
  //     },
  //   });

  //   this.map.once('idle', () => {
  //     this.updateDates();
  //   });

  //   this.map.easeTo({
  //     center: [84.364277, 20.60871],
  //     zoom: 5.5,
  //     duration: 1500,
  //   });

  //   this.map.on('click', 'district-layer', (e) => {
  //     this.loadBlocks(e.features[0].properties.id);
  //   });
  // }

  setUIBackButtonAction() {
    this.backPriorityBtn = this.platform.backButton.subscribeWithPriority(
      3,
      async () => {
        if (this.map.getSource('blocks')) {
          (await this.loader).dismiss();
          this.closeForecast();
        } else {
          this.navCtrl.pop();
        }
      }
    );

    this.backButton.onClick = (ev) => {
      if (this.map.getSource('blocks')) {
        this.closeForecast();
      } else {
        this.navCtrl.pop();
      }
    };
  }

  loadBlockData(district_id) {
    this.apiService
      .get1daysImdBlockHeatwave(district_id)
      .pipe(take(1))
      .subscribe(async (data) => {
        this.block_data = data;
        console.log(this.block_data);
        this.updateMapBlocksFeature();
      });
  }

  async updateMapBlocksFeature() {
    var matchExpression = null;
    matchExpression = ['match', ['get', 'block_name']];

    const features = this.map.queryRenderedFeatures({
      layers: ['blocks-layer'],
    });

    const unique = [
      ...new Set(features.map((item) => item.properties.block_name)),
    ];
    console.log(unique);

    var f1: any = [];
    f1 = unique;
    if (f1.length != 0) {
      unique.forEach((element) => {
        var newArray: any[] = this.block_data.filter((item) => {
          var extractedStr = item.block_name.replace('\r\n', '');
          return extractedStr == element;
        });

        if (newArray.length != 0) {
          if (this.fab == 'rainfall') {
            if (newArray[0].rainfall == null) {
              console.log('not there');
              matchExpression.push(element, 'black');
            } else {
              let rainfall = newArray[0].rainfall;
              if (rainfall <= 0) matchExpression.push(element, '#D8D8D8');
              else if (rainfall > 0 && rainfall <= 2.4)
                matchExpression.push(element, '#90EE8F');
              else if (rainfall > 2.4 && rainfall <= 7.5)
                matchExpression.push(element, '#008001');
              else if (rainfall > 7.5 && rainfall <= 20.4)
                matchExpression.push(element, '#ADD8E6');
              else if (rainfall > 20.4 && rainfall <= 35.5)
                matchExpression.push(element, '#0000FF');
              else if (rainfall > 35.5 && rainfall <= 64.4)
                matchExpression.push(element, '#FFFF00');
              else if (rainfall > 64.4 && rainfall <= 124.4)
                matchExpression.push(element, '#FFD602');
              else if (rainfall > 124.4 && rainfall <= 150.4)
                matchExpression.push(element, '#FF8C00');
              else if (rainfall > 150.4 && rainfall <= 204.4)
                matchExpression.push(element, '#FF0000');
              else if (rainfall > 204.4)
                matchExpression.push(element, '#8B0000');
            }
          } else if (this.fab == 'tmax') {
            if (newArray[0].temp_max == null) {
              console.log('not there');
              matchExpression.push(element, 'black');
            } else {
              let tmax = newArray[0].temp_max;
              if (tmax <= 10) matchExpression.push(element, '#808080');
              else if (tmax > 10 && tmax <= 14)
                matchExpression.push(element, '#02FFFF');
              else if (tmax > 14 && tmax <= 19)
                matchExpression.push(element, '#0000FF');
              else if (tmax > 19 && tmax <= 24)
                matchExpression.push(element, '#00008B');
              else if (tmax > 24 && tmax <= 29)
                matchExpression.push(element, '#006400');
              else if (tmax > 29 && tmax <= 34)
                matchExpression.push(element, '#90EE8F');
              else if (tmax > 34 && tmax <= 37)
                matchExpression.push(element, '#FFFF00');
              else if (tmax > 37 && tmax <= 40)
                matchExpression.push(element, '#FFD580');
              else if (tmax > 40 && tmax <= 42)
                matchExpression.push(element, '#FFA500');
              else if (tmax > 42 && tmax <= 44)
                matchExpression.push(element, '#F30000');
              else if (tmax > 44) matchExpression.push(element, '#8B0000');
              else matchExpression.push(element, 'white');
            }
          } else if (this.fab == 'tmin') {
            if (newArray[0].temp_min == null) {
              console.log('not there');
              matchExpression.push(element, 'black');
            } else {
              let tmin = newArray[0].temp_min;
              if (tmin <= -6) matchExpression.push(element, '#A5292A');
              else if (tmin > -6 && tmin <= -1)
                matchExpression.push(element, '#8B0000');
              else if (tmin > -1 && tmin <= 4)
                matchExpression.push(element, '#FF0000');
              else if (tmin > 4 && tmin <= 9)
                matchExpression.push(element, '#FFA500');
              else if (tmin > 9 && tmin <= 14)
                matchExpression.push(element, '#FED8B1');
              else if (tmin > 14 && tmin <= 19)
                matchExpression.push(element, '#FFFF00');
              else if (tmin > 19 && tmin <= 24)
                matchExpression.push(element, '#90EE8F');
              else if (tmin > 24 && tmin <= 29)
                matchExpression.push(element, '#008001');
              else if (tmin > 29 && tmin <= 34)
                matchExpression.push(element, '#8367D7');
              else if (tmin > 34) matchExpression.push(element, '#800080');
              else matchExpression.push(element, 'white');
            }
          } else if (this.fab == 'rh') {
            if (newArray[0].humidity == null) {
              console.log('not there');
              matchExpression.push(element, 'black');
            } else {
              let rh = newArray[0].humidity;
              if (rh <= 10) matchExpression.push(element, '#86016A');
              else if (rh > 10 && rh <= 20)
                matchExpression.push(element, '#790DD7');
              else if (rh > 20 && rh <= 30)
                matchExpression.push(element, '#2073A8');
              else if (rh > 30 && rh <= 40)
                matchExpression.push(element, '#307BCA');
              else if (rh > 40 && rh <= 50)
                matchExpression.push(element, '#00CAD4');
              else if (rh > 50 && rh <= 60)
                matchExpression.push(element, '#00C411');
              else if (rh > 60 && rh <= 70)
                matchExpression.push(element, '#8AD305');
              else if (rh > 70 && rh <= 80)
                matchExpression.push(element, '#F7EE0A');
              else if (rh > 80 && rh <= 90)
                matchExpression.push(element, '#E9BB00');
              else if (rh > 90) matchExpression.push(element, '#F30000');
              else matchExpression.push(element, 'white');
            }
          }
        }
      });
      matchExpression.push('black');

      this.map.setPaintProperty('blocks-layer', 'fill-color', matchExpression);
      this.map.setPaintProperty('blocks-layer', 'fill-opacity', 1);
    }
    this.LoadingC = false;

    (await this.loader).dismiss();
  }

  updateMapDistrictFeature() {
    var matchExpression = null;
    matchExpression = ['match', ['get', 'id']];

    // const features = this.map.queryRenderedFeatures({
    //   layers: ['district-layer'],
    // });
    const features = this.map.querySourceFeatures('district', {
      sourceLayer: 'district-layer',
    });
    // if (this.map.getSource('blocks') && this.map.isSourceLoaded('blocks')) {
    //   this.dist_name = features[0]?.properties.DIST_NAME;
    // }

    const unique = [...new Set(features.map((item) => item.properties.id))];
    console.log(unique);

    var fcst: any;
    var f1: any = [];
    f1 = unique;

    if (f1.length != 0) {
      unique.forEach((element) => {
        if (this.fab == 'rainfall') {
          fcst = this.forecast_data[this.date];

          let district_id: any = element;
          console.log('District Id: ' + district_id);

          if (!fcst[district_id]) {
            console.log('not there');
            matchExpression.push(element, 'black');
          } else {
            let rainfall = fcst[district_id].rainfall;
            console.log(
              'District Id: ' + district_id + ' Rainfall: ' + rainfall
            );

            if (rainfall <= 0) matchExpression.push(element, '#D8D8D8');
            else if (rainfall > 0 && rainfall <= 2.4)
              matchExpression.push(element, '#90EE8F');
            else if (rainfall > 2.4 && rainfall <= 7.5)
              matchExpression.push(element, '#008001');
            else if (rainfall > 7.5 && rainfall <= 20.4)
              matchExpression.push(element, '#ADD8E6');
            else if (rainfall > 20.4 && rainfall <= 35.5)
              matchExpression.push(element, '#0000FF');
            else if (rainfall > 35.5 && rainfall <= 64.4)
              matchExpression.push(element, '#FFFF00');
            else if (rainfall > 64.4 && rainfall <= 124.4)
              matchExpression.push(element, '#FFD602');
            else if (rainfall > 124.4 && rainfall <= 150.4)
              matchExpression.push(element, '#FF8C00');
            else if (rainfall > 150.4 && rainfall <= 204.4)
              matchExpression.push(element, '#FF0000');
            else if (rainfall > 204.4) matchExpression.push(element, '#8B0000');
          }
        } else if (this.fab == 'tmax') {
          fcst = this.forecast_data[this.date];

          let district_id: any = element;
          console.log('District Id: ' + district_id);

          if (!fcst[district_id]) {
            console.log('not there');
            matchExpression.push(element, 'black');
          } else {
            let tmax = fcst[district_id].temp_max;
            console.log('District Id: ' + district_id + ' Tmax: ' + tmax);

            if (tmax <= 10) matchExpression.push(element, '#808080');
            else if (tmax > 10 && tmax <= 14)
              matchExpression.push(element, '#02FFFF');
            else if (tmax > 14 && tmax <= 19)
              matchExpression.push(element, '#0000FF');
            else if (tmax > 19 && tmax <= 24)
              matchExpression.push(element, '#00008B');
            else if (tmax > 24 && tmax <= 29)
              matchExpression.push(element, '#006400');
            else if (tmax > 29 && tmax <= 34)
              matchExpression.push(element, '#90EE8F');
            else if (tmax > 34 && tmax <= 37)
              matchExpression.push(element, '#FFFF00');
            else if (tmax > 37 && tmax <= 40)
              matchExpression.push(element, '#FFD580');
            else if (tmax > 40 && tmax <= 42)
              matchExpression.push(element, '#FFA500');
            else if (tmax > 42 && tmax <= 44)
              matchExpression.push(element, '#F30000');
            else if (tmax > 44) matchExpression.push(element, '#8B0000');
            else matchExpression.push(element, 'white');
          }
        } else if (this.fab == 'tmin') {
          fcst = this.forecast_data[this.date];

          let district_id: any = element;
          console.log('District Id: ' + district_id);

          if (!fcst[district_id]) {
            console.log('not there');
            matchExpression.push(element, 'black');
          } else {
            let tmin = fcst[district_id].temp_min;
            console.log('District Id: ' + district_id + ' Tmin: ' + tmin);
            if (tmin <= -6) matchExpression.push(element, '#A5292A');
            else if (tmin > -6 && tmin <= -1)
              matchExpression.push(element, '#8B0000');
            else if (tmin > -1 && tmin <= 4)
              matchExpression.push(element, '#FF0000');
            else if (tmin > 4 && tmin <= 9)
              matchExpression.push(element, '#FFA500');
            else if (tmin > 9 && tmin <= 14)
              matchExpression.push(element, '#FED8B1');
            else if (tmin > 14 && tmin <= 19)
              matchExpression.push(element, '#FFFF00');
            else if (tmin > 19 && tmin <= 24)
              matchExpression.push(element, '#90EE8F');
            else if (tmin > 24 && tmin <= 29)
              matchExpression.push(element, '#008001');
            else if (tmin > 29 && tmin <= 34)
              matchExpression.push(element, '#8367D7');
            else if (tmin > 34) matchExpression.push(element, '#800080');
            else matchExpression.push(element, 'white');
          }
        } else if (this.fab == 'rh') {
          fcst = this.forecast_data[this.date];

          let district_id: any = element;
          console.log('District Id: ' + district_id);

          if (!fcst[district_id]) {
            console.log('not there');
            matchExpression.push(element, 'black');
          } else {
            let rh = fcst[district_id].humidity;
            console.log('District Id: ' + district_id + ' humidity: ' + rh);
            if (rh <= 10) matchExpression.push(element, '#86016A');
            else if (rh > 10 && rh <= 20)
              matchExpression.push(element, '#790DD7');
            else if (rh > 20 && rh <= 30)
              matchExpression.push(element, '#2073A8');
            else if (rh > 30 && rh <= 40)
              matchExpression.push(element, '#307BCA');
            else if (rh > 40 && rh <= 50)
              matchExpression.push(element, '#00CAD4');
            else if (rh > 50 && rh <= 60)
              matchExpression.push(element, '#00C411');
            else if (rh > 60 && rh <= 70)
              matchExpression.push(element, '#8AD305');
            else if (rh > 70 && rh <= 80)
              matchExpression.push(element, '#F7EE0A');
            else if (rh > 80 && rh <= 90)
              matchExpression.push(element, '#E9BB00');
            else if (rh > 90) matchExpression.push(element, '#F30000');
            else matchExpression.push(element, 'white');
          }
        }
      });
      matchExpression.push('black');

      this.map.setPaintProperty(
        'district-layer',
        'fill-color',
        matchExpression
      );
      if (!this.blocks) {
        this.map.setPaintProperty('district-layer', 'fill-opacity', 1);
      } else {
        this.map.setPaintProperty('district-layer', 'fill-opacity', 0.35);
      }
    }
  }

  updateDates() {
    if (this.forecast_data != null) {
      for (var k in this.forecast_data) {
        if (k != this.date) {
          this.date = k;
          console.log(this.date);
        }
        break;
      }

      if (this.fab == 'rainfall') {
        if (this.forecast_data.length != 0) {
          this.date_options = Object.keys(this.forecast_data);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);

          this.updateMapDistrictFeature();

          this.authService.showErrorToast(
            this.translate.instant(
              'Loading next 5 days Rainfall Forecast. Please wait..'
            )
          );
        } else {
          this.date_options = Object.keys(this.date);
          console.log('error');
          this.authService.showErrorToast('Data is not available currently!');
        }
      } else if (this.fab == 'tmax') {
        if (this.forecast_data.length != 0) {
          this.date_options = Object.keys(this.forecast_data);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.authService.showErrorToast(
            this.translate.instant(
              'Loading next 5 days Minimum Tempareture Forecast. Please wait..'
            )
          );
          this.updateMapDistrictFeature();
        }
      } else if (this.fab == 'tmin') {
        if (this.forecast_data.length != 0) {
          this.date_options = Object.keys(this.forecast_data);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.authService.showErrorToast(
            this.translate.instant(
              'Loading next 5 days Maximun Tempareture Forecast. Please wait..'
            )
          );
          this.updateMapDistrictFeature();
        }
      } else if (this.fab == 'rh') {
        if (this.forecast_data.length != 0) {
          this.date_options = Object.keys(this.forecast_data);
          console.log('UpdateDates', 'Set 10 dates: ' + this.date_options);
          this.authService.showErrorToast(
            this.translate.instant(
              'Loading next 5 days Humidity Forecast. Please wait..'
            )
          );
          this.updateMapDistrictFeature();
        } else {
          this.date_options = Object.keys(this.date);
          console.log('error');
          this.authService.showErrorToast(
            this.translate.instant('Data is not available currently!')
          );
        }
      }
      this.date = this.date_options[0];
    }
  }

  fcDateClicked(e) {
    this.date = e.srcElement.innerText;
    console.log(e);
    this.updateMapDistrictFeature();
  }
  updateFAB(fc) {
    this.fab = fc;
    this.map.easeTo({
      center: [84.364277, 20.60871],
      zoom: 5.5,
      duration: 0,
    });

    this.map.once('idle', () => {
      this.updateDates();

      if (this.map.getLayer('blocks-layer')) {
        this.map.easeTo({
          center: this.center[this.current_district - 1],
          zoom: 7.0,
          duration: 100,
        });
        this.updateMapBlocksFeature();
      }
    });
  }

  onClickBlock = (e) => {
    var matchExpression = null;
    var matchExpression2 = null;
    this.block_forecast_data = null;
    matchExpression = ['match', ['get', 'id']];
    matchExpression2 = ['match', ['get', 'id']];
    matchExpression.push(e.features[0].properties.id, '#4c8dff');
    matchExpression2.push(e.features[0].properties.id, 2.5);
    matchExpression.push('black');
    matchExpression2.push(0);

    this.map.setPaintProperty(
      'blocks-layer-selected',
      'line-color',
      matchExpression
    );
    this.map.setPaintProperty(
      'blocks-layer-selected',
      'line-width',
      matchExpression2
    );
    this.block_loading = true;
    this.getImdValueAdditionForBlock(e.features[0].properties.id);
  };

  showHideBackdrop() {
    this.fabState = !this.fabState;
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
      this.updateMapDistrictFeature();
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      let item = this.arr[i];
      this.date = item.innerText;
      this.updateMapDistrictFeature();
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }
    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        let item = this.arr[i];
        this.scrollTo = i;
        this.date = item.innerText;
        this.updateMapDistrictFeature();
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
          this.updateMapDistrictFeature();
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

  convertDate(date): string {
    var newData = date.split('-');

    switch (newData[1]) {
      case '01':
        return 'Jan ' + newData[2];
        break;

      case '02':
        return 'Feb ' + newData[2];
        break;

      case '03':
        return 'Mar ' + newData[2];
        break;

      case '04':
        return 'Apr ' + newData[2];
        break;

      case '05':
        return 'May ' + newData[2];
        break;

      case '06':
        return 'Jun ' + newData[2];
        break;

      case '07':
        return 'Jul ' + newData[2];
        break;

      case '08':
        return 'Aug ' + newData[2];
        break;

      case '09':
        return 'Sep ' + newData[2];
        break;

      case '10':
        return 'Oct ' + newData[2];
        break;

      case '11':
        return 'Nov ' + newData[2];
        break;

      case '12':
        return 'Dec ' + newData[2];
        break;
    }
  }

  ionViewWillLeave() {
    this.backPriorityBtn.unsubscribe();
    this.loadingCtrl.dismiss();
  }
}
