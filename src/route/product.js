import express from "express";
import productController from "#root/controller/product/product.controller.js";
const router = express.Router();

router
  .route("/")
  .get(productController.getAll)
  .post(productController.addNew)
  .delete(productController.deleteMany);
router
  .route("/:id")
  .get(productController.getOne)
  .put(productController.updateOne)
  .delete(productController.deleteOne);

export default router;
