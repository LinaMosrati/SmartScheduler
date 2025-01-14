import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceType } from '../../../../models/iresource';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActiveProjectService } from '../../../project/services/active-project.service';

@Component({
  selector: 'app-add-resource-dialog',
  templateUrl: './add-resource-dialog.component.html',
  styleUrl: './add-resource-dialog.component.scss'
})
export class AddResourceDialogComponent {
  resourceForm: FormGroup;

  resourceTypes = Object.values(ResourceType);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddResourceDialogComponent>,
    private readonly ActiveProjectService: ActiveProjectService,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string }
  ) {
    this.resourceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      details: ['', Validators.maxLength(200)],
      cost: [null, [Validators.min(0)]],
      type: [ResourceType.human, Validators.required],
      availability: [true, Validators.required],
      projectId: [data.projectId, Validators.required],
    });
  }

  onSave() {
    if (this.resourceForm.valid) {
      this.ActiveProjectService.addResource(this.resourceForm.value);
      this.dialogRef.close(this.resourceForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
