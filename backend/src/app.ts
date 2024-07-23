import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"


const app = express()

app.use(express())
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: "16kb"}))
app.use(cookieParser())

import banner from "./routes/banner.routes"
import { errorHandler } from "./middleware/errorHandler.middleware"
import category from "./routes/category.routes"
import brand from "./routes/brand.routes"
import shipping from "./routes/shipping.routes"
import order from "./routes/order.routes"
import tag from "./routes/tag.routes"
import setting from "./routes/setting.routes"
import coupon from "./routes/coupan.routes"
import post from "./routes/post.routes"
import product from "./routes/product.route"
import user from "./routes/user.routes"
import review from "./routes/review.routes"

app.use("/api", banner )
app.use("/api", category )
app.use("/api", brand)
app.use("/api", shipping)
app.use("/api", order )
app.use("/api", tag )
app.use("/api", setting)
app.use("/api", coupon)
app.use("/api", post )
app.use("/api", product )
app.use("/api", user )
app.use("/api", review )

//this is error handling middleware

app.use(errorHandler)


export {app}