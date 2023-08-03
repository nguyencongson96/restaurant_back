import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import Users from "#root/model/users.model.js";
import Orders from "#root/model/orders.model.js";
import pipeline from "#root/config/pipeline.config.js";
import mongoose from "mongoose";

const handleReservationByUser = {
  getAll: asyncWrapper(async (req, res) => {
    const { page, random } = req.query;

    const foundUser = await Users.findOne({ phone: req.phone });
    if (!foundUser) return res.status(204).json("You are new here");

    const foundOrder = await Orders.aggregate(
      pipeline(
        { match: { userId: foundUser._id }, lookup: ["location", "user"], facet: { page, random } },
        req.fieldSelect
      )
    );

    return !foundOrder ? res.status(204).json("There is no order yet") : res.status(200).json(foundOrder[0]);
  }),

  getOne: asyncWrapper(async (req, res) => {
    const { _id } = req.query;

    // Check if id parameter exists in request object
    const keyConfig = ["_id", "phone"];
    keyConfig.forEach((key) => {
      return !req.query[key] && _throw(400, `${key} required`);
    });

    // Find a user by phone number using findOne() method of Users model
    const foundUser = await Users.findOne({ phone: req.phone });
    if (!foundUser) return res.status(204).json("You are new here");

    // Find a reservation by id using find method of Orders model
    const foundOrder = await Orders.aggregate(
      pipeline(
        {
          match: { _id: new mongoose.Types.ObjectId(_id), userId: foundUser._id },
          lookup: ["location", "user"],
          project: true,
        },
        req.fieldSelect
      )
    );

    return !foundOrder
      ? res.status(404).json(`There is no order match id ${_id}`)
      : res.status(200).json(foundOrder[0]);
  }),

  addNew: asyncWrapper(async (req, res) => {
    const { bookingName, locationId, numberOfPeople, date, time } = req.body;

    // Create a new order object with locationId and numberOfPeople properties
    let newOrder = new Orders({ bookingName, locationId, numberOfPeople, date, time });

    const bookingTime = new Date(date + " " + time);
    bookingTime < new Date() && _throw(400, { time: "Cannot book time in the past" });

    // Find or create a user in the database using Mongoose's findOneAndUpdate() method
    const foundUser = await Users.findOneAndUpdate(
      { phone: req.phone },
      { name: bookingName },
      { upsert: true, runValidators: true, new: true, returnDocument: "after" }
    );

    // Assign the user ID to the new order object and save it to the database with a status of "success"
    Object.assign(newOrder, { userId: foundUser._id, status: "success" });
    await newOrder.save();

    // Return a JSON response with a status code of 201 and the new order object as its body
    return res.status(201).json(newOrder);
  }),
};

export default handleReservationByUser;
