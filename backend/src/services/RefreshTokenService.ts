import type { JwtPayload } from "jsonwebtoken";
import { appDataSource } from "../database/data-source";
import { Colaborador } from "../entities/Colaborador";
import { RefreshToken } from "../entities/RefreshToken";
import { jwtConfig } from "../config/jwt.config";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export class RefreshTokenService {

    private refreshRepository = appDataSource.getRepository(RefreshToken)
    private colaboradorRepository = appDataSource.getRepository(Colaborador)

    async execute(refreshTokenJWT: string) {
        let payload: JwtPayload

        try {
            payload = jwt.verify(refreshTokenJWT, jwtConfig.refresh.secret) as JwtPayload
        } catch {
            throw new AppError("Refresh token invalido", 401)
        }

        if (payload.type !== "refresh" || !payload.jti || !payload.sub) {
            throw new AppError("Refresh token invalido", 401)
        }

        const session = await this.refreshRepository.findOne({
            where: { jti: payload.jti },
            relations: ["colaborador"]
        })

        if (!session) {
            throw new AppError("Sessao expirada", 401)
        }

        const acessToken = jwt.sign(
            {
                sub: session.colaborador.id_colaborador,
                email: session.colaborador.email,
                nome: session.colaborador.nome,
                perfil: session.colaborador.perfil,
                type: "acess"
            },
            jwtConfig.access.secret,
            { expiresIn: jwtConfig.access.expiresIn! }
        )

        return { acessToken }
    }
}
