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

    @Column({type: "date"}) // Use @Column, pois @CreateDateColumn gera o timestamp de criação automática do registro
    data!: Date

    @Column({type: "numeric", nullable: false, default: 0})
    horas_trabalhadas!: number

    // Nome alterado para refletir que é a relação com a Jornada
    @ManyToOne(() => Jornada, (jornada) => jornada.resumos)
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada

    @OneToOne(() => HoraExtra, (horaExtra) => horaExtra.resumo) // Ajuste o inverso na entidade HoraExtra
    @JoinColumn({name: "hora_extra_id"})
    horaExtra!: HoraExtra

    @Column({type: "int", nullable: false, default: 0})
    atrasoMinutos!: number

    @Column({type: "enum", enum: StatusResumo})
    status!: StatusResumo
}