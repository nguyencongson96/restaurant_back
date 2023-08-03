import mongoose from "mongoose";
import validator from "validator";
import _throw from "#root/utils/throw.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "name required",
    validate: (value) => {
      !validator.isAlpha(value, "vi-VN", { ignore: " -/()" }) && _throw(400, "Invalid name");
    },
  },
  category: {
    type: String,
    default: "appertizers",
    validate: (value) => {
      !["appertizers", "salad&soups", "main"].includes(value) && _throw(400, "Invalid class");
    },
  },
  price: {
    type: Number,
    required: "price required",
    validate: (value) => {
      !Number(value) && _throw(400, "Invalid price");
    },
  },
  description: {
    type: String,
    required: "description required",
  },
  image: [
    {
      type: String,
      required: "image required",
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Products = mongoose.model("Products", productSchema);

export default Products;
