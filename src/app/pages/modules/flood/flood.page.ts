import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flood',
  templateUrl: './flood.page.html',
  styleUrls: ['./flood.page.scss'],
})
export class FloodPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  routeTo(route) {
    switch (route) {
      case 'hydro-forecast':
        this.router.navigateByUrl('/flood/hydro-forecast');
        break;
      case 'rainfall-forecast':
        this.router.navigateByUrl('/flood/rainfall-forecast');
        break;
      case 'map':
        this.router.navigateByUrl('/flood/map');
        break;
    }
  }
}
