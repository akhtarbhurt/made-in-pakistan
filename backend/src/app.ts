import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"


const app = express()

app.use(express())
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: "16kb"}))
app.use(cookieParser())

import banner from "./routes/banner.routes"
import { errorHandler } from "./middleware/errorHandler.middleware"

app.use("/api", banner )
app.use(errorHandler)


export {app}