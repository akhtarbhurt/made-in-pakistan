import { reviewController, deleteReviewController, getReviewController, updateReviewController } from "../controllers/review.controllers"
import express from "express"
const router = express.Router()

router.route('/Review').post(reviewController)
router.route('/Review').get(getReviewController)
router.route('/Review/:id').put(updateReviewController)
router.route('/Review/:id').delete(deleteReviewController)

export default router