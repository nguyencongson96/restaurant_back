import asyncWrapper from "#root/middleware/async.middleware.js";
import _throw from "#root/utils/throw.js";
import Info from "#root/model/info.model.js";
import generalConfig from "#root/config/general.config.js";
import jwt from "jsonwebtoken";

const keyConfig = generalConfig.info.key;

const handleInfo = {
  get: asyncWrapper(async (req, res) => {
    const { detail } = req.query;

    let allInfo;
    switch (Number(detail)) {
      case 0:
        allInfo = await Info.aggregate([
          { $unwind: "$location" },
          {
            $addFields: {
              location: {
                _id: "$location._id",
                summary: {
                  $concat: ["$location.detail", ", ", "$location.district", ", ", "$location.city"],
                },
              },
            },
          },
          // { $project: { "location.city": 0, "location.district": 0 } },
          {
            $group: {
              _id: "$name",
              ...req.fieldSelect
                .filter((item) => item !== "time")
                .reduce(
                  (obj, value) => Object.assign(obj, { [value]: { [`$${keyConfig[value]}`]: `$${value}` } }),
                  {}
                ),
              time: { $first: "$time" },
            },
          },
          // { $unset: "_id" },
          { $unwind: "$time" },
          { $addFields: { time: { summary: { $concat: ["$time.open", " - ", "$time.close"] } } } },
          {
            $group: {
              _id: "$name",
              ...req.fieldSelect
                .filter((item) => item !== "location")
                .reduce(
                  (obj, value) => Object.assign(obj, { [value]: { [`$${keyConfig[value]}`]: `$${value}` } }),
                  {}
                ),
              location: { $first: "$location" },
            },
          },
          { $unset: "_id" },
        ]);
        break;

      case 1:
        allInfo = await Info.find(
          {},
          req.fieldSelect.reduce((obj, item) => Object.assign(obj, { [item]: 1 }), { _id: 0 }, {})
        );
        break;

      default:
        break;
    }

    // Return a JSON response with a status code of 200 and the array of location objects as its body
    return allInfo ? res.status(200).json(allInfo[0]) : res.status(204).json("No Info");
  }),

  logIn: asyncWrapper(async (req, res) => {
    const { password } = req.body;
    const foundInfo = await Info.findOne({ password });
    !foundInfo && _throw(400, "wrong password");

    const accessToken = jwt.sign(
      {
        info: {
          user: foundInfo.name,
          password: password,
          roles: "admin",
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    foundInfo.accessToken = accessToken;
    await foundInfo.save();

    return res.status(200).json({ accessToken });
  }),

  update: asyncWrapper(async (req, res) => {
    const fieldUpdateArr = Object.keys(req.body);
    const foundInfo = await Info.findOne();

    fieldUpdateArr.forEach((item) => {
      const reqValue = req.body[item];

      switch (keyConfig[item]) {
        case "first":
          foundInfo[item] = reqValue;
          break;

        case "push":
          foundInfo[item] = reqValue.reduce((arr, subItem, index) => {
            const id = foundInfo[item][index]?._id;
            arr.push(id ? subItem : Object.assign(subItem, { _id: id }));
            return arr;
          }, []);
          break;

        default:
          break;
      }
    });

    await foundInfo.save();

    // Return the updated location
    return res.status(200).json(foundInfo);
  }),

  logOut: asyncWrapper(async (req, res) => {
    const foundInfo = await Info.findOneAndUpdate(
      {},
      { accessToken: "" },
      { runValidators: true, new: true, fields: { _id: 0, __v: 0 } }
    );
    return res.status(200).json(foundInfo);
  }),
};

export default handleInfo;
