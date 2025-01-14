import { Component, Input } from '@angular/core';
import { IResource } from '../../../../models/iresource';
import { MatDialog } from '@angular/material/dialog';
import { EditResourceDialogComponent } from '../../../resource/components/edit-resource-dialog/edit-resource-dialog.component';
import { ActiveProjectService } from '../../services/active-project.service';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss'
})
export class ResourceListComponent {
  @Input() canEdit : boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    protected readonly ActiveProjectService: ActiveProjectService,
  ) { }


  onEditResource(resource: IResource) {
    if (!this.canEdit) {
      return;
    }
    this.dialog.open(EditResourceDialogComponent, {
      width: '600px',
      data: { resource },
    });

  }
}
