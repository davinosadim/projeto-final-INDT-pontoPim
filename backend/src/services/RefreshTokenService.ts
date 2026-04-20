import type { JwtPayload } from "jsonwebtoken";
import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { RefreshToken } from "../entities/RefreshToken";
import { jwtConfig } from "../config/jwt.config";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { email } from "zod";

export class RefreshTokenService {

    private refreshRepository = appDataSource.getRepository(RefreshToken)
    private userRepository = appDataSource.getRepository(Colaborador)

    async execute(refreshTokenJWT: string) {
        let payload: JwtPayload

        try {
            payload = jwt.verify(
                refreshTokenJWT,
                jwtConfig.refresh.secret
            ) as JwtPayload
            
        } catch (error) {
            throw new AppError("Refresh token invalido")
            
        }
        
        if (payload.type !== "refresh" || !payload.jti || !payload.sub) {
            throw new AppError("Refresh token invalido")
        }

        const session = await this.refreshRepository.findOne({
            where: {jti: payload.jti},
            relations: ["user"]
        })

        if(!session) {
            throw new AppError("Sessao expirada")
        }

        const acessToken = jwt.sign({
            sub: session.colaborador.id_colaborador,
            email: session.colaborador.email,
            type: "acess"
        }, 
        jwtConfig.access.secret,
        {
            expiresIn: jwtConfig.access.expiresIn!
        }
    )

    return acessToken
    }
}