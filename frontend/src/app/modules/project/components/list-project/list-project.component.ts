import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IProject, ProjectStatus } from '../../../../models/iproject';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectConfirmationComponent } from '../delete-project-confirmation/delete-project-confirmation.component';
import { ProjectMemberService } from '../../../project-member/services/project-member.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { IProjectMember, ProjectMemberRole } from '../../../../models/iproject-member';

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent {
  projectsMember: IProjectMember[] = [];
  listOfProjects: IProject[] = [];
  filteredProjects: IProject[] = [];
  paginatedProjects: IProject[] = [];
  projectStatus = ProjectStatus;
  searchQuery: string = '';
  selectedStatus: string = '';
  pageSize: number = 3;
  pageIndex: number = 0;
  length: number = 0;

  constructor(
    private readonly router : Router, 
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService, 
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.projectMemberService.getAllProjectMemebersforUser(this.authService.currentUser()?.id!).subscribe({
      next: response => {
        if (response) {
          this.projectsMember = response;
          this.listOfProjects = response.map((projectMember: any) => projectMember.project);
          this.applyFilters();
        }
      }
    });
    // this.applyFilters();
  }

  applyFilters(): void {
    const searchTerm = this.searchQuery.toLowerCase();

    this.filteredProjects = this.listOfProjects.filter((project: IProject) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm) || 
                            project.description.toLowerCase().includes(searchTerm);
      const matchesStatus = this.selectedStatus ? project.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });

    this.length = this.filteredProjects.length;
    this.updatePagination();
  }

  getRole(projectId: string): ProjectMemberRole {
    const projectMember = this.projectsMember.find((projectMember: IProjectMember) => projectMember.projectId === projectId);
    return projectMember?.role!;
  }

  isOwner(projectId: string): boolean {
    const projectMember = this.projectsMember.find((projectMember: IProjectMember) => projectMember.projectId === projectId);
    return projectMember?.role === 'Owner';
  }

  updatePagination(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  onViewProject(projectId: string) {
    console.log('Viewing project with ID:', projectId);
    this.router.navigate(['/project', projectId])

  }

  onUpdateProject(projectId: string) {
    console.log('Updating project with ID:', projectId);
    this.router.navigate(['/project', 'edit-project', projectId]);
  }

  onDeleteProject(projectId: string) {
    console.log('Deleting project with ID:', projectId);
  }

  onAddProject() {
    this.router.navigate(['/project', 'add-project']);
  }

  confirmDelete(projectId: string): void {
    const dialogRef = this.dialog.open(DeleteProjectConfirmationComponent);
  
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            console.log('Project deleted successfully');
            this.listOfProjects = this.listOfProjects.filter(project => project.id !== projectId);
            this.applyFilters(); // Reapply filters to update the UI
          },
          error: err => console.error('Error deleting project:', err),
        });
      }
    });
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
