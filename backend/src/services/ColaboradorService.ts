import { appDataSource } from "../database/data-source";
import { AppError } from "../errors/AppError";
import { Repository } from "typeorm";
import { hash } from "bcryptjs";
import { Colaborador } from "../entities/Colaborador";
import { Jornada } from "../entities/Jornada";
import { CreateColaboradorSchemaDTO } from "../dto/colaborador/CreateColaboradorSchemaDTO";
import { UserRole } from "../types/roles";

export class ColaboradorService {
    private colaRepo: Repository<Colaborador>;
    private jornadaRepo: Repository<Jornada>;

    constructor() {
        this.colaRepo = appDataSource.getRepository(Colaborador)
        this.jornadaRepo = appDataSource.getRepository(Jornada)
    }

    async findByEmail(email: string) {
        return this.colaRepo.findOne({ where: { email } });
    }

    async findAll() {
        return this.colaRepo.find({ relations: ["jornada"] });
    }

    async findById(id: string) {
        return this.colaRepo.findOne({
            where: { id_colaborador: id },
            relations: ["jornada"]
        });
    }

    async toggleStatus(id: string) {
        const colaborador = await this.findById(id)
        if (!colaborador) {
            throw new AppError("Colaborador nao encontrado", 404)
        }
        colaborador.ativo = !colaborador.ativo
        const salvo = await this.colaRepo.save(colaborador)
        return { id: salvo.id_colaborador, ativo: salvo.ativo }
    }

    async createColaborador(dados: CreateColaboradorSchemaDTO) {
        const existente = await this.findByEmail(dados.email);
        if (existente) {
            throw new AppError("Email ja cadastrado", 409);
        }

        const jornada = await this.jornadaRepo.findOne({ where: { turno: dados.jornada as any } });
        if (!jornada) {
            throw new AppError("Jornada nao encontrada para o turno informado", 404);
        }

        const senhaHash = await hash(dados.senha, 10);

        const novoColaborador = this.colaRepo.create({
            nome: dados.nome,
            email: dados.email,
            matricula: dados.matricula,
            senha: senhaHash,
            cargo: dados.cargo as any,
            setor: dados.setor as any,
            perfil: (dados.perfil ?? UserRole.COLABORADOR) as UserRole,
            ativo: dados.ativo ?? true,
            jornada,
        });

        const salvo = await this.colaRepo.save(novoColaborador);

        const resultado = salvo as Partial<Colaborador> & { senha?: string };
        delete resultado.senha;
        return resultado;
    }
}
