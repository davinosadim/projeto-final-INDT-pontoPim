import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../types/roles";
import { RegistroPonto } from "./RegistroPonto";
import { AjustePonto } from "./AjustePonto";
import { Colaborador } from "./Colaborador";



@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    user!: string

    @Column()
    nome!: string

    @OneToOne(() => Colaborador, (colaborador) => colaborador.user)
    @JoinColumn({name: "colaborador_id"})
    colaborador!: Colaborador

    @Column({unique: true, nullable: false})
    email!: string

    @Column()
    senha!: string

    @Column({type: "enum", enum: UserRole})
    role!: UserRole

    @Column()
    setor!: string

    @OneToMany(() => RegistroPonto, (registro) => registro.registradoPor)
    registroFeitos!: RegistroPonto[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.aprovadoPor)
    ajustesAprovador!: AjustePonto[]


    
}