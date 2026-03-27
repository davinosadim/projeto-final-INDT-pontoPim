import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador.js";
import { TiposRegistros } from "../types/registros.js";
import { Origem } from "../types/origem.js";


@Entity("registrosPontos")
export class RegistroPonto {
    @PrimaryGeneratedColumn("uuid")
    id!:string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.registros)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador

    @Column({type: "enum", enum: TiposRegistros})
    tipo!: TiposRegistros

    @Column({type: "timestamptz", default: () => "now()"})
    timestamp!: Date

    @Column({type: "enum", enum: Origem, default: Origem.SISTEMA})
    origem!: Origem

    @Column({type: "varchar", nullable: false})
    justificativa!: string | null
}