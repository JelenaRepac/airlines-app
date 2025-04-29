import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
    selector: 'app-confirm-user',
    template: '',  
    styleUrls: [] 
  })
export class ConfirmUserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    Swal.fire({
        icon: 'success',
        title: 'Account confirmed!',
        text: 'You can now log in.',
      }).then(() => {
        // Redirect to home page after confirmation
        this.router.navigate(['/airline/login']);
      });
  }
}
