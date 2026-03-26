import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada.js";
import { join } from "node:path";

@Entity("colaboradores")
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

    @Column({type: "boolean"})
    ativo!: boolean

    @ManyToOne(() => Jornada, (jornada) => jornada.colaboradores)
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada


}