import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProjectComponent } from './components/list-project/list-project.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { ShowProjectComponent } from './components/show-project/show-project.component';

const routes: Routes = [
  {path : "", component: ListProjectComponent},
  {path : "add-project", component: AddProjectComponent},
  {path : "edit-project/:id", component: EditProjectComponent},
  {path : ":projectId", component: ShowProjectComponent},
  // {path : "/:projectId/**", component: ListProjectComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
