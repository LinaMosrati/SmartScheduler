import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { CapitalizePipe } from './core/pipes/capitalize.pipe';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ResendValidationEmailComponent } from './modules/auth/components/resend-validation-email/resend-validation-email.component';
import { ValidateEmailComponent } from './modules/auth/components/validate-email/validate-email.component';
import { ForgotPasswordComponent } from './modules/auth/components/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './modules/auth/components/new-password/new-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskFilterPipe } from './core/pipes/task-filter.pipe';
import { ProjectInviteComponent } from './modules/project-member/components/project-invite/project-invite.component';
import { EditProjectMemberComponent } from './modules/project-member/components/edit-project-member/edit-project-member.component';
import { AddTaskDialogComponent } from './modules/task/components/add-task-dialog/add-task-dialog.component';
import { ResourcesDialogComponent } from './modules/task/components/resources-dialog/resources-dialog.component';
import { DependentTasksDialogComponent } from './modules/task/components/dependent-tasks-dialog/dependent-tasks-dialog.component';
import { EditTaskDialogComponent } from './modules/task/components/edit-task-dialog/edit-task-dialog.component';
import { TaskDetailsComponent } from './modules/task/components/task-details/task-details.component';
import { AddSubTaskDialogComponent } from './modules/sub-task/components/add-sub-task-dialog/add-sub-task-dialog.component';
import { EditSubTaskDialogComponent } from './modules/sub-task/components/edit-sub-task-dialog/edit-sub-task-dialog.component';
import { DetailsSubTaskDialogComponent } from './modules/sub-task/components/details-sub-task-dialog/details-sub-task-dialog.component';
import { EditResourceDialogComponent } from './modules/resource/components/edit-resource-dialog/edit-resource-dialog.component';
import { AddResourceDialogComponent } from './modules/resource/components/add-resource-dialog/add-resource-dialog.component';
import { NumberFormatterPipe } from './core/pipes/number-formatter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    CapitalizePipe,
    ResendValidationEmailComponent,
    ValidateEmailComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    TaskFilterPipe,
    ProjectInviteComponent,
    EditProjectMemberComponent,
    AddTaskDialogComponent,
    DependentTasksDialogComponent,
    ResourcesDialogComponent,
    EditTaskDialogComponent,
    TaskDetailsComponent,
    AddSubTaskDialogComponent,
    EditSubTaskDialogComponent,
    DetailsSubTaskDialogComponent,
    AddResourceDialogComponent,
    EditResourceDialogComponent,
    NumberFormatterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
  
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent] 
})
export class AppModule {}
