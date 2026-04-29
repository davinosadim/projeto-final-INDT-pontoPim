import { Router } from "express";
import colaboradorRouter from "./colaboradorRoutes"
import authRouter from "./authRoutes";
import registroPontoRoutes from "./registrarPontoRoutes"
import equipeRoutes from "./equipeRoutes"

const routes = Router();

routes.use("/colaborador", colaboradorRouter);
routes.use("/auth", authRouter);
routes.use("/registrarPonto", registroPontoRoutes)
routes.use("/equipe", equipeRoutes)

export default routes;


