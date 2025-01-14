import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveProjectService } from '../../services/active-project.service';
import { ProjectMemberRole } from '../../../../models/iproject-member';
import { MatDialog } from '@angular/material/dialog';
import { ProjectInviteComponent } from '../../../project-member/components/project-invite/project-invite.component';
import { AddTaskDialogComponent } from '../../../task/components/add-task-dialog/add-task-dialog.component';
import { AddResourceDialogComponent } from '../../../resource/components/add-resource-dialog/add-resource-dialog.component';
import { ProjectStatus } from '../../../../models/iproject';
import { AIDialogComponent } from '../aidialog/aidialog.component';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.component.html',
  styleUrl: './show-project.component.scss'
})
export class ShowProjectComponent {
  constructor(
    protected readonly ActiveProjectService: ActiveProjectService,
    private readonly route: ActivatedRoute,
    private readonly dialog : MatDialog
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const projectId = params.get('projectId') ?? '';
      if (projectId != '' ) {
        this.ActiveProjectService.getActiveProjectInfo(projectId);

      }
    });
  }  

  leaveProject() {
    if (confirm('Are you sure you want to leave this project?'))
      this.ActiveProjectService.leaveProject();
  }

  openDialog() {
    const projectDetails = this.ActiveProjectService.activeProject();
    this.dialog.open(AIDialogComponent, {
      width : '600px',
      minHeight : "250px",
      data: projectDetails,
    });
  }

  // Placeholder for adding a task
  addTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '600px',
      data: {
        availableTasks: this.ActiveProjectService.tasks(),
        availableResources: this.ActiveProjectService.resources(),
        project: this.ActiveProjectService.activeProject(),
      },
    });
  
    dialogRef.afterClosed().subscribe((newTask) => {
      if (newTask) {
        this.ActiveProjectService.addTask(newTask);
      }
    });
  }

  // Placeholder for adding a resource
  addResource() {
    this.dialog.open(AddResourceDialogComponent, {
      width: '600px',
      data: { projectId: this.ActiveProjectService.activeProject()?.id }
    });

  }


  openRoleModal(): void {
    const dialogRef = this.dialog.open(ProjectInviteComponent, {
      width: '400px',
      data: {}, // You can pass additional data here if needed
    });
    dialogRef.afterClosed().subscribe((selectedRole) => {
      if (selectedRole) {
        // console.log('Selected Role:', selectedRole);
        // alert(`Role "${selectedRole}" assigned successfully!`);
        this.ActiveProjectService.generateInviteUrl(selectedRole);
      } else {
        console.log('Dialog was closed without assigning a role.');
      }
    });
  }

  editAccess() : boolean {
    return this.ActiveProjectService.userRole() === ProjectMemberRole.Owner || this.ActiveProjectService.userRole() === ProjectMemberRole.ProjectManager;
  }

  lowerAccess() : boolean{
    return this.ActiveProjectService.userRole() !== ProjectMemberRole.Observer && this.ActiveProjectService.userRole() !== ProjectMemberRole.Contributor;
  }

  isOwner() : boolean {
    return this.ActiveProjectService.userRole() === ProjectMemberRole.Owner;
  }

  getStatusColor(status: ProjectStatus | "Active" | undefined): string {
    switch (status) {
      case ProjectStatus.Active:
        return 'green'; // Active projects appear green
      case ProjectStatus.Completed:
        return 'blue'; // Completed projects appear blue
      case ProjectStatus.Cancelled:
        return 'red'; // Cancelled projects appear red
      default:
        return 'gray'; // Default color for undefined status
    }
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
