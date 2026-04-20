import bcrypt from "bcrypt"
import { appDataSource } from "../database/data-source"
import { Colaborador } from "../entities/Colaborador"
import { AppError } from "../errors/AppError"
import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config"
import { RefreshToken } from "../entities/RefreshToken"
import { randomUUID } from "crypto"

export class AuthService {

    private userRepository = appDataSource.getRepository(Colaborador)
    private refresRepository = appDataSource.getRepository(RefreshToken)

    async login(email: string, senha: string) {

        console.log(email)

        const user = await this.userRepository.findOne({
            where: {email},
            select: ["id_colaborador", "email", "senha"]
        })

        console.log(user)

        if (!user) {
            throw new AppError("Credenciais invalidas")
        }


        const valid = await bcrypt.compare(senha, user.senha)
        if(!valid) {
            throw new AppError("Credenciais invalidas")
        }

        // variaveis para receber tokens
        const refreshToken = await this.createRefreshToken(user)

        const acessToken = this.generateAcessToken(user)

        const refreshTokenJwt = this.generateRefreshToken(user, refreshToken.jti)

        return {acessToken, refreshToken: refreshTokenJwt}

    }

    // metodos para gerar tokens
   private generateAcessToken(colaborador: Colaborador) {
    return jwt.sign({
        sub: colaborador.id_colaborador,
        email: colaborador.email,
        type: "acess",
    }, 
    jwtConfig.access.secret, 
    {
        expiresIn: jwtConfig.access.expiresIn!
    }
)
   }


   private generateRefreshToken(colaborador: Colaborador, jti: string) { 
    return jwt.sign( { 
        sub: colaborador.id_colaborador, 
        jti: jti, 
        type: "refresh", 
    }, 
    jwtConfig.refresh.secret, 
    { 
        expiresIn: jwtConfig.refresh.expiresIn!, 
    } 
); 
    } 

    private async createRefreshToken(colaborador: Colaborador) {
        const token = this.refresRepository.create({
            jti: randomUUID(),
            colaborador,
        })

        return this.refresRepository.save(token)
    }
}