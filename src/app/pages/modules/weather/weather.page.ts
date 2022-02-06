import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {
  lang;

  constructor(private router: Router) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {}

  routeTo() {
    this.router.navigateByUrl('weather/weather-map');
  }
}
