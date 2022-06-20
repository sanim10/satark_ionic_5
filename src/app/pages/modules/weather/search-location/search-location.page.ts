import { FavModalComponent } from '../fav-modal/fav-modal.component';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ApiService } from '../../../../providers/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
})
export class SearchLocationPage implements OnInit {
  public block_data: any = [];
  public district_data: any = [];
  public filtereditems: any = [];
  searchTerm: string = '';
  lang;
  constructor(
    private apiService: ApiService,
    private modalController: ModalController
  ) {
    this.getBlocks();
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {}

  getBlocks() {
    this.apiService
      .getAllBlocks()
      .pipe(take(1))
      .subscribe((data) => {
        this.block_data = data;
        console.log('block data', this.block_data);
      });
  }

  // getDistricts() {
  //   this.apiService
  //     .getDistrict()
  //     .pipe(take(1))
  //     .subscribe((data) => {
  //       this.district_data = data;
  //       console.log('district_data', this.district_data);
  //     });
  // }

  filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);

    if (this.searchTerm && this.searchTerm.trim() != '') {
      console.log(this.searchTerm);
      this.filtereditems = this.block_data.filter((item) => {
        return (
          item.block_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
          -1
        );
      });
    } else {
      this.filtereditems = null;
    }
  }

  async openModal(block_id, block_name, block_name_ory) {
    console.log(block_id);
    const modal = await this.modalController.create({
      swipeToClose: true,
      component: FavModalComponent,
      componentProps: {
        blockId: block_id,
        block_name: block_name,
        block_name_ory: block_name_ory,
      },
    });
    return await modal.present();
  }
}
