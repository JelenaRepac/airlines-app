import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../service/voucher.service';
import { Voucher } from '../../models/voucher.model';
import { AuthService } from '../../service/auth.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { SharedModules } from '../../shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
  imports: [MatCard, MatCardTitle, MatCardContent, CommonModule, SharedModules, MatCardHeader]
})
export class VoucherComponent implements OnInit {
  vouchers: Voucher[] = [];
  availableVouchers: Voucher[] = [];
  usedVouchers: Voucher[] = [];
  user!: User;

  selectedTab: 'used' | 'available' = 'available';
  constructor(private voucherService: VoucherService, private authService: AuthService) { }

  ngOnInit(): void {
    const email = this.authService.getEmailFromToken();
    console.log(email);
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No email found in token.',
      });
      return;
    }

    this.authService.getProfile(email).subscribe({
      next: (data) => {
        this.user = data;
        console.log("id" + this.user.id);


        this.loadVouchers();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user profile.',
        });
      },
    });
  }

  loadVouchers(): void {
    this.voucherService.getVouchersByUserId(this.user.id).subscribe({
      next: (vouchers) => {
        this.vouchers = vouchers;

        this.availableVouchers = vouchers.filter(v => !v.used);
        this.usedVouchers = vouchers.filter(v => v.used);
      },
      error: (error) => {
        console.error('Failed to fetch vouchers', error);
      }
    });
  }
}
