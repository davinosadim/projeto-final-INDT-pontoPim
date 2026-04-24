import { Router } from "express";
import { RegistroPontoController } from "../controllers/RegistroPontoController";
import { validate } from "../middlewares/validateBody";
import { createRegistroPontoSchemaDTO } from "../dto/registro-ponto.ts/CreateRegistroPontoSchemaDTO";
import { authMiddleware } from "../middlewares/authMiddleware";

const registroPontoRoutes = Router()
const controller = new RegistroPontoController()

registroPontoRoutes.post("/", authMiddleware, validate(createRegistroPontoSchemaDTO), controller.create.bind(controller))

export default registroPontoRoutes