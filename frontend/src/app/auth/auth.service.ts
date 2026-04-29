import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginRequest, LoginResponse, TokenPayload, UsuarioLogado } from '../../interfaces/auth.interfaces';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);

    private _accessToken = signal<string | null>(localStorage.getItem('token'));

    readonly isLoggedIn = computed(() => {
        const token = this._accessToken();
        if (!token) return false;
        const payload = this._decodeToken(token);
        if (!payload) return false;
        return payload.exp * 1000 > Date.now();
    });

    readonly usuario = computed<UsuarioLogado | null>(() => {
        const token = this._accessToken();
        if (!token) return null;
        const payload = this._decodeToken(token);
        if (!payload) return null;
        return {
            id: payload.sub,
            nome: payload.nome,
            email: payload.email,
            perfil: payload.perfil
        };
    });

    readonly perfil = computed(() => this.usuario()?.perfil ?? null);

    login(data: LoginRequest) {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, data);
    }

    salvarTokens(response: LoginResponse) {
        localStorage.setItem('token', response.data.acessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        this._accessToken.set(response.data.acessToken);
    }

    getToken(): string | null {
        return this._accessToken();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this._accessToken.set(null);
    }

    private _decodeToken(token: string): TokenPayload | null {
        try {
            const [, payload] = token.split('.');
            return JSON.parse(atob(payload!)) as TokenPayload;
        } catch {
            return null;
        }
    }
}
