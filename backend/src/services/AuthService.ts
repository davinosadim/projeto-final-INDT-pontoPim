import bcrypt from "bcrypt"
import { appDataSource } from "../database/data-source"
import { User } from "../entities/User"
import { AppError } from "../errors/AppError"
import jwt from "jsonwebtoken"
import { jwtConfig } from "../config/jwt.config"
import { RefreshToken } from "../entities/RefreshToken"
import { randomUUID } from "crypto"

export class AuthService {

    private userRepository = appDataSource.getRepository(User)
    private refresRepository = appDataSource.getRepository(RefreshToken)

    async login(email: string, senha: string) {

        const user = await this.userRepository.findOne({
            where: {email},
        })
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
   private generateAcessToken(user: User) {
    return jwt.sign({
        sub: user.id,
        email: user.email,
        type: "acess",
    }, 
    jwtConfig.access.secret, 
    {
        expiresIn: jwtConfig.access.expiresIn!
    }
)
   }


   private generateRefreshToken(user: User, jti: string) { 
    return jwt.sign( { 
        sub: user.id, 
        jti: jti, 
        type: "refresh", 
    }, 
    jwtConfig.refresh.secret, 
    { 
        expiresIn: jwtConfig.refresh.expiresIn!, 
    } 
); 
    } 

    private async createRefreshToken(user: User) {
        const token = this.refresRepository.create({
            jti: randomUUID(),
            user,
        })

        return this.refresRepository.save(token)
    }




 
 
}