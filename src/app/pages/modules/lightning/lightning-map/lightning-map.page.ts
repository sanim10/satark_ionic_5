import { map, take } from 'rxjs/operators';
import { LightningAdvisoryComponent } from './../lightning-advisory/lightning-advisory.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { forkJoin } from 'rxjs';
import { mapKey } from '../../../../config/key';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-lightning-map',
  templateUrl: './lightning-map.page.html',
  styleUrls: ['./lightning-map.page.scss'],
})
export class LightningMapPage implements OnInit, AfterViewInit {
  fabState = false;
  lang;
  map;
  public result_data: any;
  public polygon_data: any;
  public flash_data: any;
  public advisory_data: any;
  public low_value: any;
  public moderate_value: any;
  public high_value: any;
  public m_points_data: any;
  severity_data: string;
  latitude: any = [];
  longitude: any = [];
  severity: any = [];
  cg_time: any = [];
  cg_latitude: any = [];
  cg_longitude: any = [];
  cc_time: any = [];
  cc_latitude: any = [];
  cc_longitude: any = [];

  public nowcast_data: any;
  public five_mins_data: any;
  public thirty_mins_data: any;
  public one_hour_data: any;
  public cg_data: any;
  public cc_data: any;
  timeframe: any = [];
  timeframe2: any = [];
  fab_time = 'five';
  markers_cg = [];
  markers_cc = [];
  markers = [];
  public recent_event_data: any;
  recent_time: any = [];
  recent_latitude: any = [];
  recent_longitude: any = [];
  recent_timeframe: any = [];
  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private apiService: ApiService,
    private httpClient: HttpClient,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {}
  showHideBackdrop() {
    this.fabState = !this.fabState;
  }
  ngAfterViewInit(): void {
    this.mapIt();
  }

