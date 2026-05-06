import { Between, Repository } from "typeorm";
import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { RegistroPonto } from "../entities/RegistroPonto";
import { AppError } from "../errors/AppError";
import { TiposRegistros } from "../types/registros";
import { StatusResumo } from "../types/statusResumo";

export type PeriodoHistoricoPonto = "semana" | "mes";

const SEQUENCIA_BATIDAS = [
    TiposRegistros.ENTRADA,
    TiposRegistros.SAIDA_ALMOCO,
    TiposRegistros.RETORNO_ALMOCO,
    TiposRegistros.SAIDA,
] as const;

function inicioDoDia(data: Date): Date {
    const d = new Date(data);
    d.setHours(0, 0, 0, 0);
    return d;
}

function fimDoDia(data: Date): Date {
    const d = new Date(data);
    d.setHours(23, 59, 59, 999);
    return d;
}

function dataLocalString(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

function horarioParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(":").map(Number);
    return (horas ?? 0) * 60 + (minutos ?? 0);
}

function calcularIntervalo(periodo: PeriodoHistoricoPonto) {
    const hoje = inicioDoDia(new Date());
    const inicio = new Date(hoje);

    if (periodo === "mes") {
        inicio.setDate(1);
    } else {
        const diaSemana = inicio.getDay();
        const distanciaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
        inicio.setDate(inicio.getDate() - distanciaSegunda);
    }

    return {
        inicio: inicioDoDia(inicio),
        fim: fimDoDia(hoje),
    };
}

function listarDias(inicio: Date, fim: Date): string[] {
    const dias: string[] = [];
    const cursor = inicioDoDia(inicio);
    const limite = inicioDoDia(fim);

    while (cursor <= limite) {
        dias.push(dataLocalString(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
}

function calcularResumoDoDia(registros: RegistroPonto[], cargaHorariaDia: number, horarioEntrada: string) {
    const entrada = registros.find(r => r.tipo === TiposRegistros.ENTRADA);
    const saidaAlmoco = registros.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO);
    const retornoAlmoco = registros.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO);
    const saida = registros.find(r => r.tipo === TiposRegistros.SAIDA);

    let horasTrabalhadas = 0;

    if (entrada && saida) {
        const totalMs = saida.timestamp.getTime() - entrada.timestamp.getTime();
        let almocoMs = 0;

        if (saidaAlmoco && retornoAlmoco) {
            almocoMs = retornoAlmoco.timestamp.getTime() - saidaAlmoco.timestamp.getTime();
        }

        horasTrabalhadas = Math.max(0, totalMs - almocoMs) / (1000 * 60 * 60);
    }

    const atrasoMinutos = entrada
        ? Math.max(0, entrada.timestamp.getHours() * 60 + entrada.timestamp.getMinutes() - horarioParaMinutos(horarioEntrada))
        : 0;

    const horasExtras = registros.length === SEQUENCIA_BATIDAS.length
        ? Math.max(0, horasTrabalhadas - cargaHorariaDia)
        : 0;

    let status: StatusResumo;
    if (registros.length === SEQUENCIA_BATIDAS.length) {
        status = StatusResumo.COMPLETO;
    } else if (registros.length > 0) {
        status = StatusResumo.INCOMPLETO;
    } else {
        status = StatusResumo.FALTA;
    }

    return {
        horasTrabalhadas: Number(horasTrabalhadas.toFixed(2)),
        horasExtras: Number(horasExtras.toFixed(2)),
        atrasoMinutos,
        status,
    };
}

export class HistoricoPontoService {
    private colaboradorRepository: Repository<Colaborador>;
    private registroRepository: Repository<RegistroPonto>;

    constructor() {
        this.colaboradorRepository = appDataSource.getRepository(Colaborador);
        this.registroRepository = appDataSource.getRepository(RegistroPonto);
    }

    async listarPorColaborador(colaboradorId: string, periodo: PeriodoHistoricoPonto = "semana") {
        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId },
            relations: ["jornada"],
        });

        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404);
        }

        const { inicio, fim } = calcularIntervalo(periodo);
        const registros = await this.registroRepository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                timestamp: Between(inicio, fim),
            },
            order: { timestamp: "ASC" },
        });

        const registrosPorDia = new Map<string, RegistroPonto[]>();
        for (const registro of registros) {
            const data = dataLocalString(registro.timestamp);
            const registrosDoDia = registrosPorDia.get(data) ?? [];
            registrosDoDia.push(registro);
            registrosPorDia.set(data, registrosDoDia);
        }

        const cargaHorariaDia = Number(colaborador.jornada?.cargaHorariaDia ?? 8);
        const horarioEntrada = colaborador.jornada?.horarioEntrada ?? "08:00";

        const dias = listarDias(inicio, fim).map(data => {
            const registrosDoDia = registrosPorDia.get(data) ?? [];
            const resumo = calcularResumoDoDia(registrosDoDia, cargaHorariaDia, horarioEntrada);

            return {
                data,
                batidas: {
                    entrada: registrosDoDia.find(r => r.tipo === TiposRegistros.ENTRADA)?.timestamp ?? null,
                    saidaAlmoco: registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO)?.timestamp ?? null,
                    retornoAlmoco: registrosDoDia.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO)?.timestamp ?? null,
                    saida: registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA)?.timestamp ?? null,
                },
                horasTrabalhadas: resumo.horasTrabalhadas,
                horasExtras: resumo.horasExtras,
                atrasoMinutos: resumo.atrasoMinutos,
                status: resumo.status,
                destaque: resumo.status === StatusResumo.INCOMPLETO
                    ? "incompleto"
                    : resumo.atrasoMinutos > 0
                        ? "atraso"
                        : null,
            };
        });

        return {
            colaborador: {
                id: colaborador.id_colaborador,
                nome: colaborador.nome,
                email: colaborador.email,
                matricula: colaborador.matricula,
            },
            periodo,
            inicio: dataLocalString(inicio),
            fim: dataLocalString(fim),
            dias,
        };
    }
}
