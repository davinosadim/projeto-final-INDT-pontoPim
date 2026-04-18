import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada";
import { RegistroPonto } from "./RegistroPonto";
import { ResumoDiario } from "./ResumoDiario";
import { AjustePonto } from "./AjustePonto";
import { HoraExtra } from "./Hora_extra";
import { Cargo } from "./Cargos";
import { Setor } from "./Setor";
import { RefreshToken } from "./RefreshToken";

@Entity("colaboradores")
export class Colaborador {

    @PrimaryGeneratedColumn("uuid")
    id_colaborador!: string

    @Column({type: "varchar", nullable: false})
    nome!: string

    @Column({unique: true, nullable: false})
    email!: string

    @Column({type: "varchar", select: false})
    senha!: string
    
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

    @ManyToOne(() => Jornada, (jornada) => jornada.colaboradores, { cascade: true })
    @JoinColumn({name: "jornada_id"})
    jornada!: Jornada

    @OneToMany(() => RegistroPonto, (registros) => registros.colaborador)
    registros!: RegistroPonto[]

    @OneToMany(() => ResumoDiario, (resumo) => resumo.colaborador)
    resumos!: ResumoDiario[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.colaborador)
    ajustes!: AjustePonto[]

    @OneToMany(() => HoraExtra, (horaExtra) => horaExtra.colaboradorId)
    horasExtras!: HoraExtra[]

    @OneToMany(() => RegistroPonto, (registro) => registro.registradoPor)
    registroFeitos!: RegistroPonto[]

    @OneToMany(() => RefreshToken, (token) => token.colaborador)
    token!: RefreshToken



}