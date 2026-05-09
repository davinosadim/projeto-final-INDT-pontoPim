import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import {
    ColaboradorService,
    HistoricoPontoDia,
    HistoricoPontoResponse,
    PeriodoHistoricoPonto
} from '../../services/colaborador.service';

const STATUS_LABELS: Record<HistoricoPontoDia['status'], string> = {
    completo: 'Completo',
    incompleto: 'Incompleto',
    falta: 'Falta',
    afastamento: 'Afastamento',
};

@Component({
    selector: 'app-historico-ponto-colaborador',
    imports: [TopBar, SideNav, BottomNav],
    templateUrl: './historico-ponto-colaborador.html',
    styleUrl: './historico-ponto-colaborador.css',
})
export class HistoricoPontoColaborador implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private colaboradorService = inject(ColaboradorService);

    readonly periodo = signal<PeriodoHistoricoPonto>('semana');
    readonly carregando = signal(true);
    readonly erro = signal<string | null>(null);
    readonly mensagem = signal<string | null>(null);
    readonly erroAjuste = signal<string | null>(null);
    readonly diaAjuste = signal<HistoricoPontoDia | null>(null);
    readonly motivoAjuste = signal('');
    readonly entradaAjuste = signal<string | null>(null);
    readonly saidaAlmocoAjuste = signal<string | null>(null);
    readonly retornoAlmocoAjuste = signal<string | null>(null);
    readonly saidaAjuste = signal<string | null>(null);
    readonly solicitandoAjuste = signal(false);
    readonly historico = signal<HistoricoPontoResponse | null>(null);

    readonly colaborador = computed(() => this.historico()?.colaborador ?? null);
    readonly dias = computed(() => this.historico()?.dias ?? []);

    ngOnInit() {
        this.carregarHistorico();
    }

    carregarHistorico() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.erro.set('Colaborador nao informado.');
            this.carregando.set(false);
            return;
        }

        this.carregando.set(true);
        this.erro.set(null);

        this.colaboradorService.historicoPonto(id, this.periodo()).subscribe({
            next: (res) => {
                this.historico.set(res.data);
                this.carregando.set(false);
            },
            error: (err) => {
                this.erro.set(err?.error?.message ?? 'Erro ao carregar historico de ponto.');
                this.carregando.set(false);
            }
        });
    }

    alterarPeriodo(periodo: PeriodoHistoricoPonto) {
        if (this.periodo() === periodo) return;
        this.periodo.set(periodo);
        this.carregarHistorico();
    }

    voltar() {
        this.router.navigate(['/app/colaboradores']);
    }

    emitirEspelhoPonto() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;

        const mesAtual = new Date().getMonth() + 1;
        this.router.navigate(['/app/colaboradores', id, 'espelho', mesAtual]);
    }

    abrirSolicitacaoAjuste(dia: HistoricoPontoDia) {
        this.diaAjuste.set(dia);
        this.motivoAjuste.set('');
        this.entradaAjuste.set(this.valorHorarioInput(dia.batidas.entrada));
        this.saidaAlmocoAjuste.set(this.valorHorarioInput(dia.batidas.saidaAlmoco));
        this.retornoAlmocoAjuste.set(this.valorHorarioInput(dia.batidas.retornoAlmoco));
        this.saidaAjuste.set(this.valorHorarioInput(dia.batidas.saida));
        this.erroAjuste.set(null);
    }

    fecharSolicitacaoAjuste() {
        if (this.solicitandoAjuste()) return;
        this.diaAjuste.set(null);
        this.motivoAjuste.set('');
        this.entradaAjuste.set(null);
        this.saidaAlmocoAjuste.set(null);
        this.retornoAlmocoAjuste.set(null);
        this.saidaAjuste.set(null);
        this.erroAjuste.set(null);
    }

    solicitarAjuste() {
        const id = this.route.snapshot.paramMap.get('id');
        const dia = this.diaAjuste();
        const motivo = this.motivoAjuste().trim();

        if (!id || !dia) return;

        if (!motivo) {
            this.erroAjuste.set('Informe o motivo do ajuste.');
            return;
        }

        const batidasSolicitadas = {
            entrada: this.normalizarHorarioInput(this.entradaAjuste()),
            saidaAlmoco: this.normalizarHorarioInput(this.saidaAlmocoAjuste()),
            retornoAlmoco: this.normalizarHorarioInput(this.retornoAlmocoAjuste()),
            saida: this.normalizarHorarioInput(this.saidaAjuste()),
        };

        if (!Object.values(batidasSolicitadas).some(Boolean)) {
            this.erroAjuste.set('Informe ao menos uma batida corrigida.');
            return;
        }

        this.solicitandoAjuste.set(true);
        this.erroAjuste.set(null);

        this.colaboradorService.solicitarAjustePonto(id, { data: dia.data, motivo, batidasSolicitadas }).subscribe({
            next: () => {
                this.solicitandoAjuste.set(false);
                this.fecharSolicitacaoAjuste();
                this.mensagem.set(`Solicitacao de ajuste enviada para ${this.formatarData(dia.data)}.`);
                setTimeout(() => this.mensagem.set(null), 3500);
            },
            error: (err) => {
                this.erroAjuste.set(err?.error?.message ?? 'Erro ao solicitar ajuste.');
                this.solicitandoAjuste.set(false);
            }
        });
    }

    classeLinha(dia: HistoricoPontoDia): string {
        if (dia.destaque === 'incompleto') {
            return 'bg-yellow-50 hover:bg-yellow-100/70';
        }

        if (dia.destaque === 'atraso') {
            return 'bg-orange-50 hover:bg-orange-100/70';
        }

        return 'hover:bg-slate-50';
    }

    classeStatus(status: HistoricoPontoDia['status']): string {
        if (status === 'completo') return 'bg-emerald-100 text-emerald-700';
        if (status === 'incompleto') return 'bg-yellow-100 text-yellow-800';
        if (status === 'falta') return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-600';
    }

    classeHorasExtras(horasExtras: number): string {
        return horasExtras > 0 ? 'text-emerald-700' : 'text-slate-400';
    }

    classeAtraso(atrasoMinutos: number): string {
        return atrasoMinutos > 0 ? 'text-orange-700' : 'text-slate-400';
    }

    classeBatidaManual(manual: boolean): string {
        return manual ? 'underline decoration-black decoration-1 underline-offset-2' : '';
    }

    labelStatus(status: HistoricoPontoDia['status']): string {
        return STATUS_LABELS[status];
    }

    formatarData(data: string): string {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
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

    formatarHorasMinutos(valor: number): string {
        const totalMinutos = Math.round(valor * 60);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h ${String(minutos).padStart(2, '0')}min`;
    }

    formatarAtraso(minutos: number): string {
        if (minutos <= 0) return '0min';
        const horas = Math.floor(minutos / 60);
        const resto = minutos % 60;
        if (horas === 0) return `${resto}min`;
        return `${horas}h ${String(resto).padStart(2, '0')}min`;
    }

    private valorHorarioInput(timestamp: string | null): string | null {
        if (!timestamp) return null;
        return new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'America/Manaus',
        });
    }

    private normalizarHorarioInput(valor: string | null): string | null {
        return valor?.trim() || null;
    }
}
