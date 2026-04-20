import { Router } from "express";
import colaboradorRouter from "./colaboradorRoutes"
import authRouter from "./authRoutes";

const routes = Router();

routes.use("/colaborador", colaboradorRouter);
routes.use("/auth/login", authRouter);



export default routes;


