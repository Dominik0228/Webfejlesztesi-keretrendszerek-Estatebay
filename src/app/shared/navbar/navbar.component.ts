import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth-service.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn!: boolean;

  @Output() logoutEvent = new EventEmitter<void>();
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  closeMenu() {
    console.log(this.isLoggedIn)
    this.sidenav?.close();
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.logoutEvent.emit();
  }
}

