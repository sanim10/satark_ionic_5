import { LightningAdvisoryComponent } from './../lightning-advisory/lightning-advisory.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { forkJoin } from 'rxjs';
import { mapKey } from '../../../../config/key';
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
  public nowcast_data: any;
  public cg_data: any;
  cg_longitude: any = [];
  timeframe: any = [];
  fab_time = 'thirty';
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
    private modalController: ModalController
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
            // this.onClick(e.features[0].properties.SlNo);
          });
          this.loadDta();
          this.loadPolygon();
          this.loadData();
        });
      });
  }

  loadRecentEvents() {
    this.removeMarkers();
    this.apiService.getRecentEventLightning().subscribe((data) => {
      this.recent_event_data = data;
      console.log('recent event data', this.recent_event_data);
      var length = this.recent_event_data.length;
      if (length != 0) {
        for (var i = 0; i < length; i++) {
          let el = document.createElement('div');
          el.classList.add('marker');
          var lati = this.recent_event_data[i].latitude;
          var longi = this.recent_event_data[i].longitude;
          var lightning_ti = this.recent_event_data[i].lightning_time;
          var tframe = this.recent_event_data[i].time_frame;
          this.recent_timeframe.push(tframe);
          this.recent_latitude.push(lati);
          this.recent_longitude.push(longi);
          this.recent_time.push(lightning_ti);
          ////show marker based on time frame
          if (this.recent_timeframe[i] > 1800) {
            var s =
              '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_blue_ic.svg"</ion-img></div>';
            el.innerHTML = s;
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.recent_longitude[i], this.recent_latitude[i]])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(this.recent_time[i])
              )
              .addTo(this.map);

            this.markers.push(marker);
          }
        }
      } else {
        this.authService.showErrorToastTop('No Recent Lightning Activity..');
      }
    });
  }

  loadDta() {
    let flash_type = this.apiService.getNowcastDataLightning();
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
              console.log('mlats', this.latitude); //push lat and long to array
              console.log('mlongs', this.longitude);
              if (this.latitude.length == 5) {
                var triangleCoords = [];
                for (var j = 0; j < this.latitude.length; j++) {
                  triangleCoords.push([this.latitude[j], this.longitude[j]]); //push 5 lat and 5 long to make polygon
                  console.log('coordsssssssssssss', triangleCoords);
                }
                console.log(triangleCoords);

                if (this.map.getLayer('medium-layer') != null) {
                  this.map.removeLayer('medium-layer');
                }

                this.map.addSource('medium', {
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
                  id: 'medium-layer',
                  type: 'fill',
                  source: 'medium',
                  layout: {},
                  paint: {
                    'fill-color': 'blue',
                    'fill-opacity': 0.4,
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
                  triangleCoords.push([this.latitude[j], this.longitude[j]]); //push 5 lat and 5 long to make polygon
                  console.log('coordsssssssssssss', triangleCoords);
                }
                console.log(triangleCoords);

                if (this.map.getLayer('high-layer') != null) {
                  this.map.removeLayer('high-layer');
                }
                this.map.addSource('high', {
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
                  id: 'high-layer',
                  type: 'fill',
                  source: 'high',
                  layout: {},
                  paint: {
                    'fill-color': '#FF0000',
                    'fill-opacity': 1,
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

  loadData() {
    //get data from api and send to map
    this.apiService.getNowcastDataLightning().subscribe(
      (data) => {
        console.log('now data', data);
        this.nowcast_data = data;
        this.cg_data = data['CG'];
        this.updateMap();
      },
      (Error) => {
        this.authService.showErrorToastTop('Network Error.Please try later!');
      }
    );
  }

  updateMap() {
    if (this.nowcast_data != null) {
      if (this.cg_data.length != 0) {
        for (var j = 0; j < this.cg_data.length; j++) {
          var cg_lati = this.cg_data[j].latitude;
          var cg_long = this.cg_data[j].longitude;
          var cg_lightning_time = this.cg_data[j].lightning_time;
          var tframe = this.cg_data[j].time_frame;
          this.cg_latitude.push(cg_lati);
          this.cg_longitude.push(cg_long);
          this.cg_time.push(cg_lightning_time);
          this.timeframe.push(tframe);
        }
        if (this.fab_time == 'thirty') {
          this.removeMarkers();

          console.log('timessss', this.fab_time);
          for (var t = 0; t < this.timeframe.length; t++) {
            let el = document.createElement('div');
            el.classList.add('marker');
            if (this.timeframe[t] >= 1201 && this.timeframe[t] <= 1800) {
              var s =
                '<div style="height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><ion-img src="../../../../../assets/modules/lightning/map/lightning_yellow_ic.svg"</ion-img></div>';
              el.innerHTML = s;
              const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([this.cg_longitude[t], this.cg_latitude[t]])
                .setPopup(
                  new mapboxgl.Popup({
                    closeOnClick: true,
                  }).setHTML(this.cg_time[t])
                )
                .addTo(this.map);

              this.markers.push(marker);
            }
          }
        }
        ///////////////////////////////////////////////////
      } else {
        if (this.lang == 'en') {
          this.authService.showErrorToastTop(
            'No significant lightning or thunderstorm activity.'
          );
        } else {
          this.authService.showErrorToastTop(
            'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ '
          );
        }
      }
    } else {
      if (this.lang == 'en') {
        this.authService.showErrorToastTop(
          'No significant lightning or thunderstorm activity.'
        );
      } else {
        this.authService.showErrorToastTop(
          'କୌଣସି ଉଲ୍ଲେଖନିୟ ବଜ୍ରପାତର କାର୍ଯ୍ୟକଳାପ ନାହିଁ '
        );
      }
    }
  }

  removeMarkers() {
    if (this.markers.length != 0) {
      this.markers.forEach((element) => {
        element.remove();
      });
      this.markers = null;
      this.markers = [];
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
    matchExpression = ['match', ['get', 'SlNo']];

    const features = this.map.queryRenderedFeatures({
      layers: ['block-layer'],
    });

    const unique = [...new Set(features.map((item) => item.properties.SlNo))];
    var f1: any = [];
    f1 = unique;
    if (f1.length != 0 && block.length != 0) {
      f1.forEach((element) => {
        let blk_id = element;

        if (!block[blk_id]) {
          matchExpression.push(element, 'white');
        }
        let ground_value = block[blk_id].ground;

        console.log(
          'block id' + block[blk_id].block_id + 'ground' + ground_value
        );
        if (ground_value >= low && ground_value <= moderate) {
          matchExpression.push(element, 'blue');
        } else if (ground_value >= high) matchExpression.push(element, 'red');
        else matchExpression.push(element, 'white');
      });
      matchExpression.push('white');
      if (this.map.getSource('block') != null && matchExpression) {
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

  updateTimeFAB(fc) {
    this.fab_time = fc;
    if (this.fab_time == 'thirty') {
      this.updateMap();
    } else {
      this.loadRecentEvents();
    }
  }

  refresh() {
    this.loadDta();
    this.loadPolygon();
    this.loadData();
  }

  async openAdv(l) {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: LightningAdvisoryComponent,
    });
    return await modal.present();
  }
}
