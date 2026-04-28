import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ColaboradorListItem {
    id_colaborador: string;
    nome: string;
    email: string;
    matricula: string;
    cargo: string;
    setor: string;
    perfil: string;
    ativo: boolean;
    jornada: { horarioEntrada: string; horarioSaida: string; cargaHorariaDia: number } | null;
}

export interface CreateColaboradorPayload {
    nome: string;
    email: string;
    matricula: string;
    senha: string;
    cargo: string;
    setor: string;
    perfil: string;
    ativo: boolean;
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

@Injectable({ providedIn: 'root' })
export class ColaboradorService {
    private http = inject(HttpClient);

    findAll() {
        return this.http.get<ApiResponse<ColaboradorListItem[]>>(`${environment.apiUrl}/colaborador`);
    }

    create(dados: CreateColaboradorPayload) {
        return this.http.post<ApiResponse<ColaboradorListItem>>(`${environment.apiUrl}/colaborador`, dados);
    }

    toggleStatus(id: string) {
        return this.http.patch<ApiResponse<{ id: string; ativo: boolean }>>(`${environment.apiUrl}/colaborador/${id}/status`, {});
    }
}
