import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from './../../../guard/auth.service';
import { ApiService } from './../../../providers/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lightning',
  templateUrl: './lightning.page.html',
  styleUrls: ['./lightning.page.scss'],
})
export class LightningPage implements OnInit {
  loading = true;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  routeTo() {
    this.navCtrl.navigateForward('lightning/lightning-map');
  }
  routeToHome() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }
}
