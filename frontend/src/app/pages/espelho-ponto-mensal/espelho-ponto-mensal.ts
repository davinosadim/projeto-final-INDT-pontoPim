import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
        const espelho = this.espelho();
        const colaborador = this.colaborador();
        const totais = this.totais();

        if (!espelho || !colaborador || !totais) return;

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;

        doc.setProperties({
            title: `Espelho de ponto - ${colaborador.nome} - ${this.formatarReferencia()}`,
            subject: 'Espelho de ponto mensal',
            author: 'Ponto PIM',
        });

        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 24, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text('Espelho de ponto mensal', margin, 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Referencia: ${this.formatarReferencia()}`, margin, 16);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(colaborador.nome, margin, 34);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Matricula: ${colaborador.matricula}`, margin, 40);
        doc.text(`Setor: ${this.labelSetor(colaborador.setor)}`, margin + 55, 40);
        doc.text(
            `Periodo: ${this.formatarData(espelho.referencia.inicio)} a ${this.formatarData(espelho.referencia.fim)}`,
            margin + 105,
            40
        );

        const resumoY = 49;
        const resumo = [
            ['Trabalhadas', this.formatarHoras(totais.horasTrabalhadas)],
            ['Extras', this.formatarHoras(totais.horasExtras)],
            ['Atrasos', this.formatarMinutos(totais.atrasoMinutos)],
            ['Saldo', this.formatarMinutos(totais.saldoBancoHorasMinutos)],
        ];
        resumo.forEach(([label, valor], index) => {
            const x = margin + index * 68;
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(x, resumoY, 60, 16, 2, 2, 'FD');
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text(label, x + 4, resumoY + 6);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(valor, x + 4, resumoY + 12);
        });

        const linhas = this.dias().map(dia => [
            this.formatarData(dia.data),
            this.formatarDiaSemana(dia.data),
            this.formatarHorarioPdf(dia.batidas.entrada, dia.batidasManuais.entrada),
            this.formatarHorarioPdf(dia.batidas.saidaAlmoco, dia.batidasManuais.saidaAlmoco),
            this.formatarHorarioPdf(dia.batidas.retornoAlmoco, dia.batidasManuais.retornoAlmoco),
            this.formatarHorarioPdf(dia.batidas.saida, dia.batidasManuais.saida),
            this.formatarHoras(dia.horasTrabalhadas),
            this.formatarHoras(dia.horasExtras),
            this.formatarMinutos(dia.atrasoMinutos),
            this.labelStatus(dia.status),
        ]);

        linhas.push([
            'Totais',
            '',
            '',
            '',
            '',
            '',
            this.formatarHoras(totais.horasTrabalhadas),
            this.formatarHoras(totais.horasExtras),
            this.formatarMinutos(totais.atrasoMinutos),
            this.formatarMinutos(totais.saldoBancoHorasMinutos),
        ]);

        autoTable(doc, {
            startY: 72,
            margin: { left: margin, right: margin, bottom: 16 },
            head: [[
                'Data',
                'Dia',
                'Entrada',
                'Saida almoco',
                'Retorno',
                'Saida',
                'Trabalhadas',
                'Extras',
                'Atraso',
                'Status / Saldo',
            ]],
            body: linhas,
            theme: 'grid',
            tableWidth: 'auto',
            styles: {
                font: 'helvetica',
                fontSize: 7,
                cellPadding: 1.8,
                lineColor: [226, 232, 240],
                lineWidth: 0.1,
                textColor: [51, 65, 85],
                valign: 'middle',
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [241, 245, 249],
                textColor: [51, 65, 85],
                fontStyle: 'bold',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252],
            },
            columnStyles: {
                0: { cellWidth: 22, halign: 'left' },
                1: { cellWidth: 15, halign: 'left' },
                2: { cellWidth: 23, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 23, halign: 'center' },
                5: { cellWidth: 23, halign: 'center' },
                6: { cellWidth: 25, halign: 'center' },
                7: { cellWidth: 20, halign: 'center' },
                8: { cellWidth: 22, halign: 'center' },
                9: { cellWidth: 28, halign: 'center' },
            },
            didParseCell: (data) => {
                const isTotalRow = data.row.index === linhas.length - 1 && data.section === 'body';
                if (isTotalRow) {
                    data.cell.styles.fillColor = [239, 246, 255];
                    data.cell.styles.textColor = [30, 64, 175];
                    data.cell.styles.fontStyle = 'bold';
                }
            },
            didDrawPage: () => {
                const pagina = doc.getNumberOfPages();
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                doc.text('Batidas com * foram ajustadas manualmente.', margin, pageHeight - 7);
                doc.text(`Pagina ${pagina}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
            },
        });

        const nomeArquivo = `espelho-ponto-${colaborador.matricula}-${espelho.referencia.ano}-${String(espelho.referencia.mes).padStart(2, '0')}.pdf`;
        doc.save(nomeArquivo);
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

    formatarHorarioPdf(timestamp: string | null, manual: boolean): string {
        const horario = this.formatarHorario(timestamp);
        return manual && horario !== '--:--' ? `${horario} *` : horario;
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
