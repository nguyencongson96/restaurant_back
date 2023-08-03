import mongoose from "mongoose";
import validator from "validator";
import Places from "#root/model/places.model.js";
import _throw from "#root/utils/throw.js";

const infoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "required name",
    trim: true,
    validate: (value) => {
      !validator.isAlpha(value, "vi-VN", { ignore: " -" }) && _throw(400, "Invalid name");
    },
  },
  phone: {
    type: String,
    required: "required phone",
    trim: true,
    validate: (value) => {
      !validator.isMobilePhone(value, "vi-VN") && _throw(400, "Invalid phone");
    },
  },
  email: {
    type: String,
    required: "required email",
    validate: (value) => {
      !validator.isEmail(value) && _throw(400, "Invalid email");
    },
  },
  time: [
    {
      open: {
        type: String,
        required: "open time required",
        validate: (value) => {
          !validator.isTime(value, { hourFormat: "hour24", mode: "default" }) && _throw(400, "Invalid Time");
        },
      },
      close: {
        type: String,
        required: "close time required",
        validate: (value) => {
          !validator.isTime(value, { hourFormat: "hour24", mode: "default" }) && _throw(400, "Invalid Time");
        },
      },
    },
  ],
  location: [
    {
      city: {
        type: String,
        required: "city required",
        validate: async function (value) {
          const foundCity = await Places.findOne({ city: value });
          !foundCity && _throw(400, "Invalid City");
        },
        ref: "Places",
      },
      district: {
        type: String,
        required: "district required",
        ref: "Places",
        validate: async function (value) {
          const foundCity = await Places.findOne({ city: this.city });
          if (foundCity) {
            const districtArr = foundCity.district;
            districtArr.every((item) => item.localeCompare(value) !== 0) &&
              _throw(400, `${value} is not in ${city} city`);
          }
        },
      },
      detail: {
        type: String,
        required: "need detail location",
      },
    },
  ],
  description: {
    type: String,
  },
  image: [{ type: String }],
  password: {
    type: String,
    required: "required password",
    validate: (value) => {
      validator.isStrongPassword(value);
    },
  },
  accessToken: {
    type: String,
  },
});

const Info = mongoose.model("Info", infoSchema);

export default Info;
