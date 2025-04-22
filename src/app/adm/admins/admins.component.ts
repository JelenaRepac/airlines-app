import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatTableModule } from '@angular/material/table'; // Import the MatTableModule
import { MatButtonModule } from '@angular/material/button'; // If you use buttons
import { MatPaginatorModule } from '@angular/material/paginator'; // If you need pagination
import { MatSortModule } from '@angular/material/sort'; // If you need sorting
import {MatTabsModule} from '@angular/material/tabs'
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddAdminDialogComponent } from '../add-admin-dialog/add-admin-dialog.component';
import { nextTick } from 'process';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'users',
  imports: [
    NavbarComponent,
    MatTableModule, // Make sure MatTableModule is imported
    MatButtonModule, // If you use buttons
    MatPaginatorModule, // If you need pagination
    MatSortModule, // If you need sorting,
    MatTabsModule,
    CommonModule
  ],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})



export class UsersComponent {
  users: any[] = [];
  displayedColumns: string[] = ['email'];

  constructor(private authService: AuthService, private dialog: MatDialog) {}
  
  

  loadUsers(): void {
    this.authService.getAdmins().subscribe({
      next: (data) => {
        console.log('Fetched users data:', data);
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
  
  ngOnInit() {
    this.loadUsers();
  }
  

  openConfirmDialog(admin) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.authService.deleteAdmin(admin.id).subscribe({
          next: response => {
            console.log('Server responded:', response);
            this.users = this.users.filter(u => u.id !== admin.id);
          },
          error: err => {
            console.error('Delete admin failed:', err);
          }
        });
        


        Swal.fire({
          title: 'Deleted!',
          text: 'The admin has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
    
  }

  openAddAdminDialog(): void {
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result is the selected user object
        this.promoteToAdmin(result);
      }
    });
  }

  promoteToAdmin(user: any): void {
    this.loadUsers();
  }
}