  mapIt() {
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
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
              'fill-opacity': 0.9,
              'fill-outline-color': '#5A5A5A',
            },
          });

          this.map.addLayer({
            id: 'block-layer-names',
            type: 'symbol',
            source: 'block',
            layout: {
              'text-field': ['get', 'Block'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
              'text-size': 12,
            },
            paint: {
              'text-color': '#383838',
            },
          });

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
          });

          this.map.once('idle', () => {
            this.loadDta();
            this.loadPolygon();
            this.updateMap5Mins();
            loadingEl.dismiss();
          });
        });
      });
  }

  loadDta() {
    let flash_type = this.apiService.getNowcastDataLightning30Mins();
    forkJoin([flash_type]).subscribe((results) => {
      this.result_data = results[0];
      this.flash_data = this.result_data['flash'];
      this.low_value = this.result_data['low'];
      this.moderate_value = this.result_data['moderate'];
      this.high_value = this.result_data['high'];
      console.log('high', this.high_value);
      console.log('low', this.low_value);
      console.log('moderate', this.moderate_value);
      console.log('flash data', this.flash_data);
      if (this.result_data.length != 0) {
        if (this.flash_data != null) {
          this.updateFeature();
        } else {
          this.authService.showErrorToastTop(
            'No Lightning activity currently!'
          );
        }
      } else {
        console.log('error');
        this.authService.showErrorToastTop('Data is not available currently!');
      }
    });
  }

  //load polygon data from earthnet api
  loadPolygon() {
    console.log('load polygon');
    this.apiService.getLxAlerts().subscribe((data) => {
      console.log(data);

      this.polygon_data = data;
      console.log('poly data', this.polygon_data);
      // this.loading.dismiss();
      if (this.polygon_data.length != 0 || this.polygon_data == null) {
        console.log('poly data length', this.polygon_data.length);
        for (var q = 0; q < this.polygon_data.length; q++) {
          this.m_points_data = this.polygon_data[q].Location._geometry.m_points;
          this.severity_data = this.polygon_data[q].Severity;
          console.log('severity', this.severity_data);
          ///if severity is medium polygon is blue and if high its red
          if (this.severity_data == 'Medium') {
            this.m_points_data =
              this.polygon_data[q].Location._geometry.m_points;
            console.log('m_pointssssssss', this.m_points_data);
            for (var i = 0; i < this.m_points_data.length; i++) {
              var lat = this.m_points_data[i].x;
              var long = this.m_points_data[i].y;
              this.latitude.push(lat);
              this.longitude.push(long);
              // console.log('mlats', this.latitude); //push lat and long to array
              // console.log('mlongs', this.longitude);
              if (this.latitude.length == 5) {
                var triangleCoords = [];
                for (var j = 0; j < this.latitude.length; j++) {
                  triangleCoords.push([this.longitude[j], this.latitude[j]]); //push 5 lat and 5 long to make polygon
                  // console.log('coordsssssssssssss', triangleCoords);
                }
                // console.log(triangleCoords);

                if (this.map.getLayer('medium-layer' + q + j) != null) {
                  this.map.removeLayer('medium-layer' + q + j);
                }
                if (this.map.getLayer('medium-layer-outline' + q + j) != null) {
                  this.map.removeLayer('medium-layer-outline' + q + j);
                }
                if (this.map.getSource('medium' + q + j) != null) {
                  this.map.removeSource('medium' + q + j);
                }
                this.map.addSource('medium' + q + j, {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [triangleCoords],
                    },
                  },
                });
                this.map.addLayer({
                  id: 'medium-layer' + q + j,
                  type: 'fill',
                  source: 'medium' + q + j,
                  layout: {},
                  paint: {
                    'fill-color': 'blue',
                    'fill-opacity': 0.4,
                  },
                });
                this.map.addLayer({
                  id: 'medium-layer-outline' + q + j,
                  type: 'line',
                  source: 'medium' + q + j,
                  layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                  },
                  paint: {
                    'line-color': 'blue',
                    'line-width': 1,
                  },
                });
                this.latitude = [];
                this.longitude = [];
                console.log('end of medium');
              }
            }
          } else if (this.severity_data == 'High') {
            this.m_points_data =
              this.polygon_data[q].Location._geometry.m_points;
            console.log('m_pointssssssss', this.m_points_data);
            for (var i = 0; i < this.m_points_data.length; i++) {
              var lat = this.m_points_data[i].x;
              var long = this.m_points_data[i].y;
              this.latitude.push(lat);
              this.longitude.push(long);
              console.log('mlats', this.latitude); //push lat and long to array
              console.log('mlongs', this.longitude);
              if (this.latitude.length == 5) {
                var triangleCoords = [];

                for (var j = 0; j < this.latitude.length; j++) {
                  triangleCoords.push([this.longitude[j], this.latitude[j]]); //push 5 lat and 5 long to make polygon
                  // console.log('coordsssssssssssss', triangleCoords);
                }
                // console.log(triangleCoords);

                if (this.map.getLayer('high-layer' + q + j) != null) {
                  this.map.removeLayer('high-layer' + q + j);
                }
                if (this.map.getLayer('high-layer-outline' + q + j) != null) {
                  this.map.removeLayer('high-layer-outline' + q + j);
                }
                if (this.map.getSource('high' + q + j) != null) {
                  this.map.removeSource('high' + q + j);
                }
                this.map.addSource('high' + q + j, {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    geometry: {
                      type: 'Polygon',
                      coordinates: [triangleCoords],
                    },
                  },
                });
                this.map.addLayer({
                  id: 'high-layer' + q + j,
                  type: 'fill',
                  source: 'high' + q + j,
                  layout: {},
                  paint: {
                    'fill-color': '#FF0000',
                    'fill-opacity': 0.5,
                  },
                });
                this.map.addLayer({
                  id: 'high-layer-outline' + q + j,
                  type: 'line',
                  source: 'high' + q + j,
                  layout: {
                    'line-cap': 'round',
                    'line-join': 'round',
                  },
                  paint: {
                    'line-color': '#FF0000',
                    'line-width': 1,
                  },
                });

                this.latitude = [];
                this.longitude = [];
                console.log('end of high');
              }
            }
          } else if (this.severity == 'Low') {
            console.log('do nothing for low');
          }
        }
      } else {
        this.authService.showErrorToastTop('No significant DTA');
      }
    });
  }

  updateMap5Mins() {
    this.apiService
      .getNowcastDataLightning5Mins()
      .pipe(take(1))
      .subscribe((data) => {
        this.five_mins_data = data;
        if (this.five_mins_data.length != 0) {
          console.log('now data 5mins', data);
          this.cg_data = data['CG'];
          this.cc_data = data['CC'];

          this.cg_data.forEach((cg) => {
            var cg_lati = cg.latitude;
            var cg_long = cg.longitude;
            var cg_lightning_time = cg.lightning_time;
            var tframe = cg.time_frame;
            this.cg_latitude.push(cg_lati);
            this.cg_longitude.push(cg_long);
            this.cg_time.push(cg_lightning_time);
            this.timeframe.push(tframe);

            let el = document.createElement('div');
            el.classList.add('marker');

            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_yellow_ic.svg" style="transform:scale(1.2)"></ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([cg.longitude, cg.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                })
                  .setLngLat(this.map.getCenter())
                  .setHTML(
                    `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CG : </span>` +
                      cg.lightning_time +
                      `</P>`
                  )
              )
              .addTo(this.map);

            this.markers_cg.push(marker);
          });

          this.cc_data.forEach((cc) => {
            var cc_lati = cc.latitude;
            var cc_long = cc.longitude;
            var cc_lightning_time = cc.lightning_time;
            var tframe = cc.time_frame;
            this.cc_latitude.push(cc_lati);
            this.cc_longitude.push(cc_long);
            this.cc_time.push(cc_lightning_time);
            this.timeframe.push(tframe);

            let el = document.createElement('div');
            el.classList.add('marker');

            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_blue_ic.svg"></ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([cc.longitude, cc.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                })
                  .setLngLat(this.map.getCenter())
                  .setHTML(
                    `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CC : </span>` +
                      cc.lightning_time +
                      `</P>`
                  )
              )
              .addTo(this.map);

            this.markers_cc.push(marker);
          });

          if (this.cc_data.length == 0 && this.cg_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CC & CG)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CC & CG)'
                );
          } else if (this.cc_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CC)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
                );
          } else if (this.cg_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CG)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
                );
          }
        }
      });
  }

  updateMap30Mins() {
    this.apiService
      .getNowcastDataLightning30Mins()
      .pipe(take(1))
      .subscribe((data) => {
        this.thirty_mins_data = data;
        if (this.thirty_mins_data.length != 0) {
          console.log('now data 30mins', data);
          this.cg_data = data['CG'];
          this.cc_data = data['CC'];

          this.cg_data.forEach((cg) => {
            var cg_lati = cg.latitude;
            var cg_long = cg.longitude;
            var cg_lightning_time = cg.lightning_time;
            var tframe = cg.time_frame;
            this.cg_latitude.push(cg_lati);
            this.cg_longitude.push(cg_long);
            this.cg_time.push(cg_lightning_time);
            this.timeframe.push(tframe);

            let el = document.createElement('div');
            el.classList.add('marker');

            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_yellow_ic.svg" style="transform:scale(1.2)"></ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([cg.longitude, cg.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                })
                  .setLngLat(this.map.getCenter())
                  .setHTML(
                    `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CG : </span>` +
                      cg.lightning_time +
                      `</P>`
                  )
              )
              .addTo(this.map);

            this.markers_cg.push(marker);
          });

          this.cc_data.forEach((cc) => {
            var cc_lati = cc.latitude;
            var cc_long = cc.longitude;
            var cc_lightning_time = cc.lightning_time;
            var tframe = cc.time_frame;
            this.cc_latitude.push(cc_lati);
            this.cc_longitude.push(cc_long);
            this.cc_time.push(cc_lightning_time);
            this.timeframe.push(tframe);

            let el = document.createElement('div');
            el.classList.add('marker');

            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_blue_ic.svg"></ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([cc.longitude, cc.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                })
                  .setLngLat(this.map.getCenter())
                  .setHTML(
                    `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CC : </span>` +
                      cc.lightning_time +
                      `</P>`
                  )
              )
              .addTo(this.map);

            this.markers_cc.push(marker);
          });

          if (this.cc_data.length == 0 && this.cg_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CC & CG)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CC & CG)'
                );
          } else if (this.cc_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CC)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
                );
          } else if (this.cg_data.length == 0) {
            this.lang == 'en'
              ? this.authService.showErrorToastTop(
                  'No significant lightning or thunderstorm activity (CG)'
                )
              : this.authService.showErrorToastTop(
                  'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
                );
          }
        }
      });
  }

  updateMap1Hour() {
    this.apiService
      .getNowcastDataLightning1Hour()
      .pipe(take(1))
      .subscribe((data) => {
        this.one_hour_data = data;
        console.log('now data 1hour', data);
        if (this.one_hour_data.length != 0) {
          console.log('now data 1hour', data);
          this.cg_data = data['CG'];
          this.cc_data = data['CC'];

          this.cg_data.forEach((cg) => {
            var cg_lati = cg.latitude;
            var cg_long = cg.longitude;
            var cg_lightning_time = cg.lightning_time;
            var tframe = cg.time_frame;
            this.cg_latitude.push(cg_lati);
            this.cg_longitude.push(cg_long);
            this.cg_time.push(cg_lightning_time);
            this.timeframe.push(tframe);

            let el = document.createElement('div');
            el.classList.add('marker');

            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_yellow_ic.svg" style="transform:scale(1.2)"></ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([cg.longitude, cg.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                })
                  .setLngLat(this.map.getCenter())
                  .setHTML(
                    `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CG : </span>` +
                      cg.lightning_time +
                      `</P>`
                  )
              )
              .addTo(this.map);

            this.markers_cg.push(marker);
          });
        }

        this.cc_data.forEach((cc) => {
          var cc_lati = cc.latitude;
          var cc_long = cc.longitude;
          var cc_lightning_time = cc.lightning_time;
          var tframe = cc.time_frame;
          this.cc_latitude.push(cc_lati);
          this.cc_longitude.push(cc_long);
          this.cc_time.push(cc_lightning_time);
          this.timeframe.push(tframe);

          let el = document.createElement('div');
          el.classList.add('marker');

          var s =
            '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_blue_ic.svg"></ion-img></div>';
          el.innerHTML = s;
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([cc.longitude, cc.latitude])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              })
                .setLngLat(this.map.getCenter())
                .setHTML(
                  `<P style="font-size:13px;text-align:center;width:100%"><span style="font-weight:bold">CC : </span>` +
                    cc.lightning_time +
                    `</P>`
                )
            )
            .addTo(this.map);

          this.markers_cc.push(marker);
        });

        if (this.cc_data.length == 0 && this.cg_data.length == 0) {
          this.lang == 'en'
            ? this.authService.showErrorToastTop(
                'No significant lightning or thunderstorm activity (CC & CG)'
              )
            : this.authService.showErrorToastTop(
                'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CC & CG)'
              );
        } else if (this.cc_data.length == 0) {
          this.lang == 'en'
            ? this.authService.showErrorToastTop(
                'No significant lightning or thunderstorm activity (CC)'
              )
            : this.authService.showErrorToastTop(
                'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
              );
        } else if (this.cg_data.length == 0) {
          this.lang == 'en'
            ? this.authService.showErrorToastTop(
                'No significant lightning or thunderstorm activity (CG)'
              )
            : this.authService.showErrorToastTop(
                'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ  (CG)'
              );
        }
      });
  }

  removeMarkers() {
    if (this.markers.length != 0) {
      this.markers.forEach((element) => {
        element.remove();
      });
      this.markers = null;
      this.markers = [];
    }
    if (this.markers_cc.length != 0) {
      this.markers_cc.forEach((element) => {
        element.remove();
      });
      this.markers_cc = null;
      this.markers_cc = [];
    }
    if (this.markers_cg.length != 0) {
      this.markers_cg.forEach((element) => {
        element.remove();
      });
      this.markers_cg = null;
      this.markers_cg = [];
    }
  }

  //color blocks based on the flash intensity
  updateFeature() {
    var block: any;
    var low: any;
    var high: any;
    var moderate: any;
    block = this.flash_data;
    low = this.low_value;
    high = this.high_value;

    moderate = this.moderate_value;
    console.log('map block', block);
    var matchExpression = null;
    matchExpression = ['match', ['get', 'Id']];

    const features = this.map.queryRenderedFeatures({
      layers: ['block-layer'],
    });

    const unique = [...new Set(features.map((item) => item.properties.Id))];
    var f1;
    f1 = unique;

    if (f1.length != 0 && block.length != 0) {
      f1.forEach((element) => {
        let blk_id = element;
        if (block[blk_id] == null) {
          return;
        }
        let ground_value = block[blk_id].ground;
        let cloud_value = block[blk_id].cloud;
        console.log(
          'block id' +
            block[blk_id].block_id +
            'ground' +
            ground_value +
            'cloud' +
            cloud_value
        );
        if (cloud_value == 1 && ground_value == 0) {
          // fillColor= '#D2B48C';
          matchExpression.push(element, '#D2B48C');
        } else if ((cloud_value > 1 && cloud_value <= 5) || ground_value == 1) {
          // fillColor = '#CD853F';
          matchExpression.push(element, '#CD853F');
        } else if ((cloud_value > 5 && cloud_value <= 5) || ground_value >= 2) {
          // fillColor = '#A0522D';
          matchExpression.push(element, '#A0522D');
        } else {
          //fillColor = 'rgba(255, 255, 255, 0.2)';
          matchExpression.push(element, 'rgba(255, 255, 255, 0.2)');
        }
      });
      matchExpression.push('white');
      console.log(matchExpression);

      this.map.setPaintProperty('block-layer', 'fill-color', matchExpression);

      // if (this.map.getLayer('block-layer-two') != null) {
      //   this.map.removeLayer('block-layer-two');
      // }
      // if (this.map.getSource('block') != null && matchExpression) {
      //   this.map.addLayer({
      //     id: 'block-layer-two',
      //     type: 'fill',
      //     source: 'block',
      //     paint: {
      //       'fill-color': matchExpression,
      //       'fill-opacity': 0.5,
      //     },
      //   });
      // }
    }
  }

  updateTimeFAB(fc) {
    this.fab_time = fc;
    if (this.fab_time == 'five') {
      this.removeMarkers();
      this.updateMap5Mins();
    } else if (this.fab_time == 'thirty') {
      this.removeMarkers();
      // this.updateMap();
      this.updateMap30Mins();
    } else {
      // this.loadRecentEvents();

      this.removeMarkers();
      this.updateMap1Hour();
    }
  }

  refresh() {
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        mode: 'ios',
        duration: 10000,
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.map.setPaintProperty('block-layer', 'fill-color', 'white');
        this.removeMarkers();
        this.loadDta();
        this.loadPolygon();
        this.updateMap5Mins();
        this.fab_time = 'five';
        loadingEl.dismiss();
      });
  }

  async openAdv(l) {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: LightningAdvisoryComponent,
    });
    return await modal.present();
  }

  ionViewWillLeave() {
    this.loadingCtrl.dismiss();
  }
}
