import reservationAdminController from "#root/controller/reservation/admin.controller.js";
import express from "express";
const router = express.Router();

router.route("/").get(reservationAdminController.getAll).put(reservationAdminController.updateMany);
router.route("/:id").get(reservationAdminController.getOne).put(reservationAdminController.updateOne);

export default router;
