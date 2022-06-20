import { NearbyHospitalService } from './nearby-hospital/nearby-hospital.service';
import { AdvisoryComponent } from './advisory/advisory.component';
import { FirstAidComponent } from './first-aid/first-aid.component';
import { NavController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake-bite',
  templateUrl: './snake-bite.page.html',
  styleUrls: ['./snake-bite.page.scss'],
})
export class SnakeBitePage implements OnInit {
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

      case 'first-aid':
        this.openFirstAid();
        break;

      case 'advisory':
        this.openAdvisory();
        break;

      case 'report-snakebite':
        this.navCtrl.navigateForward('/snake-bite/report-snakebite');
        break;

      case 'nearby-hospital':
        this.NHS.clicked.next(true);
        break;

      case 'sos':
        this.NHS.SOS.next(true);
        break;
    }
  }

  async openFirstAid() {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FirstAidComponent,
    });
    return await modal.present();
  }

  async openAdvisory() {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: AdvisoryComponent,
    });
    return await modal.present();
  }
}
