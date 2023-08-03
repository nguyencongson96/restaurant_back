import mongoose from "mongoose";
import validator from "validator";
import _throw from "#root/utils/throw.js";
import Info from "#root/model/info.model.js";
import generalConfig from "#root/config/general.config.js";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "title required",
    validate: (value) => {
      !validator.isAlphanumeric(value, "vi-VN", { ignore: " -%" }) && _throw(400, "Invalid title");
    },
  },
  category: {
    type: String,
    default: "event",
    validate: (value) => {
      (!validator.isAlphanumeric(value, "vi-VN", { ignore: " -" }) ||
        !generalConfig.event.category.includes(value)) &&
        _throw(400, "Invalid class");
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
  beginAt: {
    type: Date,
    default: new Date(),
  },
  endAt: {
    type: Date,
    default: new Date(),
  },
  locationId: {
    type: mongoose.ObjectId,
    required: "location required",
    validate: async (id) => {
      (await Info.findOne()).location.includes(id) && _throw(400, "Location cannot found");
    },
  },
});

const Events = mongoose.model("Events", eventSchema);

export default Events;
