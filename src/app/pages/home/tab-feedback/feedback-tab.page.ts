import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
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
    private navCtrl: NavController,
    private translate: TranslateService
  ) {}
  token_id: string;
  user_id: string;
  district_name: string;
  block_name: string;
  public user_data: any;
  lang;
  ngOnInit() {
    this.lang = localStorage.getItem('language');
    this.token_id = localStorage.getItem('token');

    this.checklogin(this.token_id);
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .pipe(take(1))
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
          this.authService.showAlert(
            'Report Submitted',
            'Your feedback has been sucessfully submitted. Thank you.'
          );

          this.navCtrl.navigateBack('/home', { replaceUrl: true });
        } else {
          this.authService.showAlert(
            'Report Submitted',
            'Your feedback has been sucessfully submitted. Thank you.'
          );
          this.navCtrl.navigateBack('/home', { replaceUrl: true });
        }
      },
      async (err) => {
        console.log('ERROR!: ', err);
        if (this.lang == 'en' || this.lang == null) {
          let alert = this.alertCtrl.create({
            header: this.translate.instant('Submission Fail!'),
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
