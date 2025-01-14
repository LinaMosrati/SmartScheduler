import { Injectable, signal } from '@angular/core';
import { ITask } from '../../../models/itask';
import { ISubTask } from '../../../models/isub-task';
import { ActiveProjectService } from '../../project/services/active-project.service';
import { SubTaskService } from '../../sub-task/services/sub-task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from './task.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IProjectMember } from '../../../models/iproject-member';

@Injectable({
  providedIn: 'root'
})
export class ActiveTaskService {

  constructor(
    private readonly activeProjectService: ActiveProjectService,
    private readonly TaskService: TaskService,
    private readonly SubTaskService: SubTaskService,
    private readonly _snackBar: MatSnackBar,
  ) { }

  activeTask = signal<ITask | undefined | null>(undefined);
  subTasks = signal<ISubTask[]>([]);
  User = signal<IProjectMember | undefined | null>(undefined);

  getActiveTaskInfo(taskId: string) {
    console.log('Task ID:', taskId);
    const task = this.activeProjectService.tasks().find(t => t.id === taskId);
    this.activeTask.set(task);
    this.User.set(this.activeProjectService.members().find(m => m.user?.id === task?.userId));
    console.log('User:', this.User());
    this.SubTaskService.getAllSubTasksforTask(taskId).subscribe({
      next: (subTasks) => {
        this.subTasks.set(subTasks);
      }
    });
  }

  refreshTask() {
    this.activeProjectService.refreshTasks();
    const task = this.activeProjectService.tasks().find(t => t.id === this.activeTask()!.id);
    this.activeTask.set(task);
  }

  refreshSubTasks() {
    this.SubTaskService.getAllSubTasksforTask(this.activeTask()!.id!).subscribe({
      next: (subTasks) => {
        this.subTasks.set(subTasks);
      }
    });
  }

  updateTask(task: ITask) {
    this.TaskService.updateTask(task).subscribe({
      next: () => {
        this._snackBar.open('Task updated successfully', '', { duration: 1500 });
        this.refreshTask();
      },
      error: () => {
        this._snackBar.open('Error updating task', '', { duration: 1500 });
      }
    });
  }

  deleteTask(taskId: string, dialog : MatDialogRef<any>) {
    this.TaskService.deleteTask(taskId).subscribe({
      next: () => {
        this._snackBar.open('Task deleted successfully', '', { duration: 1500 });
        dialog.close();
      },
      error: () => {
        this._snackBar.open('Error deleting task', '', { duration: 1500 });
      }
    });
  }

  addSubTask(subTask: ISubTask) {
    this.SubTaskService.addSubTask(subTask).subscribe({
      next: () => {
        this._snackBar.open('Subtask added successfully', '', { duration: 1500 });
        this.refreshSubTasks();
      },
      error: () => {
        this._snackBar.open('Error adding subtask', '', { duration: 1500 });
      }
    });
  }

  updateSubTask(subTask: ISubTask) {
    this.SubTaskService.updateSubTask(subTask).subscribe({
      next: () => {
        this._snackBar.open('Subtask updated successfully', '', { duration: 1500 });
        this.refreshSubTasks();
      },
      error: () => {
        this._snackBar.open('Error updating subtask', '', { duration: 1500 });
      }
    });
  }

  deleteSubTask(subTaskId: string) {
    this.SubTaskService.deleteSubTask(subTaskId).subscribe({
      next: () => {
        this._snackBar.open('Subtask deleted successfully', '', { duration: 1500 });
        this.refreshSubTasks();
      },
      error: () => {
        this._snackBar.open('Error deleting subtask', '', { duration: 1500 });
      }
    });
  }

}
