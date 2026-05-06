import { Router } from "express";
import { EquipeController } from "../controllers/EquipeController";
import { AjustePontoController } from "../controllers/AjustePontoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ensureRole } from "../middlewares/ensureRole";
import { UserRole } from "../types/roles";

const equipeRoutes = Router()
const controller = new EquipeController()
const ajustePontoController = new AjustePontoController()

equipeRoutes.get("/hoje", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), controller.getEquipeHoje.bind(controller))
equipeRoutes.get("/ajustes-ponto", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), ajustePontoController.listar.bind(ajustePontoController))
equipeRoutes.patch("/ajustes-ponto/:ajusteId", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), ajustePontoController.avaliar.bind(ajustePontoController))

export default equipeRoutes
