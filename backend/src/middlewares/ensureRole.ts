import type { RequestHandler } from "express";
import type { UserRole } from "../types/roles.js";
import { AppError } from "../errors/AppError.js";

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