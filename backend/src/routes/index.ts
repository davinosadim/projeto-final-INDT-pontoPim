import { Router } from "express";
import userRouter from "./userRoutes"
import authRouter from "./authRoutes";
import registroPontoRoutes from "./registroPontoRoutes";

const routes = Router()

routes.use("/users", userRouter)
routes.use("/auth/login", authRouter)
routes.use("/registroPonto", registroPontoRoutes)



export default routes


