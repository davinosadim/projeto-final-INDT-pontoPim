import { Request, Response } from "express";
import { RegistroPontoService } from "../services/RegistroPontoService";

export class RegistroPontoController {
    private service = new RegistroPontoService()

    async create(req: Request, res: Response) {
        const { colaboradorId } = req.body

        const resultado = await this.service.registrarBatida(colaboradorId)

        return res.status(201).json(resultado)
    }
}