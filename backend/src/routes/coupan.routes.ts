import { couponController, deleteCouponController, getCouponByIdController, updateCouponController } from "../controllers/coupan.controllers"
import express from "express"

const router = express.Router()

router.route('/coupon').post(couponController)
router.route('/coupon').get(getCouponByIdController)
router.route('/coupon/:id').put(updateCouponController)
router.route('/coupon/:id').delete(deleteCouponController)

export default router