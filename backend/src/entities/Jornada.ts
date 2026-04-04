import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Turno } from "../types/turno";
import { Colaborador } from "./Colaborador";



@Entity("jornadas")
export class Jornada {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Turno})
    turno!: Turno

    @Column({type: "numeric", nullable: false, name:"carga_horaria_dia"})
    cargaHorariaDia!: number

    @Column({type: "time", nullable: false, name: "horario_entrada"})
    horarioEntrada!: string

    @Column({type: "time", nullable: false, name: "horario_saida"})
    horarioSaida!: string

    @OneToMany(() => Colaborador, (colaborador) => colaborador.jornada)
    colaboradores!: Colaborador[]

}