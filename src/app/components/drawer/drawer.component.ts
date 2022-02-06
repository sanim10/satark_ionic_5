import { ApiService } from './../../providers/api.service';
import { take } from 'rxjs/operators';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GestureController } from '@ionic/angular';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer', { read: ElementRef }) drawer: ElementRef;
  @Output('openStateChanged') openState: EventEmitter<Boolean> =
    new EventEmitter();
  @Input() drawerData: any;
  @Input() weatherForcast: any;
  @Input() heatwaveData: any;
  @Input() lightningData: any;
  @Input() rainStatus: any;
  drawerUp = false;

  public value_addtion_forecast_data: any;
  public user_data: any;
  block_id;
  user_id;
  current_location_block;
  current_location_block_ory;
  current_location_district;
  current_location_district_ory;
  forecast_data;

  lHelper;
  constructor(
    private gestCtrl: GestureController,
    private cdr: ChangeDetectorRef,
    private LanguageHelperService: LanguageHelperService,
    private apiService: ApiService
  ) {
    this.lHelper = LanguageHelperService;
  }

  async ngAfterViewInit() {
    const drawer = this.drawer.nativeElement;
    const gesture = await this.gestCtrl.create({
      el: drawer,
      gestureName: 'flipUp',
      direction: 'y',

      onEnd: (ev) => {
        if (ev.deltaY < -0.1 && !this.drawerUp) {
          this.drawerUp = true;
          this.openState.emit(true);
        } else if (ev.deltaY > 0.1 && this.drawerUp) {
          this.drawerUp = false;
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = ``;
          this.openState.emit(false);
        }
      },
    });
    gesture.enable(true);
  }
  ngOnInit() {
    // this.checklogin(localStorage.getItem('token'));
    this.block_id = localStorage.getItem('block_id');
    this.current_location_block = localStorage.getItem('block_name');
    this.current_location_block_ory = localStorage.getItem('block_name_ory');
    this.current_location_district = localStorage.getItem('district_name');
    this.current_location_district_ory =
      localStorage.getItem('district_name_ory');
  }

  toggleBackdrop(isVisible) {
    this.drawerUp = isVisible;
    this.cdr.detectChanges();
  }

  getCondition(conditon): string {
    switch (conditon) {
      case 1:
        return 'normal';

      case 2:
        return 'heat wave';

      case 3:
        return 'severe heatwave';

      case 4:
        return 'extreme heatwave';
    }
  }
}
