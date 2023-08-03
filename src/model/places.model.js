import mongoose from "mongoose";
import _throw from "#root/utils/throw.js";

const placeSchema = new mongoose.Schema({
  city: {
    type: String,
    required: "city required",
  },
  district: [
    {
      type: String,
      required: "district required",
    },
  ],
});

const Places = mongoose.model("Places", placeSchema);

export default Places;
