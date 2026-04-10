import { Router } from "express";
import { appDataSource } from "../database/data-source";
import { UserController } from "../controllers/UserController.js";
import { UserService } from "../services/UserService.js";
import { validate } from "../middlewares/validateBody.js";
import { createUserSchema, updateUserSchema } from "../dto/user/CreateUserSchemaDTO";
import { ensureAuth } from "../middlewares/ensureAuth.js";
import { ensureRole } from "../middlewares/ensureRole.js";
import { UserRole } from "../types/roles";

const router = Router();

const usuarioService = new UserService(appDataSource);
const usuarioController = new UserController(usuarioService);

router.get("/", ensureAuth, ensureRole(UserRole.GESTOR), usuarioController.findAllUser.bind(usuarioController));
router.get("/:id", ensureAuth, ensureRole(Perfil.GESTOR, Perfil.SOLICITANTE) , usuarioController.findUserById.bind(usuarioController));
router.post("/", ensureAuth, validateBody(createUserSchema), usuarioController.createUser.bind(usuarioController));
router.put("/:id", ensureAuth, validateBody(updateUserSchema), usuarioController.updateUser.bind(usuarioController));

export default router;