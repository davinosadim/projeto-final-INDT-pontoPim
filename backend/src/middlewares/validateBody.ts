import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";
import type { RequestHandler } from "express";

export const validate = (schema: ZodSchema) : RequestHandler => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        console.log(req.params)



        if (!result.success) {
            throw new AppError("Dados invalidos", 400, result.error);
        }

        req.body = result.data;

    
        return next();
    }
};