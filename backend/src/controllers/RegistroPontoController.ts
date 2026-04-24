import { Request, Response } from "express";
import { RegistroPontoService } from "../services/RegistroPontoService";
import { AuthRequest } from "../middlewares/authMiddleware";


export class RegistroPontoController {

    private service = new RegistroPontoService()

    async create(req: AuthRequest, res: Response) {
       const colaboradorId = req.user?.id

       if (!colaboradorId) {
        throw new Error("Colaborador nao identificado no token")
       }

       const registro = await this.service.registrarBatida(colaboradorId)

       return res.status(201).json(registro)
    }
}