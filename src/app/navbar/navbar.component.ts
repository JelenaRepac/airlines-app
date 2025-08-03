import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedModules } from '../shared.module';
import { MatToolbar } from "@angular/material/toolbar";
import { WebSocketService } from '../service/web-scoket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [SharedModules, MatToolbar]
})
export class NavbarComponent {

  constructor(private elementRef: ElementRef
    , private authService: AuthService, private router: Router, private webSocketService: WebSocketService) { }

  isAdminUser = false;
  unreadNotificationsCount = 0;


  notifications: string[] = [];

  showNotifications = false;
  ngOnInit() {
    this.isAdminUser = this.authService.isAdmin();

    this.webSocketService.connect();

    this.webSocketService.onNotification().subscribe(notification => {
      this.notifications.unshift(JSON.parse(notification).message);
      this.unreadNotificationsCount++;
    });
  }


  logout(): void {
    this.authService.logout();

    Swal.fire({
      icon: 'success',
      title: 'Logout Successful!',
      text: 'You have successfully logged out.',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      toast: true

    }).then(() => {
      this.router.navigate(['airline/home']);
    });


    this.router.navigate(['airline/login']);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.unreadNotificationsCount = 0;
    }
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showNotifications && !this.elementRef.nativeElement.contains(target)) {
      this.closeNotifications();
    }
  }
}
