import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Market } from '@ionic-native/market/ngx';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { pageTransition } from './helper/page-transistions';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/language/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    SwiperModule,
    HttpClientModule,
    IonicModule.forRoot({
      backButtonText: '',
      // mode: 'ios',
      swipeBackEnabled: false,
      navAnimation: pageTransition,
    }),
    HttpClientModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: setTranslateLoader,
        deps: [HttpClient],
      },
    }),

    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    TranslateModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenOrientation,
    Navigator,
    MobileAccessibility,
    AndroidPermissions,
    Market,
    InAppBrowser,
    // BackgroundGeolocation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
