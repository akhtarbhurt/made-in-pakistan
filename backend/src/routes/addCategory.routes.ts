import { addCategoryController, deleteAddCategoryController, getAddCategoryController, updateAddCategoryController } from "../controllers/addCategory.controllers"
import express from "express"
const router = express.Router()

router.route('/addCategory').post(addCategoryController)
router.route('/addCategory').get(getAddCategoryController)
router.route('/addCategory/:id').put(updateAddCategoryController)
router.route('/addCategory/:id').delete(deleteAddCategoryController)

export default router