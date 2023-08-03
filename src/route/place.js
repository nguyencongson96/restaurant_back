import express from "express";
import placeController from "#root/controller/place/place.controller.js";
const router = express.Router();

router.route("/city").get(placeController.getCityList);
router.route("/district").get(placeController.getDistrictList);

export default router;
