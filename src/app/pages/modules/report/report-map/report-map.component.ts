import { AuthService } from '../../../../guard/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import { Geolocation } from '@capacitor/geolocation';

declare var google;

@Component({
  selector: 'app-heatwave-report-map',
  templateUrl: './report-map.component.html',
  styleUrls: ['./report-map.component.scss'],
})
export class ReportMapComponent implements OnInit, AfterViewInit {
  map;
  coordinate;
  current_loc: string;
  loc;
  loader;
  lngLat;
  constructor(
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private authService: AuthService
  ) {}
  ngAfterViewInit() {
    this.getCurrentCoordinate();
  }

  ngOnInit() {}

  mapInit() {
    // this.loadingCtrl
    //   .create({
    //     spinner: 'bubbles',
    //     cssClass: 'loader-css-class',
    //     mode: 'ios',
    //     duration: 5000,
    //   })
    //   .then((loadingEl) => {
    //     loadingEl.present();
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic3VwZXJkb3plIiwiYSI6ImNreWk0bGJ5YTI4dGIycW84dDU1emw2eG8ifQ.zUCe5RZtHPSqBo6vKneGdQ';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [84.5121, 20.5012],
      zoom: 5.3,
    });
    setTimeout(() => this.map.resize(), 0);

    document.getElementById('map').style.opacity = '1';
    document.getElementById('skeleton').style.display = 'none';

    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([this.coordinate?.longitude, this.coordinate?.latitude])
      .addTo(this.map);

    marker.on('dragend', () => {
      this.lngLat = marker.getLngLat();
      console.log(this.lngLat);
    });
    this.map.jumpTo({
      center: [this.coordinate?.longitude, this.coordinate?.latitude],
      zoom: 15,
    });
    this.loader.dismiss();

    // marker.on('dragend', onDragEnd);

    //   loadingEl.dismiss();
    // });
  }
  getCurrentCoordinate() {
    this.showloader();

    Geolocation.getCurrentPosition()
      .then((data) => {
        console.log(data);

        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy,
        };
        this.mapInit();
      })
      .catch((err) => {
        console.log(err);
        this.loader.dismiss();
        this.authService.showErrorToast('Network error!! Try again');
        this.closeModal();
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  closeModalWithData() {
    if (this.loc != null || this.loc != '')
      this.modalController.dismiss(this.loc);
  }

  setlocation() {
    let geocoder = new google.maps.Geocoder();
    var latlng;
    if (this.lngLat == null) {
      latlng = new google.maps.LatLng(
        parseFloat(this.coordinate.latitude),
        parseFloat(this.coordinate.longitude)
      );
    } else {
      latlng = new google.maps.LatLng(
        parseFloat(this.lngLat.lat),
        parseFloat(this.lngLat.lng)
      );
    }

    geocoder.geocode({ location: latlng }, (results) => {
      if (results[0]) {
        this.current_loc = results[0].formatted_address;
        this.loc = this.current_loc;
        console.log('adddress', this.loc);
        this.closeModalWithData();
      }
    });
  }

  async showloader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'loader-css-class',
      mode: 'ios',
      duration: 5000,
    });
    this.loader.present();
  }
}
