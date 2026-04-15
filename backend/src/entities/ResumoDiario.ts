import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
import { StatusResumo } from "../types/statusResumo";
import { Jornada } from "./Jornada";
import { HoraExtra } from "./hora_extra";


@Entity("resumos_diarios")
export class ResumoDiario {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.resumos)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador

    @CreateDateColumn({type: "date"})
    data!: Date

    @Column({type: "numeric", nullable: false, default: 0})
    horas_trabalhadas!: number

    @ManyToOne(() => Jornada, (jornada) => jornada.resumos)
    @JoinColumn({name: "jornada_id"})
    horas_esperadas!: Jornada

    @OneToOne(() => HoraExtra, (horaExtra) => horaExtra.colaboradorId)
    @JoinColumn({name: "hora_extra_id"})
    horasExtras!: HoraExtra

    @Column({type: "int", nullable: false, default: 0})
    atrasoMinutos!: number

    @Column({type: "enum", enum: StatusResumo})
    status!: StatusResumo
}