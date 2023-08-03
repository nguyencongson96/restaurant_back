import _throw from "#root/utils/throw.js";
import validator from "validator";
import Info from "#root/model/info.model.js";

export default function timeCheck(type, value) {
  switch (type) {
    case "date":
      // Check if the value passed in is a valid date
      !validator.isDate(value) && _throw(400, "Invalid Date");

      // Calculate the maximum time bookable and current date
      const maxTimeBook = parseInt(process.env.MAXDAYBOOK) * 24 * 60 * 60 * 1000;
      const now = new Date(),
        currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      // Check if the date is in the past or more than 3 days in advance
      value < currentDate && _throw(400, "Cannot book day in the past");
      value > currentDate + maxTimeBook && _throw(400, "Can only book in advance 3 days");
      break;

    case "time":
      !validator.isTime(value, { hourFormat: "hour24", mode: "default" }) &&
        _throw(400, "Invalid Time format");
      break;

    default:
      _throw(400, "type is required");
      break;
  }
}
