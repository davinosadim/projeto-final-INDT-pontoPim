import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
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


    @Column({type: "enum", enum: StatusAjuste})
    status!: StatusAjuste

    @Column({ type: "varchar", length: 255, nullable: true })
    comentario!: string | null;


}