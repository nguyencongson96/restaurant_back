import Places from "#root/model/places.model.js";
import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";

const placeController = {
  getCityList: asyncWrapper(async (req, res) => {
    const result = await Places.aggregate([
      { $sort: { city: 1 } },
      { $facet: { total: [{ $count: "total" }], list: [{ $project: { city: 1, _id: 0 } }] } },
      { $unwind: "$total" },
      { $unwind: "$list" },
      { $replaceRoot: { newRoot: { total: "$total.total", pages: "$pages", list: "$list.city" } } },
      {
        $group: {
          _id: "$total",
          list: { $push: "$list" },
        },
      },
      { $unset: "_id" },
    ]);

    return res.status(200).json(result[0].list);
  }),
  getDistrictList: asyncWrapper(async (req, res) => {
    const { city } = req.query;
    const result = await Places.findOne({ city }, { district: 1, _id: 0 });
    return res.status(200).json(result.district);
  }),
};

export default placeController;
