import dotenv from "dotenv"
import express from "express"
import { appDataSource } from "./database/data-source"
import routes from "./routes"
import { erroHandler } from "./middlewares/errorHandler"
import cors from "cors"



dotenv.config()

const app = express()

const PORT = process.env.PORT ?? 6060;

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}))

app.use(express.json());
app.use(routes);
app.use(erroHandler);



appDataSource.initialize().then(() => {
    console.log("Banco conectado")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})