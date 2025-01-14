import { Component } from '@angular/core';
import { ProjectStatus } from '../../../../models/iproject';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { ProjectMemberRole } from '../../../../models/iproject-member';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    protected readonly DashboardService: DashboardService,
    protected readonly AuthService: AuthService
  ) {
    this.DashboardService.loadUserDashboard();
  }

  

  getStatusColor(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Active:
        return 'green';
      case ProjectStatus.Completed:
        return 'blue';
      case ProjectStatus.Cancelled:
        return 'red';
      default:
        return 'gray';
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
