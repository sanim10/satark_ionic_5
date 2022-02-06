import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit, AfterViewInit {
  @ViewChild('video', { read: ElementRef })
  videoElement: ElementRef;

  _android = false;
  _ios = false;
  constructor(private router: Router, private platform: Platform) {
    if (this.platform.is('ios')) {
      this._ios = true;
    } else {
      this._android = true;
    }
  }

  ngOnInit() {}

  ionViewDidEnter() {
    if (!this._android) {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
      setTimeout(() => {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }, 3000);
      console.log('ios');
    }
  }
  ionViewDidLeave() {}

  ngAfterViewInit() {
    if (this._android) {
      this.videoElement.nativeElement.addEventListener('loadeddata', (e) => {
        if (this.videoElement.nativeElement.readyState >= 3) {
          setTimeout(() => {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          }, 2300);
          console.log('android');
          if (Capacitor.isPluginAvailable('SplashScreen')) {
            SplashScreen.hide();
          }
        }
      });
    }
  }
}
