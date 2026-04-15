import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cargos } from "../types/cargos";
import { Colaborador } from "./Colaborador";



@Entity("cargos")
export class Cargo {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Cargos})
    cargo!: Cargos

    @OneToOne(() => Colaborador, colaborador => colaborador.cargo)
    @JoinColumn({name: "id_colaborador"})
    colaborador!: Colaborador
}