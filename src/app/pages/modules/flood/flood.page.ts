import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flood',
  templateUrl: './flood.page.html',
  styleUrls: ['./flood.page.scss'],
})
export class FloodPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  routeTo(route) {
    switch (route) {
      case 'hydro-forecast':
        this.navCtrl.navigateForward('/flood/hydro-forecast');
        break;
      case 'rainfall-forecast':
        this.navCtrl.navigateForward('/flood/rainfall-forecast');
        break;
      case 'map':
        this.navCtrl.navigateForward('/flood/map');
        break;
      case 'home':
        this.navCtrl.navigateBack('/home', { replaceUrl: true });
        break;
    }
  }
}
