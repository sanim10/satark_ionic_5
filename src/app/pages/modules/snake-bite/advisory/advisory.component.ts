import { ModalController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-advisory',
  templateUrl: './advisory.component.html',
  styleUrls: ['./advisory.component.scss'],
})
export class AdvisoryComponent implements OnInit {
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
      ? (this.slidesLength = this.advisory_img.length - 1)
      : (this.slidesLength = this.advisory_img_od.length - 1);
  }

  advisory_img = [
    /////////////////////donts //////////

    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/suck_wound.jpg',
      text: [
        {
          dont: 'Dont attempt to cut or apply suction to the wound.',
        },
        {
          dont: 'Dont put cold packs or ice near the wound.',
        },
      ],
    },
    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/catch_snake.jpg',
      text: [
        {
          dont: 'Dont try to kill, capture or transport the snake.',
        },
        {
          dont: 'Dont allow the victim to walk even for a short distance.',
        },
      ],
    },
    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/tie_wound.jpg',
      text: [
        {
          dont: 'Do not try to tie the wound area.',
        },
        {
          dont: 'Do not burn the wound.',
        },
      ],
    },
    {
      dont: '',
      text: [
        {
          dont: 'Dont apply any antiseptic or any other pastes.',
        },
        {
          dont: 'Do not wash the wound.',
        },
      ],
    },
    {
      after_bite: ' ',
      img: '../../../../../assets/modules/snake-bite/advisory/after_bite_.png',
      text: [
        {
          do: 'Note the time of bite.',
        },
        {
          do: 'Keep monitoring the symptoms (take picture every 10 min). It will help explain the doctor.',
        },
      ],
    },
    /////////////////////time is crucial //////////

    {
      time_is_crucial: '',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',
      text: [
        {
          dont: 'Dont panic. Even a bite from venomous snake is not fatal and can be cured.',
        },
        {
          dont: 'Dont delay in taking the victim to the neatrest hospital.',
        },
        {
          do: 'Call the nearest hosptial immidiately.',
        },
      ],
    },
    {
      time_is_crucial: '',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',
      text: [
        {
          do: 'Call the emergency number immidiately.',
        },
        {
          do: 'Keep calm, increase in heart beat increases the spread of the venom.',
        },
        {
          dont: 'Do not move the victim too much. keep him as still as possible.',
        },
      ],
    },
    {
      time_is_crucial: '',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',
      text: [
        {
          do: 'Keep the wound at a level of the heart.',
        },
        {
          dont: 'Do not go to Tantrik or believe in black magic. It cannot cure.',
        },
        {
          do: 'Remove any shoes, tight clothes, or any other ornaments from the victims body.',
        },
      ],
    },
    /////////////////////how to avoid snakes//////////

    {
      be_safe: '',
      title: 'How to avoid SNAKES?',
      text: [
        {
          do: 'Keep the garbage away from home, rats come looking for food and atracks snakes to home.',
        },
        {
          do: 'If sleeping on the floor in open varanda, use mosquito net to protect from snakes coming near.',
        },
        {
          dont: 'Tree branches should not be touching the house.',
        },
      ],
    },
    {
      be_safe: '',
      title: 'How to avoid SNAKES?',
      text: [
        {
          dont: 'Dont keep wood materials rocks, stangant for long priod of time, snakes use them as their home.',
        },
        {
          do: 'Keep the house sorrounding clean from bushes, garbages.',
        },
        {
          do: 'While plucking flowers, vegeratbles fruits be careful to look for snakes.',
        },
      ],
    },

    /////////////////////snakes like to////////// -->

    {
      snakes_like: '',
      img: '../../../../../assets/modules/snake-bite/advisory/snake_like_to.png',
      text: [
        {
          dont: 'Move around quite, abandoned placess and bushes.',
        },
        {
          do: 'Look for food in the neighborhood rats, lizards and frogs.',
        },
        {
          do: 'Live mostly in paddy fields, vegetable fields, dense grass.',
        },
      ],
    },
    {
      snakes_like: '',
      img: '../../../../../assets/modules/snake-bite/advisory/snake_like_to.png',
      text: [
        {
          do: 'Bite during the morning hours, sunset and at night time.',
        },
        {
          do: 'Swim as well, be careful when in going into stangnat water bodies like ponds etc.',
        },
      ],
    },
  ];
  advisory_img_od = [
    /////////////////////donts //////////

    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/suck_wound.jpg',

      text: [
        {
          dont: 'ସାପ କାମୁଡି ଥିବା କ୍ଷତ ସ୍ଥାନକୁ ଛୁରୀ ରେ କାଟିବା କିମ୍ବା ପାଟି ଲଗାଇ ଚୁଚୁମିବା ଆବଶ୍ୟକ ନୁହେଁ ।',
        },
        {
          dont: ' କ୍ଷତ ସ୍ଥାନରେ ଥଣ୍ଡା ପଦାର୍ଥ କିମ୍ବା ବରଫ ଲଗାନ୍ତୁ ନାହିଁ ।',
        },
      ],
    },
    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/catch_snake.jpg',

      text: [
        {
          dont: 'ସାପକୁ ଧରିବାକୁ କିମ୍ବା ମାରିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ ନାହିଁ ।',
        },
        {
          dont: 'ସାପ କାମୁଡିଥିବା ବ୍ୟକ୍ତିଙ୍କୁ କୌଣସି ମତେ ଚାଲିବାକୁ ଦିୟନ୍ତୁ ନାହିଁ ।',
        },
      ],
    },
    {
      dont: '',
      img: '../../../../../assets/modules/snake-bite/advisory/tie_wound.jpg',

      text: [
        {
          dont: 'କ୍ଷତ ସ୍ଥାନ କୁ କପଡା କିମ୍ବା ରସୀ ରେ ବାନ୍ଧନ୍ତୁ ନାହିଁ ।',
        },
        {
          dont: 'କ୍ଷତ ସ୍ଥାନ କୁ ନିଆଁ ଅଥବା ନିଆଁ କାଠି ରେ ଜଳାନ୍ତୁ ନାହିଁ ।',
        },
      ],
    },
    {
      dont: '',
      text: [
        {
          dont: 'ଆଣ୍ଟିସେପ୍ଟିକ କ୍ରିମ ଅଥବା ଅନ୍ୟ କୌଣସି ପତ୍ରର ରସ ଲଗାନ୍ତୁ ନାହିଁ ।',
        },
        {
          dont: 'କ୍ଷତ ସ୍ଥାନକୁ ପାଣିରେ ଧୁଅନ୍ତୁ ନାହିଁ ।',
        },
      ],
    },
    {
      after_bite: ' ',
      title: 'ସାପ କାମୁଡିବା ପରେ...',
      img: '../../../../../assets/modules/snake-bite/advisory/after_bite_.png',

      text: [
        {
          do: 'ସାପ କାମୁଡ଼ିଥବା ସଠିକ ସମୟ ଜାଣି ରଖନ୍ତୁ ।',
        },
        {
          do: 'ସାପ କାମୁଡିବା ପରେ ରୋଗୀ ଏବଂ କ୍ଷତର ଲକ୍ଷଣକୁ ଧ୍ୟାନ ପୂର୍ବକ ଦେଖୁଥାନ୍ତୁ (ଆବଶ୍ୟକ ହେଲେ ଫୋଟୋ ନେଇ ରଖନ୍ତୁ). ପରେ ଡାକ୍ତରଙ୍କୁ ବୁଝାଇବାରେ ସହାୟକ ହେବ ।',
        },
      ],
    },
    /////////////////////time is crucial //////////

    {
      time_is_crucial: '',
      title: 'ସମୟ ବହୁତ ମୂଲ୍ୟବାନ...',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',

      text: [
        {
          dont: 'ଡରନ୍ତୁ ନାହିଁ କିମ୍ବା ଅସମ୍ଭାଳ ହୁଅନ୍ତୁ ନାହିଁ । ଠିକ ସମୟରେ ଚିକିତ୍ସା କଲେ, ବିଷଧର ସାପ କାମୁଡ଼ା ବି ଭଲ ହେଇ ପାରିବ ।',
        },
        {
          dont: 'ଡରି ସମୟ ନଷ୍ଟ କରନ୍ତୁ ନାହିଁ, ସଙ୍ଗେ ସଙ୍ଗେ ଡାକ୍ତରଖାନା ଚାଲିଯାନ୍ତୁ ।',
        },
        {
          do: 'ତୁରନ୍ତ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନାକୁ ଫୋନ କରି ଜାଣନ୍ତୁ ।',
        },
      ],
    },
    {
      time_is_crucial: '',
      title: 'ସମୟ ବହୁତ ମୂଲ୍ୟବାନ...',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',

      text: [
        {
          do: 'ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ନମ୍ବରକୁ କଲ କରନ୍ତୁ ।',
        },
        {
          do: 'ଶାନ୍ତ ରୁହନ୍ତୁ । ହୃଦୟ ଏବଂ ରକ୍ତ ପ୍ରବାହ ବେଗ ବଢିଲେ ବିଷ ଆହୁରି ପ୍ରଖରତାର ସହ ପ୍ରସାରଣ ହୋଇଥାଏ ।',
        },
        {
          dont: 'ରୋଗୀକୁ ଏବଂ କ୍ଷତ ସ୍ଥାନକୁ ବେଶୀ ହଲାନ୍ତୁ ନାହିଁ । ଯେତେ ସମ୍ଭବ ସ୍ଥୀର ରଖିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।',
        },
      ],
    },
    {
      time_is_crucial: '',
      title: 'ସମୟ ବହୁତ ମୂଲ୍ୟବାନ...',
      img: '../../../../../assets/modules/snake-bite/advisory/time_imp.png',

      text: [
        {
          dont: 'ତାନ୍ତ୍ରିକ, ବାବା କିମ୍ବା କଳା ଯାଦୁ କରୁଥିବା ଲୋକଙ୍କ ପାଖକୁ ଯାଇ ସମୟ ନଷ୍ଟ କରନ୍ତୁ ନାହିଁ । ସେମାନଙ୍କ ଚିକିତ୍ସା ରେ ରୋଗୀ ଭଲ ହେବ ନାହିଁ, ବରଂ ବେଶୀ ଖରାପ ହୋଇଯିବ ।',
        },

        {
          do: 'ରୋଗୀ ପିନ୍ଧିଥିବା ସମସ୍ତ ଟାଇଟ କପଡା, ଜୋତା, ଏବଂ ଅଳଙ୍କାର ସବୁ ବାହାର କରି ଦିୟନ୍ତୁ ।',
        },
      ],
    },
    /////////////////////how to avoid snakes//////////

    {
      be_safe: '',
      title: 'ସାପଠୁ କେମିତି ଦୂର ରେ ରହିବେ !',

      text: [
        {
          do: 'ଅନ୍ଧାର ପରେ କିମ୍ବା ଟର୍ଚ୍ଚ ଲାଇଟ୍ ବିନା ଜମି, ଖେତବାଡ଼ି କିମ୍ବା ବୁଦା ଅଞ୍ଚଳକୁ ଯାଆନ୍ତୁ ନାହିଁ।.',
        },
        {
          dont: 'ଖାଲି ପାଦ ରେ କିମ୍ବା ଚପଲ ପିନ୍ଧି ଘଞ୍ଚ ଘାସ ଥିବା ସ୍ଥାନ ରେ ଚାଲନ୍ତୁ ନାହିଁ । ସର୍ବଦା ଜୋତା ବ୍ୟବହାର କରନ୍ତୁ ।',
        },
        {
          do: 'ବିଲ ରେ କିମ୍ବା ଘାସ କାଟିଲା ବେଳେ, ଲମ୍ବା ବାଡ଼ି ରେ ପ୍ରଥମେ ଘାସ କୁ ଏଡାଇ ଦେଖନ୍ତୁ. ସାପ ନାହିଁ ତ !',
        },
      ],
    },
    {
      be_safe: '',
      title: 'ସାପଠୁ କେମିତି ଦୂର ରେ ରହିବେ !',

      text: [
        {
          do: 'ଖାଦ୍ୟ ଆବର୍ଜନାକୁ ଘର ଠାରୁ ଦୂରରେ ପକାନ୍ତୁ, ମୂଷାମାନେ ଖାଦ୍ୟ ଖୋଜିବାକୁ ଆସନ୍ତି ଏବଂ ସାପମାନଙ୍କ ଘରକୁ ଆକର୍ଷିତ କରନ୍ତି ।',
        },
        {
          do: 'ଘର ବାରଣ୍ଡା ରେ ସୋଉଥିଲେ, ମଶାରୀ ବ୍ୟବହାର କରନ୍ତୁ । ଯାହାଦ୍ୱାରା ସାପ ମଶାରୀ ରେ ପଶି ପାରିବ ନାହିଁ ।',
        },
        {
          dont: 'ଗଛର ଡାଳ ଯେମିତି ଘର ର ଛାତ କୁ କିମ୍ବା ଝରକା କୁ ଲାଗି ନଥାଉ. ସାପ ଗଛ ଦେଇ ଘରେ ପଶି ପାରେ',
        },
      ],
    },
    {
      be_safe: '',
      title: 'ସାପଠୁ କେମିତି ଦୂର ରେ ରହିବେ !',
      text: [
        {
          dont: 'ଅଦରକାରୀ କାଠ, ପଥର, ନଡ଼ା, ସବୁ ଘର ପାଖରେ ଗଛିତ କରି ରଖନ୍ତୁ ନାହିଁ , ଏହି ସବୁ କିଛି ଦିନ ଭିତରେ ସାପର ଘର ପାଲଟି ଯାଏ ।',
        },
        {
          do: 'ଘରର ଆଖପାଖରେ ଥିବା ଆବର୍ଜନା, ଘାସ ବୁଦା କୁ ସଫା କରନ୍ତୁୁ, ବଡ ବଡ ଗାତ କୁ ପୋତି ଦିଅନ୍ତୁ ।',
        },
        {
          dont: 'ଗଛରୁ ଫୁଲ, ଫଳ ତୋଳିବା ବେଳେ କିମ୍ବା ଖେତରୁ ପରିବା ତୋଳିବା ସମୟରେ ସାପ ପ୍ରତି ସଜାଗ ରୁହନ୍ତୁ ।',
        },
      ],
    },

    /////////////////////snakes like to////////// -->

    {
      snakes_like: '',
      title: 'ସାପ ଙ୍କୁ ସୁହାଇଲା ଭଳି ପରିବେଶ...',
      img: '../../../../../assets/modules/snake-bite/advisory/snake_like_to.png',

      text: [
        {
          dont: 'ଶାନ୍ତ, ବ୍ୟବହାର ହେଉ ନଥିବା ଘର, କୋଠି, ଛାତ, କାଠଗଦା, ନାଳ ଇତ୍ୟାଦି ।',
        },
        {
          do: 'ଖାଦ୍ୟ ଅନ୍ୱେଷଣ ରେ ଆସି, ଯେମିତି ମୂଷା, ଝିଟିପିଟି, ବେଙ୍ଗ ଇତ୍ୟାଦି ।',
        },
        {
          do: 'ପ୍ରାୟତଃ ଧାନ କ୍ଷେତରେ, ପନିପରିବା କ୍ଷେତରେ, ଘନ ଘାସରେ ରହିବା ପାଇଁ ପସନ୍ଦ କରନ୍ତି',
        },
      ],
    },
    {
      snakes_like: '',
      title: 'ସାପ ଙ୍କୁ ସୁହାଇଲା ଭଳି ପରିବେଶ...',
      img: '../../../../../assets/modules/snake-bite/advisory/snake_like_to.png',

      text: [
        {
          do: 'ସାପ କେତେବେଳେ ଭି କାମୁଡି ପାରେ, କିନ୍ତୁ ବିଶେଷତଃ ପ୍ରାତଃ ସକାଳ, ସନ୍ଧ୍ୟା ଓ ଅନ୍ଧାର ରାତିରେ ବେଶୀ ସାପ କାମୁଡିବା ଦେଖାଯାଏ',
        },
        {
          do: 'ପୋଖରୀ ଆଦି ସ୍ଥିର ଜଳରାଶି ଭିତରକୁ ଯିବାବେଳେ ସାବଧାନ ରୁହନ୍ତୁ । କିଛି ସାପ ବହୁତ ଭଲ ପହଁରି ପାରନ୍ତି ।',
        },
      ],
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
