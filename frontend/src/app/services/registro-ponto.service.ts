import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';
import { RegistroResponse } from '../../interfaces/registroPonto.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RegistroPontoService {

  constructor(private http: HttpClient) {}

  registrarPonto(tipo: string) {
    const token = localStorage.getItem("token")


    return this.http.post<RegistroResponse>(`${environment.apiUrl}/registrarPonto/`, 
      {tipo},
      { headers: {
        Authorization: `Bearer ${token}`
      }}
    )
  }
}
