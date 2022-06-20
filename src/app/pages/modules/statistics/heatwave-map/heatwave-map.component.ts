import { AuthService } from './../../../../guard/auth.service';
import { take } from 'rxjs/operators';
import { ApiService } from './../../../../providers/api.service';
import { LoadingController } from '@ionic/angular';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { mapKey } from '../../../../config/key';

@Component({
  selector: 'app-heatwave-stat-map',
  templateUrl: './heatwave-map.component.html',
  styleUrls: ['./heatwave-map.component.scss'],
})
export class HeatwaveMapComponent
  implements AfterViewInit, OnInit, OnDestroy, OnChanges
{
  totalDeathDataForMap: any = [];
  map;
  lang;
  @Input() selectedYear;
  mapState;
  constructor(
    private loadingCtrl: LoadingController,
    private apiService: ApiService,

    private authService: AuthService
  ) {
    this.lang = localStorage.getItem('language');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mapState) {
      this.loadingCtrl
        .create({
          spinner: 'bubbles',
          cssClass: 'loader-css-class',
          mode: 'ios',
          duration: 10000,
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.totalDeathDataForMap = null;
          this.getTotalDeathDataForMap(changes.selectedYear.currentValue);
          loadingEl.dismiss();
        });
    }
  }

  ngOnDestroy() {
    this.map.remove();
  }
  ngAfterViewInit() {
    document.getElementById('map').style.opacity = '0';
    this.mapIt();
  }

  ngOnInit() {}

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
          // style: 'mapbox://styles/mapbox/streets-v11',
          style: 'mapbox://styles/rimes/cl0menxra00c415qloucxsvtj',
          center: [84.5121, 20.5012],
          zoom: 5.3,
        });
        this.map.on('load', () => {
          this.map.addSource('heatwave', {
            type: 'geojson',
            data: '../../../../../assets/geojson/Odisha_Dist.geojson',
          });

          this.map.addLayer({
            id: 'heatwave-layer',
            type: 'fill',
            source: 'heatwave',
            paint: {
              'fill-color': 'transparent',
              'fill-opacity': 0.7,
            },
          });

          this.map.addLayer({
            id: 'heatwave-layer2',
            type: 'line',
            source: 'heatwave',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': '#000',
              'line-width': 1,
            },
          });

          setTimeout(() => this.map.resize(), 0);
        });
        this.map.once('idle', () => {
          this.mapState = true;
          this.getTotalDeathDataForMap(this.selectedYear);
          document.getElementById('map').style.opacity = '1';
          document.getElementById('skeleton').style.display = 'none';

          loadingEl.dismiss();
        });
      });
  }

  updateMap() {
    var fcst: any = [];
    Object.values(this.totalDeathDataForMap).forEach((val) => {
      fcst.push(val);
    });

    const features = this.map.queryRenderedFeatures({
      layers: ['heatwave-layer'],
    });

    const matchExpression = ['match', ['get', 'id']];

    const unique = [...new Set(features.map((item) => item.properties.id))];
    var f1;
    f1 = unique;
    if (f1.length != 0) {
      f1.forEach((element) => {
        var ID = element;
        fcst.forEach((element) => {
          if (element['dis_id'] == ID) {
            let total_deaths = element['total_deaths'];

            if (total_deaths >= 1 && total_deaths <= 50) {
              matchExpression.push(ID, 'gold');
            } else if (total_deaths > 51 && total_deaths <= 100) {
              matchExpression.push(ID, 'yellow');
            } else if (total_deaths > 101 && total_deaths <= 150) {
              matchExpression.push(ID, 'orange');
            } else if (total_deaths > 151 && total_deaths <= 200) {
              matchExpression.push(ID, 'darkorange');
            } else if (total_deaths > 201 && total_deaths <= 250) {
              matchExpression.push(ID, 'coral');
            } else if (total_deaths > 251) {
              matchExpression.push(ID, 'red');
            }
          }
        });
      });
      matchExpression.push('white');
      if (this.map.getSource('heatwave') != null) {
        this.map.setPaintProperty(
          'heatwave-layer',
          'fill-color',
          matchExpression
        );
      }
    }
    if (this.map.getLayer('heatwave-layer')) {
      return;
    } else {
      this.updateMap();
    }
    console.log('updated');
  }

  ionViewWillLeave() {
    this.loadingCtrl.dismiss();
  }
  getTotalDeathDataForMap(year) {
    let param = {
      year: year,
    };

    this.apiService
      // .getTotalDeathByHeatwaveForMap()
      .getheatwavestatsByYear(param)
      .pipe(take(1))
      .subscribe((data) => {
        this.authService.showErrorToast('Fetching new data');
        this.totalDeathDataForMap = data;
        console.log('total death data for map', this.totalDeathDataForMap);
        if (this.totalDeathDataForMap == null) {
          this.authService.showErrorToastTop(
            'Data is not available currently!'
          );
        }
        this.updateMap();
      });
  }

  clearMap() {
    if (this.map.getSource('heatwave') != null) {
      this.map.setPaintProperty('heatwave-layer', 'fill-color', 'white');
    }
  }
}
