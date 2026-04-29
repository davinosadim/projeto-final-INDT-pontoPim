import { Between, Repository } from "typeorm";
import { Colaborador } from "../entities/Colaborador";
import { ResumoDiario } from "../entities/ResumoDiario";
import { RegistroPonto } from "../entities/RegistroPonto";
import { appDataSource } from "../database/data-source";
import { UserRole } from "../types/roles";

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

export class EquipeService {
    private colaboradorRepository: Repository<Colaborador>
    private resumoRepository: Repository<ResumoDiario>
    private registroRepository: Repository<RegistroPonto>

    constructor() {
        this.colaboradorRepository = appDataSource.getRepository(Colaborador)
        this.resumoRepository = appDataSource.getRepository(ResumoDiario)
        this.registroRepository = appDataSource.getRepository(RegistroPonto)
    }

    async getEquipeHoje() {
        const colaboradores = await this.colaboradorRepository.find({
            where: { perfil: UserRole.COLABORADOR },
            relations: ["jornada"],
            order: { nome: "ASC" }
        })

        const dataHoje = dataHojeString()

        const resultado = await Promise.all(
            colaboradores.map(async (colaborador) => {
                const registros = await this.registroRepository.find({
                    where: {
                        colaborador: { id_colaborador: colaborador.id_colaborador },
                        timestamp: Between(inicioDoDia(), fimDoDia())
                    },
                    order: { timestamp: "ASC" }
                })

                const resumo = await this.resumoRepository.findOne({
                    where: {
                        colaborador: { id_colaborador: colaborador.id_colaborador },
                        data: dataHoje
                    }
                })

                return {
                    id: colaborador.id_colaborador,
                    nome: colaborador.nome,
                    matricula: colaborador.matricula,
                    cargo: colaborador.cargo,
                    setor: colaborador.setor,
                    ativo: colaborador.ativo,
                    jornada: colaborador.jornada ? {
                        horarioEntrada: colaborador.jornada.horarioEntrada,
                        horarioSaida: colaborador.jornada.horarioSaida,
                        cargaHorariaDia: colaborador.jornada.cargaHorariaDia
                    } : null,
                    registros: registros.map(r => ({
                        tipo: r.tipo,
                        timestamp: r.timestamp
                    })),
                    resumo: resumo ? {
                        horasTrabalhadas: Number(resumo.horas_trabalhadas),
                        horasExtras: Number(resumo.horas_extras),
                        horasEsperadas: Number(resumo.horas_esperadas),
                        atrasoMinutos: resumo.atraso_minutos,
                        status: resumo.status
                    } : null
                }
            })
        )

        return resultado
    }
}
