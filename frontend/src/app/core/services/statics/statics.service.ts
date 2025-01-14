import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Statics } from '../../../models/statics';

@Injectable({
  providedIn: 'root'
})
export class StaticsService {

  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = environment.apiUrl;

  totalProjects = signal<number>(0);
  totalTasks = signal<number>(0);
  totalUsers = signal<number>(0);
  totalProjectCost = signal<number>(0);
  totalResourceCost = signal<number>(0);

  getStatics() {
    return this.http.get<Statics>(`${this.apiUrl}/statics`).subscribe({
      next: (statics) => {
        this.totalProjects.set(statics.totalProjects);
        this.totalTasks.set(statics.totalTasks);
        this.totalUsers.set(statics.totalUsers);
        this.totalProjectCost.set(statics.totalProjectCost);
        this.totalResourceCost.set(statics.totalResourceCost);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
