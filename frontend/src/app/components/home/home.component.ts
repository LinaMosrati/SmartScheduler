import { Component } from '@angular/core';
import { StaticsService } from '../../core/services/statics/statics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    protected readonly staticsService: StaticsService,
  ) {
    this.staticsService.getStatics();
  }

}
