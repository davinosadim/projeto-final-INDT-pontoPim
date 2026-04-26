import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../interfaces/auth.interfaces';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient)

  private apiUrl = "http://localhost:3000/auth/login"

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(this.apiUrl, data)
  }



}
