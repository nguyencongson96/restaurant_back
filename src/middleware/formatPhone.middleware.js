import asyncWrapper from "#root/middleware/async.middleware.js";

const formatPhone = asyncWrapper((req, res, next) => {
  const phone = req.body.phone || req.query.phone;
  if (phone) {
    const trimPhone = phone ? phone.trim() : phone;
    const formatPhone = trimPhone.startsWith(0) ? `+84${trimPhone.slice(1)}` : trimPhone;
    req.phone = formatPhone;
  } else req.phone = phone;
  next();
});

export default formatPhone;
