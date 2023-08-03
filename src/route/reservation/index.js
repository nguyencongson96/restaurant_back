import express from "express";
import adminRoute from "#root/route/reservation/admin.js";
import userRoute from "#root/route/reservation/user.js";
const router = express.Router();

router.use("/user", userRoute);
router.use("/admin", adminRoute);

export default router;
