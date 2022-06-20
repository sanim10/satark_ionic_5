import { SafetyInfoComponent } from './safety-info/safety-info.component';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NearbyHospitalService } from './nearby-hospital/nearby-hospital.service';

@Component({
  selector: 'app-road-accident',
  templateUrl: './road-accident.page.html',
  styleUrls: ['./road-accident.page.scss'],
})
export class RoadAccidentPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private NHS: NearbyHospitalService
  ) {}

  ngOnInit() {}
  routeTo(route) {
    switch (route) {
      case 'home':
        this.navCtrl.navigateBack('/home', { replaceUrl: true });
        break;

      case 'safety-info':
        this.openSafetyInfo();
        break;
      case 'report-accident':
        this.navCtrl.navigateForward('/road-accident/report-accident');

        break;

      case 'nearby-hospital':
        this.NHS.clicked.next(true);
        break;

      case 'sos':
        this.NHS.SOS.next(true);
        break;
    }
  }

  async openSafetyInfo() {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: SafetyInfoComponent,
    });
    return await modal.present();
  }
}
