import { Component, Inject } from '@angular/core';
import { ProjectMemberRole } from '../../../../models/iproject-member';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../../../models/iuser';

@Component({
  selector: 'app-edit-project-member',
  templateUrl: './edit-project-member.component.html',
  styleUrl: './edit-project-member.component.scss'
})
export class EditProjectMemberComponent {
  updatedRole: ProjectMemberRole;
  availableRoles = Object.values(ProjectMemberRole);
  user?:IUser;

  constructor(
    public dialogRef: MatDialogRef<EditProjectMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public member: any // Data passed from the parent component
  ) {
    this.availableRoles = this.availableRoles.filter((role) => role !== ProjectMemberRole.Owner);
    this.user = member.member;
    this.updatedRole = member.role; // Set the initial role
  }

  onSave() {
    this.dialogRef.close({ action: 'update', role: this.updatedRole });
  }

  onRemove() {
    if (confirm('Are you sure you want to remove this user?')) {
      this.dialogRef.close({ action: 'remove' });
    }
  }
}
