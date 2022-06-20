import { NavController } from '@ionic/angular';
import { AuthService } from './../../../guard/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  lang;

  constructor(private navCtrl: NavController) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {}

  routeTo() {
    // this.router.navigateByUrl('weather/weather-map');
    this.navCtrl.navigateForward('weather/map-view');
  }

  routeToHome() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }
}
