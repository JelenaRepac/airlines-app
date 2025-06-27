import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedModules } from '../shared.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [SharedModules]
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) { }

  isAdminUser = false;


  ngOnInit(): void {
    this.isAdminUser = this.authService.isAdmin();
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
}
