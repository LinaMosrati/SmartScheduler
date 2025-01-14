import { Component, Inject } from '@angular/core';
import { ISubTask } from '../../../../models/isub-task';
import { TaskStatus } from '../../../../models/itask';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActiveTaskService } from '../../../task/services/active-task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-sub-task-dialog',
  templateUrl: './add-sub-task-dialog.component.html',
  styleUrl: './add-sub-task-dialog.component.scss'
})
export class AddSubTaskDialogComponent {
  subTask: ISubTask = {
    name: '',
    description: '',
    status: TaskStatus.todo,
    taskId: ''
  };

  statuses = Object.values(TaskStatus);

  constructor(
    private readonly dialogRef: MatDialogRef<AddSubTaskDialogComponent>,
    private readonly activeTaskService: ActiveTaskService,
    private readonly _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: string }
  ) {
    this.subTask.taskId = data.taskId;
  }

  onSubmit() {
    if (!this.subTask.name) {
      this._snackBar.open('Name is required', '', { duration: 1500 });
      return;
    }
    this.activeTaskService.addSubTask(this.subTask)
    this.dialogRef.close()
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
