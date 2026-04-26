import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../interfaces/auth.interfaces';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor (private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login/`, data)
  }

  salvarTokens(response: LoginResponse) {
    localStorage.setItem("token", response.data.acessToken)
    localStorage.setItem("refreshToken", response.data.refreshToken)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  }

  estaLogado(): boolean {
    return !this.getToken
  }


}
