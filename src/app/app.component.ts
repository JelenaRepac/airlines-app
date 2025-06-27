import { Component } from '@angular/core';
import { SharedModules } from './shared.module';
import { ChatWidgetComponent } from "./chat-widget/chat-widget.component";

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
}
