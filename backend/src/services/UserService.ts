import { appDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { CreateUserSchemaDTO } from "../dto/user/CreateUserSchemaDTO";

export class UserService {

    private userRepository = appDataSource.getRepository(User)

    async create(userData: CreateUserSchemaDTO): Promise<User> {

        const newUser = this.userRepository.create(userData)
        const savedUser = await this.userRepository.save(newUser)
        return savedUser
    }
}