import * as mapboxgl from 'mapbox-gl';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { mapKey } from '../../../../config/key';

@Component({
  selector: 'app-lightning-map',
  templateUrl: './lightning-map.component.html',
  styleUrls: ['./lightning-map.component.scss'],
})
export class LightningMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() totalDeathDataForMap: any = [];
  map;
  fillColor: any = [];
  fillOpacity: any = [];
  strokeWeight: any = [];

  constructor(private loadingCtrl: LoadingController) {}
  ngOnDestroy() {
    this.map.remove();
  }

  ngAfterViewInit(): void {
    document.getElementById('map').style.opacity = '0';
    this.mapIt();
    // setTimeout(() => this.map.resize().then().catch(), 0);
  }

  ngOnInit() {}

  ngOnChanges() {
    // setTimeout(() => this.updateMap(), 0);
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
          attributionControl: false, // container id
          style: 'mapbox://styles/mapbox/light-v10',
          center: [84.5121, 20.5012],
          zoom: 5.2,
        });
        this.map.on('load', () => {
          // make a pointer cursor
          // this.map.getCanvas().style.cursor = 'default';

          this.map.addSource('lightning', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
          });
          this.updateMap();

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
          // this.map.addLayer({
          //   id: 'lightning-layer',
          //   type: 'fill',
          //   source: 'lightning',
          //   paint: {
          //     'fill-color': [
          //       'match',
          //       ['get', 'name'], // get the property
          //       'Angul',
          //       'yellow', // if 'Angul' then yellow
          //       'Angul',
          //       'black', // if 'Angul' then black
          //       'white',
          //     ],
          //   },
          // });
        });
      });
  }

  getGeoJSON(url) {
    return fetch(url).then((response) => {
      return response.json();
    });
  }

  updateMap() {
    var fcst: any = [];
    Object.values(this.totalDeathDataForMap).forEach((val) => {
      fcst.push(val);
    });

    this.getGeoJSON('../../../../../assets/geojson/Odisha_Dist.geojson').then(
      (data) => {
        const matchExpression = ['match', ['get', 'id']];

        for (const row of data.features) {
          fcst.forEach((element) => {
            if (element['dis_id'] == row.properties.id) {
              let total_deaths = element['total_deaths'];

              if (total_deaths >= 1 && total_deaths <= 50) {
                matchExpression.push(row.properties.id, 'gold');
              } else if (total_deaths > 51 && total_deaths <= 100) {
                matchExpression.push(row.properties.id, 'yellow');
              } else if (total_deaths > 101 && total_deaths <= 150) {
                matchExpression.push(row.properties.id, 'orange');
              } else if (total_deaths > 151 && total_deaths <= 200) {
                matchExpression.push(row.properties.id, 'darkorange');
              } else if (total_deaths > 201 && total_deaths <= 250) {
                matchExpression.push(row.properties.id, 'coral');
              } else if (total_deaths > 251) {
                matchExpression.push(row.properties.id, 'red');
              }
            }
          });
        }
        matchExpression.push('white');
        if (this.map.getSource('lightning') != null) {
          this.map.addLayer({
            id: 'lightning-layer',
            type: 'fill',
            source: 'lightning',
            paint: {
              'fill-color': matchExpression,
              'fill-opacity': 0.7,
            },
          });
        }
        if (this.map.getLayer('lightning-layer')) {
          return;
        } else {
          this.updateMap();
        }
      }
    );
  }
}
