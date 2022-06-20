import { SwiperComponent } from 'swiper/angular';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { IonFab } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';

import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation } from 'swiper';
import { mapKey } from '../../../../config/key';
SwiperCore.use([Navigation]);
@Component({
  selector: 'app-hydro-forecast',
  templateUrl: './hydro-forecast.page.html',
  styleUrls: ['./hydro-forecast.page.scss'],
})
export class HydroForecastPage implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  map;
  date = null;
  date_options = null;
  time = [];
  fabState = false;
  mBasin = false;
  mRiver = false;
  rBasin = false;
  rRiver = false;
  length;
  arr = [];
  run = false;
  scrollTo = null;
  timeout;
  current = 0;
  public station_discharge_data: any;
  danger_lvl: any = [];
  loc_name: any = [];
  loc_name_ory: any = [];
  fcst_date: any = [];
  latitude: any = [];
  longitude: any = [];
  warning_lvl: any = [];
  discharge: any = [];
  water_lvl: any = [];
  public marker: any = [];
  marker_lnglat;
  lang;
  station_type;
  station_type_od;

  activeSlide = 0;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    allowTouchMove: true,
  };

  slideNext() {
    this.swiper.swiperRef.slideNext();
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    this.activeSlide = this.swiper.swiperRef.activeIndex;
    console.log(this.activeSlide);
  }
  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.lang = localStorage.getItem('language');
    let day1 = moment().format('YYYY-MM-DD');
    let day2 = moment().add(1, 'day').format('YYYY-MM-DD');
    let day3 = moment().add(2, 'day').format('YYYY-MM-DD');
    this.date_options = [day1, day2, day3];
    console.log('dates', this.date_options);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.mapIt();
    this.arr = this.content.nativeElement.children;
  }

  getForecastDischargeAllStation(selected_date: string) {
    let param = {
      date: selected_date,
    };
    this.apiService
      .getForecastDischargeAllStationByDate(param)
      .subscribe((data) => {
        this.station_discharge_data = [];
        this.station_discharge_data = data;
        console.log('discharge data', this.station_discharge_data);
        console.log('lenght of array', this.station_discharge_data.length);
        if (this.station_discharge_data.length != 0) {
          if (this.marker.length != 0) {
            this.marker.forEach((element) => {
              element.remove();
            });
            this.marker = null;
            this.marker = [];
            console.log(this.marker);
          }
          this.pointMarker();
        } else {
          if (this.marker.length != 0) {
            this.marker.forEach((element) => {
              element.remove();
            });
            this.marker = null;
            this.marker = [];
            console.log(this.marker);
          }
          this.station_discharge_data = null;
          this.authService.showAlert(
            'No Data',
            'Data for this is date currently not available'
          );
        }
      });
  }

  pointMarker() {
    this.danger_lvl = [];
    this.loc_name = [];
    this.loc_name_ory = [];
    this.fcst_date = [];
    this.latitude = [];
    this.longitude = [];
    this.warning_lvl = [];
    this.discharge = [];
    this.water_lvl = [];

    this.station_discharge_data.forEach((sd_data) => {
      var location_name = sd_data.location_name;
      var location_name_ory = sd_data.location_name_ory;
      var fcst_date = sd_data.fcst_date;
      var discharge = sd_data.discharge;
      var water_level = sd_data.water_level;
      var lat = sd_data.latitude;
      var long = sd_data.longitude;
      var warning_level = sd_data.warning_lvl;
      var danger_level = sd_data.danger_lvl;

      this.loc_name.push(location_name);
      this.loc_name_ory.push(location_name_ory);
      this.fcst_date.push(fcst_date);
      this.discharge.push(discharge);
      this.danger_lvl.push(danger_level);
      this.water_lvl.push(water_level);
      this.warning_lvl.push(warning_level);
      this.latitude.push(lat);
      this.longitude.push(long);
    });
    setTimeout(() => {
      for (var j = 0; j < this.station_discharge_data.length; j++) {
        let el = document.createElement('div');
        el.classList.add('marker');

        if (this.warning_lvl[j] == null && this.danger_lvl[j] == null) {
          var s =
            '<div style="background:#447FF7; border-radius:100%; color:white; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; border: 2px solid white;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
            Math.round(+this.discharge[j]) +
            '<br/><span style="font-size:0.6rem;text-align:center;">m3/s</span></div></div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([this.longitude[j], this.latitude[j]])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              })
                .setLngLat(this.map.getCenter())
                .setHTML(
                  this.getHTMLContent(
                    this.station_type =  "Outlet",
                    this.station_type_od =  "ବହିର୍ଗମନ ପଥ",
                    this.loc_name[j],
                    this.loc_name_ory[j],
                    this.discharge[j],
                    this.water_lvl[j],
                    this.lang == 'en' ? 'NA' : 'ଉପଲବ୍ଧ ନାହିଁ',
                    this.lang == 'en' ? 'NA' : 'ଉପଲବ୍ଧ ନାହିଁ',
                    'null',
                    'null',
                    '#447FF7'
                  )
                )
            )
            .addTo(this.map);
          let dis = this;

          marker.getElement().addEventListener('click', function (e) {
            dis.marker_lnglat = marker.getLngLat();
          });
          this.marker.push(marker);
        } else if (
          Math.round(this.water_lvl[j]) >= Math.round(this.warning_lvl[j]) &&
          Math.round(this.water_lvl[j]) < Math.round(this.danger_lvl[j])
        ) {
          var s =
            '<div style="background:#FF9C41; border-radius:100%; color:white; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; border: 2px solid white;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
            Math.round(+this.discharge[j]) +
            '<br/><span style="font-size:0.6rem;text-align:center;">m3/s</span></div></div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([this.longitude[j], this.latitude[j]])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              })
                .setLngLat(this.map.getCenter())
                .setHTML(
                  this.getHTMLContent(
                    this.station_type =  "Flood Forecast Point",
                    this.station_type_od =  "ବନ୍ୟା ପୁର୍ବାନୁମାନର ପ୍ରସଙ୍ଗ /ଚିହ୍ନ",
                    this.loc_name[j],
                    this.loc_name_ory[j],
                    this.discharge[j],
                    this.water_lvl[j],
                    this.warning_lvl[j] + 'm',
                    this.danger_lvl[j] + 'm',
                    'Above Warning Level',
                    'ଚେତାବନୀ ସଂକେତ ଉପରେ',
                    '#FF9C41'
                  )
                )
            )
            .addTo(this.map);
          let dis = this;
          marker.getElement().addEventListener('click', function (e) {
            dis.marker_lnglat = marker.getLngLat();
          });
          this.marker.push(marker);
        } else if (
          Math.round(this.water_lvl[j]) <= Math.round(this.warning_lvl[j])
        ) {
          var s =
            '<div style="background:#6FDC6F; border-radius:100%; color:white; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; border: 2px solid white;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
            Math.round(+this.discharge[j]) +
            '<br/><span style="font-size:0.6rem;text-align:center;">m3/s</span></div></div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([this.longitude[j], this.latitude[j]])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              })
                .setLngLat(this.map.getCenter())
                .setHTML(
                  this.getHTMLContent(
                    this.station_type =  "Flood Forecast Point",
                    this.station_type_od =  "ବନ୍ୟା ପୁର୍ବାନୁମାନର ପ୍ରସଙ୍ଗ /ଚିହ୍ନ",
                    this.loc_name[j],
                    this.loc_name_ory[j],
                    this.discharge[j],
                    this.water_lvl[j],
                    this.warning_lvl[j] + 'm',
                    this.danger_lvl[j] + 'm',
                    'Normal',
                    'ସ୍ୱାଭାବିକ',
                    '#2CBC2C'
                  )
                )
            )
            .addTo(this.map);
          let dis = this;
          marker.getElement().addEventListener('click', function (e) {
            dis.marker_lnglat = marker.getLngLat();
          });
          this.marker.push(marker);
        } else if (
          Math.round(this.water_lvl[j]) >= Math.round(this.danger_lvl[j])
        ) {
          var s =
            '<div style="background:#FF1717; border-radius:100%; color:white; height:50px;width:50px;text-overflow: ellipsis; display:flex;align-items:center;justify-content:center; border: 2px solid white;"><div style="text-align:center; font-weight:600;line-height:10px;margin-top:4px">' +
            Math.round(+this.discharge[j]) +
            '<br/><span style="font-size:0.6rem;text-align:center;">m3/s</span></div></div>';
          el.innerHTML = s;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([this.longitude[j], this.latitude[j]])
            .setPopup(
              new mapboxgl.Popup({
                closeOnClick: true,
              })
                .setLngLat(this.map.getCenter())
                .setHTML(
                  this.getHTMLContent(
                    this.station_type =  "Flood Forecast Point",
                    this.station_type_od =  "ବନ୍ୟା ପୁର୍ବାନୁମାନର ପ୍ରସଙ୍ଗ /ଚିହ୍ନ",
                    this.loc_name[j],
                    this.loc_name_ory[j],
                    this.discharge[j],
                    this.water_lvl[j],
                    this.warning_lvl[j] + 'm',
                    this.danger_lvl[j] + 'm',
                    'Above Danger Level',
                    'ବିପଦ ସଂକେତ ଉପରେ',
                    '#FF1717'
                  )
                )
            )
            .addTo(this.map);
          let dis = this;
          marker.getElement().addEventListener('click', function (e) {
            dis.marker_lnglat = marker.getLngLat();
          });
          this.marker.push(marker);
        }
      }

      this.map.on('click', (e) => {
        if (this.marker_lnglat != null) {
          this.map.flyTo({
            center: [this.marker_lnglat.lng, this.marker_lnglat.lat + 0.4],
          });
          // this.map.panBy([0.1, 0]);
        }
      });
    }, 0);
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
          this.map.addSource('district', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
          });

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
          this.map.addLayer({
            id: 'district-layer',
            type: 'fill',
            source: 'district',
            paint: {
              'fill-color': 'white',
              'fill-opacity': 0.5,
            },
          });
          this.map.addLayer({
            id: 'district-layer2',
            type: 'line',
            source: 'district',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#000',
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
          this.getForecastDischargeAllStation(this.date_options[0]);
          this.scrollTo = 0;
        });
      });
  }

  fabClick(option) {
    switch (option) {
      case 'mBasin':
        this.mBasin = !this.mBasin;
        this.loadMbasin();
        break;
      case 'mRiver':
        this.mRiver = !this.mRiver;
        this.loadMriver();
        break;
      case 'rBasin':
        this.rBasin = !this.rBasin;
        this.loadRbasin();
        break;
      case 'rRiver':
        this.rRiver = !this.rRiver;
        this.loadRriver();
        break;
    }
  }

  loadMriver() {
    if (this.mRiver) {
      this.map.addSource('mahanadi-river', {
        type: 'geojson',
        data: '../../../../../assets/geojson/Mahanadi.geojson',
      });
      this.map.addLayer({
        id: 'mahanadi-r-layer',
        type: 'line',
        source: 'mahanadi-river',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#0066A6',
          'line-width': 2,
        },
      });
    } else {
      this.map.removeLayer('mahanadi-r-layer');
      this.map.removeSource('mahanadi-river');
    }
  }

  loadRriver() {
    if (this.rRiver) {
      this.map.addSource('rushikulya-river', {
        type: 'geojson',
        data: '../../../../../assets/geojson/Rushikulya_river.geojson',
      });
      this.map.addLayer({
        id: 'rushikulya-r-layer',
        type: 'line',
        source: 'rushikulya-river',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#0066A6',
          'line-width': 2,
        },
      });
    } else {
      this.map.removeLayer('rushikulya-r-layer');
      this.map.removeSource('rushikulya-river');
    }
  }

  loadMbasin() {
    if (this.mBasin) {
      this.map.addSource('mahanadi-basin', {
        type: 'geojson',
        data: '../../../../../assets/geojson/Mahanadi_basin.geojson',
      });
      this.map.addLayer({
        id: 'mahanadi-b-layer',
        type: 'fill',
        source: 'mahanadi-basin',
        paint: {
          'fill-color': '#8ACDEC',
          'fill-opacity': 0.5,
        },
      });
    } else {
      this.map.removeLayer('mahanadi-b-layer');
      this.map.removeSource('mahanadi-basin');
    }
  }

  loadRbasin() {
    if (this.rBasin) {
      this.map.addSource('rushikulya-basin', {
        type: 'geojson',
        data: '../../../../../assets/geojson/Rushikulya_basin.geojson',
      });
      this.map.addLayer({
        id: 'rushikulya-b-layer',
        type: 'fill',
        source: 'rushikulya-basin',
        paint: {
          'fill-color': '#8ACDEC',
          'fill-opacity': 0.5,
        },
      });
    } else {
      this.map.removeLayer('rushikulya-b-layer');
      this.map.removeSource('rushikulya-basin');
    }
  }

  play() {
    this.run = true;
    var i;
    if (this.current != this.arr.length) {
      i = this.current;
      let item = this.arr[i];
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    } else {
      i = 0;
      this.getForecastDischargeAllStation(this.date_options[0]);
      let item = this.arr[i];
      this.scrollTo = i;
      item.scrollIntoView({ behavior: 'smooth' });
      i = i + 1;
    }
    this.timeout = setInterval(() => {
      if (i < this.arr.length) {
        this.getForecastDischargeAllStation(this.date_options[i]);
        let item = this.arr[i];
        this.scrollTo = i;
        item.scrollIntoView({ behavior: 'smooth' });
        this.current = i;
        i = i + 1;
      } else if (i >= this.arr.length) {
        this.current = i;
        clearInterval(this.timeout);
        setTimeout(() => {
          this.scrollTo = null;
          this.run = false;
          this.getForecastDischargeAllStation(this.date_options[0]);
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
    this.scrollTo = index;
    let item = this.arr[index];

    item.scrollIntoView({ behavior: 'smooth' });
    this.getForecastDischargeAllStation(this.date_options[index]);
  }

  getHTMLContent(
    station_type,
    station_type_od,
    loc_name,
    loc_name_ory,
    discharge,
    water_lvl,
    warning_lvl,
    danger_lvl,
    condition,
    condition_ory,
    color
  ) {
    var contentString =
      ` <div>
                  <ion-grid class="ion-no-padding">
                  <ion-row id="popup-content" >
                      <ion-col class="ion-no-padding ion-text-center">
                   <ion-label style="text-align:center;font-weight:600;font-size:14px;">` +
      (this.lang == 'en' ? loc_name : loc_name_ory) +
      `<br/><br/></ion-label>
                  </ion-col>
                  </ion-row>
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding  ">
                                <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Station Type` : `ଷ୍ଟେସନର ପ୍ରକାର`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      (this.lang == 'en'
        ? station_type
        : station_type_od) +
      `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en'
        ? `Forecasted Discharge`
        : `ନିଷ୍କାସିତ ଜଳ ପରିମାଣ ପୂର୍ବାନୁମାନ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      discharge +
      `m<sup>3</sup>/s
                                    </p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Forecasted Water Level` : `ଜଳ ସ୍ତରର ପୂର୍ବାନୁମାନ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                              <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      water_lvl +
      `m</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Warning Level` : `ଚେତାବନି ସଂକେତ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      `  !important">
                               <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      warning_lvl +
      `</p></ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Danger Level` : `ବିପଦ ସଂକେତ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      `  !important">
                               <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      danger_lvl +
      `</p></ion-col>
                        </ion-row>`;

    if (condition != null) {
      var conditionString =
        `<ion-row class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
        (this.lang == 'en' ? `Status` : `ସ୍ଥିତି`) +
        `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
        color +
        ` !important">
                               <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
        (this.lang == 'en' ? condition : condition_ory) +
        `</p></ion-col>
                        </ion-row>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>`;

      contentString.concat(conditionString);
    } else {
      var conditionString = `
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>`;
      contentString.concat(conditionString);
    }
    return contentString;
  }

  ionViewWillLeave() {
    this.loadingCtrl.dismiss();
  }
}
