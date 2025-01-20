import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatTableModule } from '@angular/material/table'; // Import the MatTableModule
import { MatButtonModule } from '@angular/material/button'; // If you use buttons
import { MatPaginatorModule } from '@angular/material/paginator'; // If you need pagination
import { MatSortModule } from '@angular/material/sort'; // If you need sorting
import {MatTabsModule} from '@angular/material/tabs'
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'users',
  imports: [
    NavbarComponent,
    MatTableModule, // Make sure MatTableModule is imported
    MatButtonModule, // If you use buttons
    MatPaginatorModule, // If you need pagination
    MatSortModule, // If you need sorting,
    MatTabsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})



export class UsersComponent {
  users: any[] = [];
  displayedColumns: string[] = ['firstname', 'lastname', 'passportNumber', 'email', 'rank', 'miles'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
      this.authService.getUsers().subscribe({
          next: (data) => {
              console.log('Fetched users data:', data);  // Add logging here
              if (Array.isArray(data)) {
                this.users = data;
              } else {
                console.error('Fetched data is not an array:', data);
              }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to load user profiles.',
            });
          },
        });
  }

}
