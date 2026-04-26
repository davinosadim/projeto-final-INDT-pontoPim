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
      next: (response) => {
        const registro = response.registro

        this.atualizarBatidaNaTela(registro.tipo as TipoBatida, registro.timestamp)
        this.definirProximaBatida()

        console.log("Ponto registrado:", response)
      }
    })
   
  }

  definirProximaBatida() {
    const proximoCard = this.batidas.find( 
      (batida) => batida.status !== "registrado"
    )

    if (!proximoCard) return

    proximoCard.status = "pendente"
    proximoCard.detalhe = "Aguardando..."
    proximoCard.icone = "schedule"

    this.proximaBatida = proximoCard.tipo
  }


  atualizarBatidaNaTela(tipo: TipoBatida, timestamp: string) {
    console.log('Tipo backend:', tipo);
    console.log('Batidas:', this.batidas);


    const hora = new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })

    const item = this.batidas.find(b => b.tipo === tipo)

    console.log('Card encontrado:', item);

    if (!item) return

    item.horario = hora
    item.detalhe = `Registrado às ${hora}`
    item.status = 'registrado'
    item.icone = 'check_circle'
  }

  get proximaBatidaLabel() {
    const card = this.batidas.find(
      (batida) => batida.tipo === this.proximaBatida
    )

    return card?.titulo ?? "Ponto"
  }



}
