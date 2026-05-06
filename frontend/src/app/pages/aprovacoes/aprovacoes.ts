import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { AjustePonto, EquipeService } from '../../services/equipe.service';

@Component({
    selector: 'app-aprovacoes',
    imports: [TopBar, SideNav, BottomNav],
    templateUrl: './aprovacoes.html',
    styleUrl: './aprovacoes.css',
})
export class Aprovacoes implements OnInit {
    private equipeService = inject(EquipeService);

    readonly aba = signal<'pendente' | 'aprovado' | 'rejeitado'>('pendente');
    readonly carregando = signal(true);
    readonly erro = signal<string | null>(null);
    readonly mensagem = signal<string | null>(null);
    readonly ajustes = signal<AjustePonto[]>([]);
    readonly avaliandoAjusteId = signal<string | null>(null);
    readonly ajusteReprovacao = signal<AjustePonto | null>(null);
    readonly comentarioReprovacao = signal('');
    readonly erroReprovacao = signal<string | null>(null);

    readonly ajustesFiltrados = computed(() =>
        this.ajustes().filter(ajuste => ajuste.status === this.aba())
    );

    readonly totalPendentes = computed(() =>
        this.ajustes().filter(ajuste => ajuste.status === 'pendente').length
    );

    readonly totalAprovados = computed(() =>
        this.ajustes().filter(ajuste => ajuste.status === 'aprovado').length
    );

    readonly totalReprovados = computed(() =>
        this.ajustes().filter(ajuste => ajuste.status === 'rejeitado').length
    );

    ngOnInit() {
        this.carregarAjustes();
    }

    carregarAjustes() {
        this.carregando.set(true);
        this.erro.set(null);

        this.equipeService.getAjustesPonto().subscribe({
            next: (res) => {
                this.ajustes.set(res.data);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Erro ao carregar aprovacoes.');
                this.carregando.set(false);
            }
        });
    }

    alterarAba(aba: 'pendente' | 'aprovado' | 'rejeitado') {
        this.aba.set(aba);
    }

    aprovarAjuste(ajuste: AjustePonto) {
        this.avaliandoAjusteId.set(ajuste.id);
        this.equipeService.avaliarAjuste(ajuste.id, 'aprovado').subscribe({
            next: (res) => {
                this.atualizarAjuste(res.data);
                this.avaliandoAjusteId.set(null);
                this.mostrarMensagem(`Ajuste de ${ajuste.colaborador.nome} aprovado.`);
            },
            error: (err) => {
                this.erro.set(err?.error?.message ?? 'Erro ao aprovar ajuste.');
                this.avaliandoAjusteId.set(null);
            }
        });
    }

    abrirReprovacao(ajuste: AjustePonto) {
        this.ajusteReprovacao.set(ajuste);
        this.comentarioReprovacao.set('');
        this.erroReprovacao.set(null);
    }

    fecharReprovacao() {
        if (this.avaliandoAjusteId()) return;
        this.ajusteReprovacao.set(null);
        this.comentarioReprovacao.set('');
        this.erroReprovacao.set(null);
    }

    reprovarAjuste() {
        const ajuste = this.ajusteReprovacao();
        const comentario = this.comentarioReprovacao().trim();

        if (!ajuste) return;

        if (!comentario) {
            this.erroReprovacao.set('Informe o motivo da reprovacao.');
            return;
        }

        this.avaliandoAjusteId.set(ajuste.id);
        this.equipeService.avaliarAjuste(ajuste.id, 'rejeitado', comentario).subscribe({
            next: () => {
                this.ajustes.update(lista => lista.filter(item => item.id !== ajuste.id));
                this.avaliandoAjusteId.set(null);
                this.fecharReprovacao();
                this.mostrarMensagem(`Ajuste de ${ajuste.colaborador.nome} reprovado.`);
            },
            error: (err) => {
                this.erroReprovacao.set(err?.error?.message ?? 'Erro ao reprovar ajuste.');
                this.avaliandoAjusteId.set(null);
            }
        });
    }

    private atualizarAjuste(ajusteAtualizado: AjustePonto) {
        this.ajustes.update(lista =>
            lista.map(ajuste => ajuste.id === ajusteAtualizado.id ? ajusteAtualizado : ajuste)
        );
    }

    private mostrarMensagem(mensagem: string) {
        this.mensagem.set(mensagem);
        setTimeout(() => this.mensagem.set(null), 3500);
    }

    classeStatus(status: AjustePonto['status']): string {
        if (status === 'aprovado') return 'bg-green-100 text-green-700';
        if (status === 'rejeitado') return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-800';
    }

    labelStatus(status: AjustePonto['status']): string {
        if (status === 'aprovado') return 'Aprovado';
        if (status === 'rejeitado') return 'Reprovado';
        return 'Pendente';
    }

    formatarData(data: string): string {
        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    iniciais(nome: string): string {
        return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }
}
