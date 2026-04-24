import { Router } from "express";
import colaboradorRouter from "./colaboradorRoutes"
import authRouter from "./authRoutes";
import registroPontoRoutes from "./registrarPontoRoutes"

const routes = Router();

routes.use("/colaborador", colaboradorRouter);
routes.use("/auth/login", authRouter);
routes.use("/registrarPonto", registroPontoRoutes)



export default routes;


