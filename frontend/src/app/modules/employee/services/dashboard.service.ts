import { inject, Injectable, signal } from '@angular/core';
import { IUserDashboard } from '../../../models/iuser-dashboard';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  userDashboard = signal<IUserDashboard | null>(null);

  constructor() { }

  loadUserDashboard() {
    return this.http.get<IUserDashboard>(`${this.apiUrl}/statics/${this.authService.currentUser()?.id}`).subscribe({
      next: (dashboard) => {
        dashboard.completedTasksPercentage = Number(dashboard.completedTasksPercentage) || 0;
        dashboard.rolesPercentage = dashboard.rolesPercentage.map((role) => {
          role.percentage = Number(role.percentage) || 0;
          return role;
        });
        dashboard.projects = dashboard.projects.map((project) => {
          project.completedTaskPercentage = Number(project.completedTaskPercentage) || 0;
          return project;
        });
        this.userDashboard.set(dashboard);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
