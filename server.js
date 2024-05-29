import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import { notFoundError, errorHandler } from "./middlewares/error-handler.js";

import platRoutes from "./routes/plat.js";
import restaurantRoutes from "./routes/restaurant.js";
import categorieRestaurantRoutes from "./routes/categorieRestaurant.js";

const app = express();
const port = process.env.PORT || 9090;
const databaseName = process.env.PORT || "bodysmith";
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017`;

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static("public/images"));

app.use("/plat", platRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/categorieRestaurant", categorieRestaurantRoutes);

app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
