import mongoose from "mongoose";
import validator from "validator";
import _throw from "#root/utils/throw.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: "Name required",
    validate: (value) => {
      !validator.isAlpha(value, "vi-VN", { ignore: " -" }) && _throw(400, "Invalid name");
    },
  },
  phone: {
    type: String,
    trim: true,
    required: "Phone required",
    validate: (value) => {
      (validator.isEmpty(value) || !validator.isMobilePhone(value, "vi-VN")) && _throw(400, "Invalid phone");
    },
  },
});

const Users = mongoose.model("Users", userSchema);

export default Users;
