import { ApiService } from './../../../../providers/api.service';
import { AuthService } from './../../../../guard/auth.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-flood-map',
  templateUrl: './flood-map.page.html',
  styleUrls: ['./flood-map.page.scss'],
})
export class FloodMapPage implements OnInit, AfterViewInit {
  map;
  lang;
  danger_lvl: any = [];
  loc_name: any = [];
  loc_name_ory: any = [];
  obs_date: any = [];
  latitude: any = [];
  longitude: any = [];
  warning_lvl: any = [];
  cur_lvl: any = [];
  public marker: any = [];

  public result_data: any = [];
  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.lang = localStorage.getItem('language');
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
          this.map.addSource('india', {
            type: 'geojson',
            data: '../../../../../assets/geojson/India_Map.geojson',
          });
          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();

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

          this.map.addSource('mahanadi', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Mahanadi.geojson',
          });

          this.map.addLayer({
            id: 'Mahanadi-layer',
            type: 'line',
            source: 'mahanadi',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#000',
              'line-width': 0.5,
            },
          });
        });
        this.loadData();
      });
  }

  loadData() {
    this.apiService.getWaterlevelForMap().subscribe(
      (data) => {
        this.result_data = data;
        console.log('result_data', this.result_data);
        this.pointMarkers();
      },
      (Error) => {
        this.authService.showErrorToast('Network Error.Please try later!');
      }
    );
  }

  pointMarkers() {
    if (this.result_data != null) {
      for (var i = 0; i < this.result_data.length; i++) {
        var location_name = this.result_data[i].location_name;
        var location_name_ory = this.result_data[i].location_name_ory;
        var dngr_lvl = this.result_data[i].danger_lvl;
        var warng_lvl = this.result_data[i].warning_lvl;
        var current_lvl = this.result_data[i].value;
        var date = this.result_data[i].observed_date;
        var lat = this.result_data[i].latitude;
        var long = this.result_data[i].longitude;
        this.loc_name.push(location_name);
        this.loc_name_ory.push(location_name_ory);
        this.danger_lvl.push(dngr_lvl);
        this.warning_lvl.push(warng_lvl);
        this.cur_lvl.push(current_lvl);
        this.obs_date.push(date);
        this.latitude.push(lat);
        this.longitude.push(long);
      }
      let el = document.createElement('div');
      el.classList.add('marker');

      setTimeout(() => {
        for (var j = 0; j < this.result_data.length; j++) {
          let el = document.createElement('div');
          el.classList.add('marker');

          var s =
            '<div style="background:#0066A6; border-radius:100%; color:white; height:30px;width:30px;display:flex;align-items:center;justify-content:center;border: 2px solid white"> <ion-icon src="../../../../../assets/modules/flood/reservoir_ic.svg" style="transform:scale(1.8)"></ion-icon></div>';
          el.innerHTML = s;

          if (this.warning_lvl[j] == null && this.danger_lvl[j] == null) {
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.longitude[j], this.latitude[j]])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(
                  `<div>
                  <ion-grid class="ion-no-padding">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ">` +
                    (this.lang == 'en'
                      ? this.loc_name[j]
                      : this.loc_name_ory[j]) +
                    `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   
                    <ion-row class="ion-no-padding">
                      <ion-col class="ion-no-padding">
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding  ">
                                <p style="margin-top: 5px;font-size:1.01rem">` +
                    (this.lang == 'en'
                      ? `Current Water Level`
                      : `ବର୍ତମାନ ର ଜଳସ୍ତର`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    this.cur_lvl[j] +
                    ` m</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en'
                      ? `Warning Level`
                      : `ଜଳସ୍ଥର ଚେତାବନୀ ସଂକେତ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">
                                    ` +
                    `NA` +
                    `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en' ? `Danger Level` : `ଜଳସ୍ଥର ବିପଦ ସଂକେତ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                              <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    `NA` +
                    `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en' ? `Observed Date` : `ତଦାରଖର ଦିନ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    this.obs_date[j] +
                    `</p></ion-col>
                        </ion-row>

                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>`
                )
              )
              .addTo(this.map);
            this.marker.push(marker);
          } else {
            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.longitude[j], this.latitude[j]])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(
                  `<div>
                  <ion-grid class="ion-no-padding">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem;">` +
                    (this.lang == 'en'
                      ? this.loc_name[j]
                      : this.loc_name_ory[j]) +
                    `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   
                    <ion-row class="ion-no-padding">
                      <ion-col class="ion-no-padding">
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding  ">
                                <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en'
                      ? `Current Water Level`
                      : `ବର୍ତମାନ ର ଜଳସ୍ତର`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    this.cur_lvl[j] +
                    ` m</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en'
                      ? `Warning Level`
                      : `ଜଳସ୍ଥର ଚେତାବନୀ ସଂକେତ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">
                                    ` +
                    (this.warning_lvl[j] != null
                      ? this.warning_lvl[j] + ' m'
                      : `NA`) +
                    `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en' ? `Danger Level` : `ଜଳସ୍ଥର ବିପଦ ସଂକେତ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                              <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    this.danger_lvl[j] +
                    ` m</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
                    (this.lang == 'en' ? `Observed Date` : `ତଦାରଖର ଦିନ`) +
                    `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#0066A6 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
                    this.obs_date[j] +
                    `</p></ion-col>
                        </ion-row>

                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>`
                )
              )
              .addTo(this.map);
            this.marker.push(marker);
          }
        }
      }, 0);
    }
  }
}
