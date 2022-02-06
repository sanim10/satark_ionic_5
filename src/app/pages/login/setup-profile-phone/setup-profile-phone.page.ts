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
  selector: 'app-setup-profile-phone',
  templateUrl: './setup-profile-phone.page.html',
  styleUrls: ['./setup-profile-phone.page.scss'],
})
export class SetupProfilePhonePage implements OnInit {
  @ViewChild('name') name;
  @ViewChild('email') email;
  @ViewChild('district') district;
  @ViewChild('block') blocks;
  @ViewChild('phone') phone;
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
      email: [
        '',
        Validators.compose([
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ]),
      ],
      name: [
        '',
        Validators.compose([
          Validators.maxLength(20),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
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
        this.getBlocksId();
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
          // console.log('token....', this.token_id);
          // console.log('email....', (await this.angularFireAuth.currentUser).email);
          var email = localStorage.getItem('email');
          var split = email.split('@rimes.int');
          console.log('split is...', split);
          var phone = split[0];
          console.log('phone number is...', phone);
          var url = 'https://satark.rimes.int/api_user/users_ios_post';
          var params = JSON.stringify({
            token_id: this.token_id,
            email_id: this.email.value,
            name: this.name.value,
            district: this.district.value,
            dis_id: this.district_id,
            block: this.blocks.value,
            blk_id: this.block_id,
            device: this.device_id,
            phonenum: phone,
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
