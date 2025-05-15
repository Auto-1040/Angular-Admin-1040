import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private userService: UserService) { }
  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, { userNameOrEmail: username, password })
      .pipe(
        tap((response: any) => {
          if (response && response.user.roles.includes('Admin')) {
            console.log('Login response:', response);
            sessionStorage.setItem('token', response.token);
            this.userService.setCurrentUser(response.user);
          } else {
            console.error('Login failed: User is not an admin');
            throw new Error('User is not an admin');
          }
        }),
        map((response: any) => !!response?.token), 
               catchError((err) => {
          console.error('Login failed:', err.message || err);
          return throwError(() => err); 
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.userService.setCurrentUser(null);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
