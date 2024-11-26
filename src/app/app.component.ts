import { Component } from '@angular/core';
import { routeAnimation } from './animations/route-animation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeAnimation]
})
export class AppComponent {
  title = 'agendaza-frontend';

  constructor(protected route: ActivatedRoute) {}
}
