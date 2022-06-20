import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-heatwave',
  templateUrl: './heatwave.page.html',
  styleUrls: ['./heatwave.page.scss'],
})
export class HeatwavePage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  routeTo() {
    this.navCtrl.navigateForward('heatwave/map-view');
  }
  routeToHome() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }
}
