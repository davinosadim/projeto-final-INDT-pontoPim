import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
import { StatusResumo } from "../types/statusResumo";
import { Jornada } from "./Jornada";
import { join } from "node:path";


@Entity("resumos_diarios")
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

    @ManyToOne(() => Jornada, (jornada) => jornada.resumos)
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada

    @Column({type: "numeric", nullable: false, default: 0})
    horasExtras!: number

    @Column({type: "int", nullable: false, default: 0})
    atrasoMinutos!: number

    @Column({type: "enum", enum: StatusResumo})
    status!: StatusResumo
}