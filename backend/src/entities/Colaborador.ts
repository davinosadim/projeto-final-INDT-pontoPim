import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada";
import { RegistroPonto } from "./RegistroPonto";
import { ResumoDiario } from "./ResumoDiario";
import { AjustePonto } from "./AjustePonto";
import { User } from "./User";
import { Setores } from "../types/setores";
import { Turno } from "../types/turno";
import { Cargos } from "../types/cargos";
import { HoraExtra } from "./hora_extra";
import { Cargo } from "./Cargos";
import { Setor } from "./Setor";

@Entity("colaboradores")
export class Colaborador {

    @PrimaryGeneratedColumn("uuid")
    id_colaborador!: string

    @Column({type: "varchar", nullable: false})
    nome!: string
    
    @Column({type: "varchar", nullable: false, unique: true})
    matricula!: string

    @OneToOne(() => Cargo, {nullable: false})
    @JoinColumn({name: "cargo_id"})
    cargo!: Cargo

    @ManyToOne(() => Setor , (setor) => setor.colaboradores)
    @JoinColumn({name: "id_setor"})
    setor!: Setor

    @Column({type: "boolean", default: true})
    ativo!: boolean

    @OneToOne(() => User, {nullable: true})
    @JoinColumn({name: "user_id"})
    user!: User | null

    @ManyToOne(() => Jornada, (jornada) => jornada.colaboradores)
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada

    @OneToMany(() => RegistroPonto, (registros) => registros.colaborador_id)
    registros!: RegistroPonto[]

    @OneToMany(() => ResumoDiario, (resumo) => resumo.colaborador)
    resumos!: ResumoDiario[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.colaborador)
    ajustes!: AjustePonto[]

    @OneToMany(() => HoraExtra, (horaExtra) => horaExtra.colaboradorId)
    horasExtras!: HoraExtra[]



}