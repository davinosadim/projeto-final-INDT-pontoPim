import { Response } from "express";
import { EquipeService } from "../services/EquipeService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class EquipeController {
    private service = new EquipeService()

    async getEquipeHoje(_req: AuthRequest, res: Response) {
        const dados = await this.service.getEquipeHoje()
        return res.status(200).json({ status: "success", data: dados })
    }
}
