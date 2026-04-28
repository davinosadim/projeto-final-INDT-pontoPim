import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { RefreshTokenService } from "../services/RefreshTokenService";
import { AuthService } from "../services/AuthService";
import { LogoutService } from "../services/LogoutService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createUserSchema } from "../dto/user/CreateUserSchemaDTO";
import { validate } from "../middlewares/validateBody";
import { loginSchemaDTO } from "../dto/login/LoginSchemaDTO";
import { refreshSchema } from "../dto/auth/AuthDTO";

const refreshTokenService: RefreshTokenService = new RefreshTokenService();
const authService: AuthService = new AuthService();
const logoutService: LogoutService = new LogoutService();
const authController: AuthController = new AuthController(authService, refreshTokenService, logoutService);
const authRouter = Router();


authRouter.post("/login", validate(loginSchemaDTO), authController.login.bind(authController));
authRouter.post("/refresh", validate(refreshSchema), authController.refresh.bind(authController));
authRouter.post("/logout", authMiddleware, authController.logout.bind(authController));
//authRouter.post("/register", validate(createUserSchema), authController.register.bind(authController));





export default authRouter