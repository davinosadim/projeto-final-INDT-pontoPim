import { Between, Repository } from "typeorm";
import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { RegistroPonto } from "../entities/RegistroPonto";
import { AppError } from "../errors/AppError";
import { Origem } from "../types/origem";
import { TiposRegistros } from "../types/registros";
import { StatusResumo } from "../types/statusResumo";
import { calcularResumoPonto } from "../utils/resumoPonto";

export type PeriodoHistoricoPonto = "semana" | "mes";

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

function dataLocalFromString(data: string): Date {
    const partes = data.split("-").map(Number);
    const ano = partes[0] ?? 0;
    const mes = partes[1] ?? 1;
    const dia = partes[2] ?? 1;
    return new Date(ano, mes - 1, dia);
}

function nomeDiaSemana(data: string): string {
    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    return diasSemana[dataLocalFromString(data).getDay()] ?? "segunda";
}

function ehFimDeSemana(data: string): boolean {
    const diaSemana = dataLocalFromString(data).getDay();
    return diaSemana === 0 || diaSemana === 6;
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
            const resumo = calcularResumoPonto(registrosDoDia, cargaHorariaDia, horarioEntrada);
            const fimDeSemana = ehFimDeSemana(data);
            const status = fimDeSemana && resumo.status === StatusResumo.FALTA
                ? "fim_semana"
                : resumo.status;
            const entrada = registrosDoDia.find(r => r.tipo === TiposRegistros.ENTRADA);
            const saidaAlmoco = registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO);
            const retornoAlmoco = registrosDoDia.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO);
            const saida = registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA);

            return {
                data,
                diaSemana: nomeDiaSemana(data),
                fimDeSemana,
                batidas: {
                    entrada: entrada?.timestamp ?? null,
                    saidaAlmoco: saidaAlmoco?.timestamp ?? null,
                    retornoAlmoco: retornoAlmoco?.timestamp ?? null,
                    saida: saida?.timestamp ?? null,
                },
                batidasManuais: {
                    entrada: entrada?.origem === Origem.AJUSTE,
                    saidaAlmoco: saidaAlmoco?.origem === Origem.AJUSTE,
                    retornoAlmoco: retornoAlmoco?.origem === Origem.AJUSTE,
                    saida: saida?.origem === Origem.AJUSTE,
                },
                horasTrabalhadas: resumo.horasTrabalhadas,
                horasExtras: resumo.horasExtras,
                atrasoMinutos: resumo.atrasoMinutos,
                status,
                destaque: status === StatusResumo.INCOMPLETO
                    ? "incompleto"
                    : !fimDeSemana && resumo.atrasoMinutos > 0
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
