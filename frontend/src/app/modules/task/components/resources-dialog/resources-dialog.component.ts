import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IResource } from '../../../../models/iresource';

@Component({
  selector: 'app-resources-dialog',
  templateUrl: './resources-dialog.component.html',
  styleUrl: './resources-dialog.component.scss'
})
export class ResourcesDialogComponent {
  availableResources: IResource[] = [];
  selectedResources: IResource[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.availableResources = this.data.availableResources;
    this.selectedResources = this.data.selectedResources;
  }

}
