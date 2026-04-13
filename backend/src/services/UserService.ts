import { appDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { CreateUserSchemaDTO, UpdateUserSchemaDTO } from "../dto/user/CreateUserSchemaDTO";
import { AppError } from "../errors/AppError";
import bcrypt from "bcrypt"
import { Repository } from "typeorm";
import { Setor } from "../entities/Setor";
import { DataSource } from "typeorm/browser";

export class UsuarioService {
    private userRepo: Repository<User>;
    private setorRepo: Repository<Setor>;

    constructor(dataSource: DataSource) {
        this.userRepo = dataSource.getRepository(User);
        this.setorRepo = dataSource.getRepository(Setor);
    }

    async findByEmail(email: string) {
        return await this.userRepo.findOne({ where: { email } });
    }

    async findById(id: string) {
        return await this.userRepo.findOne({ where: { id } });
    }

    async findAll() {
        return await this.userRepo.find({ relations: { setor: true } });
    }

    async createUsuario(userData: CreateUserSchemaDTO) {
        const usuario = await this.findByEmail(userData.email);
        if (usuario) {
            throw new AppError("Usuario ja cadastrado!", 409);
        }

        const setor = await this.setorRepo.findOne({ where: { id: userData.setor_id } });
        if (!setor) {
            throw new AppError("Setor nao encontrado!", 404);
        }

        const senha_hash = await hash(userData.password, 10);
        const novoUsuario = await this.userRepo.save({
            nome: userData.nome,
            email: userData.email,
            senha_hash,
            perfil: userData.perfil,
            setor
        });

        return novoUsuario;
    }

    async updateUsuario(id: string, userUpdate: UpdateUserSchemaDTO) {
        const usuario = await this.findById(id);

        if (!usuario) {
            throw new AppError("Usuario nao encontrado!", 404);
        }

        if (userUpdate.email && userUpdate.email !== usuario.email) {
            const emailEmUso = await this.findByEmail(userUpdate.email);
            if (emailEmUso) {
                throw new AppError("Email ja cadastrado!", 409);
            }
        }

        let setor;

        if (userUpdate.setor_id) {
            setor = await this.setorRepo.findOne({
                where: { id: userUpdate.setor_id },
            });

            if (!setor) {
                throw new AppError("Setor nao encontrado!", 404);
            }
        }

        Object.assign(usuario, {
            ...userUpdate,
            ...(setor && { setor }),
        });

        return await this.userRepo.save(usuario);
    }

    async deleteUsuario(id: string) {
        const result = await this.userRepo.delete(id);

        if (result.affected === 0) {
            throw new AppError("Usuario nao encontrado!", 404);
        }
    }
}