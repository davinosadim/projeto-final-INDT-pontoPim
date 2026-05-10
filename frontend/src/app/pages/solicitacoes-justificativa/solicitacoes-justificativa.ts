import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { AuthService } from '../../auth/auth.service';
import { AjustePontoResponse, ColaboradorService } from '../../services/colaborador.service';

@Component({
    selector: 'app-solicitacoes-justificativa',
    imports: [TopBar, SideNav, BottomNav],
    templateUrl: './solicitacoes-justificativa.html',
    styleUrl: './solicitacoes-justificativa.css',
})
export class SolicitacoesJustificativa implements OnInit {
    private authService = inject(AuthService);
    private colaboradorService = inject(ColaboradorService);

    readonly carregando = signal(false);
    readonly erro = signal<string | null>(null);
    readonly ajustes = signal<AjustePontoResponse[]>([]);
    readonly aba = signal<AjustePontoResponse['status'] | 'todos'>('todos');

    readonly usuario = computed(() => this.authService.usuario());
    readonly ajustesFiltrados = computed(() => {
        const abaAtual = this.aba();
        if (abaAtual === 'todos') return this.ajustes();
        return this.ajustes().filter(ajuste => ajuste.status === abaAtual);
    });
    readonly totalPendentes = computed(() => this.ajustes().filter(ajuste => ajuste.status === 'pendente').length);
    readonly totalAprovados = computed(() => this.ajustes().filter(ajuste => ajuste.status === 'aprovado').length);
    readonly totalReprovados = computed(() => this.ajustes().filter(ajuste => ajuste.status === 'rejeitado').length);

    ngOnInit() {
        this.carregarAjustes();
    }

    carregarAjustes() {
        const id = this.usuario()?.id;
        if (!id) {
            this.erro.set('Usuario nao identificado.');
            return;
        }

        this.carregando.set(true);
        this.erro.set(null);

        this.colaboradorService.listarAjustesPonto(id).subscribe({
            next: (res) => {
                this.ajustes.set(res.data);
                this.carregando.set(false);
            },
            error: (err) => {
                this.erro.set(err?.error?.message ?? 'Erro ao carregar solicitacoes.');
                this.carregando.set(false);
            }
        });
    }

    alterarAba(aba: AjustePontoResponse['status'] | 'todos') {
        this.aba.set(aba);
    }

    classeStatus(status: AjustePontoResponse['status']): string {
        if (status === 'aprovado') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (status === 'rejeitado') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }

    iconeStatus(status: AjustePontoResponse['status']): string {
        if (status === 'aprovado') return 'task_alt';
        if (status === 'rejeitado') return 'cancel';
        return 'hourglass_top';
    }

    labelStatus(status: AjustePontoResponse['status']): string {
        if (status === 'aprovado') return 'Aprovada';
        if (status === 'rejeitado') return 'Reprovada';
        return 'Pendente';
    }

    formatarBatida(valor: string | null | undefined): string {
        return valor || '--:--';
    }

    alterouBatida(ajuste: AjustePontoResponse, campo: 'entrada' | 'saidaAlmoco' | 'retornoAlmoco' | 'saida'): boolean {
        return this.formatarBatida(ajuste.batidasOriginais?.[campo]) !== this.formatarBatida(ajuste.batidasSolicitadas?.[campo]);
    }

    formatarData(data: string): string {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'America/Manaus',
        });
    }
}
