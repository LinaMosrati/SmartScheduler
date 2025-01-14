import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResource, ResourceType } from '../../../../models/iresource';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActiveProjectService } from '../../../project/services/active-project.service';

@Component({
  selector: 'app-edit-resource-dialog',
  templateUrl: './edit-resource-dialog.component.html',
  styleUrl: './edit-resource-dialog.component.scss'
})
export class EditResourceDialogComponent {

  resourceForm: FormGroup;

  resourceTypes = Object.values(ResourceType);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EditResourceDialogComponent>,
    private readonly ActiveProjectService: ActiveProjectService,
    @Inject(MAT_DIALOG_DATA) public data: { resource: IResource }
  ) {
    this.resourceForm = this.fb.group({
      id: [data.resource.id],
      name: [data.resource.name, [Validators.required, Validators.maxLength(50)]],
      type: [data.resource.type, Validators.required],
      availability: [data.resource.availability],
      details: [data.resource.details, Validators.maxLength(200)],
      cost: [data.resource.cost, [Validators.min(0)]],
      projectId: [data.resource.projectId],
    });
  }

  onSave() {
    if (this.resourceForm.valid) {
      this.ActiveProjectService.updateResource(this.resourceForm.value);
      this.dialogRef.close();
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.ActiveProjectService.deleteResource(this.resourceForm.value['id']);
      this.dialogRef.close();
    }
  }

}
