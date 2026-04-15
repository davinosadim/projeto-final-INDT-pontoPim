import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Turno } from "../types/turno";
import { Colaborador } from "./Colaborador";
import { ResumoDiario } from "./ResumoDiario";



@Entity("jornadas")
export class Jornada {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Turno})
    turno!: Turno

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false, name:"carga_horaria_dia"})
    cargaHorariaDia!: number

    @Column({type: "time", nullable: false, name: "horario_entrada"})
    horarioEntrada!: string

    @Column({type: "time", nullable: false, name: "horario_saida"})
    horarioSaida!: string

    @OneToMany(() => Colaborador, (colaborador) => colaborador.jornada)
    colaboradores!: Colaborador[]

    @OneToMany(() => ResumoDiario, (resumo) => resumo.horas_esperadas)
    resumos!: ResumoDiario[]


}