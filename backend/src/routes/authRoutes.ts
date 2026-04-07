import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { RefreshTokenService } from "../services/RefreshTokenService";
import { AuthService } from "../services/AuthService";
import { LogoutService } from "../services/LogoutService";

const refreshTokenService: RefreshTokenService = new RefreshTokenService()
const authService: AuthService = new AuthService()
const logoutService: LogoutService = new LogoutService()
const authController: AuthController = new AuthController(authService, refreshTokenService, logoutService)
const authRouter = Router()


authRouter.post("/login", (req: Request, res: Response) => authController.login(req, res))





export default authRouter