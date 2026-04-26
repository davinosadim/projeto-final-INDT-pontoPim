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

  constructor(private pontoService: RegistroPontoService) {}


  registrarPonto() {
    console.log("clicou no botao")
    this.pontoService.registrarPonto(this.proximaBatida).subscribe({
      next: (res) => {
        const registro = res.registro
        console.log("Ponto registrado:", res)

        this.atualizarBatidaNaTela(registro.tipo, registro.timestamp)

        this.definirProximaBatida()
      },

      error: (erro) => {
        console.log("Erro ao registrar ponto:", erro)
      }
    })
  }

  definirProximaBatida() {
    if(this.proximaBatida === TipoBatida.ENTRADA)
      this.proximaBatida = TipoBatida.SAIDA_ALMOCO

    else if (this.proximaBatida === TipoBatida.SAIDA_ALMOCO)
      this.proximaBatida = TipoBatida.RETORNO_ALMOCO

    else if (this.proximaBatida === TipoBatida.RETORNO_ALMOCO)
      this.proximaBatida = TipoBatida.SAIDA
  }


  atualizarBatidaNaTela(tipo: string, timestamp: string) {
    const hora = new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })

    const item = this.batidas.find(b => b.titulo === tipo)

    if (item) {
      item.horario = hora
      item.status = "registrado"
    }
  }



}
