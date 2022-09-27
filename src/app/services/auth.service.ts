import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = environment['apiURL'];

  constructor(public http: HttpClient, private router: Router) { }

  login(user: any) {
    return this.http.post<any>(this.baseURL + "/login", user);
  }

  register(user: any) {
    return this.http.post<any>(this.baseURL + "/register", user);
  }
  
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
