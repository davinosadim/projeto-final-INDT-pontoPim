import { DataSource } from "typeorm";
import { Colaborarador } from "../entities/Colaborador.js";
import { Jornada } from "../entities/Jornada.js";
import { RegistroPonto } from "../entities/RegistroPonto.js";

export const appDataSource = new DataSource({
    type: "postgres",
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    synchronize: true,
    logging: false,
    entities: [Colaborarador, Jornada, RegistroPonto],
    migrations: [],
    subscribers: []
    



})

