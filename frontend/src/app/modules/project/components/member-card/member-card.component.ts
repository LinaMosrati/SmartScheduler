import { Component, Input } from '@angular/core';
import { IUser } from '../../../../models/iuser';
import { EditProjectMemberComponent } from '../../../project-member/components/edit-project-member/edit-project-member.component';
import { ProjectMemberRole } from '../../../../models/iproject-member';
import { ActiveProjectService } from '../../services/active-project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectMemberService } from '../../../project-member/services/project-member.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TaskStatus } from '../../../../models/itask';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  @Input() member?: IUser;
  @Input() role?: string;
  @Input() color?: string;
  @Input() projectMemberId?: string;
  @Input() canEdit: boolean = false;

  constructor(
      protected readonly ActiveProjectService: ActiveProjectService,
      private readonly projectMemberService: ProjectMemberService,
      private readonly authService: AuthService,
      private readonly dialog : MatDialog,
      private readonly _snackBar: MatSnackBar
    ) { }

    ngOnInit() {
      if ( this.canEdit && ( this.role == ProjectMemberRole.Owner || this.member?.id == this.authService.currentUser()?.id)) {
        this.canEdit = false;
      }
    }

  openEditUserDialog(): void {
    const dialogRef = this.dialog.open(EditProjectMemberComponent, {
      width: '400px',
      data: {
        member: this.member,
        role: this.role,
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.action === 'update') {
          this.updateUserRole(this.member?.id!, result.role);
        } else if (result.action === 'remove') {
          this.removeUserFromProject(this.member?.id!);
        }
      }
    });
  }
  
  updateUserRole(userId: string, newRole: ProjectMemberRole) {
    this.projectMemberService.updateProjectMember({
      id: this.projectMemberId!,
      projectId: this.ActiveProjectService.activeProject()?.id!,
      userId: userId,
      role: newRole
    }).subscribe({
      next: () => {
        this._snackBar.open('User role updated successfully!', '', {
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.ActiveProjectService.refreshMembers(); // Refresh members list
      },
      error: (err) => {
        this._snackBar.open(err.message, '', {
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
  
  removeUserFromProject(userId: string) {
    this.projectMemberService.deleteProjectMember(this.projectMemberId!).subscribe({
      next: () => {
        this._snackBar.open('User removed successfully!', '', {
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.ActiveProjectService.refreshMembers(); // Refresh members list
      },
      error: (err) => {
        this._snackBar.open(err.message, '', {
          duration: 1500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  getNumberOfTasks() {
    return this.ActiveProjectService.tasks().filter(t => t.userId === this.member?.id).length;
  }

  getNumberOfTasksCompleted() {
    return this.ActiveProjectService.tasks().filter(t => t.userId === this.member?.id && t.status === TaskStatus.done).length
  }

  canShowNbTasks(){
    return this.role != ProjectMemberRole.Owner && this.role != ProjectMemberRole.Contributor && this.role != ProjectMemberRole.Observer;
  }
}
