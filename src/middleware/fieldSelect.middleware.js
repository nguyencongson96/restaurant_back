import asyncWrapper from "#root/middleware/async.middleware.js";
import generalConfig from "#root/config/general.config.js";

const fieldSelect = asyncWrapper((req, res, next) => {
  const { field } = req.query;
  const urlPath = req.url;

  if (field) req.fieldSelect = field.split(",").map((item) => item.trim());
  else {
    const { order, info, product, event } = generalConfig;
    req.fieldSelect = urlPath.includes("reservation")
      ? order.key
      : urlPath.includes("info")
      ? Object.keys(info.key)
      : urlPath.includes("product")
      ? product.key
      : urlPath.includes("event")
      ? event.key
      : [];
  }

  next();
});

export default fieldSelect;
