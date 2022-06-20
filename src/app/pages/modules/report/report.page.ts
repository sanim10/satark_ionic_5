import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../guard/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  reportItems: string[] = ['heatwave', 'lightning', 'flood'];
  reportItems_ory: string[] = ['ଗ୍ରୀଷ୍ମ ପ୍ରବାହ', 'ବଜ୍ରପାତ', 'ବନ୍ୟା'];
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

      case 'କୃଷି':
        url = 'agriculture';
        break;

      case 'ବନ୍ୟା':
        url = 'flood';
        break;
    }
    this.router.navigateByUrl('report/' + url + '-report').catch((err) => {
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
