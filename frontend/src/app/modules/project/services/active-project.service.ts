import { Injectable, signal } from '@angular/core';
import { IProject } from '../../../models/iproject';
import { ITask, TaskStatus } from '../../../models/itask';
import { IResource } from '../../../models/iresource';
import { IUser } from '../../../models/iuser';
import { IProjectMember, ProjectMemberRole } from '../../../models/iproject-member';
import { ProjectService } from './project.service';
import { ProjectMemberService } from '../../project-member/services/project-member.service';
import { TaskService } from '../../task/services/task.service';
import { ResourceService } from '../../resource/services/resource.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth/auth.service';
import { InviteMemberService } from '../../project-member/services/invite-member.service';
import { IProjectStatistic } from '../../../models/iproject-statistic';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveProjectService {

  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService,
    private readonly taskService: TaskService,
    private readonly resourceService: ResourceService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly authService: AuthService,
    private readonly inviteMemberService: InviteMemberService
  ) { }

  activeProject = signal<IProject | undefined | null>(undefined);
  tasks = signal<ITask[]>([]);
  resources = signal<IResource[]>([]);
  members = signal<IProjectMember[]>([]);
  statics = signal<IProjectStatistic | null>(null); 

  userRole = signal<ProjectMemberRole | undefined | null>(undefined);


  getActiveProjectInfo(projectId: string) {
    const project$ = this.projectService.getProjectById(projectId);
    const members$ = this.projectMemberService.getAllProjectMembersforProject(projectId);
    const tasks$ = this.taskService.getAllTasksforProject(projectId);
    const resources$ = this.resourceService.getAllResourcesforProject(projectId);
  
    forkJoin({
      project: project$,
      members: members$,
      tasks: tasks$,
      resources: resources$,
    }).subscribe({
      next: ({ project, members, tasks, resources }) => {
        console.log('Project:', project);
        console.log('Members:', members);
        console.log('Tasks:', tasks);
        console.log('Resources:', resources);
  
        // Set the project
        this.activeProject.set(project);
  
        // Set members and determine the current user's role
        this.members.set(this.sortMembersByRole(members));
        const currentUserId = this.authService.currentUser()?.id;
        const currentUser = members.find((member) => member.userId === currentUserId);
  
        if (currentUser) {
          this.userRole.set(currentUser.role);
        } else {
          this._snackBar.open('You are not assigned to this Project, Contact the Owner.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          this.router.navigate(['/project']);
          return; // Exit early if user is not assigned to the project
        }
  
        // Set tasks and resources
        this.tasks.set(tasks);
        this.resources.set(resources);
  
        // Calculate statistics after all data is loaded
        this.calculateStatistics();
      },
      error: (err) => {
        console.error('Error loading project data:', err);
  
        // Handle errors and navigate to projects page if necessary
        this.activeProject.set(null);
        this.members.set([]);
        this.tasks.set([]);
        this.resources.set([]);
        this.router.navigate(['/project']);
      },
    });
  }

  leaveProject() {
    const currentUserId = this.authService.currentUser()?.id;
    const currentMember = this.members().find((member) => member.userId === currentUserId);
  
    if (currentMember) {
      this.projectMemberService.deleteProjectMember(currentMember.id!).subscribe({
        next: () => {
          this._snackBar.open('You have left the project!', '', { duration: 1500 });
          this.router.navigate(['/project']);
        },
        error: (err) => {
          console.error('Error leaving project:', err);
        },
      });
    } else {
      this._snackBar.open('You are not assigned to this Project, Contact the Owner.', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      this.router.navigate(['/project']);
    }
  }

  refrechProject() {
    this.projectService.getProjectById(this.activeProject()?.id!).subscribe({
      next: (project) => {
        this.activeProject.set(project);
        this.calculateStatistics();
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.activeProject.set(null);
        this.router.navigate(['/project']);
      },
    });
  }

  refreshMembers() {
    this.projectMemberService.getAllProjectMembersforProject(this.activeProject()?.id!).subscribe({
      next: (members) => {
        this.members.set(this.sortMembersByRole(members));
        const currentUserId = this.authService.currentUser()?.id;
        const currentUser = members.find((member) => member.userId === currentUserId);
  
        if (currentUser) {
          this.userRole.set(currentUser.role);
          this.calculateStatistics();
        } else {
          this._snackBar.open('You are not assigned to this Project, Contact the Owner.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1500,
          });
          this.router.navigate(['/project']);
        }
      },
      error: (err) => {
        console.error('Error loading project members:', err);
        this.members.set([]);
      },
    });
  }

  addTask(task: ITask) {
    this.taskService.addTask(task).subscribe({
      next: () => {
        this._snackBar.open('Task added successfully!', '', { duration: 1500 });
        this.refreshTasks();
      },
      error: (err) => {
        console.error('Error adding task:', err);
      },
    });
  }

  updateTask(task: ITask) {
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this._snackBar.open('Task updated successfully!', '', { duration: 1500 });
        this.refreshTasks();
      },
      error: (err) => {
        console.error('Error updating task:', err);
      },
    });
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this._snackBar.open('Task deleted successfully!', '', { duration: 1500 });
        this.refreshTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      },
    });
  }

  refreshTasks() {
    this.taskService.getAllTasksforProject(this.activeProject()?.id!).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.calculateStatistics();
      },
      error: (err) => {
        console.error('Error loading project tasks:', err);
        this.tasks.set([]);
      },
    });
  }

  addResource(resource: IResource) {
    this.resourceService.addResource(resource).subscribe({
      next: () => {
        this._snackBar.open('Resource added successfully!', '', { duration: 1500 });
        this.refreshResources();
      },
      error: (err) => {
        console.error('Error adding resource:', err);
      },
    });
  }

  updateResource(resource: IResource) {
    this.resourceService.updateResource(resource).subscribe({
      next: () => {
        this._snackBar.open('Resource updated successfully!', '', { duration: 1500 });
        this.refreshResources();
      },
      error: (err) => {
        console.error('Error updating resource:', err);
      },
    });
  }

  deleteResource(resourceId: string) {
    this.resourceService.deleteResource(resourceId).subscribe({
      next: () => {
        this._snackBar.open('Resource deleted successfully!', '', { duration: 1500 });
        this.refreshResources();
      },
      error: (err) => {
        console.error('Error deleting resource:', err);
      },
    });
  }

  refreshResources() {
    this.resourceService.getAllResourcesforProject(this.activeProject()?.id!).subscribe({
      next: (resources) => {
        this.resources.set(resources);
        this.calculateStatistics();
      },
      error: (err) => {
        console.error('Error loading project resources:', err);
        this.resources.set([]);
      },
    });
  }

  sortMembersByRole(members: IProjectMember[]): IProjectMember[] {
    const roleOrder = [
      ProjectMemberRole.Owner,
      ProjectMemberRole.ProjectManager,
      ProjectMemberRole.Developer,
      ProjectMemberRole.TesterQA,
      ProjectMemberRole.Contributor,
      ProjectMemberRole.Observer
    ];
  
    return members.sort((a, b) => {
      const roleA = roleOrder.indexOf(a.role);
      const roleB = roleOrder.indexOf(b.role);
      return roleA - roleB;
    });
  }

  calculateStatistics() {
      let stat : IProjectStatistic = {
        daysPassed: 0,
        daysRemaining: 0,
        roleCount: {},
        completedTasks: 0,
        inProgressTasks: 0,
        totalResourceCost: 0
      }
      const project = this.activeProject();
      if (project) {
        const startDate = new Date(project.startDate).getTime();
        const endDate = new Date(project.endDate).getTime();
        const now = Date.now();
  
        stat.daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        stat.daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
  
        stat.roleCount = this.members().reduce((count: { [role: string]: number }, member) => {
          const roleKey = member.role.toString(); 
          count[roleKey] = (count[roleKey] || 0) + 1; 
          return count;
        }, {} as { [role: string]: number });
  
        stat.completedTasks = this.tasks().filter((task) => task.status === TaskStatus.done).length;
        stat.inProgressTasks = this.tasks().filter((task) => task.status === TaskStatus.inProgress).length;
  
        this.resources().forEach((resource) => {
          stat.totalResourceCost += Number(resource.cost) || 0;
        });
        this.statics.set(stat);
      }

    }

  generateInviteUrl(role: ProjectMemberRole ) {
    const url = this.inviteMemberService.generateInviteUrl(this.activeProject()?.id!, role);
    navigator.clipboard.writeText(url).then(() => {
      this._snackBar.open('Invite link copied to clipboard!', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
    });
  }
}
