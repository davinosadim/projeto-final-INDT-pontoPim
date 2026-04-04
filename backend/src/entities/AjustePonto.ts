import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
import { User } from "./User";
import { StatusAjuste } from "../types/statusAjuste";


@Entity("ajustes_ponto")
export class AjustePonto {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.ajustes)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador

    @Column({type: "date", nullable: false})
    data!: Date

    @Column({type: "varchar"})
    motivo!: string

    @ManyToOne(() => User, (user) => user.ajustesAprovador, { nullable: true})
    @JoinColumn({name: "aprovado_por"})
    aprovadoPor!: User

    @Column({type: "enum", enum: StatusAjuste})
    status!: StatusAjuste


}