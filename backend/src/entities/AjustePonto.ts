import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @CreateDateColumn({type: "date", nullable: false})
    data!: Date

    @Column({type: "varchar"})
    motivo!: string

    @ManyToOne(() => User, (user) => user.ajustesAprovado, { nullable: true})
    @JoinColumn({name: "aprovado_por"})
    aprovadoPor!: User

    @Column({type: "enum", enum: StatusAjuste})
    status!: StatusAjuste

    @Column({ type: "varchar", length: 255, nullable: true })
    comentario!: string | null;


}