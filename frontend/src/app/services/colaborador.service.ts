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
    jornada: string;
    perfil: string;
    ativo: boolean;
}

export type PeriodoHistoricoPonto = 'semana' | 'mes';

export interface BatidasManuais {
    entrada: boolean;
    saidaAlmoco: boolean;
    retornoAlmoco: boolean;
    saida: boolean;
}

export interface HistoricoPontoDia {
    data: string;
    batidas: {
        entrada: string | null;
        saidaAlmoco: string | null;
        retornoAlmoco: string | null;
        saida: string | null;
    };
    batidasManuais: BatidasManuais;
    horasTrabalhadas: number;
    horasExtras: number;
    atrasoMinutos: number;
    status: 'completo' | 'incompleto' | 'falta' | 'afastamento';
    destaque: 'incompleto' | 'atraso' | null;
}

export interface HistoricoPontoResponse {
    colaborador: {
        id: string;
        nome: string;
        email: string;
        matricula: string;
    };
    periodo: PeriodoHistoricoPonto;
    inicio: string;
    fim: string;
    dias: HistoricoPontoDia[];
}

export interface EspelhoPontoDia {
    data: string;
    batidas: {
        entrada: string | null;
        saidaAlmoco: string | null;
        retornoAlmoco: string | null;
        saida: string | null;
    };
    batidasManuais: BatidasManuais;
    horasTrabalhadas: number;
    horasExtras: number;
    atrasoMinutos: number;
    status: 'completo' | 'incompleto' | 'falta' | 'afastamento';
}

export interface EspelhoPontoMensalResponse {
    colaborador: {
        id: string;
        nome: string;
        matricula: string;
        setor: string;
    };
    referencia: {
        mes: number;
        ano: number;
        inicio: string;
        fim: string;
    };
    dias: EspelhoPontoDia[];
    totais: {
        horasTrabalhadas: number;
        horasExtras: number;
        atrasoMinutos: number;
        saldoBancoHorasMinutos: number;
    };
}

export interface SolicitarAjustePayload {
    data: string;
    motivo: string;
    batidasSolicitadas: BatidasAjustePayload;
}

export interface BatidasAjustePayload {
    entrada: string | null;
    saidaAlmoco: string | null;
    retornoAlmoco: string | null;
    saida: string | null;
}

export interface AjustePontoResponse {
    id: string;
    data: string;
    motivo: string;
    batidasOriginais: BatidasAjustePayload | null;
    batidasSolicitadas: BatidasAjustePayload | null;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    comentario: string | null;
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

    historicoPonto(id: string, periodo: PeriodoHistoricoPonto) {
        return this.http.get<ApiResponse<HistoricoPontoResponse>>(`${environment.apiUrl}/colaborador/${id}/ponto`, {
            params: { periodo }
        });
    }

    espelhoPontoMensal(id: string, mes: number) {
        return this.http.get<ApiResponse<EspelhoPontoMensalResponse>>(`${environment.apiUrl}/colaborador/${id}/espelho/${mes}`);
    }

    solicitarAjustePonto(id: string, payload: SolicitarAjustePayload) {
        return this.http.post<ApiResponse<AjustePontoResponse>>(`${environment.apiUrl}/colaborador/${id}/ponto/ajustes`, payload);
    }

    listarAjustesPonto(id: string) {
        return this.http.get<ApiResponse<AjustePontoResponse[]>>(`${environment.apiUrl}/colaborador/${id}/ponto/ajustes`);
    }
}
