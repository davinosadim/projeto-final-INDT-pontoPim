import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { SideNav } from '../../components/side-nav/side-nav';
import { TopBar } from '../../components/top-bar/top-bar';
import {
    ColaboradorService,
    EspelhoPontoDia,
    EspelhoPontoMensalResponse
} from '../../services/colaborador.service';

const STATUS_LABELS: Record<EspelhoPontoDia['status'], string> = {
    completo: 'Completo',
    incompleto: 'Incompleto',
    falta: 'Falta',
    afastamento: 'Afastamento',
};

const SETOR_LABELS: Record<string, string> = {
    financeiro: 'Financeiro',
    recursos_humanos: 'Recursos Humanos',
    producao: 'Producao',
    ti: 'TI',
};

@Component({
    selector: 'app-espelho-ponto-mensal',
    imports: [TopBar, SideNav, BottomNav],
    templateUrl: './espelho-ponto-mensal.html',
    styleUrl: './espelho-ponto-mensal.css',
})
export class EspelhoPontoMensal implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private colaboradorService = inject(ColaboradorService);

    readonly carregando = signal(true);
    readonly erro = signal<string | null>(null);
    readonly espelho = signal<EspelhoPontoMensalResponse | null>(null);

    readonly dias = computed(() => this.espelho()?.dias ?? []);
    readonly colaborador = computed(() => this.espelho()?.colaborador ?? null);
    readonly totais = computed(() => this.espelho()?.totais ?? null);

    ngOnInit() {
        this.carregarEspelho();
    }

    carregarEspelho() {
        const id = this.route.snapshot.paramMap.get('id');
        const mes = Number(this.route.snapshot.paramMap.get('mes'));

        if (!id || !Number.isInteger(mes) || mes < 1 || mes > 12) {
            this.erro.set('Parametros do espelho invalidos.');
            this.carregando.set(false);
            return;
        }

        this.carregando.set(true);
        this.erro.set(null);

        this.colaboradorService.espelhoPontoMensal(id, mes).subscribe({
            next: (res) => {
                this.espelho.set(res.data);
                this.carregando.set(false);
            },
            error: (err) => {
                this.erro.set(err?.error?.message ?? 'Erro ao carregar espelho de ponto.');
                this.carregando.set(false);
            }
        });
    }

    voltar() {
        this.router.navigate(['/app/colaboradores']);
    }

    imprimir() {
        window.print();
    }

    labelStatus(status: EspelhoPontoDia['status']): string {
        return STATUS_LABELS[status];
    }

    classeStatus(status: EspelhoPontoDia['status']): string {
        if (status === 'completo') return 'bg-emerald-100 text-emerald-700';
        if (status === 'incompleto') return 'bg-yellow-100 text-yellow-800';
        if (status === 'falta') return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-600';
    }

    classeBatidaManual(manual: boolean): string {
        return manual ? 'underline decoration-black decoration-1 underline-offset-2' : '';
    }

    labelSetor(setor: string): string {
        return SETOR_LABELS[setor] ?? setor;
    }

    formatarData(data: string): string {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'America/Manaus',
        });
    }

    formatarDiaSemana(data: string): string {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
            weekday: 'short',
            timeZone: 'America/Manaus',
        });
    }

    formatarHorario(timestamp: string | null): string {
        if (!timestamp) return '--:--';
        return new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Manaus',
        });
    }

    formatarHoras(valor: number): string {
        return `${valor.toFixed(2).replace('.', ',')}h`;
    }

    formatarMinutos(minutos: number): string {
        const absoluto = Math.abs(minutos);
        const horas = Math.floor(absoluto / 60);
        const resto = absoluto % 60;
        const sinal = minutos < 0 ? '-' : '';

        if (horas === 0) return `${sinal}${resto}min`;
        return `${sinal}${horas}h ${String(resto).padStart(2, '0')}min`;
    }

    formatarReferencia(): string {
        const referencia = this.espelho()?.referencia;
        if (!referencia) return '';

        return new Date(referencia.ano, referencia.mes - 1, 1).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
        });
    }
}
