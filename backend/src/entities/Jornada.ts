import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Turno } from "../types/turno.js";

import { Colaborarador } from "./Colaborador.js";



@Entity("jornadas")
export class Jornada {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "enum", enum: Turno})
    turno!: Turno

    @Column({type: "numeric", nullable: false})
    cargaHorariaDia!: number

    @Column({type: "time", nullable: false})
    horarioEntrada!: string

    @Column({type: "time", nullable: false})
    horarioSaida!: string

    @OneToMany(() => Colaborarador, (colaborador) => colaborador.jornada)
    colaboradores!: Colaborarador[]

}