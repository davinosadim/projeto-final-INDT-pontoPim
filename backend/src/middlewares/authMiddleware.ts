import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import { AppError } from "../errors/AppError";
import type { UserRole } from "../types/roles";

export interface AuthRequest extends Request {
    user?: {
        id: string
        email: string
        nome: string
        perfil: UserRole
    }
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return next(new AppError("Token nao fornecido", 401))
    }

    const [, token] = authHeader.split(" ")

    if (!token) {
        return next(new AppError("Token malformado", 401))
    }

    let payload: JwtPayload

    try {
        payload = jwt.verify(token, jwtConfig.access.secret) as JwtPayload
    } catch {
        return next(new AppError("Token invalido ou expirado", 401))
    }

    if (payload.type !== "acess") {
        return next(new AppError("Token invalido", 401))
    }

    req.user = {
        id: payload.sub as string,
        email: payload.email as string,
        nome: payload.nome as string,
        perfil: payload.perfil as UserRole
    }

    return next()
}
