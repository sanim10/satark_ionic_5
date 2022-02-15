import { element } from 'protractor';
import { OceanOverviewDetailsComponent } from './ocean-overview-details/ocean-overview-details.component';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../guard/auth.service';
import { ApiService } from './../../../providers/api.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  LoadingController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { mapKey } from '../../../config/key';

@Component({
  selector: 'app-ocean',
  templateUrl: './ocean.page.html',
  styleUrls: ['./ocean.page.scss'],
})
export class OceanPage implements OnInit, AfterViewInit {
  @ViewChild('selected_date') selected_date;

  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  fabState = false;
  buttons;
  map;
  marker: any = [];
  lang;
  date_options;
  date;
  fab_value;
  arr;
  run = false;
  wave = false;
  timeout;
  current = 0;

  wind = false;
  swell = false;
  overview = true;
  public ocean_station_data: any;
  public wave_data: any;
  public wind_data: any;
  public swell_data: any;
  public overview_data: any;
  date_2 = null;
  date_3 = null;
  time = '02:30';
  time_options = [
    '02:30',
    '05:30',
    '08:30',
    '11:30',
    '14:30',
    '17:30',
    '20:30',
    '23:30',
  ];
  scrollTo = 0;
  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private authService: AuthService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) {
    this.lang = localStorage.getItem('language');
    let today = moment().format('YYYY-MM-DD');
    let today_2 = moment(today).add(1, 'days').format('YYYY-MM-DD');
    let today_3 = moment(today).add(2, 'days').format('YYYY-MM-DD');
    this.date_options = [today, today_2, today_3];
    this.date = today;
    let default_date = moment(this.date).format('YYYYMMDD');
    // this.getOverviewData();
  }

  showSliderValue() {}
  ngOnInit() {}

  ngAfterViewInit(): void {
    this.mapIt();
  }

  showDateSelector = async () => {
    this.buttons = [
      {
        text: this.lang == 'en' ? 'Cancel' : 'ବାତିଲ କରନ୍ତୁ',
        role: 'cancel',
      },
    ];

    this.date_options.forEach((element) => {
      var tmpButton = {
        text: element,
        handler: () => {
          console.log();
          this.date = element;
          let new_date = moment(this.date).format('YYYYMMDD');
          console.log('new date', new_date);
          if (this.fab_value == 'wave') {
            this.getWaveDataAllStation(new_date);
          } else if (this.fab_value == 'wind') {
            this.getWindDataAllStation(new_date);
          } else if (this.fab_value == 'swell') {
            this.getSwellDataAllStation(new_date);
          }
        },
      };

      this.buttons.push(tmpButton);
    });

    (
      await this.actionSheetController.create({ buttons: this.buttons })
    ).present();
  };

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
          zoom: 5.5,
        });
        this.map.on('load', () => {
          this.map.addSource('block', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
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
          this.map.addLayer({
            id: 'block-outline',
            type: 'line',
            source: 'block',
            paint: {
              'line-color': 'black',
              'line-width': 1,
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
              'line-color': '#000',
              'line-width': 1,
            },
          });
          this.getOverviewData();
        });
      });
  }

  //get overview
  getOverviewData() {
    this.removeMarkers();

    this.apiService
      .getAllOceanStations()
      .pipe(take(1))
      .subscribe((data) => {
        console.log('all stations..', data);
        this.ocean_station_data = data;

        for (var t = 0; t < this.ocean_station_data.length; t++) {
          let el = document.createElement('div');
          el.classList.add('marker');

          // var s =
          //   '<div  id="' +
          //   this.ocean_station_data[t].id +
          //   '"style="background:radial-gradient(circle,#0771B8 40%, #4BC7CF 100%); border-radius:100%; color:#000; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; border: 0px solid white;"><div style="text-align:center; font-weight:400;line-height:10px;margin-top:4px;">' +
          //   this.ocean_station_data[t].location +
          //   '</div></div>';

          var s =
            '<div id="' +
            this.ocean_station_data[t].id +
            '" style="background:radial-gradient(circle,#7ABFFF 20%, #004CBF 100%); border-radius:100%; color:#black; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; text-align:center;font-size:8px;">' +
            this.ocean_station_data[t].location +
            '</div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([
              this.ocean_station_data[t].long,
              this.ocean_station_data[t].lat,
            ])
            .addTo(this.map);
          let dis = this;
          marker.getElement().addEventListener('click', function (e) {
            e.stopPropagation();
            console.log(e.target.id);
            dis.openFavLoc(e.target.id);
          });
          this.marker.push(marker);
        }
      });
  }

  ///fetch wave data for all station
  getWaveDataAllStation(newdate: any) {
    this.removeMarkers();

    let params = {
      date: newdate,
    };
    console.log(newdate);
    this.apiService.getWaveAllStations(params).subscribe((data) => {
      console.log('wave data..', data);
      this.wave_data = data;
      let selected_time = this.time;
      console.log('selected time..', this.time);
      let selected_date_time = this.date + ' ' + this.time + ':00';
      console.log('new date time..', selected_date_time);
      this.setWaveData();
    });
  }

  //fetch swell data for all station
  getSwellDataAllStation(newdate: any) {
    this.removeMarkers();

    let params = {
      date: newdate,
    };
    this.apiService.getSwellAllStations(params).subscribe((data) => {
      this.swell_data = data;
      console.log('swell data..', this.swell_data);
      this.setSwellData();
    });
  }

  //fetch wind data for all station
  getWindDataAllStation(newdate: any) {
    this.removeMarkers();

    let params = {
      date: newdate,
    };
    this.apiService.getWindAllStations(params).subscribe((data) => {
      this.wind_data = data;
      console.log('wind data..', this.wind_data);
      this.setWindData();
    });
  }

  ////show all stations
  getAllStation() {
    this.removeMarkers();

    this.apiService.getAllOceanStations().subscribe((data) => {
      console.log('all stations..', data);
      this.ocean_station_data = data;
      for (var t = 0; t < this.ocean_station_data.length; t++) {
        let el = document.createElement('div');
        el.classList.add('marker');
        var contentString =
          ` <div>
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding">
                      <ion-col class="ion-no-padding">
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding  ">
                                <p style="margin-top: 5px;font-size:1.01rem;">` +
          (this.lang == 'en' ? `Point` : ``) +
          `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:var(--ion-color-primary) !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
          this.ocean_station_data[t].location +
          `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
          (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
          `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:var(--ion-color-primary) !important">
                                <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">
                                    ` +
          this.ocean_station_data[t].district_name +
          `m<sup>3</sup>/s
                                    </p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="8" class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem;">` +
          (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
          `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:var(--ion-color-primary) !important">
                              <p style="margin-top: 5px;font-size:1.01rem;font-weight:500">` +
          this.ocean_station_data[t].block_name +
          `</p>
                              </ion-col>
                        </ion-row>
                  </ion-grid>
                </div>`;
        var s =
          '<div style="background:var(--ion-color-primary); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"></div>';
        el.innerHTML = s;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([
            this.ocean_station_data[t].long,
            this.ocean_station_data[t].lat,
          ])
          .setPopup(
            new mapboxgl.Popup({
              closeOnClick: true,
            }).setHTML(contentString)
          )
          .addTo(this.map);

        this.marker.push(marker);
      }
    });
  }

  showHideBackdrop() {
    this.fabState = !this.fabState;
  }

  input(e) {
    console.log(e);
    var bulletPosition = e / 9;
    document.getElementById('rslabel').style.left = bulletPosition * 91 + '%';
  }

  removeMarkers() {
    if (this.marker.length != 0) {
      this.marker.forEach((element) => {
        element.remove();
      });
      this.marker = null;
      this.marker = [];
    }
  }

  async openFavLoc(id: any) {
    console.log(id);
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: OceanOverviewDetailsComponent,
      componentProps: { station_id: id },
    });
    return await modal.present();
  }

  updateFAB(fc) {
    this.fab_value = fc;
    console.log('fab is..', this.fab_value);
    let new_date = moment(this.date).format('YYYYMMDD');
    console.log('new date', new_date);
    if (this.fab_value == 'wave') {
      this.getWaveDataAllStation(new_date);
      this.wave = true;
      this.swell = false;
      this.wind = false;
      this.overview = false;
    } else if (this.fab_value == 'wind') {
      this.getWindDataAllStation(new_date);
      this.wave = false;
      this.swell = false;
      this.wind = true;
      this.overview = false;
    } else if (this.fab_value == 'swell') {
      this.getSwellDataAllStation(new_date);
      this.wave = false;
      this.swell = true;
      this.wind = false;
      this.overview = false;
    } else if (this.fab_value == 'overview') {
      this.wave = false;
      this.swell = false;
      this.wind = false;
      this.overview = true;
      this.getOverviewData();
    }
  }

  //on Date item clicked
  fcTimeClicked(event) {
    this.time = event.srcElement.innerText;
    console.log(this.time);
    this.removeMarkers();

    switch (this.fab_value) {
      case 'wind':
        this.setWindData();
        break;
      case 'wave':
        this.setWaveData();
        break;
      case 'swell':
        this.setSwellData();
        break;
    }
  }

  selector() {
    this.removeMarkers();
    switch (this.fab_value) {
      case 'wind':
        this.setWindData();
        break;
      case 'wave':
        this.setWaveData();
        break;
      case 'swell':
        this.setSwellData();
        break;
    }
  }

  setWindData() {
    if (this.wind_data.length != 0) {
      let selected_date_time = this.date + ' ' + this.time + ':00';
      for (var i = 0; i < this.wind_data.length; i++) {
        let el = document.createElement('div');
        el.classList.add('marker');

        if (selected_date_time == this.wind_data[i].forecast_time) {
          console.log(
            'station id' +
              this.wind_data[i].station_name +
              'value..' +
              this.wind_data[i].value
          );
          if (
            this.wind_data[i].value >= 0.0 &&
            this.wind_data[i].value < 19.8
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wind_data[i].location
                : this.wind_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#32CD33 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].district_name
                : this.wind_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#32CD33 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].block_name
                : this.wind_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Wind Speed(Km/hr)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#32CD33">Calm-Gentle Breeze</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;
            var s =
              '<div style="background:radial-gradient(circle,#32CD33 40%, rgba(17, 166, 17, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wind_data[i].long, this.wind_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (
            this.wind_data[i].value >= 19.8 &&
            this.wind_data[i].value < 50.0
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wind_data[i].location
                : this.wind_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#E5C100 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].district_name
                : this.wind_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#E5C100 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].block_name
                : this.wind_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Wind Speed(Km/hr)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#E5C100">Moderate Breeze - Strong Breeze</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;
            var s =
              '<div style="background:radial-gradient(circle,rgb(255 223 0) 40%, rgba(163, 145, 19, 1) 100%);  border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wind_data[i].long, this.wind_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (
            this.wind_data[i].value >= 50.0 &&
            this.wind_data[i].value < 74.5
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wind_data[i].location
                : this.wind_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#DA2A2A !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].district_name
                : this.wind_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#DA2A2A !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].block_name
                : this.wind_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Wind Speed(Km/hr)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#DA2A2A">Strong Gale - Hurricane Force</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;
            var s =
              '<div style="background:radial-gradient(circle,rgba(248, 104, 104, 1) 40%, rgba(218, 42, 42, 1); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wind_data[i].long, this.wind_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (this.wind_data[i].value >= 74.5) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wind_data[i].location
                : this.wind_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#FAAB70 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].district_name
                : this.wind_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#FAAB70 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wind_data[i].block_name
                : this.wind_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Wind Speed(Km/hr)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#FAAB70">High Wind, Moderate Gale - Gale, Fresh Gale</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;
            var s =
              '<div style="background:radial-gradient(circle,rgba(250, 171, 112, 1) 40%, rgba(212, 114, 39, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wind_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wind_data[i].long, this.wind_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          }
        }
      }
    } else {
      this.authService.showErrorToast('Awaiting data');
      if (this.marker.length != 0) {
        console.log('yes');
        this.removeMarkers();
      }
      this.getAllStation();
    }
  }

  setSwellData() {
    let selected_date_time = this.date + ' ' + this.time + ':00';
    console.log('new date time..', selected_date_time);
    console.log(this.swell_data);

    if (this.swell_data.length != 0) {
      for (var i = 0; i < this.swell_data.length; i++) {
        let el = document.createElement('div');
        el.classList.add('marker');
        if (selected_date_time == this.swell_data[i].forecast_time) {
          var contentString =
            ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
            (this.lang == 'en'
              ? this.swell_data[i].location
              : this.swell_data[i].location) +
            `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
            (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
            `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding" >
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
            (this.lang == 'en'
              ? this.swell_data[i].district_name
              : this.swell_data[i].district_name_ory) +
            `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
            (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
            `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#32CD33 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
            (this.lang == 'en'
              ? this.swell_data[i].block_name
              : this.swell_data[i].block_name_ory) +
            `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;">Swell Wave Height(m)</p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#32CD33">` +
            parseFloat(this.swell_data[i].value).toFixed(2) +
            `</p></ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;

          var s =
            '<div style="background:radial-gradient(circle,#32CD33 40%, rgba(17, 166, 17, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
            parseFloat(this.swell_data[i].value).toFixed(2) +
            '</div></div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([this.swell_data[i].long, this.swell_data[i].lat])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              }).setHTML(contentString)
            )
            .addTo(this.map);

          this.marker.push(marker);
        }
      }
    } else {
      this.authService.showErrorToast('Awaiting data');
      if (this.marker.length != 0) {
        console.log('yes');
        this.removeMarkers();
      }
      this.getAllStation();
    }
  }

  setWaveData() {
    let selected_date_time = this.date + ' ' + this.time + ':00';
    console.log('new date time..', selected_date_time);
    if (this.wave_data.length != 0) {
      for (var i = 0; i < this.wave_data.length; i++) {
        let el = document.createElement('div');
        el.classList.add('marker');
        if (selected_date_time == this.wave_data[i].forecast_time) {
          console.log(
            'station id' +
              this.wave_data[i].station_name +
              'value..' +
              this.wave_data[i].value
          );
          if (
            parseFloat(this.wave_data[i].value) >= 0.0 &&
            parseFloat(this.wave_data[i].value) < 0.5
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wave_data[i].location
                : this.wave_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#32CD33 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].district_name
                : this.wave_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#32CD33 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].block_name
                : this.wave_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Significant Wave height(m)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#32CD33">Calm - Smooth</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;
            var s =
              '<div style="background:radial-gradient(circle,#32CD33 40%, rgba(17, 166, 17, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wave_data[i].long, this.wave_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (
            parseFloat(this.wave_data[i].value) >= 0.5 &&
            parseFloat(this.wave_data[i].value) < 1.5
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wave_data[i].location
                : this.wave_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#E5C100 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].district_name
                : this.wave_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#E5C100 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].block_name
                : this.wave_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Significant Wave height(m)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#E5C100">Slight</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;

            var s =
              '<div style="background:radial-gradient(circle,rgb(255 223 0) 40%, rgba(163, 145, 19, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wave_data[i].long, this.wave_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (
            parseFloat(this.wave_data[i].value) >= 1.5 &&
            parseFloat(this.wave_data[i].value) < 2.5
          ) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wave_data[i].location
                : this.wave_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#FAAB70 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].district_name
                : this.wave_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#FAAB70 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].block_name
                : this.wave_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Significant Wave height(m)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#FAAB70">Moderate</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;

            var s =
              '<div style="background:radial-gradient(circle,rgba(250, 171, 112, 1) 40%, rgba(212, 114, 39, 1) 100%); border-radius:100%; color:white; height:40px;width:40px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wave_data[i].long, this.wave_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          } else if (parseFloat(this.wave_data[i].value) >= 2.5) {
            var contentString =
              ` <div>
                  <ion-grid class="ion-no-padding" style="padding-left:-18px !important">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:1.04rem ;">` +
              (this.lang == 'en'
                ? this.wave_data[i].location
                : this.wave_data[i].location) +
              `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding ">
                                 <p style="margin-top: 5px;font-size:1.01rem; text-align:center">` +
              (this.lang == 'en' ? `District` : `ଜିଲ୍ଲା`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#EC3737 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].district_name
                : this.wave_data[i].district_name_ory) +
              `</p></ion-col>
                        </ion-row>
                   <ion-row  class="ion-no-padding">
                              <ion-col class="ion-no-padding">
                                 <p style="margin-top: 5px;font-size:1.01rem;text-align:center">` +
              (this.lang == 'en' ? `Block` : `ବ୍ଲକ`) +
              `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:#EC3737 !important">
                               <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;text-align:center">` +
              (this.lang == 'en'
                ? this.wave_data[i].block_name
                : this.wave_data[i].block_name_ory) +
              `</p></ion-col>
                        </ion-row>
                       
                  <ion-row  class="ion-no-padding">
                  <ion-col class="ion-text-center">
                  <ion-card>

                  <ion-grid>
                  <ion-row>
                  <ion-col>
                 <p style="margin-top: 5px;font-size:1.01rem;"> Significant Wave height(m)</p>
                  </ion-col>
                   <ion-col>
                  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#7E7E7E">` +
              (this.lang == 'en' ? `Status` : `ଅବସ୍ଥା`) +
              ` </p>
                  </ion-col>
                  </ion-row>
                     <ion-row>
                  <ion-col>  <p style="margin-top: 5px;font-size:1.01rem;font-weight:500;color:#000">` +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              `</p></ion-col>
                   <ion-col>
                     <p style="margin-top: 5px;font-size:1.01rem;color:#EC3737">Rough - Phenomenal</p>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                  </ion-card>
                  </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>`;

            var s =
              '<div style="background:radial-gradient(circle,rgba(248, 104, 104, 1) 40%, rgba(218, 42, 42, 1); border-radius:100%; color:white; height:37px;width:37px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center;border: 3px solid white"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
              parseFloat(this.wave_data[i].value).toFixed(2) +
              '</div></div>';
            el.innerHTML = s;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([this.wave_data[i].long, this.wave_data[i].lat])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnClick: true,
                }).setHTML(contentString)
              )
              .addTo(this.map);

            this.marker.push(marker);
          }
        }
      }
    } else {
      this.authService.showErrorToast('Awaiting data');
      if (this.marker.length != 0) {
        console.log('yes');
        this.removeMarkers();
      }
      this.getAllStation();
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
      this.time = item.innerText;
      this.selector();
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      let item = this.arr[i];
      console.log(item.innerText);
      this.selector();
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }
    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        let item = this.arr[i];
        this.scrollTo = i;
        this.time = item.innerText;
        this.selector();
        item.scrollIntoView({ behavior: 'smooth' });
        this.current = i;
        i = i + 1;
      } else if (i >= this.arr.length) {
        this.current = i;
        clearInterval(this.timeout);
        setTimeout(() => {
          this.scrollTo = null;
          this.run = false;
          this.selector();
          this.time = this.arr[0].innerText;
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
}
