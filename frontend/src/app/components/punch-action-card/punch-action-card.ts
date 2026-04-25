import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-punch-action-card',
  imports: [],
  templateUrl: './punch-action-card.html',
  styleUrl: './punch-action-card.css',
})
export class PunchActionCard {
   @Input() proximaBatida = 'Saída para Almoço';

  @Output() registrar = new EventEmitter<void>();

  onRegistrar() {
    this.registrar.emit();
  }
}
