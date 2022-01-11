import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(private modalController: ModalController) {}
  truel = false;
  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
