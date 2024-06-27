import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
//iheb
import { errorHundler, notFoundError } from "./middlewares/errorr-handler.js";
import reclamationRoutes from "./routes/reclamation.js";
import commentaireRoutes from "./routes/commentaire.js";
import serviceRoutes from "./routes/service.js" 
import userRoutes from "./routes/user.js";
import coachRoutes from "./routes/coach.js";
import nutritionnisteRoutes from "./routes/nutritionniste.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import approveRoutes from "./routes/approve.js";
import panierRoutes from './routes/panier.js'; // Importe les routes du panier
import categorieRoutes from './routes/categorie.js';
import achatRoutes from './routes/achat.js';
import produitRoutes from './routes/produit.js'; // Importe les routes des produits

import { createAdmin } from "./controllers/adminSeed.js";
import passport from "passport";
import session from "express-session";
//zouhour
import seanceRoutes from "./routes/seance.js";
import reservationRoutes from "./routes/reservation.js";
import service from "./models/service.js";

import { ResetJob } from "./controllers/coach.js";

// dotenv file
dotenv.config({ path: ".env" });

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

const app = express();
const port = process.env.PORT;
const databaseName = process.env.DATABASENAME;
const db_url = process.env.DB_URL;
app.use(express.json());

// initialization of session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// passport initialization
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
app.use('/img', express.static('public/images'));

app.use("/user", userRoutes);
app.use("/coach", coachRoutes);
app.use("/nutritionniste", nutritionnisteRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes); 
app.use("/approve", approveRoutes);
app.use("/seance", seanceRoutes);
app.use("/reservation", reservationRoutes);
app.use('/produit', produitRoutes); // Utilise les routes des produits
app.use('/buy', achatRoutes);
app.use('/categorie', categorieRoutes);
app.use('/panier', panierRoutes); // Utilise les routes du panier
app.use("/reclamation", reclamationRoutes);
app.use("/service", serviceRoutes);
app.use("/commentaire", commentaireRoutes);

app.use(notFoundError);
app.use(errorHundler);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
// function to reset coaches disponibility
ResetJob();