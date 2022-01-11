import { LanguageHelperService } from 'src/app/helper/language-helper/language-helper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeTabService {
  constructor() {}

  modules: string[] = [
    'weather',
    'lightning',
    'heatwave',
    'agriculture',
    'flood',
    'ocean',
    'road safety',
    'snake bite',
    'report',
    'statistics',
  ];
  modules_od: string[] = [
    'ପାଣିପାଗ',
    'ବଜ୍ରପାତ',
    'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ',
    'କୃଷି',
    'ବନ୍ୟା',
    'ସମୁଦ୍ର',
    'ସଡକ ସୁରକ୍ଷା',
    'ସର୍ପାଘାତ',
    'ବିବରଣୀ',
    'ପରିସଂଖ୍ୟାନ',
  ];
}
