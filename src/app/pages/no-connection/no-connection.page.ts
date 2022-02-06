import { Network } from '@capacitor/network';
import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
})
export class NoConnectionPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.checkConnection();
  }

  checkConnection() {
    Network.getStatus().then((status) => {
      console.log(status);
      if (status.connected) {
        console.log('click');
        this.navCtrl.back();
      } else {
        this.showErrorToast('No connection found');
      }
    });
  }

  showErrorToast(txt) {
    this.toastCtrl
      .create({
        message: txt,
        duration: 1000,
        position: 'bottom',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }
}
