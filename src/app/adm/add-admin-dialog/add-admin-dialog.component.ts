import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { SharedModules } from '../../shared.module';


@Component({
  selector: 'app-add-admin-dialog',
  templateUrl: './add-admin-dialog.component.html',
  styleUrls: ['./add-admin-dialog.component.css'],

  imports:[SharedModules],
  standalone: true,

})
export class AddAdminDialogComponent implements OnInit {
  users: any[] = [];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddAdminDialogComponent>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUsers().subscribe({
      next: (admins) => {
        this.users = admins;
      },
      error: () => {
        console.error('Failed to fetch users');
      }
    });
  }

 
  addAdmin(user): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will grant ADMIN rights to ${user.email}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add as admin!',
      cancelButtonText: 'No, keep as user'
    }).then(result => {
      if (result.isConfirmed) {
        this.authService.addAdmin(user).subscribe({
          next: response => {
            console.log('Server responded:', response);
            this.dialogRef.close(user);
            this.users.push(user);
            
            Swal.fire('Added!', 'The user now has admin privileges.', 'success');
          },
          error: err => {
            console.error('Add admin failed:', err);
            Swal.fire('Error', 'Could not add admin. Please try again.', 'error');
          }
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
