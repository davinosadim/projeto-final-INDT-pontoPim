import { Component } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { PunchActionCard } from '../../components/punch-action-card/punch-action-card';
import { PunchCard } from '../../components/punch-card/punch-card';
import { PunchCardData } from '../../components/punch-card/punch-card';



@Component({
  selector: 'app-meu-ponto',
  imports: [TopBar, SideNav, PunchActionCard, PunchCard],
  templateUrl: './meu-ponto.html',
  styleUrl: './meu-ponto.css',
})
export class MeuPonto {

  
  proximaBatida = 'Saída para Almoço';

  batidas: PunchCardData[] = [
    {
      titulo: 'Entrada 1',
      horario: '08:00',
      detalhe: 'Registrado às 08:02',
      status: 'registrado',
      icone: 'check_circle',
    },
    {
      titulo: 'Almoço Saída',
      horario: '--:--',
      detalhe: 'Aguardando...',
      status: 'pendente',
      icone: 'schedule',
    },
    {
      titulo: 'Almoço Retorno',
      horario: '--:--',
      detalhe: 'Indisponível',
      status: 'bloqueado',
      icone: 'block',
    },
    {
      titulo: 'Saída Final',
      horario: '--:--',
      detalhe: 'Indisponível',
      status: 'bloqueado',
      icone: 'block',
    },
  ];

registrarPonto() {
  console.log('Registrando:', this.proximaBatida);
}
}
