import { appDataSource } from "../database/data-source";
import { CreateUserSchemaDTO, UpdateUserSchemaDTO } from "../dto/user/CreateUserSchemaDTO";
import { AppError } from "../errors/AppError";
import { Repository } from "typeorm";
import { Setor } from "../entities/Setor";
import { DataSource } from "typeorm/browser";
import { hash } from "bcryptjs";
import { Colaborador } from "../entities/Colaborador";
import { CreateColaboradorSchemaDTO } from "../dto/colaborador/CreateColaboradorSchemaDTO";

export class ColaboradorService {
    private colaRepo: Repository<Colaborador>;
    private setorRepo: Repository<Setor>;

    constructor() {
        this.colaRepo = appDataSource.getRepository(Colaborador)
        this.setorRepo = appDataSource.getRepository(Setor)
    }

    async findByEmail(email: string) {
        return await this.colaRepo.findOne({ where: { email } });
    }

    // async findById(id: string) {
    //     return await this.colaRepo.findOne({ where: { id_colaborador} });
    // }

    async findAll() {
        return await this.colaRepo.find({ relations: { setor: true } as any});
    }

    async createUsuario(colaboradorData: CreateColaboradorSchemaDTO) {

        const usuario = await this.findByEmail(colaboradorData.email);

        console.log(usuario)
        console.log(colaboradorData)


        if (usuario) {
            throw new AppError("Usuario ja cadastrado!", 409);
        }

        
        const senha_hash = await hash(colaboradorData.senha, 10);
        console.log("hash gerado: ", senha_hash)
        const novoUsuario = await this.colaRepo.save({
            nome: colaboradorData.nome,
            email: colaboradorData.email,
            matricula: colaboradorData.matricula,
            senha: senha_hash,
            cargo: colaboradorData.cargo,
            setor: colaboradorData.setor

           
        });

        console.log("novo usuario: ", novoUsuario)
    

        return novoUsuario;
    }


    // async updateUsuario(id: string, userUpdate: UpdateUserSchemaDTO) {
    //     const usuario = await this.findById(id);

    //     if (!usuario) {
    //         throw new AppError("Usuario nao encontrado!", 404);
    //     }

    //     if (userUpdate.email && userUpdate.email !== usuario.email) {
    //         const emailEmUso = await this.findByEmail(userUpdate.email);
    //         if (emailEmUso) {
    //             throw new AppError("Email ja cadastrado!", 409);
    //         }
    //     }

    //     let setor;

    //     if (userUpdate.setor) {
    //         setor = await this.setorRepo.findOne({
    //             where: { id: userUpdate.setor },
    //         });

    //         if (!setor) {
    //             throw new AppError("Setor nao encontrado!", 404);
    //         }
    //     }

    //     Object.assign(usuario, {
    //         ...userUpdate,
    //         ...(setor && { setor }),
    //     });

    //     return await this.userRepo.save(usuario);
    // }

    // async deleteUsuario(id: string) {
    //     const result = await this.userRepo.delete(id);

    //     if (result.affected === 0) {
    //         throw new AppError("Usuario nao encontrado!", 404);
    //     }
    // }
}