import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Colaborador } from "./Colaborador";
import { StatusResumo } from "../types/statusResumo";

@Entity("resumos_diarios")
@Unique(["colaborador", "data"])
export class ResumoDiario {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.resumos)
    @JoinColumn({ name: "colaborador_id" })
    colaborador!: Colaborador

    @Column({ type: "date" })
    data!: string

    @Column({ type: "numeric", precision: 10, scale: 2, nullable: false, default: 0 })
    horas_trabalhadas!: number

    @Column({ type: "numeric", precision: 10, scale: 2, nullable: false, default: 0 })
    horas_extras!: number

    @Column({ type: "numeric", precision: 10, scale: 2, nullable: false, default: 0 })
    horas_esperadas!: number

    @Column({ type: "int", nullable: false, default: 0 })
    atraso_minutos!: number

    @Column({ type: "enum", enum: StatusResumo, default: StatusResumo.INCOMPLETO })
    status!: StatusResumo
}
