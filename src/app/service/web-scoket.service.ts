import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client/dist/sockjs';


@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private stompClient!: Client;

    private notificationSubject = new Subject<string>();

    private isConnected = false;

    onNotification(): Observable<string> {
        return this.notificationSubject.asObservable();
    }
    connect() {
        if (this.isConnected) {
            console.log('[WebSocketService] Already connected.');
            return;
        }
        this.isConnected = true;

        console.log('[WebSocketService] connect() called');

        const socket = new SockJS('http://localhost:8080/ws-notifications');

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str)
        });

        this.stompClient.onConnect = (frame) => {
            console.log('Connected:', frame);

            this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
                if (message.body) {
                    this.notificationSubject.next(message.body);

                    console.log('Received:', message.body);
                    // update UI
                }
            });
        };

        this.stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.stompClient.activate(); // 🔥 this replaces .connect()
    }

    disconnect() {
        this.stompClient.deactivate(); // proper way to disconnect
    }
}
