import { take } from 'rxjs/operators';
import { AuthService } from './../../../guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../providers/api.service';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrivacyPolicyComponent } from 'src/app/shared/privacy-policy/privacy-policy.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setup-profile-email',
  templateUrl: './setup-profile-email.page.html',
  styleUrls: ['./setup-profile-email.page.scss'],
})
export class SetupProfileEmailPage implements OnInit {
  @ViewChild('name') name;
  @ViewChild('phone') phone;
  @ViewChild('district') district;
  @ViewChild('block') blocks;
  @ViewChild('agree') agree;

  public district_data: any;
  public block_data: any;
  public success: any;
  Form: FormGroup;

  district_id: string;
  token_id: string;
  email_id: string;
  block_id: string;
  device_id: string;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    public formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {
    this.getDistrict();

    this.Form = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
      phone: ['', Validators.compose([Validators.required])],
      district: ['', Validators.required],
      block: ['', Validators.required],
      agree: ['false', Validators.requiredTrue],
    });
  }

  ngOnInit() {}

  async openPrivacy() {
    const modal = this.modalController.create({
      swipeToClose: true,
      component: PrivacyPolicyComponent,
    });
    (await modal).present();
  }

  getDistrict() {
    this.apiService
      .getDistrict()
      .pipe(take(1))
      .subscribe((data) => {
        this.district_data = data;
      });
  }

  getBlocks() {
    var dis_name = this.district.value;
    var len = this.district_data.length;
    for (var i = 0; i < len; ++i) {
      if (
        this.district_data[i].district_name == dis_name ||
        this.district_data[i].district_name_ory == dis_name
      ) {
        console.log('id', this.district_data[i].id);
        this.district_id = this.district_data[i].id;
      }
    }
    let param = {
      id: this.district_id,
    };
    this.apiService
      .getBlocks(param)
      .pipe(take(1))
      .subscribe((data) => {
        this.block_data = data;
      });
  }

  getBlocksId() {
    var block_name = this.blocks.value;
    console.log('block_name', block_name);
    var len = this.block_data.length;
    for (var i = 0; i < len; ++i) {
      if (
        this.block_data[i].block_name == block_name ||
        this.block_data[i].block_name_ory == block_name
      ) {
        console.log('block id', this.block_data[i].id);
        this.block_id = this.block_data[i].id;
      }
    }
  }
  async signUp() {
    this.loadingCtrl
      .create({ keyboardClose: true, mode: 'ios' })
      .then((loadingEl) => {
        loadingEl.present();
        if (this.Form.valid) {
          this.token_id = localStorage.getItem('token');
          this.device_id = localStorage.getItem('deviceid');
          var email = localStorage.getItem('email');
          var url = 'https://satark.rimes.int/api_user/users_ios_post';
          var params = JSON.stringify({
            token_id: this.token_id,
            email_id: email,
            name: this.name.value,
            district: this.district.value,
            dis_id: this.district_id,
            block: this.blocks.value,
            blk_id: this.block_id,
            device: this.device_id,
            phonenum: this.phone.value,
            extra_param: 'insert_user',
            role: '4',
          });
          console.log('param', params);
          this.httpClient
            .post(url, params, { responseType: 'text' })
            .pipe(take(1))
            .subscribe(
              (data) => {
                localStorage.removeItem('new_user');
                loadingEl.dismiss();
                this.authService.showAlert(
                  'Success!',
                  'You have successfully registered.'
                );
                this.navCtrl.navigateForward('/home', { replaceUrl: true });
              },
              (err) => {
                console.log('ERROR!: ', err);
                loadingEl.dismiss();
                // this.navCtrl.navigateBack('/login', { replaceUrl: true });
                this.authService.showAlert('Failed!', 'Try again');
              }
            );
        } else {
          loadingEl.dismiss();
          this.authService.showErrorToast(
            'Fill the mandatory details and accept terms and conditons'
          );
        }
      });
  }
}
