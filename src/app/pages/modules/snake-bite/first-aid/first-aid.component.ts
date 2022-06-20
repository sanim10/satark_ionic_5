import { ModalController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-first-aid',
  templateUrl: './first-aid.component.html',
  styleUrls: ['./first-aid.component.scss'],
})
export class FirstAidComponent implements OnInit {
  @ViewChild('swiper', { static: true }) swiper?: SwiperComponent;

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
  }

  ngOnInit() {}

  slideNext() {
    this.swiper.swiperRef.slideNext();
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  onSlideChange() {
    this.activeSlide = this.swiper.swiperRef.activeIndex;
  }
  closeModal() {
    this.modalController.dismiss();
  }

  first_aid_img = [
    {
      do: '',
      img: '../../../../../assets/modules/snake-bite/first-aid/man.png',
      text: 'Do not move the victim too much. Keep him as still as possible.',
    },
    {
      do: '',
      img: '../../../../../assets/modules/snake-bite/first-aid/wash_leg.png',
      text: 'Do not wash the wound. Dont apply any antiseptic or any other pastes.',
    },
    {
      do: '',
      img: '../../../../../assets/modules/snake-bite/first-aid/hospital_building.png',
      text: 'Dont delay in taking the victim to the nearest hospital.',
    },
  ];
}
