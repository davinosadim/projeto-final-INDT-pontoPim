import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RefreshToken } from "../entities/RefreshToken";
import { resourceLimits } from "node:worker_threads";
import { JwtPayload } from "jsonwebtoken";
import { LogoutService } from "../services/LogoutService";
import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config";
import { RefreshTokenService } from "../services/RefreshTokenService";

export class AuthController {

    private authService: AuthService
    private refreshTokenService: RefreshTokenService
    private logoutService: LogoutService

    constructor(authService: AuthService, refreshToken: RefreshTokenService, logoutService: LogoutService) {
        this.authService = authService
        this.refreshTokenService = refreshToken
        this.logoutService = logoutService
    }

    async login(req: Request, res: Response) {
        const { email, senha } = req.body

        console.log("Ola")

        const result = await this.authService.login(email, senha)

        return res.status(200).json({status: "sucess", data: result})
    }

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body

        const result = await this.refreshTokenService.execute(refreshToken)

        return res.status(200).json({status: "sucess", data: result})
    }

    async logout(req: Request, res: Response) {
        const { refreshToken } = req.body

        const payload = jwt.verify(refreshToken, jwtConfig.refresh.secret) as JwtPayload

        if(!payload?.jti) {
            return res.status(400).json({message: "Token invalido"})
        }

        await this.logoutService.execute(payload.jti as string)

        return res.status(204).json({})
    }

}