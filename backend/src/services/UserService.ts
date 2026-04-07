import { appDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { CreateUserSchemaDTO } from "../dto/user/CreateUserSchemaDTO";

export class UserService {

    private userRepository = appDataSource.getRepository(User)

    async create(userData: CreateUserSchemaDTO): Promise<User> {

        const { nome, email, senha, role, setor} = userData

        const newUser = this.userRepository.create({
            nome,
            role,
            email,
            setor
        })

        await this.userRepository.save(newUser)

        return newUser
    }
}