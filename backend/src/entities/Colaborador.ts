import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Turno } from "../types/turno.js";

@Entity("colaborador")
export class Colaborarador {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar", nullable: false})
    nome!: string
    
    @Column({type: "varchar", nullable: false, unique: true})
    matricula!: string

    @Column({type: "varchar", nullable: false})
    cargo!: string

    @Column({type: "varchar", nullable: false})
    setor!: string

    @Column({type: "enum", enum: Turno})
    turno!: Turno


}