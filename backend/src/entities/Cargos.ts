import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("cargos")
export class Cargos {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Cargos})
    cargo!: Cargos
}