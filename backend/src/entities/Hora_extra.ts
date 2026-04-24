import { Column, CreateDateColumn, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Colaborador } from "./Colaborador"
import { ResumoDiario } from "./ResumoDiario"

export class HoraExtra {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    // @ManyToOne(() => Colaborador, (colaborador) => colaborador.horasExtras)
    // @JoinColumn({name: "colaborador_id"})
    // colaboradorId!: string

    @CreateDateColumn({type: "date"})
    data!: Date

    @Column({type: "numeric", nullable: false})
    horas!: number

    @Column({type: "varchar", nullable: false})
    motivo!: string

}