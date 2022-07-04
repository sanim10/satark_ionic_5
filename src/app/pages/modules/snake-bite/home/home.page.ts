import { HttpClient } from '@angular/common/http';
import { NearbyHospitalService } from './../nearby-hospital/nearby-hospital.service';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { LoadingController } from '@ionic/angular';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
declare var google;
var marker;
var markers = [];
var InfoWindow;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { read: ElementRef }) mapElement: ElementRef;

  coordinate;
  map;
  public user_data: any;
  public latitude: any;
  public longitude: any;
  public nearest_phc_data: any;
  public nearest_sc_data: any;
  public nearest_ambulance_data: any;
  public sos_events: any;
  public snakebite_data: any;
  phc_lat: any = [];
  phc_long: any = [];
  phc_distance: any = [];
  phc_location: any = [];
  sc_lat: any = [];
  sc_long: any = [];
  sc_distance: any = [];
  sc_location: any = [];
  loader;
  lang;
  public marker: any = [];
  sos_address;
  marker_lnglat;
  permission = false;
  fabState = false;
  fab = 'recent-attacks';
  mapState = false;

  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private authService: AuthService,
    private NHS: NearbyHospitalService,
    private httpClient: HttpClient
  ) {
    this.lang = localStorage.getItem('language');
    this.checklogin(localStorage.getItem('token'));
  }
  ngOnDestroy(): void {
    this.loader.dismiss();
  }

  ngOnInit() {
    this.requestPermission();
    this.NHS.clicked.subscribe(() => {
      if (this.mapState) {
        this.updateFAB('nearby-hospital');
      }
    });
    this.NHS.SOS.subscribe(() => {
      if (this.mapState) {
        this.addSos();
      }
    });
  }

  ngAfterViewInit() {
    this.showloader();
  }

  getLocation = () => {
    Geolocation.getCurrentPosition()
      .then((data) => {
        console.log(data);

        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy,
        };

        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;

        this.getAddress();

        this.mapInit();
      })
      .catch((err) => {
        this.authService.showAlert(null, 'Error getting location!');
        this.loader.dismiss();
      });
  };

  mapInit() {
    console.log('lat', this.latitude);
    console.log('long', this.longitude);
    // let latLng = new google.maps.LatLng(14.020100, 100.523570);
    let latLng = new google.maps.LatLng(this.latitude, this.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.data.loadGeoJson('assets/geojson/India_Map.geojson');
    this.map.data.setStyle({
      fillColor: '#3589ff',
      fillOpacity: 0.0,
      strokeWeight: 0.5,
    });
    this.loader.dismiss();

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.latitude, this.longitude),
      map: this.map,
      visible: true,
    });
    console.log('marker', marker);

    this.mapState = true;
    this.getSOSEvents();
  }

  getAddress = () => {
    let geocoder = new google.maps.Geocoder();
    if (this.coordinate.length != 0) {
      var latlng;
      latlng = new google.maps.LatLng(
        parseFloat(this.coordinate.latitude),
        parseFloat(this.coordinate.longitude)
      );
      geocoder.geocode({ location: latlng }, (results) => {
        if (results[0]) {
          this.sos_address = results[0].formatted_address;
          console.log('sos address', this.sos_address);
        } else {
          alert('No results found');
        }
      });
    }
  };

  addSos() {
    console.log('sos address again =', this.sos_address);
    var url = 'https://satark.rimes.int/api_snakebite/sos_report_post';
    var params = JSON.stringify({
      user: this.user_data[0].id,
      address: this.sos_address,
      lati: this.latitude,
      lng: this.longitude,
      // address: 'test',
      // lati: 0,
      // lng: 0,
      phone: this.user_data[0].phone,
    });

    console.log('params', params);

    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      (data) => {
        console.log('data', data);
        this.authService.showAlert(null, 'SOS Set!');
      },
      (err) => {
        this.authService.showAlert('Fail!', 'Please try later');
        console.log('ERROR!: ', err);
      }
    );
  }

  //get nearby hospitals
  getNearbyHostpitals() {
    this.removeMarkers();
    let param = {
      lat: this.latitude,
      long: this.longitude,
      // lat: 19.62139646,
      // long: 84.67353751,
    };
    this.apiService
      .getNearestPhc(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.nearest_phc_data = data;
          console.log('nearest phc', this.nearest_phc_data);
          if (this.nearest_phc_data.length != 0) {
            this.nearest_phc_data.forEach((element) => {
              var phc_lati = element.latitude;
              var phc_long = element.longitude;
              var phc_dist = Math.round(element.distance);
              var phc_loc = element.location;

              marker = new google.maps.Marker({
                position: new google.maps.LatLng(phc_lati, phc_long),
                map: this.map,
                icon: '../../../../../assets/modules/road-accident/hospital_ic_map.svg',
                clickable: true,
                visible: true,
                info: this.getHTMLContentNearHospital(phc_loc, phc_dist),
              });
              console.log('marker', marker);
              markers.push(marker);

              // /show popup box when marker is clicked
              var infowindow = new google.maps.InfoWindow();
              google.maps.event.addListener(marker, 'click', function () {
                if (InfoWindow) {
                  InfoWindow.close();
                }
                infowindow.setContent(this.info);
                infowindow.open(this.map, this);
                InfoWindow = infowindow;
              });
            });
          } else {
            this.authService.showAlert(null, 'No Hospitals nearby');
          }
        },
        (err) => {
          this.authService.showErrorToastTop(
            'Network Error.Please refresh page.'
          );
        }
      );
    this.apiService
      .getNearestSc(param)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.nearest_sc_data = data;
          console.log('nearest sc', this.nearest_sc_data);

          if (this.nearest_sc_data.length != 0) {
            this.nearest_sc_data.forEach((element) => {
              var sc_lati = element.latitude;
              var sc_long = element.longitude;
              var sc_dist = Math.round(element.distance);
              var sc_loc = element.sub_center;
              this.sc_lat.push(sc_lati);
              this.sc_long.push(sc_long);
              this.sc_distance.push(sc_dist);
              this.sc_location.push(sc_loc);

              marker = new google.maps.Marker({
                position: new google.maps.LatLng(sc_lati, sc_long),
                map: this.map,
                icon: '../../../../../assets/modules/road-accident/hospital_ic_map.svg',
                clickable: true,
                visible: true,
                info: this.getHTMLContentNearHospital(sc_loc, sc_dist),
              });
              console.log('marker', marker);
              markers.push(marker);

              // /show popup box when marker is clicked
              var infowindow = new google.maps.InfoWindow();
              google.maps.event.addListener(marker, 'click', function () {
                if (InfoWindow) {
                  InfoWindow.close();
                }
                infowindow.setContent(this.info);
                infowindow.open(this.map, this);
                InfoWindow = infowindow;
              });
            });
          } else {
            this.authService.showAlert(null, 'No Hospitals nearby');
          }
        },
        (err) => {
          this.authService.showErrorToastTop(
            'Network Error.Please refresh page.'
          );
        }
      );
  }

  getSOSEvents() {
    this.removeMarkers();

    this.apiService
      .getSosEventsSnakebite()
      .pipe(take(1))
      .subscribe((data) => {
        this.sos_events = data;
        console.log('sos events', this.sos_events);
        if (this.sos_events.length != 0) {
          this.sos_events.forEach((sos) => {
            var sos_lati = sos.latitude;
            var sos_long = sos.longitude;
            var sos_date = sos.date;
            var sos_loc = sos.address;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(sos.latitude, sos.longitude),
              map: this.map,
              icon: '../../../../../assets/modules/road-accident/sos_ic_map.svg',
              clickable: true,
              visible: true,
              info: this.getHTMLContentSOSEvents(sos_loc, sos_date),
            });
            console.log('marker', marker);
            markers.push(marker);

            // /show popup box when marker is clicked
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function () {
              if (InfoWindow) {
                InfoWindow.close();
              }
              infowindow.setContent(this.info);
              infowindow.open(this.map, this);
              InfoWindow = infowindow;
            });
          });
        }
      }),
      (Error) => {
        this.authService.showErrorToast('Network Error.Please refresh page.');
      };

    this.getSnakebiteBvents();
  }

  getSnakebiteBvents() {
    this.apiService
      .getEventsSnakebite()
      .pipe(take(1))
      .subscribe((data) => {
        this.snakebite_data = data;
        console.log('snakebite events', this.snakebite_data);
        if (this.snakebite_data.length != 0) {
          this.snakebite_data.forEach((snakebite) => {
            var acci_lati = snakebite.latitude;
            var acci_long = snakebite.longitude;
            var acci_date = snakebite.date;
            var acci_msg = snakebite.event_description;
            var acci_loc = snakebite.location_of_incident;
            let el = document.createElement('div');
            el.classList.add('marker');

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(acci_lati, acci_long),
              map: this.map,
              icon: '../../../../../assets/modules/snake-bite/bite_ic_map.svg',
              clickable: true,
              visible: true,
              info: this.getHTMLContentSnakeBiteEvents(
                acci_loc,
                acci_date,
                acci_msg
              ),
            });
            console.log('marker', marker);
            markers.push(marker);

            // /show popup box when marker is clicked
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', function () {
              if (InfoWindow) {
                InfoWindow.close();
              }
              infowindow.setContent(this.info);
              infowindow.open(this.map, this);
              InfoWindow = infowindow;
            });
          });
        }
      }),
      (Error) => {
        this.authService.showErrorToastTop(
          'Network Error.Please refresh page.'
        );
      };
  }

  getHTMLContentNearHospital(loc, dist, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/snake-bite/hospital_ic_map.svg" style="position:absolute"/>
                      <h4 style="margin-left: auto;margin-right: auto">` +
      (this.lang == 'en' ? `Hospital` : `ଡାକ୍ତରଖାନା`) +
      ` </h4>
                      </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ion-padding-start ">
                                <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Location` : `ସ୍ଥାନ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      loc +
      `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="7" class="ion-no-padding ion-padding-start ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Distance` : `ଦୂରତା`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      dist +
      `KM</p>
                              </ion-col>
                        </ion-row>
                          </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>
                        `;

    return contentString;
  }

  getHTMLContentSOSEvents(loc, date, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/snake-bite/sos_ic_map.svg" style="position:absolute; height:31px"/>
                      <h4 style="margin-left: auto;margin-right: auto">` +
      (this.lang == 'en' ? `Event Spotted` : `ଚିହ୍ନିତ ଘଟଣା`) +
      ` </h4>
                      </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="4.5" class="ion-no-padding ion-padding-start ">
                                <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Location` : `ସ୍ଥାନ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      loc +
      `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="4.5" class="ion-no-padding ion-padding-start ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Event Date` : `ତାରିଖ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      date +
      `</p>
                              </ion-col>
                        </ion-row>
                          </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>
                        `;

    return contentString;
  }

  getHTMLContentSnakeBiteEvents(loc, date, msg, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/snake-bite/bite_ic_map.svg" style="position:absolute; height:31px"/>
                      <h4 style="margin-left: auto;margin-right: auto">` +
      (this.lang == 'en' ? `Event Spotted` : `ଚିହ୍ନିତ ଘଟଣା`) +
      ` </h4>
                      </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="4.5" class="ion-no-padding ion-padding-start ">
                                <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Location` : `ସ୍ଥାନ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">` +
      loc +
      `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="4.5" class="ion-no-padding ion-padding-start ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Event Date` : `ତାରିଖ`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      date +
      `</p>
                              </ion-col>
                        </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="4.5" class="ion-no-padding ion-padding-start ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Event` : `ଘଟଣା`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      msg +
      `</p>
                              </ion-col>
                        </ion-row>
                          </ion-col>
                    </ion-row>
                  </ion-grid>
                </div>
                        `;

    return contentString;
  }

  removeMarkers() {
    var containerElement = document.getElementById('map');
    containerElement.setAttribute('class', 'null');
    if (marker && marker.setMap) {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
    }
  }

  requestPermission() {
    Geolocation.checkPermissions().then((status) => {
      if (status.location == 'granted' && status.coarseLocation === 'granted') {
        this.permission = true;
        this.getLocation();
      } else {
        this.permission = false;
        Geolocation.requestPermissions().then((permissionStatus) => {
          console.log(permissionStatus);
          if (
            permissionStatus.location == 'granted' &&
            permissionStatus.coarseLocation == 'granted'
          ) {
            this.permission = true;
            this.getLocation();
          } else {
            this.permission = false;
            this.authService.showErrorToastTop('Please enable Location');
          }
        });
      }
    }).catch((err) => {
      this.authService.showAlert(null, 'Please enable Location!');
      // this.loader.dismiss();
    });
  }

  showHideBackdrop() {
    this.fabState = !this.fabState;
  }

  updateFAB = (fc) => {
    if (this.mapState) {
      this.fab = fc;
      if (this.fab == 'recent-attacks') {
        this.authService.showErrorToastTop('Fetching new data');
        this.removeMarkers();
        this.getSOSEvents();
      } else {
        this.authService.showErrorToastTop('Fetching new data');
        this.removeMarkers();
        this.getNearbyHostpitals();
      }
    } else {
      this.authService.showErrorToastTop('Please try later');
    }
  };

  async showloader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
      mode: 'ios',
      duration:3000
    });
    this.loader.present();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
      });
  }
}
