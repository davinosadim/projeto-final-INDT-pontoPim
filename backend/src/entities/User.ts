import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../types/roles";
import { RegistroPonto } from "./RegistroPonto";
import { AjustePonto } from "./AjustePonto";
import { Colaborador } from "./Colaborador";
import { RefreshToken } from "./RefreshToken";
import { Setores } from "../types/setores";
import { Setor } from "./Setor";



@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id_user!: string

    @Column({type: "varchar"})
    nome!: string

    @OneToOne(() => Colaborador, (colaborador) => colaborador.user)
    @JoinColumn({name: "id_colaborador"})
    colaborador!: Colaborador | null

    @Column({unique: true, nullable: false})
    email!: string

    @Column({type: "varchar", select: false})
    senha!: string

    @Column({type: "enum", enum: UserRole})
    role!: UserRole

    @OneToOne(() => Setor, {nullable: true})
    @JoinColumn({name: "id_setor"})
    setor!: Setor | null
    

    @OneToMany(() => RegistroPonto, (registro) => registro.registradoPor)
    registroFeitos!: RegistroPonto[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.aprovadoPor)
    ajustesAprovado!: AjustePonto[]

    @OneToMany(() => RefreshToken, (token) => token.user)
    @JoinColumn({name: "id_refresh"})
    token!: RefreshToken[]

    @CreateDateColumn({type: "timestamptz"})
    createdAt!: Date


    
}