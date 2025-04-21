import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { map, Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private userService: UserService) {}
    login(username: string, password: string) :Observable<boolean> {
     return this.http.post(`${environment.apiBaseUrl}/auth/login`, { userNameOrEmail: username, password })
        .pipe(
          tap((response: any) => {
            console.log('Login response:', response);
            if (response && response.token) {
              sessionStorage.setItem('token', response.token); 
              this.userService.setCurrentUser(response.user);
            }
          }),
          map((response: any) => !!response?.token)
        );
}
}
