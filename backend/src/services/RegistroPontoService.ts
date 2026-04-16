import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { Jornada } from "../entities/Jornada";
import { RegistroPonto } from "../entities/RegistroPonto";
import { ResumoDiario } from "../entities/ResumoDiario";
import { TiposRegistros } from "../types/registros";
import { Origem } from "../types/origem";
import { AppError } from "../errors/AppError";
import { converterHorarioParaMinutos } from "../utils/time";
import { ORDEM_BATIDAS } from "../types/ordemBatidas";
import { StatusResumo } from "../types/statusResumo";
import { Between, Repository } from "typeorm";

export class RegistroPontoService {

    private registroRepository: Repository<RegistroPonto>
    private colaboradorRepository: Repository<Colaborador>
    private resumoRepository: Repository<ResumoDiario>

    constructor(){
        this.registroRepository = appDataSource.getRepository(RegistroPonto)
        this.colaboradorRepository = appDataSource.getRepository(Colaborador)
        this.resumoRepository = appDataSource.getRepository(ResumoDiario)
    }

    async registrarBatida(colaboradorId: string) {
        // Pesquisa colaborador
        const colaborador = await this.colaboradorRepository.findOne({
            where: {id: colaboradorId},
            relations: ["jornada"]
        })


        // Validacooes para colaborador
        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado")
        }

        if (!colaborador.ativo) {
            throw new AppError("Colaborador inativo nao pode registrar ponto")
        }

        if (!colaborador.jornada) {
            throw new Error("Colaborador nao possui jornada vinculada")
        }

        // Registro de ponto
        const agora = new Date()
        const { inicioDoDia, fimDoDia } = this.obterLimitesDoDia(agora)

        const batidasHoje = await this.registroRepository.find({
        where: {
            colaborador: { id: colaboradorId},
            timestamp: Between(inicioDoDia, fimDoDia)
        },
        order: {
            timestamp: "ASC"
        }
        })

        if (batidasHoje.length >= ORDEM_BATIDAS.length) {
            throw new AppError("As 4 batidas do dia ja foram registradas")
        }

        const proximaBatida = ORDEM_BATIDAS[batidasHoje.length]

        const novoRegistro = this.registroRepository.create({
            colaborador,
            tipo: TiposRegistros.ENTRADA,
            timestamp: agora,
            origem: Origem.SISTEMA,
            justificativa: null,
            registradoPor: null
        })

        const registroSalvo = await this.registroRepository.save(novoRegistro)

        const resumoAtualizado = await this.recalcularResumoDiario(colaborador, inicioDoDia, fimDoDia)

        return { 
            mensagem: "Batida registrada com sucesso",
            registro: registroSalvo,
            resumo: resumoAtualizado
        }

    }

    private async recalcularResumoDiario(colaborador: Colaborador, inicioDoDia: Date, fimDoDia: Date) {
        const batidas = await this.registroRepository.find({
            where: {
                colaborador: { id: colaborador.id },
                timestamp: Between(inicioDoDia, fimDoDia)
            },
            order: {
                timestamp: "ASC"
            },
        })

        const entrada = batidas.find((batida) => batida.tipo === TiposRegistros.ENTRADA)
        const saidaAlmoco = batidas.find((batida) => batida.tipo === TiposRegistros.SAIDA_ALMOCO)
        const retornoAlmoco = batidas.find((batida) => batida.tipo === TiposRegistros.RETORNO_ALMOCO)
        const saida = batidas.find((batida) => batida.tipo === TiposRegistros.SAIDA)

        let horasTrabalhadas = 0
        let horasExtras = 0
        let atrasoMinutos = 0
        let status: StatusResumo = StatusResumo.FALTA

        if (batidas.length > 0) {
            status = StatusResumo.INCOMPLETO
        }

        if (entrada) {
            const minutosEntradaReal = entrada.timestamp.getHours() * 60 + entrada.timestamp.getMinutes()

            const minutosEntradaEsperada = converterHorarioParaMinutos(colaborador.jornada.horarioEntrada)

            if (minutosEntradaReal > minutosEntradaEsperada) {
                atrasoMinutos = minutosEntradaReal - minutosEntradaEsperada
            }
        }

        if (entrada && saida) {
            const totalPeriodo = this.diferencaEmMinutos(entrada.timestamp, saida.timestamp)

            let intervaloAlmoco = 0

            if (saidaAlmoco && retornoAlmoco) {
                intervaloAlmoco = this.diferencaEmMinutos(saidaAlmoco.timestamp, retornoAlmoco.timestamp)
            }


            const minutosTrabalhados = totalPeriodo - intervaloAlmoco
            horasTrabalhadas = minutosTrabalhados / 60

        }

        const diaCompleto = !!(entrada && saidaAlmoco && retornoAlmoco && saida)

        if (diaCompleto) {
            status = StatusResumo.COMPLETO

            if(horasTrabalhadas > Number(colaborador.jornada.cargaHorariaDia)) {
                horasExtras = horasTrabalhadas - Number(colaborador.jornada.cargaHorariaDia)
            }
        }

        let resumo = await this.resumoRepository.findOne({
            where: {
                colaborador: { id: colaborador.id},
                data: inicioDoDia
            },
            relations: ["colaborador"]
        })

        if(!resumo){
            resumo = this.resumoRepository.create({
                colaborador,
                data: inicioDoDia,
                horasTrabalhadas,
                horasExtras,
                atrasoMinutos,
                status
            })
        } else {
            resumo.horasTrabalhadas = horasTrabalhadas
            resumo.horasExtras = horasExtras
            resumo.horasExtras = horasExtras
            resumo.atrasoMinutos = atrasoMinutos
            resumo.status = status
        }

        return await this.resumoRepository.save(resumo)
    

  
    }

    private obterLimitesDoDia(data: Date) {
        const inicioDoDia = new Date(data)
        inicioDoDia.setHours(0, 0, 0, 0)

        const fimDoDia = new Date(data) 
        fimDoDia.setHours(23, 59, 59, 999)

        return { inicioDoDia, fimDoDia}
    }

    private diferencaEmMinutos(dataInicial: Date, dataFinal: Date): number {
        return Math.floor(
            (dataFinal.getTime() - dataInicial.getTime()) / (1000 * 60)
        )
    }


}