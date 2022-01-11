import { NavOptions, createAnimation } from '@ionic/core';

interface TransitionOptions extends NavOptions {
  progressCallback?: (ani: Animation | undefined) => void;
  baseEl: any;
  enteringEl: HTMLElement;
  leavingEl: HTMLElement | undefined;
}

const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }
  const ionPage = element.querySelector(
    ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'
  );
  if (ionPage) {
    return ionPage;
  }
  return element;
};

export const pageTransition = (_: HTMLElement, opts: TransitionOptions) => {
  const DURATION = 50;

  const rootTransition = createAnimation().duration(opts.duration || DURATION);
  // .easing('cubic-bezier(0.0, 0.1, 0.1, 1.0)');

  const enteringPage = createAnimation()
    .addElement(getIonPageElement(opts.enteringEl))
    .beforeRemoveClass('ion-page-invisible');

  const leavingPage = createAnimation().addElement(
    getIonPageElement(opts.leavingEl)
  );

  if (opts.direction === 'forward') {
    enteringPage.fromTo('opacity', '0%', '100%');
    // enteringPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');//alt
    // leavingPage.fromTo('transform', 'translateX(0)', 'translateX(-20%)');
  } else {
    leavingPage.fromTo('opacity', '100%', '0%');
    // leavingPage.fromTo('transform', 'translateX(0)', 'translateX(100%)'); //alt
    // enteringPage.fromTo('transform', 'translateX(-20%)', 'translateX(0)');
  }

  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);

  return rootTransition;
};
