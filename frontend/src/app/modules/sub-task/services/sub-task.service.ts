import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { ISubTask } from '../../../models/isub-task';

@Injectable({
  providedIn: 'root'
})
export class SubTaskService {

  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);
  
  apiUrl = environment.apiUrl;

  getAllSubTasksforTask(taskId: string) {
    return this.http.get<ISubTask[]>(`${this.apiUrl}/sub-tasks?taskId=${taskId}`);
  }

  getSubTaskById(id: string) {
    return this.http.get<ISubTask>(`${this.apiUrl}/sub-tasks/${id}`);
  }

  addSubTask(subTask: ISubTask) {
    return this.http.post(`${this.apiUrl}/sub-tasks/task/${subTask.taskId}`, subTask);
  }

  updateSubTask(subTask: ISubTask) {
    return this.http.put(`${this.apiUrl}/sub-tasks/${subTask.id}`, subTask);
  }

  deleteSubTask(id: string) {
    return this.http.delete(`${this.apiUrl}/sub-tasks/${id}`);
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
