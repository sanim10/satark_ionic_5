import { AuthService } from './../../../../guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../../../../providers/api.service';
import {
  ActionSheetController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    domSanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private httpClient: HttpClient,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}
  public user_data = null;
  user_image: any;
  img: any;

  ngOnInit() {
    this.checklogin(localStorage.getItem('token'));
  }

  closeModal() {
    this.modalController.dismiss();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        this.user_image = this.user_data[0].user_image;
        if (
          this.user_image != null ||
          this.user_image != 'null' ||
          this.user_image != ''
        ) {
          this.img = this.user_image;
        } else {
          this.user_image = 'null';
        }
        // console.log('user_data', this.user_data);
        // console.log('full name', this.user_data[0].full_name);
      });
  }

  async getPhoto() {
    var buttons = [
      {
        text: 'Camera',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: 'Photos',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {},
      },
    ];

    if (
      this.user_image != 'null' ||
      this.user_image != null ||
      this.user_image != this.default_img
    ) {
      let butttondelete = {
        text: 'Delete',
        handler: () => {
          this.deleteImage();
        },
      };
      buttons.push(butttondelete);
    }
    (await this.actionSheetCtrl.create({ buttons: buttons })).present();
  }

  getCamera = (src) => {
    Camera.checkPermissions().then((status) => {
      if (status.camera == 'granted' && status.photos == 'granted') {
        switch (src) {
          case 1:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Camera,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
              var url = 'https://satark.rimes.int/api_user/users_ios_post';
              var params = JSON.stringify({
                img: this.img,
                token: this.user_data[0].token,
                extra_param: 'update_image',
              });

              this.httpClient
                .post(url, params, { responseType: 'text' })
                .subscribe(
                  (data) => {
                    console.log('post data', params);
                    this.checklogin(this.user_data[0].token);
                  },
                  async (err) => {
                    let alert = this.alertCtrl.create({
                      message:
                        'Your profile cannot be updated at this time.Please try again later',
                      buttons: ['OK'],
                    });
                    (await alert).present();
                  }
                );
            });
            break;

          case 2:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Photos,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
              var url = 'https://satark.rimes.int/api_user/users_ios_post';
              var params = JSON.stringify({
                img: this.img,
                token: this.user_data[0].token,
                extra_param: 'update_image',
              });

              this.httpClient
                .post(url, params, { responseType: 'text' })
                .subscribe(
                  (data) => {
                    console.log('post data', params);
                    this.checklogin(this.user_data[0].token);
                  },
                  async (err) => {
                    let alert = this.alertCtrl.create({
                      message:
                        'Your profile cannot be updated at this time.Please try again later',
                      buttons: ['OK'],
                    });
                    (await alert).present();
                  }
                );
            });
            break;
        }
      } else {
        this.authService.showErrorToast('Please enable camera access');
        Camera.requestPermissions().then((permissionStatus) => {
          console.log(permissionStatus);
        });
      }
    });
  };

  ////delete image and set default image
  deleteImage() {
    this.img = this.default_img;
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      img: this.img,
      token: this.user_data[0].token,
      extra_param: 'update_image',
    });
    this.httpClient.post(url, params, { responseType: 'text' }).subscribe(
      (data) => {
        console.log('post data', params);
        this.user_data[0].user_image = this.img;
      },
      async (err) => {
        let alert = this.alertCtrl.create({
          header:
            'Your profile cannot be updated at this time.Please try again later',
          buttons: ['OK'],
        });
        (await alert).present();
      }
    );
  }

  default_img: any =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAADAFBMVEUAAAAA//9/f/9Vqv8/f78zmcxVqtRIkdo/n984qeJMmeVFotA/lNROnNdIo9pEmd0/n99LpeFGm9RDodY/mdhIndpFotxCm50/n99HmNZEnNdCoNlImtpGnttEod1BnN5Hn9dFmthDndlBoNpGm9tEntxDod1HnNdGn9hEm9lCndpHoNtFnNxDntxCoN1GndlFn9lDnNpHnttGoNxEnNxDnt1Gm9lFndlEn9pDnNtGnttFn9xEnd1HntlFnNlEndpDn9tGnNtFntxEn9xDndlGntpFnNpEnttDn9tFndxEntxDnNlGndpFntpEnNtDnttGn9tFndxEntlDnNpFndpFn9tEndtGnttFn9xEndlDntpGnNpFndpEn9tDndtFntxFnNlEndpGntpFndpEnttEn9tGndxFntlEnNpDndpFntpFndtEnttDn9tFndlEntpEndpFndpFnttEndtEnttFnNlFndpEntpEndpFnttEnttEndtFntlFndpEndpEntpFndtFnttEnttEndtFntpFndpEndpFnttFndtEnttEnttFndpFntpEndpEnttFnttFndtEnttFndpFndpDntpEndtFnttFnttEndtEntpFndpFnNpEnttEndtFnttDnttEndpFntpFndlDnttEnttFndtFnttEndpEnNpFntlFndtEnttFnttFndtDntpEndpFnNlFntlDndtEnttFnttFnNpEntpFndlFnNlDnttEndtFnttFndpDnNpEntlFndlFnttDnttEnNtFntpDndpEnNlFntlFndtDnttEnttFnNpFntpDndlEnNlFnttDnNtDnttFndpFnNpDntlEndlFnttFnttDnNtEnttFndpFnNlDntlFnNtFnttDnttDnNtFntlFndlDnNlEnttFnNtFnttDnttFnNlFntlDnNlDnttFnttFnNtDnttDndlFnNlFntlDnNtEnttFnttDnNtDntlFnNlFnNlDnttDnNtFnttFnttDnNlDntlFnNlFntuotfl+AAAA/3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1O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';
}
