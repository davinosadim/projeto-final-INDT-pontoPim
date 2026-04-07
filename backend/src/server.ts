import dotenv from "dotenv"
import express from "express"
import { appDataSource } from "./database/data-source"
import authRouter from "./routes"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 6060

app.use(express.json())
app.use(authRouter)


appDataSource.initialize().then(() => {
    console.log("Data Base connect")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})