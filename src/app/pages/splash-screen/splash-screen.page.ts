import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit, AfterViewInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, 2900);
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      SplashScreen.hide();
    }
  }
  ionViewDidLeave() {
    // StatusBar.show();
  }

  ngAfterViewInit() {
    // StatusBar.hide();\
  }
}
