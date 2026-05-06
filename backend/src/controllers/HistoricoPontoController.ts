import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { HistoricoPontoService, PeriodoHistoricoPonto } from "../services/HistoricoPontoService";
import { AppError } from "../errors/AppError";
import { UserRole } from "../types/roles";
import { parseListarHistoricoPontoParams, parseListarHistoricoPontoQuery } from "../dto/historico-ponto/listar/ListarHistoricoPontoDTO";

export class HistoricoPontoController {
    private service = new HistoricoPontoService();

    async listarPorColaborador(req: AuthRequest, res: Response) {
        if (!req.user) {
            throw new AppError("Autenticacao requerida", 401);
        }

        const params = parseListarHistoricoPontoParams(req.params);

        const consultaPropria = req.user.id === params.id;
        const perfilPermitido = req.user.perfil === UserRole.GESTOR || req.user.perfil === UserRole.RH;

        if (!consultaPropria && !perfilPermitido) {
            throw new AppError("Acesso negado", 403);
        }

        const query = parseListarHistoricoPontoQuery(req.query);

        const historico = await this.service.listarPorColaborador(
            params.id,
            query.periodo as PeriodoHistoricoPonto
        );

        return res.status(200).json({ status: "success", data: historico });
    }
}
