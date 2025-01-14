import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITask } from '../../../../models/itask';

@Component({
  selector: 'app-dependent-tasks-dialog',
  templateUrl: './dependent-tasks-dialog.component.html',
  styleUrl: './dependent-tasks-dialog.component.scss'
})
export class DependentTasksDialogComponent {
  availableTasks : ITask[] = [];
  selectedTasks : ITask[] = [];

  constructor(
    public dialogRef: MatDialogRef<DependentTasksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _snackBar: MatSnackBar
  ) {
    this.availableTasks = this.data.availableTasks;
    this.selectedTasks = this.data.selectedTasks || [];
  }

  onCanceled(): void {
    this.dialogRef.close();
  }

  onSelectedTasks(): void {
    
    this.dialogRef.close(this.selectedTasks);
  }


}
