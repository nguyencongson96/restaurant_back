import express from "express";
import eventController from "#root/controller/event/event.controller.js";
const router = express.Router();

router.route("/").get(eventController.getAll).post(eventController.addNew);

router
  .route("/:id")
  .get(eventController.getOne)
  .put(eventController.updateOne)
  .delete(eventController.deleteOne);

export default router;
