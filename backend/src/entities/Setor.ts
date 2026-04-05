import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";
import { Setores } from "../types/setores";



@Entity("setores")
export class Setor {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Setores, name:"nome_setor"})
    nomeSetor!: Setores

    @OneToMany(() => Colaborador, (colaborador) => colaborador.setores)
    colaboradores!: Colaborador[]
}