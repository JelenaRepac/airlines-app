import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [MatToolbar, RouterModule]
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();

    Swal.fire({
      icon: 'success',
      title: 'Logout Successful!',
      text: 'You have successfully logged out.',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      background: '#AEEA94',
      color: '#fff'
    }).then(() => {
      this.router.navigate(['/home']);
    });


    this.router.navigate(['/login']);
  }
}
