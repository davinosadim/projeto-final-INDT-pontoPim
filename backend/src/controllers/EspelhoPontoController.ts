import { Response } from "express";
import { parseEspelhoMensalParams } from "../dto/params/EspelhoMensalParamSchemaDTO";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../middlewares/authMiddleware";
import { EspelhoPontoService } from "../services/EspelhoPontoService";
import { UserRole } from "../types/roles";

export class EspelhoPontoController {
    private service = new EspelhoPontoService();

    async gerarMensal(req: AuthRequest, res: Response) {
        if (!req.user) {
            throw new AppError("Autenticacao requerida", 401);
        }

        const params = parseEspelhoMensalParams(req.params);
        const consultaPropria = req.user.id === params.id;
        const perfilPermitido = req.user.perfil === UserRole.GESTOR || req.user.perfil === UserRole.RH;

        if (!consultaPropria && !perfilPermitido) {
            throw new AppError("Acesso negado", 403);
        }

        const espelho = await this.service.gerarMensal(params.id, params.mes);

        return res.status(200).json({ status: "success", data: espelho });
    }
}
