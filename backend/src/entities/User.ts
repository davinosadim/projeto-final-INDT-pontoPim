import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../types/roles.js";
import { RegistroPonto } from "./RegistroPonto.js";
import { AjustePonto } from "./AjustePonto.js";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    user!: string

    @Column()
    nome!: string

    @Column({unique: true})
    matricula!: string

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