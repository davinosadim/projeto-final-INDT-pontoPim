import "reflect-metadata"
import { DataSource } from "typeorm";
import * as dotenv from "dotenv"
import { Colaborador } from "../entities/Colaborador";
import { Jornada } from "../entities/Jornada";
import { RegistroPonto } from "../entities/RegistroPonto";
import { ResumoDiario } from "../entities/ResumoDiario";
import { AjustePonto } from "../entities/AjustePonto";
import { RefreshToken } from "../entities/RefreshToken";

dotenv.config()

export const appDataSource = new DataSource({
    type: "postgres",
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    synchronize: true,
    logging: false,
    entities: [Colaborador, Jornada, RegistroPonto, ResumoDiario, AjustePonto, RefreshToken],
    migrations: [],
    subscribers: []
})
