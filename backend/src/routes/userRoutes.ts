import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validate} from "../middlewares/validateBody";
import { createUserSchema } from "../dto/user/CreateUserSchemaDTO";

const router = Router()
const userController = new UserController()

router.post("/", validate(createUserSchema), userController.create)

export default router