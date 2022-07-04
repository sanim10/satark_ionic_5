import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ApiService } from './../../../../providers/api.service';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from './../../../../guard/auth.service';
import { NearbyHospitalService } from './../nearby-hospital/nearby-hospital.service';

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
  public user_data: any;
  public latitude: any;
  public longitude: any;
  public origin_latitude: any;
  public origin_longitude: any;
  public sos_events: any;
  public accident_data: any;
  public blackspot_data: any;
  public directionsService: any;

  public nearest_phc_data: any;
  public nearest_sc_data: any;
  loader;
  lang;
  public marker: any = [];
  public ODmarker: any = [];
  sos_address;
  marker_lnglat;
  permission = false;
  fabState = false;
  fab = 'recent-attacks';
  mapState = false;
  accidents = false;
  black_spots = false;
  coordinate;
  map;
  directions;
  geocoder: any;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  autocompleteorigin: any;
  autocompleteItemsorigin: any;
  nearbyItems: any;
  GooglePlaces: any;
  public dest_latitude: any;
  public dest_longitude: any;
  polyline_converted;
  route_distance;
  route_duration;
  public trafficLayer: any;
  public directionsDisplay: any;

  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private NHS: NearbyHospitalService,
    public ngZOne: NgZone
  ) {
    this.lang = localStorage.getItem('language');
    this.checklogin(localStorage.getItem('token'));
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    // this.GooglePlaces =  new google.maps.places.PlacesService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.autocompleteorigin = { input: '' };
    this.autocompleteItemsorigin = [];
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
    });
    this.trafficLayer = new google.maps.TrafficLayer();
  }
  ngOnDestroy() {
    this.loader.dismiss();
  }
  ngAfterViewInit(): void {
    this.showloader();
  }

  ngOnInit() {
    console.log("opening map");
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

  getLocation = () => {
    console.log("getiing location");
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
        this.origin_latitude = data.coords.latitude;
        this.origin_longitude = data.coords.longitude;

        this.getAddress();

        this.mapInit();
      })
      .catch((err) => {
        this.authService.showAlert(null, 'Error getting location!');
        this.loader.dismiss();
      });
  };

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
  }

  getSOSEvents() {
    this.removeMarkers();

    this.apiService
      .getSosEventsAll()
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

    this.getAccidentEvents();
  }

  getAccidentEvents() {
    this.apiService
      .getAccidentReportAll()
      .pipe(take(1))
      .subscribe((data) => {
        this.accident_data = data;
        console.log('accident events', this.accident_data);
        if (this.accident_data.length != 0) {
          this.accident_data.forEach((accident) => {
            var acci_lati = accident.latitude;
            var acci_long = accident.longitude;
            var acci_date = accident.date;
            var acci_msg = accident.message;
            var acci_loc = accident.location;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(acci_lati, acci_long),
              map: this.map,
              icon: '../../../../../assets/modules/road-accident/accident_marker.svg',
              clickable: true,
              visible: true,
              info: this.getHTMLContentAccidentEvents(
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

  getBlackSpots = () => {
    this.apiService
      .getBlackSpots()
      .pipe(take(1))
      .subscribe((data) => {
        this.blackspot_data = data;
        console.log('blackspot events', this.blackspot_data);
        if (this.blackspot_data.length != 0) {
          this.blackspot_data.forEach((blkspt) => {
            var blkspt_lati = blkspt.latitude;
            var blkspt_long = blkspt.longitude;
            var blkspt_rdtype = blkspt.road_type;
            var blkspt_loc = blkspt.location;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(
                blkspt.latitude,
                blkspt.longitude
              ),
              map: this.map,
              icon: '../../../../../assets/modules/road-accident/black_spot_marker.svg',
              clickable: true,
              visible: true,
              info: this.getHTMLContentBlackSpots(blkspt_loc, blkspt_rdtype),
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
  };

  addSos() {
    console.log('sos address again =', this.sos_address);
    var url = 'https://satark.rimes.int/api_road_accident/sos_report_post';

    var params = JSON.stringify({
      user: this.user_data[0].id,

      address: this.sos_address,
      lati: this.latitude,
      lng: this.longitude,
      phone: this.user_data[0].phone,

      // address: 'test',
      // lati: 0,
      // lng: 0,
      // phone: 1128888888,
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

  getHTMLContentSOSEvents(loc, date, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/snake-bite/sos_ic_map.svg" style="position:absolute;height:31px"/>
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

  getHTMLContentAccidentEvents(loc, date, msg, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/road-accident/accident_marker.svg" style="position:absolute; height:31px"/>
                      <h4 style="margin-left: auto;margin-right: auto">` +
      (this.lang == 'en' ? `Event Spotted` : `ଚିହ୍ନିତ ଘଟଣା`) +
      ` </h4>
                      </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="5" class="ion-no-padding ion-padding-start ">
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
                              <ion-col size="5" class="ion-no-padding ion-padding-start ">
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
                              <ion-col size="5" class="ion-no-padding ion-padding-start ">
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

  getHTMLContentBlackSpots(loc, rtype, color = '#447FF7') {
    var contentString =
      ` <div style="min-width:252px">
                  <ion-grid class="ion-no-padding">
                   
                    <ion-row class="ion-no-padding" >
                      <ion-col class="ion-no-padding">
                      <ion-row class="ion-no-padding">
                      <img src="assets/modules/road-accident/black_spot_marker.svg" style="position:absolute;height:31px"/>
                      <h4 style="margin-left: auto;margin-right: auto">` +
      (this.lang == 'en' ? `Black Spot` : `ଭୟାବହ ଦୁର୍ଘଟଣା ସ୍ଥଳୀ`) +
      ` </h4>
                      </ion-row>
                        <ion-row  class="ion-no-padding">
                              <ion-col size="5" class="ion-no-padding ion-padding-start ">
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
                              <ion-col size="5" class="ion-no-padding ion-padding-start ">
                                 <p style="margin-top: 0px;font-size:14px;">` +
      (this.lang == 'en' ? `Road Type` : `ରାସ୍ତାର - ପ୍ରକାର`) +
      `</p>
                              </ion-col>
                              <ion-col  class="ion-no-padding"  style="color:` +
      color +
      ` !important">
                                <p style="margin-top: 0px;font-size:14px;font-weight:500">
                                    ` +
      rtype +
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

  updateFAB = (fc) => {
    if (this.mapState) {
      this.fab = fc;
      this.removeMarkers();
      if (this.fab == 'accidents') {
        this.accidents = !this.accidents;
        this.black_spots ? (this.black_spots = false) : '';
        if (this.accidents) {
          this.authService.showErrorToastTop('Fetching new data');
          this.getSOSEvents();
        }
      } else if (this.fab == 'black-spots') {
        this.black_spots = !this.black_spots;
        this.accidents ? (this.accidents = false) : '';
        if (this.black_spots) {
          this.authService.showErrorToastTop('Fetching new data');
          this.getBlackSpots();
        }
      } else if (this.fab == 'nearby-hospital') {
        this.authService.showErrorToastTop('Fetching new data');
        this.accidents ? (this.accidents = false) : '';
        this.black_spots ? (this.black_spots = false) : '';
        this.getNearbyHostpitals();
      } else {
        this.accidents ? (this.accidents = false) : '';
        this.black_spots ? (this.black_spots = false) : '';
      }
    } else {
      this.authService.showErrorToastTop('Please try later');
    }
  };

  removeMarkers() {
    var containerElement = document.getElementById('map');
    containerElement.setAttribute('class', 'null');
    if (marker && marker.setMap) {
      markers.forEach((element) => {
        element.setMap(null);
      });

      markers = [];
    }
  }

  requestPermission() {
    Geolocation.checkPermissions().then((status) => {
      console.log("status...", status);
      if (status.location == 'granted' && status.coarseLocation === 'granted') {
        this.permission = true;
        this.getLocation();
      } else {
        console.log("status...", status);
        this.permission = false;
        Geolocation.requestPermissions().then((permissionStatus) => {
          console.log("permission status...",permissionStatus);
          if (
            permissionStatus.location == 'granted' &&
            permissionStatus.coarseLocation == 'granted'
          ) {
            this.permission = true;
            this.getLocation();
          } else {
            this.permission = false;
            this.authService.showErrorToastTop('Please enable Location');
            // this.loader.dismiss();
          }
        });
      }
    }) .catch((err) => {
      this.authService.showAlert(null, 'Please enable Location!');
      // this.loader.dismiss();
    });
  }

  showHideBackdrop() {
    this.fabState = !this.fabState;
  }
  async showloader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
      mode: 'ios',
      duration: 3000
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
  ///search and autocomplete address
  updateOriginSearchResults() {
    if (this.autocompleteorigin.input == '') {
      this.autocompleteItemsorigin = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocompleteorigin.input },
      (predictions, status) => {
        this.autocompleteItemsorigin = [];
        this.ngZOne.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItemsorigin.push(prediction);
          });
        });
      }
    );
  }

  ///search and autocomplete address
  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.ngZOne.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }

  selectOriginSearchResult(item) {
    this.autocompleteItemsorigin = [];
    console.log('place name', item);
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng,
        };
        console.log('search box position', position);
        this.origin_latitude = results[0].geometry.location.lat();
        this.origin_longitude = results[0].geometry.location.lng();
        this.autocompleteorigin.input = item.description;
        console.log('origin lat', this.origin_latitude);
        console.log('origin lon', this.origin_longitude);
        if (this.autocomplete.input != null) {
          this.startNavigation();
        }
      }
    });
  }

  ////show search result for destionation
  selectSearchResult(item) {
    this.autocompleteItems = [];
    console.log('place name', item);
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng,
        };
        console.log('search box position', position);
        this.dest_latitude = results[0].geometry.location.lat();
        this.dest_longitude = results[0].geometry.location.lng();
        this.autocomplete.input = item.description;
        console.log('desti lat', this.dest_latitude);
        console.log('desti lon', this.dest_longitude);
        // this.previewRoute();
        // this.previewRoute2();
        this.startNavigation();
      }
    });
  }

  clear() {
    this.autocompleteorigin.input = '';
    this.autocomplete.input = '';
    this.autocompleteItemsorigin = [];
    this.autocompleteItems = [];
    this.route_distance = null;
    this.route_duration = null;

    this.origin_latitude = this.latitude;
    this.origin_longitude = this.longitude;

    this.directionsDisplay.setMap(null);

  }

  ////display routes
  startNavigation() {
    if (this.autocomplete.input != '') {
    

      //check if map is empty.if no clear map and render new direction
      if (this.directionsDisplay != null) {
        this.directionsDisplay.setMap(null);
        this.directionsDisplay = null;
        this.directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true,
          map: this.map,
        });
      }
      this.directionsDisplay.setMap(this.map);
      this.directionsService.route(
        {
          origin: { lat: this.origin_latitude, lng: this.origin_longitude },

          destination: { lat: this.dest_latitude, lng: this.dest_longitude },
          travelMode: google.maps.TravelMode['DRIVING'],
       
        },
        (res, status) => {
          if (status == google.maps.DirectionsStatus.OK) {
            this.directionsDisplay.setDirections(res);
            console.log('direction result', res);
            console.log('time', res.routes[0].legs[0].duration.text);
            console.log('distance', res.routes[0].legs[0].distance.text);
            this.route_distance = res.routes[0].legs[0].distance.text;
            this.route_duration = res.routes[0].legs[0].duration.text;
            this.trafficLayer.setMap(this.map);
            if (this.lang == 'en') {
              var subTitle =
                'The destination is' +
                ' ' +
                '<h4>' +
                this.route_distance +
                '</h4>' +
                ' ' +
                'away and it will take' +
                '<h4>' +
                ' ' +
                this.route_duration +
                '</h4>';
              this.authService.showAlert('Journey Detail', subTitle);
            } else {
              var subTitle =
                'ଗନ୍ତବ୍ୟସ୍ଥଳର ଦୂରତା' +
                ' ' +
                '<h4>' +
                this.route_distance +
                '</h4>' +
                ' ' +
                'ଏବଂ ସମୟ ଲାଗିବ' +
                '<h4>' +
                ' ' +
                this.route_duration +
                '</h4>';
              this.authService.showAlert(
                'ଯାତ୍ରା ସମ୍ପର୍କିତ ବିବରଣୀ',
                subTitle,
                'ଠିକ'
              );
            }
          } else {
            console.warn(status);
          }
        },
        (Error) => {
          console.log('error', Error);
        }
      );
    }
  }
}
