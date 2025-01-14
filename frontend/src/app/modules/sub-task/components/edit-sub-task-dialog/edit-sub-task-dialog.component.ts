import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ISubTask } from '../../../../models/isub-task';
import { ActiveTaskService } from '../../../task/services/active-task.service';
import { ActiveProjectService } from '../../../project/services/active-project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskStatus } from '../../../../models/itask';
import { IProjectMember, ProjectMemberRole } from '../../../../models/iproject-member';

@Component({
  selector: 'app-edit-sub-task-dialog',
  templateUrl: './edit-sub-task-dialog.component.html',
  styleUrl: './edit-sub-task-dialog.component.scss'
})
export class EditSubTaskDialogComponent {

  user : IProjectMember | undefined = undefined;
  availableUsers : IProjectMember[] = []; 
  statuses = Object.values(TaskStatus);


  subTask: ISubTask = {
    name: '',
    description: '',
    status: TaskStatus.todo,
    taskId: '',
    userId: ''
  };

  constructor(
    public dialogRef: MatDialogRef<EditSubTaskDialogComponent>,
    private readonly activeTaskService: ActiveTaskService,
    private readonly _snackBar: MatSnackBar,
    private readonly ActiveProjectService: ActiveProjectService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      subTask: ISubTask; // The sub-task being edited
    }
  ) {
    this.subTask = { ...data.subTask }; // Copy the sub-task to avoid changing the original object
    if (this.subTask.userId) this.user = this.ActiveProjectService.members().find(m => m.user?.id === this.subTask.userId);
    this.availableUsers = this.ActiveProjectService.members().filter(m => m.role === ProjectMemberRole.Developer || m.role === ProjectMemberRole.TesterQA || m.role === ProjectMemberRole.ProjectManager );
    this.availableUsers = this.ActiveProjectService.sortMembersByRole(this.availableUsers);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.subTask.name) {
      this._snackBar.open('Name is required', '', { duration: 1500 });
      return;
    }
    this.activeTaskService.updateSubTask(this.subTask);
    this.dialogRef.close();
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
