import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface RegistroBatidaEquipe {
    tipo: string;
    timestamp: string;
}

export interface ResumoEquipe {
    horasTrabalhadas: number;
    horasExtras: number;
    horasEsperadas: number;
    atrasoMinutos: number;
    status: string;
}

export interface ColaboradorEquipe {
    id: string;
    nome: string;
    matricula: string;
    cargo: string;
    setor: string;
    ativo: boolean;
    jornada: { horarioEntrada: string; horarioSaida: string; cargaHorariaDia: number } | null;
    registros: RegistroBatidaEquipe[];
    resumo: ResumoEquipe | null;
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class EquipeService {
    private http = inject(HttpClient);

    getEquipeHoje() {
        return this.http.get<ApiResponse<ColaboradorEquipe[]>>(`${environment.apiUrl}/equipe/hoje`);
    }
}
