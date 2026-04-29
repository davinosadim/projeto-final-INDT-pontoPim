import { Response } from "express";
import { RegistroPontoService } from "../services/RegistroPontoService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { AppError } from "../errors/AppError";

export class RegistroPontoController {

    private service = new RegistroPontoService()

    async getHoje(req: AuthRequest, res: Response) {
        const colaboradorId = req.user?.id

        if (!colaboradorId) {
            throw new AppError("Colaborador nao identificado no token", 401)
        }

        const dados = await this.service.getHoje(colaboradorId)

        return res.status(200).json({ status: "success", data: dados })
    }

    async create(req: AuthRequest, res: Response) {
        const colaboradorId = req.user?.id

        if (!colaboradorId) {
            throw new AppError("Colaborador nao identificado no token", 401)
        }

        const registro = await this.service.registrarBatida(colaboradorId)

        return res.status(201).json({ status: "success", data: registro })
    }
}
