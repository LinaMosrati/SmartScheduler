import { Component, Inject } from '@angular/core';
import { ITask, TaskStatus } from '../../../../models/itask';
import { ISubTask } from '../../../../models/isub-task';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActiveTaskService } from '../../services/active-task.service';
import { ActiveProjectService } from '../../../project/services/active-project.service';
import { AddSubTaskDialogComponent } from '../../../sub-task/components/add-sub-task-dialog/add-sub-task-dialog.component';
import { EditSubTaskDialogComponent } from '../../../sub-task/components/edit-sub-task-dialog/edit-sub-task-dialog.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {

  canEdit = false;
  taskId: string;

  constructor(
    protected readonly activeTaskService: ActiveTaskService,
    protected readonly ActiveProjectService: ActiveProjectService,
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: string, canEdit: boolean }
  ) {
    console.log('Task Details:', data);
    this.taskId = data.taskId;
    this.canEdit = data.canEdit;
    this.activeTaskService.getActiveTaskInfo(this.taskId);
  }

  getResources() {
    return this.ActiveProjectService.resources().filter(r => (this.activeTaskService.activeTask()?.resourcesId ?? []).includes(r.id!));
  }

  addSubTask() {
    const dialogRef = this.dialog.open(AddSubTaskDialogComponent, {
      width: '400px',
      data: { 
        taskId: this.activeTaskService.activeTask()?.id 
      }
    });
  
    dialogRef.afterClosed().subscribe((result: ISubTask | null) => {      
    });
  }

  editSubTask(subTask: ISubTask) {
    const dialogRef = this.dialog.open(EditSubTaskDialogComponent, {
      width: '400px',
      data: { 
        subTask: subTask
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {      
    });
  }

  deleteSubTask(subTask: ISubTask) {
    if (!confirm('Are you sure you want to delete this sub-task?')) return;
    this.activeTaskService.deleteSubTask(subTask.id!);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getUserName() {
    return this.activeTaskService.User()?.user?.firstName + ' ' + this.activeTaskService.User()?.user?.lastName;
  }

  getUserImage(userId: string) {
    return this.ActiveProjectService.members().find(m => m.user?.id === userId)?.user?.image;
  }
  getUserName2(userId: string) {
    const member = this.ActiveProjectService.members().find(m => m.user?.id === userId);
    return member?.user?.firstName + ' ' + member?.user?.lastName;
  }

}
