import { deleteOrderController, getOrderController, orderController, updateOrderController } from "../controllers/order.controllers"
import express from "express"

const router = express.Router()

router.route("/order").post(orderController)
router.route("/order/:id").patch(updateOrderController)
router.route("/order/:id").delete(deleteOrderController)
router.route("/order").get(getOrderController)


export default router