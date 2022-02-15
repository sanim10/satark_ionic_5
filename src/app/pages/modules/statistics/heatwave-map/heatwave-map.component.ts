import { LoadingController } from '@ionic/angular';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { mapKey } from '../../../../config/key';

@Component({
  selector: 'app-heatwave-stat-map',
  templateUrl: './heatwave-map.component.html',
  styleUrls: ['./heatwave-map.component.scss'],
})
export class HeatwaveMapComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() totalDeathDataForMap: any = [];
  map;
  fillColor: any = [];
  fillOpacity: any = [];
  strokeWeight: any = [];

  constructor(private loadingCtrl: LoadingController) {}
  ngOnDestroy() {
    this.map.remove();
  }
  ngAfterViewInit() {
    document.getElementById('map').style.opacity = '0';
    this.mapIt();
  }

  ngOnInit() {}

  ngOnChanges() {}

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
          zoom: 5.3,
        });
        this.map.on('load', () => {
          // make a pointer cursor
          // this.map.getCanvas().style.cursor = 'default';

          this.map.addSource('heatwave', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
          });
          this.updateMap();

          setTimeout(() => this.map.resize(), 0);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
          // this.map.addLayer({
          //   id: 'heatwave-layer',
          //   type: 'fill',
          //   source: 'heatwave',
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

              if (total_deaths >= 1 && total_deaths <= 5) {
                matchExpression.push(row.properties.id, 'gold');
              } else if (total_deaths > 5.1 && total_deaths <= 10.0) {
                matchExpression.push(row.properties.id, 'yellow');
              } else if (total_deaths > 10.1 && total_deaths <= 15.0) {
                matchExpression.push(row.properties.id, 'orange');
              } else if (total_deaths > 15.1 && total_deaths <= 20.0) {
                matchExpression.push(row.properties.id, 'darkorange');
              } else if (total_deaths > 20.1 && total_deaths <= 25.0) {
                matchExpression.push(row.properties.id, 'coral');
              } else if (total_deaths > 25.1) {
                matchExpression.push(row.properties.id, 'red');
              }
            }
          });

          // const green = 10;
          // const color = `#25958a`;
          // matchExpression.push(row.properties.id, color);
        }
        matchExpression.push('#ffffff');

        if (this.map.getSource('heatwave') != null && matchExpression) {
          this.map.addLayer({
            id: 'heatwave-layer',
            type: 'fill',
            source: 'heatwave',
            paint: {
              'fill-color': matchExpression,
              // 'fill-opacity': 0.7,
            },
          });
        }
        if (this.map.getLayer('heatwave-layer')) {
          return;
        } else {
          this.updateMap();
        }
      }
    );
  }
}
