import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ListProjectComponent } from './components/list-project/list-project.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator } from '@angular/material/paginator';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { DeleteProjectConfirmationComponent } from './components/delete-project-confirmation/delete-project-confirmation.component';
import { ShowProjectComponent } from './components/show-project/show-project.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { AIDialogComponent } from './components/aidialog/aidialog.component';
import { ResultDialogComponent } from './components/result-dialog/result-dialog.component';


@NgModule({
  declarations: [
    ListProjectComponent,
    AddProjectComponent,
    EditProjectComponent,
    DeleteProjectConfirmationComponent,
    ShowProjectComponent,
    MemberCardComponent,
    TaskBoardComponent,
    ResourceListComponent,
    AIDialogComponent,
    ResultDialogComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatPaginator,
    MatExpansionModule
  ]
})
export class ProjectModule { }
