import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Jornada } from "./Jornada";
import { RegistroPonto } from "./RegistroPonto";
import { ResumoDiario } from "./ResumoDiario";
import { AjustePonto } from "./AjustePonto";
import { RefreshToken } from "./RefreshToken";
import { Cargos } from "../types/cargos";
import { Setores } from "../types/setores";
import { UserRole } from "../types/roles";

@Entity("colaboradores")
export class Colaborador {

    @PrimaryGeneratedColumn("uuid")
    id_colaborador!: string

    @Column({ type: "varchar", nullable: false })
    nome!: string

    @Column({ unique: true, nullable: false })
    email!: string

    @Column({ type: "varchar", select: false })
    senha!: string

    @Column({ type: "varchar", nullable: false, unique: true })
    matricula!: string

    @Column({ type: "enum", enum: Cargos })
    cargo!: Cargos

    @Column({ type: "enum", enum: Setores })
    setor!: Setores

    @Column({ type: "enum", enum: UserRole, default: UserRole.COLABORADOR })
    perfil!: UserRole

    @Column({ type: "boolean", default: true })
    ativo!: boolean

    @ManyToOne(() => Jornada, (jornada) => jornada.colaboradores, { nullable: true })
    @JoinColumn({ name: "jornada_id" })
    jornada!: Jornada

    @OneToMany(() => RegistroPonto, (registro) => registro.colaborador)
    registros!: RegistroPonto[]

    @OneToMany(() => ResumoDiario, (resumo) => resumo.colaborador)
    resumos!: ResumoDiario[]

    @OneToMany(() => AjustePonto, (ajuste) => ajuste.colaborador)
    ajustes!: AjustePonto[]

    @OneToMany(() => RegistroPonto, (registro) => registro.registradoPor)
    registroFeitos!: RegistroPonto[]

    @OneToMany(() => RefreshToken, (token) => token.colaborador)
    tokens!: RefreshToken[]
}
