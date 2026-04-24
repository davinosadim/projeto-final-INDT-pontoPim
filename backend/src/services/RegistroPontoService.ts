import { Between, Repository } from "typeorm";
import { RegistroPonto } from "../entities/RegistroPonto";
import { Colaborador } from "../entities/Colaborador";
import { appDataSource } from "../database/data-source";
import { TiposRegistros } from "../types/registros";





export class RegistroPontoService {
    
    private registroRespository: Repository<RegistroPonto>
    private colaboradorRepository: Repository<Colaborador>
    
    constructor(){
        this.registroRespository = appDataSource.getRepository(RegistroPonto)
        this.colaboradorRepository = appDataSource.getRepository(Colaborador)
    }

    async registrarBatida(colaboradorId: string) {
        const colaborador = await this.colaboradorRepository.findOne({
            where: { id_colaborador: colaboradorId},
            relations: ["jornada"]
        })

        if (!colaborador) {
            throw new Error("Colaborador nao encontrado")
        }

        

        const inicioDia = new Date()
        inicioDia.setHours(0, 0, 0, 0)

        const fimDia = new Date()
        fimDia.setHours(23, 59, 59, 999)

        const registroHoje = await this.registroRespository.find({
            where: {
                colaborador: { id_colaborador: colaboradorId },
                timestamp: Between(inicioDia, fimDia)
            },
            relations: ["colaborador"],
            order: {
                timestamp: "ASC"
            }
        })

        
        const sequenciaBatidas = [
            TiposRegistros.ENTRADA,
            TiposRegistros.SAIDA_ALMOCO,
            TiposRegistros.RETORNO_ALMOCO,
            TiposRegistros.SAIDA
        ]

        if (registroHoje.length >= sequenciaBatidas.length) {
             console.log(registroHoje)
            throw new Error("Todas as batidas do dia ja foram registradas")
        }

       

        const proximoTipo = sequenciaBatidas[registroHoje.length]

        if (!proximoTipo) {
            throw new Error("Nao foi possivel encontrar a batida")
        }

        const agora = new Date()


            
        const novoRegistro = this.registroRespository.create({
            colaborador,
            tipo: proximoTipo,
            timestamp: agora,
            justificativa: null,
            registradoPor: null

        })

        console.log(colaborador)

        const registroSalvo = await this.registroRespository.save(novoRegistro)


        console.log("colaboradorId:", colaboradorId);
        console.log("colaborador:", colaborador);
        console.log("registrosHoje:", registroHoje.length);
        console.log("proximoTipo:", proximoTipo);

        return {
            mensagem: "Batida registrada com sucesso",
            registro: registroSalvo
        }
    }
}