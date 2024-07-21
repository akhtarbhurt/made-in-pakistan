import { upload } from "../middleware/upload.middleware"
import { deletePostController, getPostController, postController, updatePostController } from "../controllers/post.controllers"
import express from "express"

const router = express.Router()

router.route("/post").post( upload.single("postImage"), postController)
router.route("/post").get(getPostController)
router.route("/post/:id").put( upload.single("postImage"), updatePostController)
router.route("/post/:id").delete(deletePostController)

export default router