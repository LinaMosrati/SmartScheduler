import { Component, computed, inject } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart Scheduler';

  // Signal for current user
  currentUser = computed(() => this.authService.currentUser?.());

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    // Check if user is authenticated
    this.authService.checkAuth();
  }

  isAdmin(): boolean {
    if (this.currentUser() !== null) {
      return this.currentUser()?.role === 'admin';
    }
    return false;    
  }
  isUser(): boolean {
    if (this.currentUser() !== null) {
      return this.currentUser()?.role === 'user';
    }
    return false;    
  }

  // Navigate to the profile page
  navigateToProfile(): void {
    this.router.navigate(['/user', 'profile']);
  }

  // Logout the user
  logout(): void {
    this.authService.logout(); // Ensure this method clears the session
    this.router.navigate(['/']);
  }
}
