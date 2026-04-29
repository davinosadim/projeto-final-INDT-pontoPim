import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PontoHojeResponse, RegistrarPontoResponse } from '../../interfaces/registroPonto.interfaces';

@Injectable({ providedIn: 'root' })
export class RegistroPontoService {
    private http = inject(HttpClient);

    getHoje() {
        return this.http.get<PontoHojeResponse>(`${environment.apiUrl}/registrarPonto/hoje`);
    }

    registrarPonto() {
        return this.http.post<RegistrarPontoResponse>(`${environment.apiUrl}/registrarPonto`, {});
    }
}
