import { In, Repository } from "typeorm";
import { appDataSource } from "../database/data-source";
import { AjustePonto } from "../entities/AjustePonto";
import { Colaborador } from "../entities/Colaborador";
import { AppError } from "../errors/AppError";
import { StatusAjuste } from "../types/statusAjuste";
import { UserRole } from "../types/roles";

interface CriarAjustePontoInput {
    colaboradorId: string;
    data: string;
    motivo: string;
    solicitanteId: string;
    solicitantePerfil: UserRole;
}

interface AvaliarAjustePontoInput {
    ajusteId: string;
    status: StatusAjuste.APROVADO | StatusAjuste.REJEITADO;
    comentario: string | null;
}

export class AjustePontoService {
    private ajusteRepository: Repository<AjustePonto>;
    private colaboradorRepository: Repository<Colaborador>;

    constructor() {
        this.ajusteRepository = appDataSource.getRepository(AjustePonto);
        this.colaboradorRepository = appDataSource.getRepository(Colaborador);
    }

    async criarSolicitacao({ colaboradorId, data, motivo, solicitanteId, solicitantePerfil }: CriarAjustePontoInput) {
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

        const ajuste = this.ajusteRepository.create({
            colaborador,
            data: new Date(`${data}T00:00:00`),
            motivo,
            status: StatusAjuste.PENDENTE,
            comentario: null,
        });

        const salvo = await this.ajusteRepository.save(ajuste);

        return {
            id: salvo.id,
            data: salvo.data,
            motivo: salvo.motivo,
            status: salvo.status,
        };
    }

    async listar(status?: StatusAjuste) {
        const statuses = status ? [status] : [StatusAjuste.PENDENTE, StatusAjuste.APROVADO, StatusAjuste.REJEITADO];
        const ajustes = await this.ajusteRepository.find({
            where: { status: In(statuses) },
            relations: ["colaborador"],
            order: { data: "DESC" },
        });

        return ajustes.map(ajuste => ({
            id: ajuste.id,
            data: ajuste.data,
            motivo: ajuste.motivo,
            status: ajuste.status,
            comentario: ajuste.comentario,
            colaborador: {
                id: ajuste.colaborador.id_colaborador,
                nome: ajuste.colaborador.nome,
                matricula: ajuste.colaborador.matricula,
                cargo: ajuste.colaborador.cargo,
                setor: ajuste.colaborador.setor,
            },
        }));
    }

    async avaliar({ ajusteId, status, comentario }: AvaliarAjustePontoInput) {
        const ajuste = await this.ajusteRepository.findOne({
            where: { id: ajusteId },
            relations: ["colaborador"],
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

        ajuste.status = status;
        ajuste.comentario = comentario?.trim() || null;

        const salvo = await this.ajusteRepository.save(ajuste);

        return {
            id: salvo.id,
            data: salvo.data,
            motivo: salvo.motivo,
            status: salvo.status,
            comentario: salvo.comentario,
            colaborador: {
                id: salvo.colaborador.id_colaborador,
                nome: salvo.colaborador.nome,
                matricula: salvo.colaborador.matricula,
                cargo: salvo.colaborador.cargo,
                setor: salvo.colaborador.setor,
            },
        };
    }
}
