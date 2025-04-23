import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: UserModel | null = null;

  constructor(private http: HttpClient) { }
  setCurrentUser(user: UserModel): void {
    this.currentUser = user;
  }

  getCurrentUser(): UserModel | null {
    return this.currentUser;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiBaseUrl}/User`);
  }
  
  addUser(user: UserModel): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/User`, user);
  }
  
  updateUser(id: number, user: UserModel): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/User/${id}`, user);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/User/${id}`);
  }
}
