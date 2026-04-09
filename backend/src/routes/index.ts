import { Router } from "express";
import userRouter from "./userRoutes"
import authRouter from "./authRoutes";

const routes = Router()

routes.use("/users", userRouter)
routes.use("/auth/login", authRouter)



export default routes


