import { Component, computed, input } from '@angular/core';
import { TipoBatida } from '../../../interfaces/registroPonto.interfaces';

export type PunchStatus = 'registrado' | 'pendente' | 'bloqueado';

export interface PunchCardData {
    tipo: TipoBatida;
    titulo: string;
    horario: string;
    detalhe: string;
    status: PunchStatus;
    icone: string;
}

@Component({
    selector: 'app-punch-card',
    imports: [],
    templateUrl: './punch-card.html',
    styleUrl: './punch-card.css',
})
export class PunchCard {
    batida = input.required<PunchCardData>();

    readonly cardClass = computed(() => {
        const s = this.batida().status;
        const base = 'rounded-xl p-5 flex flex-col justify-between min-h-[140px] transition-colors';
        if (s === 'registrado') return `${base} bg-white border border-slate-200 hover:border-blue-200`;
        if (s === 'pendente') return `${base} bg-white border-2 border-dashed border-blue-300`;
        return `${base} bg-slate-50 border border-slate-200 opacity-60`;
    });

    readonly titleClass = computed(() => {
        const s = this.batida().status;
        const base = 'font-semibold uppercase text-[11px] tracking-widest';
        if (s === 'registrado') return `${base} text-slate-600`;
        if (s === 'pendente') return `${base} text-blue-900`;
        return `${base} text-slate-400`;
    });

    readonly iconClass = computed(() => {
        const s = this.batida().status;
        const base = 'w-8 h-8 rounded-full flex items-center justify-center';
        if (s === 'registrado') return `${base} bg-emerald-50 text-emerald-600`;
        if (s === 'pendente') return `${base} text-blue-400`;
        return `${base} text-slate-300`;
    });

    readonly horarioClass = computed(() => {
        const s = this.batida().status;
        if (s === 'registrado') return 'text-3xl font-bold text-blue-900';
        return 'text-3xl font-bold text-slate-300';
    });

    readonly detalheClass = computed(() => {
        const s = this.batida().status;
        if (s === 'registrado') return 'text-sm text-slate-500';
        if (s === 'pendente') return 'text-sm text-blue-900 font-semibold';
        return 'text-sm text-slate-400';
    });
}
