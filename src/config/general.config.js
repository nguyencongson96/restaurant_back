const generalConfig = {
  info: {
    key: {
      name: "first",
      phone: "first",
      email: "first",
      password: "first",
      description: "first",
      accessToken: "first",
      time: "push",
      location: "push",
      image: "first",
    },
  },
  order: {
    key: ["_id", "bookingName", "numberOfPeople", "date", "time", "location", "status", "user", "userId"],
    status: ["success", "completed", "cancelled"],
  },
  product: { key: ["_id", "name", "category", "price", "description", "image", "createdAt", "updatedAt"] },
  event: {
    key: ["_id", "title", "category", "description", "image", "beginAt", "endAt", "location", "locationId"],
    category: ["event", "promotion", "highlight"],
  },
};

export default generalConfig;
