import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InviteMemberService } from '../../services/invite-member.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../project/services/project.service';
import { ProjectMemberService } from '../../services/project-member.service';
import { ProjectMemberRole } from '../../../../models/iproject-member';
import { IProject } from '../../../../models/iproject';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ScrollService } from '../../../../core/services/scroll/scroll.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss'
})
export class InviteComponent {

  isExpired: boolean = false;
  projectId?: string;
  ownerId?: string;
  role?: ProjectMemberRole;
  projectData?: IProject; // Project data retrieved from the backend
  isLoading: boolean = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly inviteService: InviteMemberService,
    private readonly ProjectService: ProjectService,
    private readonly ProjectMemberService: ProjectMemberService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly ScrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let token = params.get('token');
      if (token) {
        try {
          token = decodeURIComponent(token); // Decode the token
          // Decrypt the token and get its data
          const data = this.inviteService.retrieveInviteData(token);
          this.projectId = data.projectId;
          this.ownerId = data.ownerId;
          this.role = data.role;

          // Fetch project data from backend
          this.ProjectService.getProjectById(this.projectId).subscribe({
            next: (res) => {
              this.projectData = res;
              this.isLoading = false;
              this.ScrollService.scrollToHideNavbar();
                this.ProjectMemberService.getAllProjectMembersforProject(res.id!).subscribe({
                  next: (value) => {
                    const users = value.map((member) => { return member.userId });
                    const currentUserId = this.authService.currentUser()?.id;
                    if (users.includes(currentUserId!)) {
                      this.snackBar.open('You are already a member of this project', 'Close', { duration: 3000 });
                      this.router.navigate(['/project', res.id]); // Redirect to the project
                    }
                  },
                  error: (err) => {
                    this.router.navigate(['/project']);
                  },
                })
            },
            error: (err) => {
              if ( err.status == 401) {
                this.snackBar.open('you need to login!', 'Close', { duration: 3000 });
                this.router.navigate(['/login']);
              }
              else {
                this.snackBar.open(`Error fetching project: ${err.message}`, 'Close', { duration: 3000 });
                this.router.navigate(['/project']); // Redirect to home page
              }
            }
          });
        } catch (error) {
          // Token is invalid or expired
          this.isExpired = true;
          this.isLoading = false;
        }
      } else {
        this.snackBar.open('Invalid invitation link', 'Close', { duration: 3000 });
        this.router.navigate(['/']); // Redirect to home page
      }
    });
  }

  joinProject(): void {

    if (this.authService.currentUser() == null) {
      this.snackBar.open('Please login to join the project', 'Close', { duration: 3000 });
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    // confirm the user wants to join the project
    if (!confirm('Are you sure you want to join this project?')) {
      return;
    }

    if( !this.projectId || !this.ownerId || !this.role) {
      this.snackBar.open('Invalid invitation link', 'Close', { duration: 3000 });
      this.router.navigate(['/']); // Redirect to home page
      return;
    }
    this.ProjectMemberService.acceptProjectInvitation({
      projectId: this.projectId,
      ownerId: this.ownerId,
      userId: this.authService.currentUser()?.id ,
      role: this.role
    }).subscribe({
      next: () => {
        this.snackBar.open('Successfully joined the project!', 'Close', { duration: 3000 });
        this.router.navigate([`/project/${this.projectId}`]); // Redirect to the project
      },
      error: (err) => {
        this.snackBar.open(`Failed to join the project: ${err.message}`, 'Close', { duration: 3000 });
      }
    })
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
