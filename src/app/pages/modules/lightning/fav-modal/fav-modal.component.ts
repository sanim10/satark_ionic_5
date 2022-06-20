import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { SwiperComponent } from 'swiper/angular';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination } from 'swiper';
import { ModalController, Platform } from '@ionic/angular';
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-fav-modal',
  templateUrl: './fav-modal.component.html',
  styleUrls: ['./fav-modal.component.scss'],
})
export class FavModalComponent implements OnInit {
  @Input() lightningData;
  @Input() blockId: any;
  @Input() block_name: any;
  @Input() block_name_ory: any;
  @Input() presented: any;
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    allowTouchMove: true,
    pagination: {
      el: '.swiper-pagination',
      renderBullet: (index, className) => {
        return '<span class="' + className + '">' + '</span>';
      },
    },
  };

  loading = false;
  block_id: string;
  public success_data: any;
  public registered_loc_data: any;
  lHelper;
  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private apiService: ApiService,
    private authService: AuthService,
    private languageHelper: LanguageHelperService
  ) {
    this.lHelper = languageHelper;
  }

  ngOnInit() {
    this.registered_loc_data = this.lightningData;
    console.log(this.registered_loc_data);
    this.display();
  }

  display() {
    if (this.blockId == null) {
      this.getLightningAdvRegisteredLocData(this.lightningData.block_id);
    } else {
      this.getLightningAdvRegisteredLocData(this.blockId);
    }
    this.loading = true;
  }

  doRefresh(event) {
    // this.display();
    this.loading = true;
    setTimeout(() => {
      event.target.complete();
      this.loading = false;
    }, 500);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getLightningAdvRegisteredLocData(blk_id: string) {
    let param = {
      id: blk_id,
    };
    this.apiService.getRegisteredLocLightningData(param).subscribe(
      (data) => {
        this.registered_loc_data = data['advisory'];
        if (this.registered_loc_data?.length != 0) {
          console.log('registered_loc_data', this.registered_loc_data);
        } else {
          // this.registered_loc_data = null;
          this.registered_loc_data.l_type = null;
          console.log('no registered_loc_data', this.registered_loc_data);
        }
        this.loading = false;
      },
      (Error) => {
        this.authService.showErrorToast(
          'Error while getting data. Please refresh the page.'
        );
        this.loading = false;
      }
    );
  }
}
