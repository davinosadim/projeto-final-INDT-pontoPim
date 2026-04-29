import { Router } from "express";
import { EquipeController } from "../controllers/EquipeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ensureRole } from "../middlewares/ensureRole";
import { UserRole } from "../types/roles";

const equipeRoutes = Router()
const controller = new EquipeController()

equipeRoutes.get("/hoje", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), controller.getEquipeHoje.bind(controller))

export default equipeRoutes
