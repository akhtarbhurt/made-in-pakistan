import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { deleteSettingController, getSettingController, settingController, updateSettingController } from "../controllers/setting.controller";

const router = Router();

router.route('/setting').post(upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
]), settingController);

router.route('/setting').get(getSettingController)

router.route('/setting/:id').put(upload.fields([
    { name: "headerLogo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 }
]), updateSettingController);

router.route('/setting/:id').delete(deleteSettingController)

export default router;
