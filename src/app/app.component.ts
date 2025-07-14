import { Component } from '@angular/core';
import { SharedModules } from './shared.module';
import { ChatWidgetComponent } from "./chat-widget/chat-widget.component";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    SharedModules,
    ChatWidgetComponent
  ],
})
export class AppComponent {
  title = 'airlines-app';
  showChat = true;
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      const hideElements = url.startsWith('/airline/login') || url.startsWith('/airline/sign-up');
      this.showChat = !hideElements;
      this.showNavbar = !hideElements;

    });
  }
}


