import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHundler, notFoundError } from "./middlewares/errorr-handler.js";
import userRoutes from "./routes/user.js";
import coachRoutes from "./routes/coach.js";
import nutritionnisteRoutes from "./routes/nutritionniste.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import approveRoutes from "./routes/approve.js";
import { createAdmin } from "./controllers/adminSeed.js";
import passport from "passport";
import session from "express-session";

dotenv.config({ path: ".env" });

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const app = express();
const port = process.env.PORT;
const databaseName = process.env.DATABASENAME;
const db_url = process.env.DB_URL;
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.use("/user", userRoutes);
app.use("/coach", coachRoutes);
app.use("/nutritionniste", nutritionnisteRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/approve", approveRoutes);

app.use(notFoundError);
app.use(errorHundler);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import platRoutes from "./routes/plat.js";
import restaurantRoutes from "./routes/restaurant.js";
import categorieRestaurantRoutes from "./routes/categorieRestaurant.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 9090;
const databaseName = process.env.DATABASENAME || "bodysmith";
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
