import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
import { TiposRegistros } from "../types/registros";
import { Origem } from "../types/origem";


@Entity("registros_pontos")
export class RegistroPonto {
    @PrimaryGeneratedColumn("uuid")
    id!:string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.registros)
    @JoinColumn({ name: "colaborador_id" })
    colaborador!: Colaborador;


    @Column({type: "enum", enum: TiposRegistros})
    tipo!: TiposRegistros

    @Column({type: "timestamptz", default: () => "now()"})
    timestamp!: Date

    @Column({type: "enum", enum: Origem, default: Origem.SISTEMA})
    origem!: Origem

    @Column({type: "text", nullable: true})
    justificativa!: string | null

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.registroFeitos, { nullable: true})
    @JoinColumn({name: "registrado_por"})
    registradoPor!: Colaborador | null
}