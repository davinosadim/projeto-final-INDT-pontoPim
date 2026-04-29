import type { RequestHandler } from "express";
import type { UserRole } from "../types/roles";
import { AppError } from "../errors/AppError";
import type { AuthRequest } from "./authMiddleware";

export const ensureRole = (...perfisPermitidos: UserRole[]): RequestHandler => {
    return (req, _res, next) => {
        const authReq = req as AuthRequest

        if (!authReq.user) {
            return next(new AppError("Autenticacao requerida", 401))
        }

        if (!perfisPermitidos.includes(authReq.user.perfil as UserRole)) {
            return next(new AppError("Acesso negado", 403))
        }

        return next()
    }
}
