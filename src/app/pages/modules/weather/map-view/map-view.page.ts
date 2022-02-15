import { FavModalComponent } from './../fav-modal/fav-modal.component';
import {
  LoadingController,
  Platform,
  ModalController,
  IonBackButtonDelegate,
  NavController,
} from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import { mapKey } from '../../../../config/key';
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
})
export class MapViewPage implements OnInit, AfterViewInit {
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButton: IonBackButtonDelegate;
  dist_name;
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
  constructor(
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private navCtrl: NavController
  ) {
    this.lang = localStorage.getItem('language');
  }
  ngAfterViewInit() {
    this.mapIt();
    this.setUIBackButtonAction();
  }

  ngOnInit() {
    // console.log(this.district_id);
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
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [84.145805, 20.576347],
          zoom: 5.2,
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
              'fill-opacity': 0.7,
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
              'line-color': '#000',
              'line-width': 1,
            },
          });

          this.map.on('click', 'district-layer', (e) => {
            this.loadBlocks(e.features[0].properties.id);
          });
          loadingEl.dismiss();
        });
      });
  }

  async openModal(block_id) {
    console.log(block_id);
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FavModalComponent,
      componentProps: {
        blockId: block_id,
      },
    });
    modal.onDidDismiss().then(() => {
      this.presented = false;
    });

    if (!this.presented)
      return await modal.present().then(() => {
        this.presented = true;
      });
  }

  loadBlocks(district_id) {
    this.map.removeLayer('district-layer');
    this.map.removeLayer('district-outline');
    this.map.removeSource('district');

    this.map.addSource('blocks', {
      type: 'geojson',
      data:
        '../../../../../assets/geojson/Odisha_block_id' +
        district_id +
        '.geojson',
    });

    this.map.jumpTo({
      center: this.center[district_id - 1],
      zoom: 7.5,
    });

    this.map.addLayer({
      id: 'blocks-layer',
      type: 'fill',
      source: 'blocks',
      paint: {
        'fill-color': 'white',
        'fill-opacity': 0.5,
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
        'line-color': '#002338',
        'line-width': 1,
      },
    });

    this.map.on('click', 'blocks-layer', (e) => {
      this.openModal(e.features[0].properties.id);
    });

    this.map.on('sourcedata', () => {
      const features = this.map.querySourceFeatures('blocks', {
        sourceLayer: 'blocks',
      });
      this.dist_name = features[0]?.properties.DIST_NAME;
    });
  }

  resetMap() {
    this.dist_name = null;
    this.map.removeLayer('blocks-layer');
    this.map.removeLayer('blocks-outline');
    this.map.removeSource('blocks');

    this.map.addSource('district', {
      type: 'geojson',
      data: '../../../../../assets/geojson/Odisha_Dist.geojson',
    });
    this.map.addLayer({
      id: 'district-layer',
      type: 'fill',
      source: 'district',
      paint: {
        'fill-color': 'white',
        'fill-opacity': 0.7,
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
        'line-color': '#000',
        'line-width': 1,
      },
    });
    this.map.jumpTo({
      center: [84.145805, 20.576347],
      zoom: 5.2,
    });

    this.map.on('click', 'district-layer', (e) => {
      this.loadBlocks(e.features[0].properties.id);
    });
  }

  setUIBackButtonAction() {
    this.platform.backButton.subscribeWithPriority(5, () => {
      if (this.map.getSource('blocks') != null) {
        this.resetMap();
      } else {
        this.navCtrl.back();
      }
    });

    this.backButton.onClick = (ev) => {
      if (this.map.getSource('blocks') != null) {
        this.resetMap();
      } else {
        this.navCtrl.back();
      }
    };
  }
}
