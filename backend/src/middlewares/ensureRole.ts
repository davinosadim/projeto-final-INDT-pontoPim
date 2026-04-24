import type { RequestHandler } from "express";
import type { UserRole } from "../types/roles";
import { AppError } from "../errors/AppError";

export const ensureRole = (...perfisPermitido: UserRole[]): RequestHandler => {
    return (req, res, next) => {

        if (!req.auth) {
            throw next(new AppError('Autenticação requerida', 401));
        }

        if(!perfisPermitido.includes(req.auth.perfil)) {
            throw next(new AppError("Acesso negado", 403))
        }

        next();

    }
}