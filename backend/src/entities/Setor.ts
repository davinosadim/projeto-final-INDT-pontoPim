import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";



@Entity("setores")
export class Setores {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Setores, unique: true, name:"nome_Setor"})
    nomeSetor!: string

    @OneToMany(() => Colaborador, (colaborador) => colaborador.setores)
    colaboradores!: Colaborador[]
}