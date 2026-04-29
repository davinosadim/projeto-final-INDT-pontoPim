import { Router } from "express";
import { validate } from "../middlewares/validateBody";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ensureRole } from "../middlewares/ensureRole";
import { UserRole } from "../types/roles";
import { ColaboradorController } from "../controllers/ColaboradorController";
import { createColaboradorSchema } from "../dto/colaborador/CreateColaboradorSchemaDTO";

const router = Router();
const colaboradorController = new ColaboradorController()

router.get("/", authMiddleware, ensureRole(UserRole.GESTOR, UserRole.RH), colaboradorController.findAll.bind(colaboradorController));
router.post("/", authMiddleware, ensureRole(UserRole.RH), validate(createColaboradorSchema), colaboradorController.create.bind(colaboradorController));
router.patch("/:id/status", authMiddleware, ensureRole(UserRole.RH), colaboradorController.toggleStatus.bind(colaboradorController));

export default router;
