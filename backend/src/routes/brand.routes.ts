import { brandController, deleteBrandController, getBrandController, updateBrandController } from "../controllers/brand.controllers"
import express from "express"
const router = express.Router()

router.route('/brand').post(brandController)
router.route('/brand').get(getBrandController)
router.route('/brand/:id').put(updateBrandController)
router.route('/brand/:id').delete(deleteBrandController)

export default router