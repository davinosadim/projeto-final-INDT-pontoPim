import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Setores } from "../types/setores";
import { Colaborador } from "./Colaborador";



@Entity("setores")
export class Setor {
    @PrimaryGeneratedColumn("uuid")
    id_setor!: string

    @Column({type: "enum", enum: Setores, name:"nome_setor"})
    nomeSetor!: Setores

    @OneToMany(() => Colaborador, (colaborador) => colaborador.setor)
    @JoinColumn({name: "id_colaborador"})
    colaboradores!: Colaborador[]

}