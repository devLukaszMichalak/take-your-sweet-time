import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { getRouterLink, PageRouts } from '../../routing/pages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  logout() {
    this.authService.logOutUser().then(() => this.router.navigate(getRouterLink(PageRouts.LOGIN)));
  }
  
  isAuthenticated = (): boolean => this.authService.isAuthenticated();
}
