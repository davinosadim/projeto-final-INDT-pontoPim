import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService()

export class UserController {
    
    async create(req: Request, res: Response): Promise<Response> {
        try {

            const user = await userService.create(req.body)
            const { senha, ...userSemSenha} = user
            return res.status(201).json(userSemSenha)
            
        } catch (error) {
            return res.status(500).json({message: "Erro ao criar usuario"})
            
        }
    }
}