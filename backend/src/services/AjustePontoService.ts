import { Between, In, Repository } from "typeorm";
import { appDataSource } from "../database/data-source";
import { AjustePonto } from "../entities/AjustePonto";
import { Colaborador } from "../entities/Colaborador";
import { RegistroPonto } from "../entities/RegistroPonto";
import { ResumoDiario } from "../entities/ResumoDiario";
import { AppError } from "../errors/AppError";
import { Origem } from "../types/origem";
import { TiposRegistros } from "../types/registros";
import { UserRole } from "../types/roles";
import { StatusAjuste } from "../types/statusAjuste";
import { calcularResumoPonto } from "../utils/resumoPonto";

type BatidasAjuste = {
    entrada?: string | null | undefined;
    saidaAlmoco?: string | null | undefined;
    retornoAlmoco?: string | null | undefined;
    saida?: string | null | undefined;
};

interface CriarAjustePontoInput {
    colaboradorId: string;
    data: string;
    motivo: string;
    batidasSolicitadas: BatidasAjuste;
    solicitanteId: string;
    solicitantePerfil: UserRole;
}

interface AvaliarAjustePontoInput {
    ajusteId: string;
    status: StatusAjuste.APROVADO | StatusAjuste.REJEITADO;
    comentario: string | null;
}

const ORDEM_BATIDAS = [
    { chave: "entrada", tipo: TiposRegistros.ENTRADA },
    { chave: "saidaAlmoco", tipo: TiposRegistros.SAIDA_ALMOCO },
    { chave: "retornoAlmoco", tipo: TiposRegistros.RETORNO_ALMOCO },
    { chave: "saida", tipo: TiposRegistros.SAIDA },
] as const;

function inicioDoDia(data: string): Date {
    const d = new Date(`${data}T00:00:00`);
    d.setHours(0, 0, 0, 0);
    return d;
}

function fimDoDia(data: string): Date {
    const d = new Date(`${data}T00:00:00`);
    d.setHours(23, 59, 59, 999);
    return d;
}

