import { Component, HostListener } from '@angular/core';

// TODO: fix passing url params as external data into pug
const templateVars = '{"title": "pug template with variables", "count": ' + (777 + 111) + '}';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.pug?' + templateVars,
})
export class AppComponent {
  title = 'ng-app';
  isDisabled = false;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.isDisabled = true;
  }
}
