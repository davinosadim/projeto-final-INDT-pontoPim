import { Router } from "express";
import { RegistroPontoController } from "../controllers/RegistroPontoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const registroPontoRoutes = Router()
const controller = new RegistroPontoController()

registroPontoRoutes.get("/hoje", authMiddleware, controller.getHoje.bind(controller))
registroPontoRoutes.post("/", authMiddleware, controller.create.bind(controller))

export default registroPontoRoutes
