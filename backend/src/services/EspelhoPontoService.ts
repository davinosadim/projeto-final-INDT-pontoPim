import { Between, Repository } from "typeorm";
import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { RegistroPonto } from "../entities/RegistroPonto";
import { AppError } from "../errors/AppError";
import { Origem } from "../types/origem";
import { TiposRegistros } from "../types/registros";
import { calcularResumoPonto } from "../utils/resumoPonto";

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

function listarDiasDoEspelho(inicio: Date, fim: Date, registrosPorDia: Map<string, RegistroPonto[]>): string[] {
    const dias: string[] = [];
    const cursor = inicioDoDia(inicio);
    const limite = inicioDoDia(fim);

    while (cursor <= limite) {
        const data = dataLocalString(cursor);
        const diaSemana = cursor.getDay();
        const fimDeSemana = diaSemana === 0 || diaSemana === 6;

        if (!fimDeSemana || (registrosPorDia.get(data)?.length ?? 0) > 0) {
            dias.push(data);
        }

        cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
}

export class EspelhoPontoService {
    private colaboradorRepository: Repository<Colaborador>;
    private registroRepository: Repository<RegistroPonto>;

    constructor() {
        this.colaboradorRepository = appDataSource.getRepository(Colaborador);
        this.registroRepository = appDataSource.getRepository(RegistroPonto);
    }

    async gerarMensal(colaboradorId: string, mes: number) {
        const ano = new Date().getFullYear();
        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId },
            relations: ["jornada"],
        });

        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404);
        }

        const inicio = inicioDoDia(new Date(ano, mes - 1, 1));
        const fimDoMes = fimDoDia(new Date(ano, mes, 0));
        const hoje = fimDoDia(new Date());
        const fim = fimDoMes > hoje ? hoje : fimDoMes;
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
        let totalMinutosTrabalhados = 0;
        let totalHorasExtrasMinutos = 0;
        let totalAtrasosMinutos = 0;

        const dias = listarDiasDoEspelho(inicio, fim, registrosPorDia).map(data => {
            const registrosDoDia = registrosPorDia.get(data) ?? [];
            const resumo = calcularResumoPonto(registrosDoDia, cargaHorariaDia, horarioEntrada);
            const entrada = registrosDoDia.find(r => r.tipo === TiposRegistros.ENTRADA);
            const saidaAlmoco = registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO);
            const retornoAlmoco = registrosDoDia.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO);
            const saida = registrosDoDia.find(r => r.tipo === TiposRegistros.SAIDA);

            totalMinutosTrabalhados += resumo.minutosTrabalhados;
            totalHorasExtrasMinutos += resumo.horasExtrasMinutos;
            totalAtrasosMinutos += resumo.atrasoMinutos;

            return {
                data,
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
                status: resumo.status,
            };
        });

        return {
            colaborador: {
                id: colaborador.id_colaborador,
                nome: colaborador.nome,
                matricula: colaborador.matricula,
                setor: colaborador.setor,
            },
            referencia: {
                mes,
                ano,
                inicio: dataLocalString(inicio),
                fim: dataLocalString(fim),
            },
            dias,
            totais: {
                horasTrabalhadas: Number((totalMinutosTrabalhados / 60).toFixed(2)),
                horasExtras: Number((totalHorasExtrasMinutos / 60).toFixed(2)),
                atrasoMinutos: totalAtrasosMinutos,
                saldoBancoHorasMinutos: totalHorasExtrasMinutos - totalAtrasosMinutos,
            },
        };
    }
}
