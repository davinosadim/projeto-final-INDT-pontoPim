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

export type StatusAjustePonto = 'pendente' | 'aprovado' | 'rejeitado';

export interface BatidasAjuste {
    entrada: string | null;
    saidaAlmoco: string | null;
    retornoAlmoco: string | null;
    saida: string | null;
}

export interface AjustePonto {
    id: string;
    data: string;
    motivo: string;
    batidasOriginais: BatidasAjuste | null;
    batidasSolicitadas: BatidasAjuste | null;
    status: StatusAjustePonto;
    comentario: string | null;
    colaborador: {
        id: string;
        nome: string;
        matricula: string;
        cargo: string;
        setor: string;
    };
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

    getAjustesPonto(status?: StatusAjustePonto) {
        return this.http.get<ApiResponse<AjustePonto[]>>(`${environment.apiUrl}/equipe/ajustes-ponto`, {
            params: status ? { status } : {}
        });
    }

    avaliarAjuste(ajusteId: string, status: 'aprovado' | 'rejeitado', comentario: string | null = null) {
        return this.http.patch<ApiResponse<AjustePonto>>(`${environment.apiUrl}/equipe/ajustes-ponto/${ajusteId}`, {
            status,
            comentario
        });
    }
}
