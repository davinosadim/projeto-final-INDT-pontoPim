import { Between, Repository } from "typeorm";
import { RegistroPonto } from "../entities/RegistroPonto";
import { Colaborador } from "../entities/Colaborador";
import { ResumoDiario } from "../entities/ResumoDiario";
import { appDataSource } from "../database/data-source";
import { TiposRegistros } from "../types/registros";
import { StatusResumo } from "../types/statusResumo";
import { AppError } from "../errors/AppError";

const SEQUENCIA_BATIDAS = [
    TiposRegistros.ENTRADA,
    TiposRegistros.SAIDA_ALMOCO,
    TiposRegistros.RETORNO_ALMOCO,
    TiposRegistros.SAIDA,
] as const

function inicioDoDia(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

function fimDoDia(): Date {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
}

function dataHojeString(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

function horarioParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(":").map(Number)
    return (horas ?? 0) * 60 + (minutos ?? 0)
}

function calcularResumo(
    registros: RegistroPonto[],
    cargaHorariaDia: number,
    horarioEntrada: string
) {
    const entrada = registros.find(r => r.tipo === TiposRegistros.ENTRADA)
    const saidaAlmoco = registros.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO)
    const retornoAlmoco = registros.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO)
    const saida = registros.find(r => r.tipo === TiposRegistros.SAIDA)

    let horasTrabalhadas = 0

    if (entrada && saida) {
        const totalMs = saida.timestamp.getTime() - entrada.timestamp.getTime()
        let almocoMs = 0
        if (saidaAlmoco && retornoAlmoco) {
            almocoMs = retornoAlmoco.timestamp.getTime() - saidaAlmoco.timestamp.getTime()
        }
        horasTrabalhadas = Math.max(0, (totalMs - almocoMs)) / (1000 * 60 * 60)
    }

    let atrasoMinutos = 0
    if (entrada) {
        const entradaMin = entrada.timestamp.getHours() * 60 + entrada.timestamp.getMinutes()
        const esperadoMin = horarioParaMinutos(horarioEntrada)
        atrasoMinutos = Math.max(0, entradaMin - esperadoMin)
    }

    const horasExtras = registros.length === 4
        ? Math.max(0, horasTrabalhadas - cargaHorariaDia)
        : 0

    let status: StatusResumo
    if (registros.length === 4) {
        status = StatusResumo.COMPLETO
    } else if (registros.length > 0) {
        status = StatusResumo.INCOMPLETO
    } else {
        status = StatusResumo.FALTA
    }

    return { horasTrabalhadas, horasExtras, atrasoMinutos, status }
}

export class RegistroPontoService {

    private registroRepository: Repository<RegistroPonto>
    private colaboradorRepository: Repository<Colaborador>
    private resumoRepository: Repository<ResumoDiario>

    constructor() {
        this.registroRepository = appDataSource.getRepository(RegistroPonto)
        this.colaboradorRepository = appDataSource.getRepository(Colaborador)
        this.resumoRepository = appDataSource.getRepository(ResumoDiario)
    }

    async getHoje(colaboradorId: string) {
        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId },
            relations: ["jornada"]
        })

        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404)
        }

        const registros = await this.registroRepository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                timestamp: Between(inicioDoDia(), fimDoDia())
            },
            order: { timestamp: "ASC" }
        })

        const proximaBatida = registros.length < SEQUENCIA_BATIDAS.length
            ? SEQUENCIA_BATIDAS[registros.length]
            : null

        const resumo = await this.resumoRepository.findOne({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                data: dataHojeString()
            }
        })

        return {
            registros,
            proximaBatida,
            resumo: resumo ? {
                horasTrabalhadas: Number(resumo.horas_trabalhadas),
                horasExtras: Number(resumo.horas_extras),
                horasEsperadas: Number(resumo.horas_esperadas),
                atrasoMinutos: resumo.atraso_minutos,
                status: resumo.status
            } : null
        }
    }

    async registrarBatida(colaboradorId: string) {
        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId },
            relations: ["jornada"]
        })

        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404)
        }

        if (!colaborador.ativo) {
            throw new AppError("Colaborador inativo nao pode registrar ponto", 403)
        }

        const registrosHoje = await this.registroRepository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                timestamp: Between(inicioDoDia(), fimDoDia())
            },
            order: { timestamp: "ASC" }
        })

        if (registrosHoje.length >= SEQUENCIA_BATIDAS.length) {
            throw new AppError("Todas as batidas do dia ja foram registradas", 400)
        }

        const tipoAtual = SEQUENCIA_BATIDAS[registrosHoje.length]!

        const novoRegistro = this.registroRepository.create({
            colaborador,
            tipo: tipoAtual,
            timestamp: new Date()
        })

        const registroSalvo = await this.registroRepository.save(novoRegistro)
        const registrosAtualizados = [...registrosHoje, registroSalvo]

        await this.salvarResumoDiario(colaborador, registrosAtualizados)

        const proximaBatida = registrosAtualizados.length < SEQUENCIA_BATIDAS.length
            ? SEQUENCIA_BATIDAS[registrosAtualizados.length]
            : null

        return {
            mensagem: "Batida registrada com sucesso",
            registro: registroSalvo,
            registroHoje: registrosAtualizados,
            batidaRegistrada: tipoAtual,
            proximaBatida
        }
    }

    private async salvarResumoDiario(colaborador: Colaborador, registros: RegistroPonto[]) {
        const cargaHorariaDia = Number(colaborador.jornada?.cargaHorariaDia ?? 8)
        const horarioEntrada = colaborador.jornada?.horarioEntrada ?? "08:00"
        const dataHoje = dataHojeString()

        const { horasTrabalhadas, horasExtras, atrasoMinutos, status } = calcularResumo(
            registros,
            cargaHorariaDia,
            horarioEntrada
        )

        let resumo = await this.resumoRepository.findOne({
            where: {
                colaborador: { id_colaborador: colaborador.id_colaborador },
                data: dataHoje
            }
        })

        if (resumo) {
            resumo.horas_trabalhadas = horasTrabalhadas
            resumo.horas_extras = horasExtras
            resumo.horas_esperadas = cargaHorariaDia
            resumo.atraso_minutos = atrasoMinutos
            resumo.status = status
        } else {
            resumo = this.resumoRepository.create({
                colaborador,
                data: dataHoje,
                horas_trabalhadas: horasTrabalhadas,
                horas_extras: horasExtras,
                horas_esperadas: cargaHorariaDia,
                atraso_minutos: atrasoMinutos,
                status
            })
        }

        return this.resumoRepository.save(resumo)
    }
}
