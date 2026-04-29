import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "./Colaborador";


@Entity("refresh_token")
export class RefreshToken {

    @PrimaryGeneratedColumn("uuid")
    id_refresh!: string

    @Column({type: "varchar", unique: true})
    jti!: string

    @ManyToOne(() => Colaborador, (colaborador) => colaborador.tokens)
    @JoinColumn({name: "token_id"})
    colaborador!: Colaborador

    @CreateDateColumn()
    createdAt!: Date
}