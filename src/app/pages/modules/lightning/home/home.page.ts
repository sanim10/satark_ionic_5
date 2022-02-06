import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { take } from 'rxjs/operators';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { FavModalComponent } from '../fav-modal/fav-modal.component';
import SwiperCore, { Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  activeTab: string;
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

  loading = true;
  public user_data: Array<any>;
  block_id: string;
  user_id: string;
  today: string;
  public fav_loc_data: any;
  public success_data: any;
  public registered_loc_data: any;
  public fav_loc_lightning_data: any;
  public dta_data: any;
  public dta_fav_data: any;
  dta_status_reg: string;
  dta_status_fav: string;
  lHelper;
  favourites = [
    {
      location: 'angul',
      condition: 'no lightning',
    },
    {
      location: 'Dhansala',
      condition: 'low lightning',
      advisory: [
        {
          headerName: "do's",
          content: [
            {
              img: '../../../../../assets/modules/lightning/dos/dos_1.jpg',
              text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
            },
            {
              img: '../../../../../assets/home/buttons/heatwave_ic.svg',
              text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
            },
            {
              img: '../../../../../assets/home/buttons/heatwave_ic.svg',
              text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
            },
          ],
        },

        {
          headerName: "dont's",
          content: [
            {
              img: '../../../../../assets/home/buttons/heatwave_ic.svg',
              text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
            },
            {
              img: '../../../../../assets/home/buttons/heatwave_ic.svg',
              text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
            },
          ],
        },
      ],
    },
  ];

  lightning = {
    location: 'Dhankauda, Sambalpur',
    condition: 'medium lightning',
    temperature: '33',
    advisory: [
      {
        headerName: "do's",
        content: [
          {
            img: '../../../../../assets/modules/lightning/dos/dos_1.svg',
            text: 'When thunderstorm comes, go out of water',
          },
          {
            img: '../../../../../assets/modules/lightning/dos/dos_2.svg',
            text: 'When thunder roars, go indoors',
          },
          {
            img: '../../../../../assets/modules/lightning/dos/dos_3.svg',
            text: 'If in an open field, crouch down and put your feet together ',
          },
          {
            img: '../../../../../assets/modules/lightning/dos/dos_4.svg',
            text: 'Perform CPR immediately on the victim of lightning',
          },
          {
            img: '../../../../../assets/modules/lightning/dos/dos_5.svg',
            text: 'Avoid taking bath during lightning storm as current can easily pass through water',
          },
          {
            img: '../../../../../assets/modules/lightning/dos/dos_6.svg',
            text: 'Unplug unnecesssary electrical equipments and avoid using corded telephones',
          },
        ],
      },

      {
        headerName: "dont's",
        content: [
          {
            img: '../../../../../assets/home/buttons/lightning_ic.svg',
            text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
          },
          {
            img: '../../../../../assets/home/buttons/lightning_ic.svg',
            text: 'Lorem ipsum dolor sit amet. Ex dolore facere ut perferendis dicta rem rerum voluptas. ',
          },
        ],
      },
    ],
  };

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private authService: AuthService,
    private languageService: LanguageHelperService
  ) {
    this.activeTab = 'current';
    this.lHelper = this.languageService;
  }
  ngAfterViewInit() {
    this.display();
  }

  ngOnInit() {}

  display() {
    this.loading = true;
    this.checklogin(localStorage.getItem('token'));
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async openFavLoc(lightning: any) {
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FavModalComponent,
      componentProps: { lightningData: lightning },
    });
    return await modal.present();
  }

  checklogin(id: string) {
    this.apiService
      .checklogin(id)
      .pipe(take(1)) //call api to check token
      .subscribe((data) => {
        this.user_data = data['result'];
        console.log('user_data', this.user_data);
        this.block_id = this.user_data[0].block_id;
        this.user_id = this.user_data[0].id;
        console.log('block', this.user_data[0].block_id);
        this.getFavLocations(this.user_id);
        this.getLightningAdvRegisteredLocData(this.block_id);
        this.getLightningAdvFavLocData(this.user_id);
        this.getDtaRegBlocks(this.block_id);
        this.getDtaFavBlocks(this.user_id);
      });
  }

  ////get fav location detail of user by userid
  getFavLocations(usrid: string) {
    let param = {
      id: usrid,
    };
    this.apiService.getFavLocations(param).subscribe(
      (data) => {
        this.fav_loc_data = data['result'];
        this.success_data = data['success'];
        if (!this.success_data) {
          this.fav_loc_data = null;
        } else {
          console.log('fav locations', this.fav_loc_data);
        }
      },
      (Error) => {
        this.authService.showErrorToast(
          'Error while getting location. Please try again.'
        );
      }
    );
  }

  /////get lightning data for user registered location
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
      },
      (Error) => {
        this.authService.showErrorToast(
          'Error while getting data. Please refresh the page.'
        );
      }
    );
  }

  /////get lightning data for user favourite location
  getLightningAdvFavLocData(usr_id: string) {
    let param = {
      id: usr_id,
    };
    this.apiService.getFavLocLightningData(param).subscribe(
      (data) => {
        this.fav_loc_lightning_data = data['advisory'];
        if (this.fav_loc_lightning_data?.length != 0) {
          console.log('fav_loc_lightning_data', this.fav_loc_lightning_data);
          // this.fav_loc_lightning_data[0].l_type = 'High';
          // this.fav_loc_lightning_data.forEach((element) => {
          //   this.getLightningFavLocData(element.block_id)
          //     .pipe(take(1))
          //     .subscribe((data) => {});
          // });
        } else {
          this.fav_loc_lightning_data = null;
          console.log('no fav_loc_lightning_data', this.fav_loc_lightning_data);
        }
      },
      (Error) => {
        this.authService.showErrorToast(
          'Error while getting data. Please refresh the page.'
        );
      }
    );
  }

  //check if registered block has dta or not
  getDtaRegBlocks(id: string) {
    let param = {
      block_id: id,
    };
    this.apiService.getDtaBlockNames(param).subscribe(
      (data) => {
        this.dta_data = data;
        if (this.dta_data?.length != 0) {
          console.log('dta blocks...', this.dta_data);
          // for(var i = 0; i <= this.dta_data.length; ++i){
          //   if(this.block_id === this.dta_data[i].block_id){
          //     this.dta_status_reg = this.dta_data[i].severity;
          //     break;
          //   } else {
          //     this.dta_status_reg = null;
          //   }
          // }
        } else {
          // this.dta_data = null;
          this.dta_data[0].severity = null;
        }
        this.loading = false;
      },
      (err) => {
        this.authService.showErrorToast(
          'Error while getting data. Please refresh the page.'
        );
      }
    );
  }

  //check if fav blocks have dta or not
  getDtaFavBlocks(id: string) {
    let param = {
      user_id: id,
    };
    this.apiService.getDtaFavBlockNames(param).subscribe(
      (data) => {
        this.dta_fav_data = data;
        if (this.dta_fav_data?.length != 0) {
          console.log('dta blocks fav...', this.dta_fav_data);
          // for(var i = 0; i <= this.dta_data.length; ++i){
          //   if(this.block_id === this.dta_data[i].block_id){
          //     this.dta_status_reg = this.dta_data[i].severity;
          //     break;
          //   } else {
          //     this.dta_status_reg = null;
          //   }
          // }
        } else {
          this.dta_fav_data = null;
        }
      },
      (err) => {
        this.authService.showErrorToast(
          'Error while getting data. Please refresh the page.'
        );
      }
    );
  }

  /////get lightning data for user registered location
  getLightningFavLocData(blk_id: string) {
    let param = {
      id: blk_id,
    };
    return this.apiService.getRegisteredLocLightningData(param);
  }
}
