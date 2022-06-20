import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { take } from 'rxjs/operators';
import { ApiService } from './../../providers/api.service';
import { AuthService } from './../../guard/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-favorites',
  templateUrl: './edit-favorites.page.html',
  styleUrls: ['./edit-favorites.page.scss'],
})
export class EditFavoritesPage implements OnInit {
  public district_data: any;
  public block_data: any;
  public user_data: any = [];
  public user_datum: any = [];
  public result_data: any;
  public fav_loc_data: any;
  public success_data: any;
  block_id: string;
  user_id: string;
  search_item: string;
  found_data: any = [];
  items: any;
  filtereditems: any;
  searchTerm: string = '';
  exists: boolean = false;
  checked_state: string;
  lang: string;
  lHelper;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    languageHelperService: LanguageHelperService,
    private httpClient: HttpClient,
    private translate: TranslateService
  ) {
    this.lang = localStorage.getItem('language');
    this.lHelper = languageHelperService;
  }

  ngOnInit() {
    this.getBlocks();
    // this.checklogin(localStorage.getItem('token'));

    this.user_id = localStorage.getItem('id');
    this.user_datum.block_id = localStorage.getItem('block_id');
    this.user_datum.block_name = localStorage.getItem('block_name');
    this.user_datum.block_name_ory = localStorage.getItem('block_name_ory');
    this.user_datum.district_name = localStorage.getItem('district_name');
    this.user_datum.district_name_ory = localStorage.getItem('district_name_ory');
    this.user_data.push(this.user_datum);
    this.getFavLocations(this.user_id);

    this.found_data = null;
    this.filtereditems = [];
  }

  // checklogin(id: string) {
  //   this.apiService
  //     .checklogin(id) //call api to check token
  //     .pipe(take(1))
  //     .subscribe((data) => {
  //       console.log(data);
  //       this.user_data = data['result'];
  //       console.log('user_data', this.user_data);
  //       this.block_id = this.user_data[0].block_id;
  //       this.user_id = this.user_data[0].id;
  //       console.log('block', this.user_data[0].block_id);
  //       this.getFavLocations(this.user_id);
  //     });
  // }

  getBlocks() {
    this.apiService
      .getAllBlocks()
      .pipe(take(1))
      .subscribe((data) => {
        this.block_data = data;
        console.log('block data', this.block_data);
      });
  }

  getFavLocations(usrid: string) {
    this.apiService
      .getFavLocations(usrid)
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.fav_loc_data = data['result'];
          this.success_data = data['success'];
          if (!this.success_data) {
            this.fav_loc_data = null;
          } else {
            console.log('fav locations', this.fav_loc_data);
          }
        },
        (Error) => {
          this.authService.showErrorToast(
            'Error while getting location. Please try again.'
          );
        }
      );
  }

  ///change notification state
  changeNotificationState(e, id) {
    var checked = e.detail.checked;
    var fav_blockid = id;
    console.log('fav_blockid', fav_blockid);
    if (checked == true) {
      this.checked_state = 'yes';
      if(this.lang === "en"){
        this.authService.showErrorToast(
          'You will start getting notification for this location from now.'
        );
      } else {
        this.authService.showErrorToast(
          'ଆପଣ ବର୍ତ୍ତମାନଠାରୁ ଏହି ସ୍ଥାନ ପାଇଁ ସୂଚନା  ପାଇପାରିବେ'
        );
      }
    } else {
      this.checked_state = 'no';
      if(this.lang === "en"){
        this.authService.showAlert(
          'Notice!',
          'You will not get any notification for this location anymore.'
        );
      } else {
        this.authService.showAlert(
          'ସୂଚନା !',
          'ଆପଣ ଏହି ସ୍ଥାନ ପାଇଁ ଆଉ କୌଣସି ସୂଚନା ପାଇବେ ନାହିଁ'
        );
      }
    }
    var url = 'https://satark.rimes.int/api_user/users_ios_post';
    var params = JSON.stringify({
      block_id: fav_blockid,
      user_id: this.user_id,
      checked_state: this.checked_state,
      extra_param: 'changenoti',
    });
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('data', data);
        },
        (err) => {
          console.log('ERROR!: ', err);
          this.authService.showErrorToast(
            'Error while deleting location. Please try again.'
          );
        }
      );
  }

  deleteLocation(id) {
    var blk_to_be_del = id;
    var url = 'https://satark.rimes.int/api_user/del_fav_loc_post';
    var params = JSON.stringify({
      id: blk_to_be_del,
    });
    this.httpClient
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('data', data);
          this.authService.showErrorToast('Location has been deleted.');
          this.filtereditems = null;
        },
        (err) => {
          console.log('ERROR!: ', err);
          this.authService.showErrorToast(
            'Error while deleting location. Please try again.'
          );
        }
      );
    this.getFavLocations(this.user_id);
  }

  /////add new preferred location
  addLocation(bid) {
    console.log('bid.... ', bid);
    if(bid === this.user_datum.block_id){
      this.authService.showErrorToast('Location already exists.');
    } else {
      for (var i = 0; i < this.block_data.length; ++i) {
        if (bid == this.block_data[i].id) {
          var blockname = this.block_data[i].block_name;
          var blockname_ory = this.block_data[i].block_name_ory;
          console.log('blockname', blockname);
          console.log('blockname_ory', blockname_ory);
          break;
        }
      }
      if (this.fav_loc_data == null) {
        var url = 'https://satark.rimes.int/api_user/add_fav_loc_post';
        var params = JSON.stringify({
          blk_id: bid,
          blkname: blockname,
          blkname_ory: blockname_ory,
          usrid: this.user_id,
        });
        this.httpClient
          .post(url, params, { responseType: 'text' })
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log('data', data);
              this.getFavLocations(this.user_id);
              this.authService.showErrorToast('New block has been added.');
              this.filtereditems = null;
            },
            (err) => {
              console.log('ERROR!: ', err);
              this.authService.showErrorToast(
                'Error while adding location. Please try again.'
              );
              this.getFavLocations(this.user_id);
            }
          );
      } else {
        ///check number of fav loc.max allowed is 5
        if (this.fav_loc_data?.length != 5) {
          for (var j = 0; j < this.fav_loc_data.length; ++j) {
            if (bid == this.fav_loc_data[j].block_id) {
              this.exists = true;
              console.log('exists', this.exists);
              console.log('not added', this.fav_loc_data[j].block_id);
              this.authService.showErrorToast('Location already exists.');
              break;
            }
          }
          if (this.exists != true) {
            var url = 'https://satark.rimes.int/api_user/add_fav_loc_post';
            var params = JSON.stringify({
              blk_id: bid,
              blkname: blockname,
              blkname_ory: blockname_ory,
              usrid: this.user_id,
            });
            this.httpClient
              .post(url, params, { responseType: 'text' })
              .pipe(take(1))
              .subscribe(
                (data) => {
                  console.log('data', data);
                  this.getFavLocations(this.user_id);
                  this.authService.showErrorToast('New block has been added.');
                  this.filtereditems = null;
                },
                (err) => {
                  console.log('ERROR!: ', err);
                  this.authService.showErrorToast(
                    'Error while adding location. Please try again.'
                  );
                  this.getFavLocations(this.user_id);
                }
              );
          }
        } else {
          this.authService.showAlert(
            this.translate.instant('Limit Reached'),
            this.translate.instant(
              'Maximum of 5 favourite location is allowed. Please remove any existing location before adding new location.'
            )
          );
          this.filtereditems = null;
        }
      }
    }
  }

  ///////sort locations to show in the suggestion box during search
  async filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim() != '') {
      console.log(this.searchTerm);
      this.filtereditems = await this.block_data.filter((item) => {
        return (
          item.block_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
          -1
        );
      });
    } else {
      this.filtereditems = null;
    }
  }
}
