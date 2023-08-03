import Events from "#root/model/event.model.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import pipeline from "#root/config/pipeline.config.js";

const eventsController = {
  getAll: asyncWrapper(async (req, res) => {
    const { page } = req.query;
    const foundEvents = await Events.aggregate(
      pipeline({ lookup: ["location"], facet: { page } }, req.fieldSelect)
    );
    return res.status(200).json(foundEvents[0]);
  }),
  getOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundEvent = await Events.findById(id);
    return res.status(200).json(foundEvent);
  }),
  addNew: asyncWrapper(async (req, res) => {
    let newEvent = await Events.create(req.body);
    return res.status(201).json(newEvent);
  }),
  updateOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundEvent = await Events.findByIdAndUpdate(
      id,
      Object.assign(req.body, { updatedAt: new Date() }),
      { runValidators: true, upsert: true, new: true }
    );
    return res.status(200).json(foundEvent);
  }),
  deleteOne: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundEvent = await Events.findByIdAndDelete(id);
    return res.status(200).json(foundEvent);
  }),
};

export default eventsController;
