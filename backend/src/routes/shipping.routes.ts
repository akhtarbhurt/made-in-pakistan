import { shippingController, deleteShippingController, getShippingController, updateShippingController } from "../controllers/shipping.controllers"
import express from "express"
const router = express.Router()

router.route('/shipping').post(shippingController)
router.route('/shipping').get(getShippingController)
router.route('/shipping/:id').put(updateShippingController)
router.route('/shipping/:id').delete(deleteShippingController)

export default router