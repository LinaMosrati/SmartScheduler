import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DependentTasksDialogComponent } from '../dependent-tasks-dialog/dependent-tasks-dialog.component';
import { ResourcesDialogComponent } from '../resources-dialog/resources-dialog.component';
import { ITask, TaskPriority, TaskStatus } from '../../../../models/itask';
import { IResource } from '../../../../models/iresource';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProject } from '../../../../models/iproject';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {

  task : ITask = {
    name: '',
    description: undefined,
    priority: TaskPriority.low,
    startDate: undefined,
    endDate: undefined,
    status: TaskStatus.todo,
    estimatedTime: undefined,
    cost: undefined,
    projectId: '',
    userId: undefined,

    dependentTasksId: [],
    resourcesId: []
  };

  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);
  dependentTasks: ITask[] = [];
  selectedResources: IResource[] = [];
  project?: IProject ;

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private readonly dialog: MatDialog,
    private readonly _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.task.projectId = this.data.project.id;
    this.project = this.data.project;
  }

  openDependentTasksDialog() {
    const dialogRef = this.dialog.open(DependentTasksDialogComponent, {
      width: '600px',
      data: { availableTasks: this.data.availableTasks, selectedTasks: this.dependentTasks },
    });

    dialogRef.afterClosed().subscribe((selectedTasks : ITask[]) => {
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
    if(this.task.startDate) {
      if( !this.task.endDate ) {
        return 'if there is a start date, there must be an end date (every story have an end).';
      }
      if(new Date(this.task.startDate) < new Date(this.project?.startDate!)) {
        return 'Start date cannot be earlier than the project start date.';
      }
      if(new Date(this.task.startDate) > new Date(this.project?.endDate!)) {
        return 'Start date cannot be later than the project end date.';
      }
      if(new Date(this.task.endDate) > new Date(this.project?.endDate!)) {
        return 'End date cannot be later than the project end date.';
      }
      if (new Date(this.task.startDate) > new Date(this.task.endDate)) {
        return 'Start date cannot be later than the end date.';
      }
    }
    if(this.task.cost && this.task.cost < 0) {
      return 'Cost cannot be negative.';
    }
    if(this.task.estimatedTime && this.task.estimatedTime < 0) {
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

    this.dialogRef.close(this.task);
  }

}
