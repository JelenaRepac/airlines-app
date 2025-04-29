import { Component } from '@angular/core';
import { SharedModules } from './shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    SharedModules
  ],
})
export class AppComponent {
  title = 'airlines-app';
}
