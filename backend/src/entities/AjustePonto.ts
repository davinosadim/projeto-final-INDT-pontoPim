import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador.js";


@Entity("ajustesPonto")
export class AjustePonto {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.ajustes)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador
}