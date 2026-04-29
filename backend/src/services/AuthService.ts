import bcrypt from "bcrypt"
import { appDataSource } from "../database/data-source"
import { Colaborador } from "../entities/Colaborador"
import { AppError } from "../errors/AppError"
import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config"
import { RefreshToken } from "../entities/RefreshToken"
import { randomUUID } from "crypto"

export class AuthService {

    private colaboradorRepository = appDataSource.getRepository(Colaborador)
    private refreshRepository = appDataSource.getRepository(RefreshToken)

    async login(email: string, senha: string) {
        const user = await this.colaboradorRepository.findOne({
            where: { email },
            select: ["id_colaborador", "email", "senha", "nome", "perfil", "ativo"]
        })

        if (!user) {
            throw new AppError("Credenciais invalidas", 401)
        }

        if (!user.ativo) {
            throw new AppError("Colaborador inativo", 403)
        }

        const valid = await bcrypt.compare(senha, user.senha)
        if (!valid) {
            throw new AppError("Credenciais invalidas", 401)
        }

        const refreshTokenRecord = await this.createRefreshToken(user)
        const acessToken = this.generateAcessToken(user)
        const refreshToken = this.generateRefreshToken(user, refreshTokenRecord.jti)

        return {
            acessToken,
            refreshToken,
            usuario: {
                id: user.id_colaborador,
                nome: user.nome,
                email: user.email,
                perfil: user.perfil
            }
        }
    }

    private generateAcessToken(colaborador: Colaborador) {
        return jwt.sign(
            {
                sub: colaborador.id_colaborador,
                email: colaborador.email,
                nome: colaborador.nome,
                perfil: colaborador.perfil,
                type: "acess",
            },
            jwtConfig.access.secret,
            { expiresIn: jwtConfig.access.expiresIn! }
        )
    }

    private generateRefreshToken(colaborador: Colaborador, jti: string) {
        return jwt.sign(
            {
                sub: colaborador.id_colaborador,
                jti,
                type: "refresh",
            },
            jwtConfig.refresh.secret,
            { expiresIn: jwtConfig.refresh.expiresIn! }
        )
    }

    private async createRefreshToken(colaborador: Colaborador) {
        const token = this.refreshRepository.create({
            jti: randomUUID(),
            colaborador,
        })
        return this.refreshRepository.save(token)
    }
}
