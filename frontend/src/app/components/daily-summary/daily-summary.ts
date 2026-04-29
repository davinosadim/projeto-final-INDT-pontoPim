import { Component, computed, input } from '@angular/core';

type StatusResumo = 'completo' | 'incompleto' | 'falta' | 'afastamento';

function formatarHoras(horas: number): string {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}m`;
}

@Component({
    selector: 'app-daily-summary',
    imports: [],
    templateUrl: './daily-summary.html',
    styleUrl: './daily-summary.css',
})
export class DailySummary {
    horasTrabalhadas = input(0);
    horasExtras = input(0);
    horasEsperadas = input(8);
    atrasoMinutos = input(0);
    status = input<StatusResumo>('incompleto');

    readonly horasTrabalhadasFmt = computed(() => formatarHoras(this.horasTrabalhadas()));
    readonly horasExtrasFmt = computed(() => formatarHoras(this.horasExtras()));
    readonly horasEsperadasFmt = computed(() => formatarHoras(this.horasEsperadas()));

    readonly statusLabel = computed(() => {
        const map: Record<StatusResumo, string> = {
            completo: 'Completo',
            incompleto: 'Incompleto',
            falta: 'Falta',
            afastamento: 'Afastamento',
        };
        return map[this.status()] ?? 'Incompleto';
    });

    readonly statusClass = computed(() => {
        const s = this.status();
        if (s === 'completo') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (s === 'falta') return 'bg-red-100 text-red-800 border-red-200';
        if (s === 'afastamento') return 'bg-purple-100 text-purple-800 border-purple-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    });

    readonly temAtraso = computed(() => this.atrasoMinutos() > 0);
    readonly temHorasExtras = computed(() => this.horasExtras() > 0);
}
