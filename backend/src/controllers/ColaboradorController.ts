import { Request, Response } from "express";
import { ColaboradorService } from "../services/ColaboradorService";

export class ColaboradorController {

    private service = new ColaboradorService()

    async findAll(_req: Request, res: Response) {
        const colaboradores = await this.service.findAll();
        return res.status(200).json({ status: "success", data: colaboradores });
    }

    async create(req: Request, res: Response) {
        const colaborador = await this.service.createColaborador(req.body);
        return res.status(201).json({ status: "success", data: colaborador });
    }

    async toggleStatus(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params
        const resultado = await this.service.toggleStatus(id)
        return res.status(200).json({ status: "success", data: resultado })
    }
}
