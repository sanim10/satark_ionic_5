import { Router } from '@angular/router';
import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { AuthService } from './../../../guard/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  statItems: string[] = ['heatwave', 'lightning'];
  statItems_ory: string[] = ['ଗ୍ରୀଷ୍ମ ପ୍ରବାହ', 'ବଜ୍ରପାତ'];

  constructor(
    private authService: AuthService,
    private lHelper: LanguageHelperService,
    private router: Router
  ) {}

  ngOnInit() {}

  routeTo(url) {
    switch (url) {
      case 'ବଜ୍ରପାତ':
        url = 'lightning';
        break;

      case 'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ':
        url = 'heatwave';
        break;
    }
    this.router.navigateByUrl('statistics/' + url + '-stat').catch((err) => {
      console.log(err);
      this.popAlert();
    });
  }

  popAlert() {
    if (this.lHelper.lang == 'en') {
      this.authService.showAlert(
        'Thank you for your interest',
        'The page will be available soon'
      );
    } else {
      this.authService.showAlert(
        'ଆପଣଙ୍କ ଆଗ୍ରହ ପାଇଁ ଧନ୍ୟବାଦ',
        'ଏହି ପୃଷ୍ଠା ଖୁବଶୀଘ୍ର ଉପଲବ୍ଧ ହେବ',
        'ଠିକ'
      );
    }
  }
}
