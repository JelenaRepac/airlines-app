import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports : [MatToolbar]
})
export class NavbarComponent {}
