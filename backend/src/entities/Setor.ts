import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Setores } from "../types/setores";



@Entity("setores")
export class Setor {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Setores, name:"nome_setor"})
    nomeSetor!: Setores

}