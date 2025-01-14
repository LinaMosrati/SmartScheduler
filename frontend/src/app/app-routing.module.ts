import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { NgModule } from '@angular/core';
import { ValidateEmailComponent } from './modules/auth/components/validate-email/validate-email.component';
import { ResendValidationEmailComponent } from './modules/auth/components/resend-validation-email/resend-validation-email.component';
import { ForgotPasswordComponent } from './modules/auth/components/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './modules/auth/components/new-password/new-password.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
{path : "", component: HomeComponent },
{path:"login",component:LoginComponent},
{path:"signup",component:SignupComponent},
{path : "verify/:token", component:ValidateEmailComponent},
{path : "resend-validation/:email", component: ResendValidationEmailComponent},
{path: "forgot-password", component: ForgotPasswordComponent},
{path : "reset-password/:token", component: NewPasswordComponent},
{path:"admin",loadChildren:()=>import("./modules/admin/admin.module").then(e => e.AdminModule)},
{path:"dashboard",loadChildren:()=>import("./modules/employee/employee.module").then(e => e.EmployeeModule)},
{path:"project",loadChildren:()=>import("./modules/project/project.module").then(e => e.ProjectModule)},
{path:"user",loadChildren:()=>import("./modules/user/user.module").then(e => e.UserModule)},
{path:"invite",loadChildren:()=>import("./modules/project-member/project-member.module").then(e => e.ProjectMemberModule)},
{path:"**",redirectTo:""}

];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule { }
