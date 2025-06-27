import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedModules } from '../shared.module';

@Component({
  selector: 'app-chat-widget',
  imports: [SharedModules],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  isOpen = false;
  isLoading = false;
  chatMessages: { sender: 'user' | 'bot', text: string }[] = [];
  message: string = '';

  isAnimating = true;

  ngOnInit() {
    setTimeout(() => {
      this.isAnimating = false;
    }, 6000); // stop after 6 seconds
  }

  constructor(private http: HttpClient) { }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  sendMessage() {
    if (this.message.trim()) {
      this.chatMessages.push({ sender: 'user', text: this.message });
      const userMessage = this.message.trim();
      this.isLoading = true;

      setTimeout(() => {
        this.http.post<any>('http://localhost:9001/chat/message', { message: userMessage }).subscribe({
          next: (response) => {
            this.chatMessages.push({ sender: 'bot', text: response.message });
            this.isLoading = false;
          },
          error: (err) => {
            this.chatMessages.push({ sender: 'bot', text: 'Error: Could not contact server.' });
            this.isLoading = false;
          }
        });
      }, 500);

      this.message = '';
    }
  }



}
