import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { ColaboradorEquipe, EquipeService } from '../../services/equipe.service';

const LABELS_TIPO: Record<string, string> = {
    entrada: 'Entrada',
    saida_almoco: 'Saída Almoço',
    retorno_almoco: 'Retorno Almoço',
    saida: 'Saída',
};

const LABELS_STATUS: Record<string, string> = {
    completo: 'Completo',
    incompleto: 'Em andamento',
    falta: 'Falta',
};

const CLASSES_STATUS: Record<string, string> = {
    completo: 'bg-green-100 text-green-800',
    incompleto: 'bg-yellow-100 text-yellow-800',
    falta: 'bg-red-100 text-red-800',
};

@Component({
    selector: 'app-equipe',
    imports: [TopBar, SideNav, BottomNav],
    templateUrl: './equipe.html',
    styleUrl: './equipe.css',
})
export class Equipe implements OnInit {
    private equipeService = inject(EquipeService);

    readonly carregando = signal(true);
    readonly erro = signal<string | null>(null);
    readonly colaboradores = signal<ColaboradorEquipe[]>([]);

    readonly filtro = signal<'todos' | 'ativos' | 'inativos'>('ativos');

    readonly colaboradoresFiltrados = computed(() => {
        const lista = this.colaboradores();
        const f = this.filtro();
        if (f === 'ativos') return lista.filter(c => c.ativo);
        if (f === 'inativos') return lista.filter(c => !c.ativo);
        return lista;
    });

    readonly totalPresentes = computed(() =>
        this.colaboradores().filter(c => c.ativo && c.registros.length > 0).length
    );

    readonly totalFalta = computed(() =>
        this.colaboradores().filter(c => c.ativo && c.registros.length === 0).length
    );

    ngOnInit() {
        this.carregarEquipe();
    }

    carregarEquipe() {
        this.carregando.set(true);
        this.erro.set(null);
        this.equipeService.getEquipeHoje().subscribe({
            next: (res) => {
                this.colaboradores.set(res.data);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Erro ao carregar dados da equipe.');
                this.carregando.set(false);
            }
        });
    }

    labelTipo(tipo: string): string {
        return LABELS_TIPO[tipo] ?? tipo;
    }

    labelStatus(status: string | undefined): string {
        if (!status) return 'Sem registro';
        return LABELS_STATUS[status] ?? status;
    }

    classStatus(status: string | undefined): string {
        if (!status) return 'bg-slate-100 text-slate-600';
        return CLASSES_STATUS[status] ?? 'bg-slate-100 text-slate-600';
    }

    formatarHora(timestamp: string): string {
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    formatarHoras(h: number): string {
        const hh = Math.floor(h);
        const mm = Math.round((h - hh) * 60);
        return `${String(hh).padStart(2, '0')}h${String(mm).padStart(2, '0')}`;
    }

    iniciais(nome: string): string {
        return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }
}
