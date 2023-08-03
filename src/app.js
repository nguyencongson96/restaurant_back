import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import * as url from "url";
import express from "express";
import mongoose from "mongoose";
import reservation from "#root/route/reservation/index.js";
import infoRoute from "#root/route/info.js";
import productRoute from "#root/route/product.js";
import eventRoute from "#root/route/event.js";
import placeRoute from "#root/route/place.js";
import errHandler from "#root/middleware/errHandler.middleware.js";
import formatPhone from "#root/middleware/formatPhone.middleware.js";
import fieldSelect from "#root/middleware/fieldSelect.middleware.js";
import dbConnect from "#root/config/dbConnect.config.js";

// Set up Express server
const app = express(); // create an instance of an Express application
const PORT = 4100; // set the port number for the server to listen on

await dbConnect();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Serve static files in the 'public' directory
const __dirname = url.fileURLToPath(import.meta.url); // get the directory name of the current module
app.use("/", express.static(path.join(__dirname, "public")));

app.use(express.json()); // parse JSON request bodies
app.use(cookieParser()); // parse cookies

// use router for handling requests
app.use(fieldSelect);
app.use("/reservation", formatPhone, reservation);
app.use("/info", infoRoute);
app.use("/product", productRoute);
app.use("/event", eventRoute);
app.use("/place", placeRoute);

// use middleware for handling errors
app.use(errHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose.connection
    .once("open", () => console.log("Connected to MongoDB"))
    .on("error", (err) => console.log(err));
});
