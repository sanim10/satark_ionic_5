import { AuthService } from './../../../guard/auth.service';
import { ApiService } from './../../../providers/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lightning',
  templateUrl: './lightning.page.html',
  styleUrls: ['./lightning.page.scss'],
})
export class LightningPage implements OnInit {
  loading = true;

  constructor() {}

  ngOnInit() {}
}
