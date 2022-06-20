import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { AuthService } from './../../../../guard/auth.service';
import { ApiService } from './../../../../providers/api.service';
import { SwiperComponent } from 'swiper/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() newheatwaveData: any;
  @Input() blockId: any;
  @Input() presented: any;

  loading = false;
  public imd_alert_data: any;
  public heatwaveData: any;
  public block_id: any;
  lHelper;
  heatwave = [
    {
      condition: 'No Heatwave',
      condition_class: 'normal',
      advisory: [
        {
          headerName: 'warning',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/warning_1.svg',
              text: 'Maximum temperatures are near normal',
            },
          ],
        },
        {
          headerName: 'impact',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/impact_1.svg',
              text: 'Comfortable Temperatures and No actions are needed',
            },
          ],
        },

        {
          headerName: 'suggestion',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/suggestion_1.svg',
              text: 'Continue to work as usual',
            },
          ],
        },
      ],
    },
    {
      condition: 'Heatwave Alert',
      condition_class: 'heat wave',
      advisory: [
        {
          headerName: 'warning',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/heat/warning_1.svg',
              text: 'Heatwave conditions at isolated pockets persists on 2 days',
            },
          ],
        },
        {
          headerName: 'impact',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/heat/impact_1.svg',
              text: 'Moderate temperature. Heat is tolerable for general public but moderate health concern for vulnerable people like Infants, elderly and people with chronic diseases',
            },
          ],
        },

        {
          headerName: 'suggestion',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/heat/suggestion_1.svg',
              text: 'Avoid heat exposure. Cover your head when outside like cloths, hat, umbrella',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/heat/suggestion_2.svg',
              text: 'Wear light weight light color, loose cotton clothes. Drink lot of Water',
            },
          ],
        },
      ],
    },

    {
      condition: 'Severe Heat Alert',
      condition_class: 'severe heatwave',
      advisory: [
        {
          headerName: 'warning',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/warning_1.svg',
              text: 'Severe heatwave conditions persist for two days',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/warning_1.svg',
              text: 'Though not severe, heatwave conditions persist for four days or more',
            },
          ],
        },
        {
          headerName: 'impact',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/impact_1.svg',
              text: 'High temperature. increased likelihood of heat illness symptoms in people who are exposed to sun for a prolonged period or doing heavy work',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/impact_2.svg',
              text: 'High health concern for vulnerable people like Infants, elderly and people with chronic diseases',
            },
          ],
        },

        {
          headerName: 'suggestion',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/suggestion_1.svg',
              text: 'Avoid heat exposure. Keep cool ',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/suggestion_2.svg',
              text: 'Drink enough water even if not thirsty. Keep yourself hydrated',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/severe/suggestion_3.svg',
              text: 'Use ORS, homemade drinks like lassi, torani (rice water), lemon water, butter milk etc',
            },
          ],
        },
      ],
    },
    {
      condition: 'Extreme Heat Alert',
      condition_class: 'extreme heatwave',
      advisory: [
        {
          headerName: 'warning',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/warning_1.svg',
              text: 'Severe heatwave conditions persist for two days',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/warning_1.svg',
              text: 'Total number of heat/severe heat waves days exceeding 6 days',
            },
          ],
        },
        {
          headerName: 'impact',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/impact_1.svg',
              text: 'Very high likelihood of developing, heat illness and heat stroke',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/impact_2.svg',
              text: 'People of all ages are vulnerable during this period including the livestock',
            },
          ],
        },

        {
          headerName: 'suggestion',
          content: [
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/suggestion_3.svg',
              text: 'Extreme care for vulnerable people',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/suggestion_1.svg',
              text: 'Take care of livestock. Provide lot of liquid',
            },
            {
              img: '../../../../../assets/modules/heatwave/advisory/extreme/suggestion_2.svg',
              text: 'Don’t do hard work in the sun',
            },
          ],
        },
      ],
    },
  ];
  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private apiService: ApiService,
    private authService: AuthService,
    private languageHelperService: LanguageHelperService
  ) {
    // this.back();
    this.lHelper = languageHelperService;
  }

  ngOnInit() {
    this.block_id = this.newheatwaveData;
    this.display();
  }

  display() {
    this.loading = true;

    if (this.blockId == null) {
      this.getHeatwaveForEachBlock(this.block_id);
    } else {
      this.getHeatwaveForEachBlock(this.blockId);
    }
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  // get imd heatwave alerts for each block
  getHeatwaveForEachBlock(block_id) {
    let param = {
      id: block_id,
      block_id: block_id,
    };
    this.apiService
      .getUpdatedValueAdditionDataForWeather(param)
      // .getImdHeatwaveAlertsDissemintationForEachBlock(param)
      .subscribe(
        (data) => {
          this.imd_alert_data = data;
          if (this.imd_alert_data?.length != 0) {
            console.log(this.imd_alert_data);

            switch (this.imd_alert_data[0].heat_wave_status) {
              case '1':
                this.heatwaveData = this.heatwave[0];
                break;
              case '2':
                this.heatwaveData = this.heatwave[1];
                break;
              case '3':
                this.heatwaveData = this.heatwave[2];
                break;
              case '4':
                this.heatwaveData = this.heatwave[3];
                break;
            }
          } else {
            this.imd_alert_data = null;
          }
          this.loading = false;
        },
        (Error) => {
          this.loading = false;

          this.authService.showErrorToast(
            'Error while getting data. Please reload the page.'
          );
        }
      );
  }

  convertDate(date): string {
    var newData = date.split('-');

    switch (newData[1]) {
      case '01':
        return 'Jan ' + newData[2];
        break;

      case '02':
        return 'Feb ' + newData[2];
        break;

      case '03':
        return 'Mar ' + newData[2];
        break;

      case '04':
        return 'Apr ' + newData[2];
        break;

      case '05':
        return 'May ' + newData[2];
        break;

      case '06':
        return 'Jun ' + newData[2];
        break;

      case '07':
        return 'Jul ' + newData[2];
        break;

      case '08':
        return 'Aug ' + newData[2];
        break;

      case '09':
        return 'Sep ' + newData[2];
        break;

      case '10':
        return 'Oct ' + newData[2];
        break;

      case '11':
        return 'Nov ' + newData[2];
        break;

      case '12':
        return 'Dec ' + newData[2];
        break;
    }
  }

  getCondition(conditon): string {
    switch (conditon) {
      case 1:
        return 'No Heatwave';

      case 2:
        return 'Heatwave Alert';

      case 3:
        return 'Severe Heat Alert';

      case 4:
        return 'extreme heatwave';
    }
  }
}
