import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { ColaboradorListItem, ColaboradorService, CreateColaboradorPayload } from '../../services/colaborador.service';

const CARGOS = [
    { value: 'operador', label: 'Operador' },
    { value: 'assitente_producao', label: 'Assistente de Produção' },
    { value: 'analista_rh', label: 'Analista de RH' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'analista_financeiro', label: 'Analista Financeiro' },
    { value: 'analista_desenvolvimento', label: 'Analista de Desenvolvimento' },
];

const SETORES = [
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'recursos_humanos', label: 'Recursos Humanos' },
    { value: 'producao', label: 'Produção' },
    { value: 'ti', label: 'TI' },
];

const TURNOS = [
    { value: 'manha', label: 'Manhã (07h–16h)' },
    { value: 'tarde', label: 'Tarde (14h–23h)' },
    { value: 'noite', label: 'Noite' },
    { value: 'administrativo', label: 'Administrativo (08h–17h)' },
];

const PERFIS = [
    { value: 'colaborador', label: 'Colaborador' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'rh', label: 'RH' },
];

@Component({
    selector: 'app-colaboradores',
    imports: [ReactiveFormsModule, TopBar, SideNav, BottomNav],
    templateUrl: './colaboradores.html',
    styleUrl: './colaboradores.css',
})
export class Colaboradores implements OnInit, OnDestroy {
    private colaboradorService = inject(ColaboradorService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private sucessoTimeout: ReturnType<typeof setTimeout> | null = null;

    readonly cargos = CARGOS;
    readonly setores = SETORES;
    readonly turnos = TURNOS;
    readonly perfis = PERFIS;

    readonly carregando = signal(true);
    readonly erro = signal<string | null>(null);
    readonly colaboradores = signal<ColaboradorListItem[]>([]);
    readonly mostrarModal = signal(false);
    readonly salvando = signal(false);
    readonly erroForm = signal<string | null>(null);
    readonly filtroBusca = signal('');
    readonly mensagemSucesso = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group({
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        matricula: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        cargo: ['', Validators.required],
        setor: ['', Validators.required],
        jornada: ['', Validators.required],
        perfil: ['colaborador', Validators.required],
        ativo: [true],
    });

    readonly colaboradoresFiltrados = computed(() => {
        const busca = this.filtroBusca().toLowerCase();
        if (!busca) return this.colaboradores();
        return this.colaboradores().filter(c =>
            c.nome.toLowerCase().includes(busca) ||
            c.email.toLowerCase().includes(busca) ||
            c.matricula.toLowerCase().includes(busca)
        );
    });

    ngOnInit() {
        this.carregarColaboradores();
    }

    ngOnDestroy() {
        if (this.sucessoTimeout) {
            clearTimeout(this.sucessoTimeout);
        }
    }

    carregarColaboradores() {
        this.carregando.set(true);
        this.erro.set(null);
        this.colaboradorService.findAll().subscribe({
            next: (res) => {
                this.colaboradores.set(res.data);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Erro ao carregar colaboradores.');
                this.carregando.set(false);
            }
        });
    }

    abrirModal() {
        this.form.reset({ perfil: 'colaborador', ativo: true });
        this.erroForm.set(null);
        this.mostrarModal.set(true);
    }

    fecharModal() {
        this.mostrarModal.set(false);
    }

    salvar() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.erroForm.set('Preencha todos os campos obrigatorios corretamente.');
            return;
        }
        this.salvando.set(true);
        this.erroForm.set(null);
        const dados: CreateColaboradorPayload = this.form.getRawValue();
        this.colaboradorService.create(dados).subscribe({
            next: (res) => {
                this.colaboradores.update(lista => [res.data, ...lista]);
                this.salvando.set(false);
                this.fecharModal();
                this.mostrarMensagemSucesso(`O colaborador ${res.data.nome} foi cadastrado.`);
            },
            error: (err) => {
                this.erroForm.set(this.mensagemErroCadastro(err));
                this.salvando.set(false);
            }
        });
    }

    private mensagemErroCadastro(err: any): string {
        const primeiraValidacao = err?.error?.details?.issues?.[0]?.message;
        return primeiraValidacao ?? err?.error?.message ?? 'Erro ao criar colaborador.';
    }

    mostrarMensagemSucesso(mensagem: string) {
        if (this.sucessoTimeout) {
            clearTimeout(this.sucessoTimeout);
        }

        this.mensagemSucesso.set(mensagem);
        this.sucessoTimeout = setTimeout(() => this.mensagemSucesso.set(null), 4500);
    }

    fecharMensagemSucesso() {
        if (this.sucessoTimeout) {
            clearTimeout(this.sucessoTimeout);
            this.sucessoTimeout = null;
        }

        this.mensagemSucesso.set(null);
    }

    toggleStatus(colaborador: ColaboradorListItem) {
        this.colaboradorService.toggleStatus(colaborador.id_colaborador).subscribe({
            next: (res) => {
                this.colaboradores.update(lista =>
                    lista.map(c => c.id_colaborador === res.data.id ? { ...c, ativo: res.data.ativo } : c)
                );
            },
            error: () => {}
        });
    }

    abrirHistorico(colaborador: ColaboradorListItem) {
        this.router.navigate(['/app/colaboradores', colaborador.id_colaborador, 'ponto']);
    }

    abrirEspelho(colaborador: ColaboradorListItem) {
        const mesAtual = new Date().getMonth() + 1;
        this.router.navigate(['/app/colaboradores', colaborador.id_colaborador, 'espelho', mesAtual]);
    }

    iniciais(nome: string): string {
        return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }

    labelCargo(valor: string): string {
        return CARGOS.find(c => c.value === valor)?.label ?? valor;
    }

    labelSetor(valor: string): string {
        return SETORES.find(s => s.value === valor)?.label ?? valor;
    }

    labelPerfil(valor: string): string {
        return PERFIS.find(p => p.value === valor)?.label ?? valor;
    }
}
