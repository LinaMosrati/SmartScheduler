import { Component, Inject } from '@angular/core';
import { ITask, TaskPriority, TaskStatus } from '../../../../models/itask';
import { IResource } from '../../../../models/iresource';
import { IProject } from '../../../../models/iproject';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DependentTasksDialogComponent } from '../dependent-tasks-dialog/dependent-tasks-dialog.component';
import { ResourcesDialogComponent } from '../resources-dialog/resources-dialog.component';
import { IProjectMember, ProjectMemberRole } from '../../../../models/iproject-member';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss'
})
export class EditTaskDialogComponent {
  task: ITask;
  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);
  dependentTasks: ITask[] = [];
  selectedResources: IResource[] = [];
  project: IProject;
  availableUsers: IProjectMember[] = []; // List of users to assign the task to

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    private readonly dialog: MatDialog,
    private readonly _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.task = { ...data.task }; // Clone the task to avoid modifying the original object
    this.project = data.project;
    this.dependentTasks = data.dependentTasks || [];
    this.selectedResources = data.selectedResources || [];
    this.availableUsers = data.availableUsers ? data.availableUsers.filter((m: IProjectMember) => m.role === ProjectMemberRole.Developer || m.role === ProjectMemberRole.TesterQA || m.role === ProjectMemberRole.ProjectManager ) : [];
  }

  openDependentTasksDialog() {
    const dialogRef = this.dialog.open(DependentTasksDialogComponent, {
      width: '600px',
      data: { availableTasks: this.data.availableTasks.filter((task : ITask) => task.id != this.task.id) , selectedTasks: this.dependentTasks },
    });

    dialogRef.afterClosed().subscribe((selectedTasks: ITask[]) => {
      if (selectedTasks) {
        this.dependentTasks = selectedTasks;
        this.task.dependentTasksId = selectedTasks.map((task) => task.id!);
      }
    });
  }

  openResourcesDialog() {
    const dialogRef = this.dialog.open(ResourcesDialogComponent, {
      width: '600px',
      data: { availableResources: this.data.availableResources, selectedResources: this.selectedResources },
    });

    dialogRef.afterClosed().subscribe((selectedResources: IResource[]) => {
      if (selectedResources) {
        this.selectedResources = selectedResources;
        this.task.resourcesId = selectedResources.map((resource) => resource.id!);
      }
    });
  }

  validateTask(): string | null {
    if (!this.task.name || this.task.name.trim() === '') {
      return 'Task name is required.';
    }
    if (this.task.startDate) {
      if (!this.task.endDate) {
        return 'If there is a start date, there must be an end date.';
      }
      if (new Date(this.task.startDate) < new Date(this.project.startDate!)) {
        return 'Start date cannot be earlier than the project start date.';
      }
      if (new Date(this.task.startDate) > new Date(this.project.endDate!)) {
        return 'Start date cannot be later than the project end date.';
      }
      if (new Date(this.task.endDate) > new Date(this.project.endDate!)) {
        return 'End date cannot be later than the project end date.';
      }
      if (new Date(this.task.startDate) > new Date(this.task.endDate)) {
        return 'Start date cannot be later than the end date.';
      }
    }
    if (this.task.cost && this.task.cost < 0) {
      return 'Cost cannot be negative.';
    }
    if (this.task.estimatedTime && this.task.estimatedTime < 0) {
      return 'Estimated time cannot be negative.';
    }
    return null;
  }

  onSave() {
    const validationError = this.validateTask();
    if (validationError) {
      this._snackBar.open(validationError, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    console.log('Task to save:', this.task);
    this.dialogRef.close(this.task);
  }

  onDelete() {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    this.dialogRef.close('delete');
  }

  roleColors: { [key in ProjectMemberRole]: string } = {
      [ProjectMemberRole.Owner]: '#4caf50', // Green
      [ProjectMemberRole.ProjectManager]: '#2196f3', // Blue
      [ProjectMemberRole.Developer]: '#ff9800', // Orange
      [ProjectMemberRole.TesterQA]: '#9c27b0', // Purple
      [ProjectMemberRole.Contributor]: '#ffc107', // Yellow
      [ProjectMemberRole.Observer]: '#607d8b' // Gray
    };
}
