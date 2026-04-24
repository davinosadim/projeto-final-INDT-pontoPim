import { Router } from "express";
import { appDataSource } from "../database/data-source";
import { validate } from "../middlewares/validateBody";
import { ensureAuth } from "../middlewares/ensureAuth";
import { ensureRole } from "../middlewares/ensureRole";
import { UserRole } from "../types/roles";
import { ColaboradorContoller } from "../controllers/ColaboradorController";
import { createColaboradorSchema } from "../dto/colaborador/CreateColaboradorSchemaDTO";

const router = Router();


const colaboradorController = new ColaboradorContoller()


router.get("/", ensureAuth, ensureRole(UserRole.GESTOR), colaboradorController.findAllUser.bind(colaboradorController));
router.post("/", validate(createColaboradorSchema), colaboradorController.create.bind(colaboradorController));


export default router;