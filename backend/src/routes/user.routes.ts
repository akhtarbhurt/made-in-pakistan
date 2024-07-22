import { Router } from "express";
import { getCurrentUser, logoutUser, refreshAccessToken, userLogin, userRegistration } from "../controllers/user.controllers";
import validate from "../middleware/validator.middleware";
import { validator } from "../utils/validator";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyRole } from "../middleware/role.middleware";

const router = Router();

router.route("/register").post(validate(validator), userRegistration);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Example admin route
router.route("/admin-route").get(verifyJWT, verifyRole(["admin"]), (req, res) => {
    res.status(200).json({ message: "Admin content" });
});

// Example user route
router.route("/user-route").get(verifyJWT, verifyRole(["user", "admin"]), (req, res) => {
    res.status(200).json({ message: "User content" });
});

export default router;
