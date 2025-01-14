import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { IUser } from '../../../models/iuser';
import { IUserLogin } from '../../../models/iuser-login';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;
  currentUser = signal<IUser | undefined | null>(undefined);


  apiCheckUser = `${this.apiUrl}/user` ;
  apiRegister = `${this.apiUrl}/register` ;
  apiLogin = `${this.apiUrl}/login`;

  checkAuth() {
    return this.http
      .get<{ message: string, user: IUser }>(this.apiCheckUser)
      .subscribe({          
         next: (response) => {
        console.log(response);
        this.currentUser.set(response.user);
        },
        error: (error) => {
          this.currentUser.set(null);
        }
      });
  }

  login(user: IUserLogin) {
    
    const email = user.email;

    return this.http
      .post<{ token: string; user: IUser }>(this.apiLogin, user)
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
          this.openSnackBar('Logged in successfully');
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          // console.log(error.status);
          if (error.status == 401) {
            this.openSnackBar('Invalid email or password');
            return throwError(() => new Error('Invalid email or password'));
          }
          else if (error.status == 402) {
            this.openSnackBar('Please verify your email address');
            this.router.navigate(['/resend-validation', email ]);
            return of(null);
            // return throwError(() => new Error('Email not verified'));
          }
          else if (error.status == 403) {
            this.openSnackBar('Your account is inactive. Please contact support.');
            return throwError(() => new Error('Account inactive'));
          }
          else if (error.status == 409 || error.status == 408) {
            this.openSnackBar(error.error.message);
            return throwError(() => new Error('Account locked'));
          }
          this.openSnackBar('An error occurred. Please try again later.');
          return throwError(() => new Error('An error occurred'));
          
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.openSnackBar('Logged out');
    this.router.navigate(['/']);
  }

  register(user: FormData) {
    
    const requiredFields = ['firstName', 'lastName', 'contact', 'email'];
    
    for (const field of requiredFields) {
      if (!user.has(field) || !user.get(field)) {
        console.log(`Form data is not valid: Missing or empty field "${field}"`);
        this.openSnackBar(`Form data is not valid: Missing or empty field "${field}"`);
      }
    }
    return this.http
      .post<{message: string}>(this.apiRegister, user)
      .pipe(
        tap((response) => {
          console.log(response.message);        
          this.openSnackBar(response.message);  
          this.router.navigate(['/login']);
        }),
        catchError( (error) => {
          if (error.status === 409) {
            // Handle email conflict
            this.openSnackBar('This email is already in use. Please try another one.');
            return throwError(() => new Error('Email already in use'));
          }
          if(error.status === 400) {
            // Handle other validation errors
            this.openSnackBar('Please fill in all required fields correctly');
            return throwError(() => new Error('Validation error'));
          }
          // Handle other errors
          this.openSnackBar('An error occurred. Please try again later.');
          return throwError(() => new Error('An error occurred'));
        })
      )      
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    }
    );
  }
  

}