function dataLocalString(data: Date | string): string {
    if (typeof data === "string") {
        return data.slice(0, 10);
    }

    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

function formatarHora(data: Date | null | undefined): string | null {
    if (!data) return null;
    return `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
}

function criarDataHora(data: string, horario: string): Date {
    const [horas, minutos] = horario.split(":").map(Number);
    const timestamp = new Date(`${data}T00:00:00`);
    timestamp.setHours(horas ?? 0, minutos ?? 0, 0, 0);
    return timestamp;
}

function serializarBatidas(registros: RegistroPonto[]): Required<BatidasAjuste> {
    return {
        entrada: formatarHora(registros.find(r => r.tipo === TiposRegistros.ENTRADA)?.timestamp),
        saidaAlmoco: formatarHora(registros.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO)?.timestamp),
        retornoAlmoco: formatarHora(registros.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO)?.timestamp),
        saida: formatarHora(registros.find(r => r.tipo === TiposRegistros.SAIDA)?.timestamp),
    };
}

export class AjustePontoService {
    private ajusteRepository: Repository<AjustePonto>;
    private colaboradorRepository: Repository<Colaborador>;
    private registroRepository: Repository<RegistroPonto>;
    private resumoRepository: Repository<ResumoDiario>;

    constructor() {
        this.ajusteRepository = appDataSource.getRepository(AjustePonto);
        this.colaboradorRepository = appDataSource.getRepository(Colaborador);
        this.registroRepository = appDataSource.getRepository(RegistroPonto);
        this.resumoRepository = appDataSource.getRepository(ResumoDiario);
    }

    async criarSolicitacao({
        colaboradorId,
        data,
        motivo,
        batidasSolicitadas,
        solicitanteId,
        solicitantePerfil,
    }: CriarAjustePontoInput) {
        const podeSolicitar = solicitanteId === colaboradorId ||
            solicitantePerfil === UserRole.GESTOR ||
            solicitantePerfil === UserRole.RH;

        if (!podeSolicitar) {
            throw new AppError("Acesso negado", 403);
        }

        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId },
        });

        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404);
        }

        const registrosDoDia = await this.buscarRegistrosDoDia(colaboradorId, data);
        const ajuste = this.ajusteRepository.create({
            colaborador,
            data: new Date(`${data}T00:00:00`),
            motivo,
            batidasOriginais: serializarBatidas(registrosDoDia),
            batidasSolicitadas: {
                entrada: batidasSolicitadas.entrada ?? null,
                saidaAlmoco: batidasSolicitadas.saidaAlmoco ?? null,
                retornoAlmoco: batidasSolicitadas.retornoAlmoco ?? null,
                saida: batidasSolicitadas.saida ?? null,
            },
            status: StatusAjuste.PENDENTE,
            comentario: null,
        });

        const salvo = await this.ajusteRepository.save(ajuste);

        return this.formatarAjuste(salvo);
    }

    async listar(status?: StatusAjuste) {
        const statuses = status ? [status] : [StatusAjuste.PENDENTE, StatusAjuste.APROVADO, StatusAjuste.REJEITADO];
        const ajustes = await this.ajusteRepository.find({
            where: { status: In(statuses) },
            relations: ["colaborador"],
            order: { data: "DESC" },
        });

        return ajustes.map(ajuste => this.formatarAjuste(ajuste));
    }

    async listarPorColaborador(colaboradorId: string, solicitanteId: string, solicitantePerfil: UserRole) {
        const podeConsultar = solicitanteId === colaboradorId ||
            solicitantePerfil === UserRole.GESTOR ||
            solicitantePerfil === UserRole.RH;

        if (!podeConsultar) {
            throw new AppError("Acesso negado", 403);
        }

        const ajustes = await this.ajusteRepository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
            },
            relations: ["colaborador"],
            order: { data: "DESC" },
        });

        return ajustes.map(ajuste => this.formatarAjuste(ajuste));
    }

    async avaliar({ ajusteId, status, comentario }: AvaliarAjustePontoInput) {
        return appDataSource.transaction(async manager => {
            const ajusteRepository = manager.getRepository(AjustePonto);
            const registroRepository = manager.getRepository(RegistroPonto);
            const resumoRepository = manager.getRepository(ResumoDiario);

            const ajuste = await ajusteRepository.findOne({
                where: { id: ajusteId },
                relations: ["colaborador", "colaborador.jornada"],
            });

            if (!ajuste) {
                throw new AppError("Solicitacao de ajuste nao encontrada", 404);
            }

            if (ajuste.status !== StatusAjuste.PENDENTE) {
                throw new AppError("Solicitacao de ajuste ja avaliada", 409);
            }

            if (status === StatusAjuste.REJEITADO && !comentario?.trim()) {
                throw new AppError("Comentario e obrigatorio ao reprovar um ajuste", 400);
            }

            if (status === StatusAjuste.APROVADO) {
                await this.aplicarCorrecao(ajuste, registroRepository, resumoRepository);
            }

            ajuste.status = status;
            ajuste.comentario = comentario?.trim() || null;

            const salvo = await ajusteRepository.save(ajuste);
            return this.formatarAjuste(salvo);
        });
    }

    private async aplicarCorrecao(
        ajuste: AjustePonto,
        registroRepository: Repository<RegistroPonto>,
        resumoRepository: Repository<ResumoDiario>
    ) {
        const data = dataLocalString(ajuste.data);
        const batidas = ajuste.batidasSolicitadas ?? {};

        await registroRepository.delete({
            colaborador: { id_colaborador: ajuste.colaborador.id_colaborador },
            timestamp: Between(inicioDoDia(data), fimDoDia(data)),
        });

        const novosRegistros = ORDEM_BATIDAS
            .filter(({ chave }) => Boolean(batidas[chave]))
            .map(({ chave, tipo }) => registroRepository.create({
                colaborador: ajuste.colaborador,
                tipo,
                timestamp: criarDataHora(data, batidas[chave] as string),
                origem: Origem.AJUSTE,
                justificativa: ajuste.motivo,
            }));

        const registrosSalvos = novosRegistros.length > 0
            ? await registroRepository.save(novosRegistros)
            : [];

        const cargaHorariaDia = Number(ajuste.colaborador.jornada?.cargaHorariaDia ?? 8);
        const horarioEntrada = ajuste.colaborador.jornada?.horarioEntrada ?? "08:00";
        const resumoCalculado = calcularResumoPonto(registrosSalvos, cargaHorariaDia, horarioEntrada);

        let resumo = await resumoRepository.findOne({
            where: {
                colaborador: { id_colaborador: ajuste.colaborador.id_colaborador },
                data,
            },
        });

        if (!resumo) {
            resumo = resumoRepository.create({
                colaborador: ajuste.colaborador,
                data,
                horas_esperadas: cargaHorariaDia,
            });
        }

        resumo.horas_trabalhadas = resumoCalculado.horasTrabalhadas;
        resumo.horas_extras = resumoCalculado.horasExtras;
        resumo.horas_esperadas = cargaHorariaDia;
        resumo.atraso_minutos = resumoCalculado.atrasoMinutos;
        resumo.status = resumoCalculado.status;

        await resumoRepository.save(resumo);
    }

    private async buscarRegistrosDoDia(colaboradorId: string, data: string) {
        return this.registroRepository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                timestamp: Between(inicioDoDia(data), fimDoDia(data)),
            },
            order: { timestamp: "ASC" },
        });
    }

    private formatarAjuste(ajuste: AjustePonto) {
        return {
            id: ajuste.id,
            data: dataLocalString(ajuste.data),
            motivo: ajuste.motivo,
            batidasOriginais: ajuste.batidasOriginais,
            batidasSolicitadas: ajuste.batidasSolicitadas,
            status: ajuste.status,
            comentario: ajuste.comentario,
            colaborador: {
                id: ajuste.colaborador.id_colaborador,
                nome: ajuste.colaborador.nome,
                matricula: ajuste.colaborador.matricula,
                cargo: ajuste.colaborador.cargo,
                setor: ajuste.colaborador.setor,
            },
        };
    }
}
