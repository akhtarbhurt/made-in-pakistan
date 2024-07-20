import { tagController, deleteTagController, getTagController, updateTagController } from "../controllers/tag.controller"
import express from "express"
const router = express.Router()

router.route('/tag').post(tagController)
router.route('/tag').get(getTagController)
router.route('/tag/:id').put(updateTagController)
router.route('/tag/:id').delete(deleteTagController)

export default router