import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador.js";
import { Status } from "../types/status.js";


@Entity("resumosDiarios")
export class ResumoDiario {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.resumos)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador

    @Column({type: "date", nullable: false})
    data!: Date

    @Column({type: "numeric", nullable: false, default: 0})
    horasTrabalhadas!: number

    @Column({type: "numeric", nullable: false})
    horasEsperadas!: number

    @Column({type: "numeric", nullable: false, default: 0})
    horasExtras!: number

    @Column({type: "int", nullable: false, default: 0})
    atrasoMinutos!: number

    @Column({type: "enum", enum: Status})
    status!: Status
}