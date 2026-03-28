import { DataSource } from "typeorm";
import { Colaborador } from "../entities/Colaborador.js";
import { Jornada } from "../entities/Jornada.js";
import { RegistroPonto } from "../entities/RegistroPonto.js";
import { AjustePonto } from "../entities/AjustePonto.js";
import { ResumoDiario } from "../entities/ResumoDiario.js";
import { User } from "../entities/User.js";

export const appDataSource = new DataSource({
    type: "postgres",
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    synchronize: true,
    logging: false,
    entities: [Colaborador, Jornada, RegistroPonto, AjustePonto, ResumoDiario, User],
    migrations: [],
    subscribers: []
    



})

