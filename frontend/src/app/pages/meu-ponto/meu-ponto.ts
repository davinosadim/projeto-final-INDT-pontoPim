import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { PunchActionCard } from '../../components/punch-action-card/punch-action-card';
import { PunchCard, PunchCardData } from '../../components/punch-card/punch-card';
import { DailySummary } from '../../components/daily-summary/daily-summary';
import { RegistroPontoService } from '../../services/registro-ponto.service';
import { AuthService } from '../../auth/auth.service';
import { RegistroBatida, ResumoDiario, TipoBatida } from '../../../interfaces/registroPonto.interfaces';

const BATIDA_LABELS: Record<TipoBatida, string> = {
    entrada: 'Entrada',
    saida_almoco: 'Saída para Almoço',
    retorno_almoco: 'Retorno do Almoço',
    saida: 'Saída Final',
};

const SEQUENCIA: TipoBatida[] = ['entrada', 'saida_almoco', 'retorno_almoco', 'saida'];

function formatarHorario(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Manaus',
    });
}

@Component({
    selector: 'app-meu-ponto',
    imports: [TopBar, SideNav, BottomNav, PunchActionCard, PunchCard, DailySummary],
    templateUrl: './meu-ponto.html',
    styleUrl: './meu-ponto.css',
})
export class MeuPonto implements OnInit, OnDestroy {
    private pontoService = inject(RegistroPontoService);
    private authService = inject(AuthService);

    readonly carregando = signal(true);
    readonly registrando = signal(false);
    readonly erro = signal<string | null>(null);

    private readonly _registros = signal<RegistroBatida[]>([]);
    private readonly _proximaBatida = signal<TipoBatida | null>('entrada');
    private readonly _resumo = signal<ResumoDiario | null>(null);

    readonly nomeUsuario = computed(() => this.authService.usuario()?.nome ?? 'Colaborador');

    readonly horaAtual = signal(new Date());

    readonly horaAtualFormatada = computed(() =>
        this.horaAtual().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Manaus',
        })
    );

    readonly dataHoje = computed(() =>
        this.horaAtual().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'America/Manaus',
        })
    );

    readonly proximaBatidaLabel = computed(() => {
        const prox = this._proximaBatida();
        return prox ? BATIDA_LABELS[prox] : null;
    });

    readonly resumo = computed(() => this._resumo());

    readonly batidas = computed<PunchCardData[]>(() => {
        const registros = this._registros();
        const proxima = this._proximaBatida();

        return SEQUENCIA.map(tipo => {
            const registro = registros.find(r => r.tipo === tipo);

            if (registro) {
                const horario = formatarHorario(registro.timestamp);
                return {
                    tipo,
                    titulo: BATIDA_LABELS[tipo],
                    horario,
                    detalhe: `Registrado às ${horario}`,
                    status: 'registrado' as const,
                    icone: 'check_circle',
                };
            }

            if (tipo === proxima) {
                return {
                    tipo,
                    titulo: BATIDA_LABELS[tipo],
                    horario: '--:--',
                    detalhe: 'Aguardando registro',
                    status: 'pendente' as const,
                    icone: 'schedule',
                };
            }

            return {
                tipo,
                titulo: BATIDA_LABELS[tipo],
                horario: '--:--',
                detalhe: 'Indisponível',
                status: 'bloqueado' as const,
                icone: 'block',
            };
        });
    });

    private _clockInterval?: ReturnType<typeof setInterval>;

    ngOnInit() {
        this._clockInterval = setInterval(() => this.horaAtual.set(new Date()), 1000);
        this.carregarHoje();
    }

    ngOnDestroy() {
        clearInterval(this._clockInterval);
    }

    carregarHoje() {
        this.carregando.set(true);
        this.erro.set(null);

        this.pontoService.getHoje().subscribe({
            next: ({ data }) => {
                this._registros.set(data.registros);
                this._proximaBatida.set(data.proximaBatida);
                this._resumo.set(data.resumo);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Erro ao carregar ponto do dia. Tente novamente.');
                this.carregando.set(false);
            },
        });
    }

    registrarPonto() {
        if (this.registrando()) return;
        this.registrando.set(true);
        this.erro.set(null);

        this.pontoService.registrarPonto().subscribe({
            next: ({ data }) => {
                this._registros.set(data.registroHoje);
                this._proximaBatida.set(data.proximaBatida);
                this.registrando.set(false);
                this.carregarHoje();
            },
            error: (err) => {
                const msg = err?.error?.message ?? 'Erro ao registrar batida.';
                this.erro.set(msg);
                this.registrando.set(false);
            },
        });
    }
}
