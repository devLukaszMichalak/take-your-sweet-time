import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { getRouterLink, PageRouts } from '../../routing/pages';
import { Router } from '@angular/router';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { DataBsTheme } from './data-bs-theme';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  protected readonly faPowerOff = faPowerOff;
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
  private readonly localStorageKey = 'take-your-sweet-time-theme';
  
  logout() {
    this.authService.logOutUser().then(() => this.router.navigate(getRouterLink(PageRouts.LOGIN)));
  }
  
  isAuthenticated = (): boolean => this.authService.isAuthenticated();
  
  ngOnInit() {
    const storedItem = localStorage.getItem(this.localStorageKey);
    if (storedItem) {
      document.documentElement.setAttribute('data-bs-theme', storedItem);
    }
  }
  
  setLightMode() {
    localStorage.setItem(this.localStorageKey, DataBsTheme.LIGHT);
    document.documentElement.setAttribute('data-bs-theme', DataBsTheme.LIGHT)
  }
  setDarkMode() {
    localStorage.setItem(this.localStorageKey, DataBsTheme.DARK);
    document.documentElement.setAttribute('data-bs-theme', DataBsTheme.DARK)
  }
  
  isDarkMode(): boolean {
    return document.documentElement.getAttribute('data-bs-theme') === DataBsTheme.DARK;
  }
}
