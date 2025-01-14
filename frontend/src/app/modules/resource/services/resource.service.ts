import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IResource } from '../../../models/iresource';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);
  
  apiUrl = environment.apiUrl;

  getAllResourcesforProject(projectId: string) {
    return this.http.get<IResource[]>(`${this.apiUrl}/resources?projectId=${projectId}`);
  }

  getAllResourcesforTask(taskId: string) {
    return this.http.get<IResource[]>(`${this.apiUrl}/resources?taskId=${taskId}`);
  }

  getResourcesForTaskAndProject(taskId: string, projectId: string) {
    return this.http.get<IResource[]>(`${this.apiUrl}/resources?taskId=${taskId}&projectId=${projectId}`);
  }

  getResourceById(id: string) {
    return this.http.get<IResource>(`${this.apiUrl}/resources/${id}`);
  }

  addResource(resource: IResource) {
    return this.http.post(`${this.apiUrl}/resources`, resource);
  }

  updateResource(resource: IResource) {
    return this.http.put(`${this.apiUrl}/resources/${resource.id}`, resource);
  }

  deleteResource(id: string) {
    return this.http.delete(`${this.apiUrl}/resources/${id}`);
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
