import express from "express"
import { upload } from "../middleware/upload.middleware"
import { bannerControllers, deleteBannerController, getBannerController, updateBannerControllers } from "../controllers/banners.controllers"

const router = express.Router()

router.route('/banner').post(upload.single("bannerImage"), bannerControllers)
router.route('/banner/:id').put(upload.single("bannerImage"), updateBannerControllers)
router.route("/banner/:id").delete(deleteBannerController)
router.route("/banner").get(getBannerController)
export default router