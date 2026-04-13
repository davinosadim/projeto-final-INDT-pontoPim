import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada";
import { RegistroPonto } from "./RegistroPonto";
import { ResumoDiario } from "./ResumoDiario";
import { AjustePonto } from "./AjustePonto";
import { User } from "./User";
import { Setores } from "../types/setores";
import { Turno } from "../types/turno";
import { Cargos } from "../types/cargos";

@Entity("colaboradores")
export class Colaborador {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar", nullable: false})
    nome!: string
    
    @Column({type: "varchar", nullable: false, unique: true})
    matricula!: string

    @Column({type: "enum", enum: Cargos, nullable: false})
    cargo!: Cargos

    @Column({type: "enum", enum: Setores, nullable: false})
    setor!: Setores

    @Column({type: "enum", enum: Turno})
    turno!: Turno

    @OneToOne(() => User, {nullable: true})
    @JoinColumn({name: "user_id"})
    user!: User | null

    @Column({type: "boolean"})
    ativo!: boolean

    @ManyToOne(() => Jornada, (jornada) => jornada.colaboradores)
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada

    @OneToMany(() => RegistroPonto, (registros) => registros.colaborador)
    registros!: RegistroPonto[]

    @OneToMany(() => ResumoDiario, (resumo) => resumo.colaborador)
    resumos!: ResumoDiario[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.colaborador)
    ajustes!: AjustePonto[]



}