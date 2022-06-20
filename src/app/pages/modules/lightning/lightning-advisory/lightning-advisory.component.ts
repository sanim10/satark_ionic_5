import { SwiperComponent } from 'swiper/angular';
import { ApiService } from './../../../../providers/api.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions, Pagination } from 'swiper';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-lightning-advisory',
  templateUrl: './lightning-advisory.component.html',
  styleUrls: ['./lightning-advisory.component.scss'],
})
export class LightningAdvisoryComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;
  advisory_data;
  lang;
  activeSlide = 0;
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
      loadPrevNext: true, // pre-loads the next image to avoid showing a loading placeholder if possible
      loadPrevNextAmount: 2, //or, if you wish, preload the next 2 images
    },
  };
  advisory_img = [
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_1.svg',
      text: 'When thunderstrom comes, go out of water',
    },
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_2.svg',
      text: 'When thunder roars, go indoor',
    },
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_3.svg',
      text: 'If in an open field, crouch down and put your feet together',
    },
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_4.svg',
      text: 'Perform CPR immediately on the victim of ligntning',
    },
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_5.svg',
      text: 'Avoid taking bath during lightning storm as current can easily pass through water',
    },
    {
      img: '../../../../../assets/modules/lightning/advisory/adv_6.svg',
      text: 'Unplug unnecessary electrical equipments and avoid using corded telephones',
    },
  ];

  slideNext() {
    this.swiper.swiperRef.slideNext();
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    this.activeSlide = this.swiper.swiperRef.activeIndex;
  }

  constructor(
    private modalController: ModalController,
    private apiService: ApiService
  ) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {
    this.getAdvisoryData();
  }

  getAdvisoryData() {
    this.apiService.getNowcastDataLightning30Mins().subscribe((data) => {
      if (data['advisory'].length != 0) {
        this.advisory_data = data['advisory'];
        console.log('advisory dta', this.advisory_data);
      } else {
        this.advisory_data = null;
        console.log('no ad', this.advisory_data);
      }
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
