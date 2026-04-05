import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Cargos } from "../types/cargos";



@Entity("cargos")
export class Cargo {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Cargos})
    cargo!: Cargos
}