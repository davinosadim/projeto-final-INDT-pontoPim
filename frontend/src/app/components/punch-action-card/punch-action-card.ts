import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-punch-action-card',
    imports: [],
    templateUrl: './punch-action-card.html',
    styleUrl: './punch-action-card.css',
})
export class PunchActionCard {
    proximaBatida = input.required<string>();
    carregando = input(false);
    registrar = output<void>();

    onRegistrar() {
        this.registrar.emit();
    }
}
