import { appDataSource } from "../database/data-source";
import { RefreshToken } from "../entities/RefreshToken";
import { AppError } from "../errors/AppError";

export class LogoutService {

    private refreshRepository = appDataSource.getRepository(RefreshToken)

    async execute(jti: string) {
        const session = await this.refreshRepository.findOne({
            where: { jti }
        })

        if (!session){
            throw new AppError("Sessao nao encontrada")
        }

        await this.refreshRepository.remove(session)
    }
}