import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LogoutService } from "../services/LogoutService";
import { RefreshTokenService } from "../services/RefreshTokenService";
import { AppError } from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

export class AuthController {

    constructor(
        private authService: AuthService,
        private refreshTokenService: RefreshTokenService,
        private logoutService: LogoutService
    ) {}

    async login(req: Request, res: Response) {
        const { email, senha } = req.body
        const result = await this.authService.login(email, senha)
        return res.status(200).json({ status: "success", data: result })
    }

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body
        const result = await this.refreshTokenService.execute(refreshToken)
        return res.status(200).json({ status: "success", data: result })
    }

    async logout(req: Request, res: Response) {
        const { refreshToken } = req.body

        let payload: JwtPayload
        try {
            payload = jwt.verify(refreshToken, jwtConfig.refresh.secret) as JwtPayload
        } catch {
            throw new AppError("Token invalido", 400)
        }

        if (!payload?.jti) {
            throw new AppError("Token invalido", 400)
        }

        await this.logoutService.execute(payload.jti)
        return res.status(204).send()
    }
}
