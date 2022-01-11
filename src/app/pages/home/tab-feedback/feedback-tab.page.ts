import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from './../../../providers/api.service';
import { AuthService } from './../../../guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback-tab',
  templateUrl: './feedback-tab.page.html',
  styleUrls: ['./feedback-tab.page.scss'],
})
export class FeedbackTabPage implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private navctrl: NavController
  ) {}
  token_id: string;
  user_id: string;
  district_name: string;
  block_name: string;
  public user_data: any;
  lang;
  ngOnInit() {
    this.user_id = localStorage.getItem('token');
    this.lang = localStorage.getItem('language');
  }

  checklogin(id: string) {
    let param = {
      token_value: id,
    };
    this.apiService
      .checklogin(param) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
        this.user_id = this.user_data[0].id;
        this.district_name = this.user_data[0].district_name;
        this.block_name = this.user_data[0].block_name;
        console.log('user-id', this.user_data[0].id);
      });
  }

  saveFeedback(field, feedback) {
    console.log(field + ' ' + feedback);
    var url = 'https://satark.rimes.int/api_user/feedback_post';
    var params = JSON.stringify({
      token_id: this.token_id,
      user_id: this.user_id,
      district: this.district_name,
      block: this.block_name,
      field: field,
      content: feedback,
    });

    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      async (data) => {
        console.log('data', data);
        if (this.lang == 'en' || this.lang == null) {
          let alert = this.alertCtrl.create({
            header: 'Report Submitted',
            message: 'Your feedback has been sucessfully submitted. Thank you.',
            buttons: ['OK'],
          });
          (await alert).present();
          this.navctrl.navigateBack('/home', { replaceUrl: true });
        } else {
          let alert = this.alertCtrl.create({
            header: 'Report Submitted',
            message: 'Your feedback has been sucessfully submitted. Thank you.',
            buttons: ['OK'],
          });
          (await alert).present();
          this.navctrl.navigateBack('/home', { replaceUrl: true });
        }
      },
      async (err) => {
        console.log('ERROR!: ', err);
        if (this.lang == 'en' || this.lang == null) {
          let alert = this.alertCtrl.create({
            header: 'Submission Fail!',
            message: 'Please try again',
            buttons: ['OK'],
          });
          (await alert).present();
        } else {
          let alert = this.alertCtrl.create({
            header: 'ଦାଖଲ ବିଫଳ !',
            message: 'Please try again',
            buttons: ['ଠିକ୍'],
          });
          (await alert).present();
        }
      }
    );
  }
}
