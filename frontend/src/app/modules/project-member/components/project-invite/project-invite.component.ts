import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectMemberRole } from '../../../../models/iproject-member';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-invite',
  templateUrl: './project-invite.component.html',
  styleUrl: './project-invite.component.scss'
})
export class ProjectInviteComponent {
  roles: ProjectMemberRole[] = [
    ProjectMemberRole.ProjectManager,
    ProjectMemberRole.Developer,
    ProjectMemberRole.TesterQA,
    ProjectMemberRole.Contributor,
    ProjectMemberRole.Observer
  ]; // Available roles

  // roles: string[] = [
  //   'Project Manager',
  //   'Developer',
  //   'Tester/QA',
  //   'Contributor',
  //   'Observer'
  // ]; // Available

  selectedRole: string = ''; // Role selected by the user

  constructor(
    public dialogRef: MatDialogRef<ProjectInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close(); // Close the modal without returning data
  }

  onAssignRole(): void {
    if (!this.selectedRole) {
      this._snackBar.open('Please select a role!', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }
    this.dialogRef.close(this.selectedRole); // Close the modal and return the selected role
  }
}
