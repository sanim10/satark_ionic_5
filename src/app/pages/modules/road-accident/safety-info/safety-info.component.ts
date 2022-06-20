import { ApiService } from 'src/app/providers/api.service';
import { ModalController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-safety-info',
  templateUrl: './safety-info.component.html',
  styleUrls: ['./safety-info.component.scss'],
})
export class SafetyInfoComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  @ViewChild('swiper_od', { static: true }) swiper_od?: SwiperComponent;
  lang;
  activeSlide = 0;
  slidesLength;
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
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
    },
  };
  constructor(private modalController: ModalController) {
    this.lang = localStorage.getItem('language');

    this.lang == 'en'
      ? (this.slidesLength = this.safety_info_img.length - 1)
      : (this.slidesLength = this.safety_info_img_od.length - 1);
  }

  safety_info_img = [
    {
      do: '',
      img: '../../../../../assets/modules/road-accident/safety_info/en/1_wear_belt.png',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/2_dont_no_cell_phone.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/3_DO_LANE_DRIVING.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/4_no_texting.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/5_traffic_rule.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/6_dont_drink_drive.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/7_slow_at_zebra.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/8_no_park.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/9_use_zebra.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/10_WEAR_HELMET.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/11_dont_drive_drowsy.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/en/12_SLIPPERY_ROAD.png',
      do: '',
    },
  ];
  safety_info_img_od = [
    {
      do: '',
      img: '../../../../../assets/modules/road-accident/safety_info/od/1_BE_FIRST_TO_OBEY THE_TRAFFIC_RULES_ORY.png',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/2_NO_OVERTAKING.png',
      dont: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/3_GIVE_ROAD_TO_OTHERS_ORY.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/4_LIFE_IS_PRECIOUS.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/5_WEAR_SEAT_BELTS_ORY.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/6_STAY_BEHIND_ZEBRA_CROSSING.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/7_WEAR_HELMET_ORY.png',
      do: '',
    },
    {
      img: '../../../../../assets/modules/road-accident/safety_info/od/8_FOLLOW_YOUR_LANE_WHILE_DRIVING_ORY.png',
      do: '',
    },
  ];

  ngOnInit() {}

  slideNext() {
    this.lang == 'en'
      ? this.swiper.swiperRef.slideNext()
      : this.swiper_od.swiperRef.slideNext();
  }
  slidePrev() {
    this.lang == 'en'
      ? this.swiper.swiperRef.slidePrev()
      : this.swiper_od.swiperRef.slidePrev();
  }

  onSlideChange() {
    this.lang == 'en'
      ? (this.activeSlide = this.swiper.swiperRef.activeIndex)
      : (this.activeSlide = this.swiper_od.swiperRef.activeIndex);
  }
  closeModal() {
    this.modalController.dismiss();
  }
}
