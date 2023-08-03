import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import Products from "#root/model/products.model.js";
import pipeline from "#root/config/pipeline.config.js";
import mongoose from "mongoose";

const handleProduct = {
  getAll: asyncWrapper(async (req, res) => {
    const { page, random, category } = req.query;
    const foundProduct = await Products.aggregate(
      pipeline({ match: { category }, facet: { page, random } }, req.fieldSelect)
    );
    return res.status(200).json(foundProduct[0]);
  }),

  getOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;

    // Find a reservation by id using find method of Orders model
    const foundProduct = await Products.aggregate(
      pipeline(
        {
          match: { _id: new mongoose.Types.ObjectId(id) },
          project: true,
        },
        req.fieldSelect
      )
    );

    return !foundProduct
      ? res.status(404).json(`There is no order match id ${_id}`)
      : res.status(200).json(foundProduct[0]);
  }),

  addNew: asyncWrapper(async (req, res) => {
    let newProduct = await Products.create(req.body);
    return res.status(201).json(newProduct);
  }),

  updateOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Products.findByIdAndUpdate(
      id,
      Object.assign(req.body, { updatedAt: new Date() }),
      { runValidators: true, upsert: true, new: true }
    );
    return res.status(200).json(foundProduct);
  }),

  deleteOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Products.findByIdAndDelete(id);
    return res.status(200).json(foundProduct);
  }),

  deleteMany: asyncWrapper(async (req, res) => {
    const { id } = req.body;
    const deleteProduct = await Products.deleteMany({ _id: id });
    return res.status(200).json(deleteProduct);
  }),
};

export default handleProduct;
