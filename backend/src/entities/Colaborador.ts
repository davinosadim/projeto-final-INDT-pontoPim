import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("colaborador")
export class Colaborarador {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar", nullable: false})
    nome!: string
    
    @Column({type: "varchar", nullable: false, unique: true})
    matricula!: string
}