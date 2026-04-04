import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada";
import { RegistroPonto } from "./RegistroPonto";
import { ResumoDiario } from "./ResumoDiario";
import { AjustePonto } from "./AjustePonto";
import { User } from "./User";
import { Setores } from "./Setor";

@Entity("colaboradores")
export class Colaborador {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar", nullable: false})
    nome!: string
    
    @Column({type: "varchar", nullable: false, unique: true})
    matricula!: string

    @OneToOne(() => User, (user) => user.colaborador)
    user!: User

    @Column({type: "varchar", nullable: false})
    cargo!: string

    @Column({type: "varchar", nullable: false})
    setor!: string

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

    @ManyToOne(() => Setores, (setor) => setor.colaboradores)
    @JoinColumn({name: "setor_id"})
    setores!: Setores


}