import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActiveProjectService } from '../../services/active-project.service';
import { IProjectDetails } from '../../../../models/iproject-details';
import { SubTaskService } from '../../../sub-task/services/sub-task.service';
import { forkJoin, map } from 'rxjs';
import { GiminiService } from '../../services/gimini.service';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';

@Component({
  selector: 'app-aidialog',
  templateUrl: './aidialog.component.html',
  styleUrl: './aidialog.component.scss'
})
export class AIDialogComponent {

  projectDetails?: IProjectDetails ;

  constructor(
    private readonly giminiservice: GiminiService,
    private readonly dialog: MatDialog,
    private readonly activeProjectService: ActiveProjectService,
    private readonly subTaskService : SubTaskService,
    public dialogRef: MatDialogRef<AIDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Fetch project details with tasks and subtasks
   */
  getProjectDetails(): Promise<IProjectDetails> {
    return new Promise((resolve, reject) => {
      const tasksWithSubTasks$ = this.activeProjectService.tasks().map(task => {
        return this.subTaskService.getAllSubTasksforTask(task.id!).pipe(
          // Map the subtasks to the task object
          map(subTasks => ({ task, subTasks }))
        );
      });

      // Wait for all tasks and subtasks to complete
      forkJoin(tasksWithSubTasks$).subscribe({
        next: tasks => {
          const projectDetails: IProjectDetails = {
            project: this.activeProjectService.activeProject()!,
            members: this.activeProjectService.members(),
            tasks,
            resources: this.activeProjectService.resources()
          };

          this.projectDetails = projectDetails;
          resolve(projectDetails);
        },
        error: err => reject(err)
      });
    });
  }

  /**
   * Analyze project using GPT
   */
  async analyze() {
    // Use Gimini API to generate text
    try {
      const projectDetails = await this.getProjectDetails();
    const responseObservable = await this.giminiservice.generateText('Analyze the following project details and provide recommendations: ' + JSON.stringify(projectDetails));
    this.openResultDialog(responseObservable.response.text());
    } catch (error) {
      console.error('Error analyzing project:', error);
    }
  }

  /**
   * Suggest tasks using GPT
   */
  async suggestTasks() {
    try {
      const projectDetails = await this.getProjectDetails();
      const responseObservable = await this.giminiservice.generateText('Suggest tasks to add for the following project: ' + JSON.stringify(projectDetails));
      this.openResultDialog(responseObservable.response.text());
    } catch (error) {
      console.error('Error suggesting tasks:', error);
    }
  }

  /**
   * Suggest resources using GPT
   */
  async suggestResources() {
    try {
      const projectDetails = await this.getProjectDetails();
      const responseObservable = await this.giminiservice.generateText('Suggest resources to add for the following project: ' + JSON.stringify(projectDetails));
      this.openResultDialog(responseObservable.response.text());
    } catch (error) {
      console.error('Error suggesting resources:', error);
    }
  }

  /**
   * Open the result dialog with the provided result
   */
  openResultDialog(result: string) {
    this.dialog.open(ResultDialogComponent, {
      data: {
        result: result
      }
    });
  }
}
