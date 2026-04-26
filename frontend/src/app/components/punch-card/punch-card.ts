import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Input } from '@angular/core';
import { TipoBatida } from '../../pages/meu-ponto/meu-ponto';


export type PunchStatus = 'registrado' | 'pendente' | 'bloqueado';

export interface PunchCardData {
  tipo: TipoBatida
  titulo: string;
  horario: string;
  detalhe: string;
  status: PunchStatus;
  icone: string;
}

@Component({
  selector: 'app-punch-card',
  imports: [NgClass],
  templateUrl: './punch-card.html',
  styleUrl: './punch-card.css',
})
export class PunchCard {

  @Input() batida!: PunchCardData;
}
