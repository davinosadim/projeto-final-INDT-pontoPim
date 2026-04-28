import { Component } from '@angular/core';
import { TopBar } from '../../components/top-bar/top-bar';
import { SideNav } from '../../components/side-nav/side-nav';
import { PunchActionCard } from '../../components/punch-action-card/punch-action-card';
import { PunchCard } from '../../components/punch-card/punch-card';
import { PunchCardData } from '../../components/punch-card/punch-card';
import { RegistroPontoService } from '../../services/registro-ponto.service';


export enum TipoBatida  {
  ENTRADA = 'entrada', 
  SAIDA_ALMOCO = 'saida_almoco', 
  RETORNO_ALMOCO = 'retorno_almoco', 
  SAIDA = 'saida'
}

@Component({
  selector: 'app-meu-ponto',
  imports: [TopBar, SideNav, PunchActionCard, PunchCard],
  templateUrl: './meu-ponto.html',
  styleUrl: './meu-ponto.css',
})
export class MeuPonto {

  proximaBatida: TipoBatida = TipoBatida.ENTRADA;

  batidas: PunchCardData[] = [
    {
      tipo: TipoBatida.ENTRADA,
      titulo: 'Entrada 1',
      horario: '--:--',
      detalhe: 'Aguardando...',
      status: 'pendente',
      icone: 'check_circle',
    },
    {
      tipo: TipoBatida.SAIDA_ALMOCO,
      titulo: 'Almoço Saída',
      horario: '--:--',
      detalhe: 'Indisponivel',
      status: 'bloqueado',
      icone: 'block',
    },
    {
      tipo: TipoBatida.RETORNO_ALMOCO,
      titulo: 'Almoço Retorno',
      horario: '--:--',
      detalhe: 'Indisponível',
      status: 'bloqueado',
      icone: 'block',
    },
    {
      tipo: TipoBatida.SAIDA,
      titulo: 'Saída Final',
      horario: '--:--',
      detalhe: 'Indisponível',
      status: 'bloqueado',
      icone: 'block',
    },
  ];

  constructor(private pontoService: RegistroPontoService) {}


  registrarPonto() {

    this.pontoService.registrarPonto(this.proximaBatida).subscribe({
      next: (res) => {
        this.atualizarBatidaNaTela(
          res.registro.tipo as TipoBatida,
          res.registro.timestamp
        )
    

      }
    })
 }

 definirProximaBatida() {
  this.pontoService.registrarPonto(this.proximaBatida).subscribe({
    next: (res) => {
      
      this.atualizarBatidaNaTela(
        res.registro.tipo as TipoBatida,
        res.registro.timestamp
      )

    }
  })
 }

 atualizarBatidaNaTela(tipo: TipoBatida, timestamp: string) {

  const horario = new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  this.batidas = this.batidas.map((batida) => {

    if (batida.tipo !== tipo) {
      return batida
    }

    return {
      ...batida,
      horario: horario,
      detalhe: `Registrado as ${horario}`,
      status: "registrado",
      icone: "check_circle"
    }
  })
 }
}
