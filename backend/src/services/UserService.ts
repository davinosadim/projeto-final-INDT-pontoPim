import { appDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { CreateUserSchemaDTO, UpdateUserSchemaDTO } from "../dto/user/CreateUserSchemaDTO";
import { AppError } from "../errors/AppError";
import bcrypt from "bcrypt"

export class UserService {

    private userRepository = appDataSource.getRepository(User)

    async create(userData: CreateUserSchemaDTO): Promise<User> {

        const { nome, email, senha, role, setor } = userData

        const senhaHash = await bcrypt.hash(senha, 10)

        const user = this.userRepository.create({
            nome,
            email,
            senha: senhaHash,
            role,
            setor
        })

        await this.userRepository.save(user)

        return user
    }
}