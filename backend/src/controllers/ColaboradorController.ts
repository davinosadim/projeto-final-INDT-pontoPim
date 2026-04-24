import { Request, Response } from "express";
import { ColaboradorService } from "../services/ColaboradorService";

const colaboradorService = new ColaboradorService()

export class ColaboradorContoller {

    private colaboradorService = new ColaboradorService()

    constructor() {
        this.colaboradorService = colaboradorService;
    }

    async findAllUser(req: Request, res: Response) {

        const users = await this.colaboradorService.findAll();
        return res.status(200).json(users);
    }
    
    async create(req: Request, res: Response): Promise<Response> {
        try {

            const colaborador = await colaboradorService.createUsuario(req.body)
            console.log(colaborador)
            return res.status(201).json(colaborador)
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "Erro ao criar usuario"})
            
        }
    }
}