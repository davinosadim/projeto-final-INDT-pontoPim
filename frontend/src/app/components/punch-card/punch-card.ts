import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Input } from '@angular/core';


export type PunchStatus = 'registrado' | 'pendente' | 'bloqueado';

export interface PunchCardData {
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

  @Input({ required: true }) batida!: PunchCardData;
}
