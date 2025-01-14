import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITask } from '../../../models/itask';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;

  getAllTasksforUser() {
    return this.http.get<ITask[]>(`${this.apiUrl}/tasks?userId=${this.auth.currentUser()?.id}`);
  }

  getAllTasksforProject(projectId: string) {
    return this.http.get<ITask[]>(`${this.apiUrl}/tasks?projectId=${projectId}`);
  }

  getAllTasksforUserAndProject(projectId: string) {
    return this.http.get<ITask[]>(`${this.apiUrl}/tasks?projectId=${projectId}&userId=${this.auth.currentUser()?.id}`);
  }

  getTaskById(id: string) {
    return this.http.get<ITask>(`${this.apiUrl}/tasks/${id}`);
  }

  addTask(task: ITask) {
    return this.http.post(`${this.apiUrl}/tasks`, task);
  }

  updateTask(task: ITask) {
    return this.http.put(`${this.apiUrl}/tasks/${task.id}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }
  
  private openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    }
    );
  }
}
