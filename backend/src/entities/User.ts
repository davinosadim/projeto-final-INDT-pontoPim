import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../types/roles";
import { RegistroPonto } from "./RegistroPonto";
import { AjustePonto } from "./AjustePonto";
import { Colaborador } from "./Colaborador";
import { RefreshToken } from "./RefreshToken";
import { Setores } from "../types/setores";



@Entity("user")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar"})
    nome!: string

    @OneToOne(() => Colaborador, (colaborador) => colaborador.user)
    colaborador!: Colaborador | null

    @Column({unique: true, nullable: false})
    email!: string

    @Column({type: "varchar", select: false})
    senha!: string

    @Column({type: "enum", enum: UserRole})
    role!: UserRole

    @Column({type: "enum", enum: Setores})
    setor!: Setores

    @OneToMany(() => RegistroPonto, (registro) => registro.registradoPor)
    registroFeitos!: RegistroPonto[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.aprovadoPor)
    ajustesAprovador!: AjustePonto[]

    @OneToMany(() => RefreshToken, (token) => token.user)
    tokens!: RefreshToken[]

    @CreateDateColumn()
    createdAt!: Date


    
}