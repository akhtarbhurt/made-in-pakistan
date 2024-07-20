import express from "express";
import { upload } from "../middleware/upload.middleware"
import { categoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/category.controllers";

const router = express.Router();

router.route('/category').post(upload.single('categoryImage'), categoryController);
router.route('/category').get(getCategoryController);
router.route('/category/:id').delete(deleteCategoryController);
router.route('/category/:id').put(upload.single('categoryImage'), updateCategoryController);

export default router;
