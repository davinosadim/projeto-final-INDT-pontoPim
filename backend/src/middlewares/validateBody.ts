import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        if(error instanceof ZodError) {
            return res.status(400).json({
                message: "Erro de validacao dos dados",
                errors: error.issues.map(err => ({
                    path: err.path.join("."),
                    message: err.message
                }))
            })
        }

        return res.status(500).json({message: "Erro interno do servidor"})
        
    }
}