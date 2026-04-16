import { Router } from "express";
import { RegistroPontoController } from "../controllers/RegistroPontoController";
import { validate } from "../middlewares/validateBody";
import { createRegistroPontoSchemaDTO } from "../dto/registro-ponto.ts/CreateRegistroPontoSchemaDTO";

const registroPontoRoutes = Router()
const controller = new RegistroPontoController()

registroPontoRoutes.post("/", validate(createRegistroPontoSchemaDTO), controller.create.bind(controller))

export default registroPontoRoutes