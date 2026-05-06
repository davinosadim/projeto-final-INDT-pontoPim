import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { AjustePontoService } from "../services/AjustePontoService";
import { AppError } from "../errors/AppError";
import { parseAvaliarAjustePontoBody, parseAvaliarAjustePontoParams } from "../dto/ajuste-ponto/avaliar/AvaliarAjustePontoDTO";
import { parseCriarAjustePontoBody, parseCriarAjustePontoParams } from "../dto/ajuste-ponto/criar/CriarAjustePontoDTO";
import { parseListarAjustePontoQuery } from "../dto/ajuste-ponto/listar/ListarAjustePontoDTO";

export class AjustePontoController {
    private service = new AjustePontoService();

    async criarSolicitacao(req: AuthRequest, res: Response) {
        if (!req.user) {
            throw new AppError("Autenticacao requerida", 401);
        }

        const params = parseCriarAjustePontoParams(req.params);
        const body = parseCriarAjustePontoBody(req.body);

        const ajuste = await this.service.criarSolicitacao({
            colaboradorId: params.id,
            data: body.data,
            motivo: body.motivo,
            solicitanteId: req.user.id,
            solicitantePerfil: req.user.perfil,
        });

        return res.status(201).json({ status: "success", data: ajuste });
    }

    async listar(req: AuthRequest, res: Response) {
        const query = parseListarAjustePontoQuery(req.query);

        const ajustes = await this.service.listar(query.status);
        return res.status(200).json({ status: "success", data: ajustes });
    }

    async avaliar(req: AuthRequest, res: Response) {
        const params = parseAvaliarAjustePontoParams(req.params);
        const body = parseAvaliarAjustePontoBody(req.body);

        const ajuste = await this.service.avaliar({
            ajusteId: params.ajusteId,
            status: body.status,
            comentario: body.comentario ?? null,
        });

        return res.status(200).json({ status: "success", data: ajuste });
    }
}
