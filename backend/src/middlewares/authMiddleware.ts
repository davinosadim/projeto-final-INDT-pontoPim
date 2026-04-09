import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload} from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";
import { AppError } from "../errors/AppError";

export interface AuthRequest extends Request {
    user?: {
        id: string
        email: string
    }
}

export function authMiddleware (req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization



    if(!authHeader) {
        throw new AppError("Token nao fornecido")
    }

    const [, token] = authHeader.split("")

    if(!token) {
        throw new AppError("Token malformado")
    }

    let payload: JwtPayload

    try {
        payload = jwt.verify(
            token,
            jwtConfig.access.secret
        ) as JwtPayload
        
    } catch (error) {
        throw new AppError("Token invalido ou expirado")
        
    }

    if(payload.type !== "acess") {
        throw new AppError("Token invalido")
    }

    req.user = {
        id: payload.sub as string,
        email: payload.email as string
    }

    next()
} 