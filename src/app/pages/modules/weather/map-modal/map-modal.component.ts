import { FavModalComponent } from './../fav-modal/fav-modal.component';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { mapKey } from '../../../../config/key';
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @Input() district_id: any;
  @Input() district_name: any;
  @Input() district_name_ory: any;
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
  constructor(
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.back();
    this.lang = localStorage.getItem('language');
  }
  ngAfterViewInit() {
    this.mapIt();
  }

  ngOnInit() {
    console.log(this.district_id);
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
          center: this.center[this.district_id - 1],
          zoom: 7.5,
        });
        this.map.on('load', () => {
          this.map.addSource('blocks', {
            type: 'geojson',
            data:
              '../../../../../assets/geojson/Odisha_block_id' +
              this.district_id +
              '.geojson',
          });
          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

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
              'line-color': '#000',
              'line-width': 1,
            },
          });
          // const marker = new mapboxgl.Marker({
          //   draggable: true,
          // })
          //   .setLngLat(this.center[0])
          //   .addTo(this.map);

          // function onDragEnd() {
          //   const lngLat = marker.getLngLat();
          //   console.log(lngLat);
          // }

          // marker.on('dragend', onDragEnd);

          this.map.on('click', 'blocks-layer', (e) => {
            console.log(e.features);
            this.openModal(e.features[0].properties.id);
          });

          loadingEl.dismiss();
        });
      });
  }

  back() {
    this.platform.backButton.subscribeWithPriority(5, () => {});
    this.modalController.dismiss();
  }
  closeModal() {
    this.modalController.dismiss();
  }

  async openModal(block_id) {
    console.log(block_id);
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FavModalComponent,
      componentProps: { blockId: block_id },
    });
    return await modal.present();
  }
}
