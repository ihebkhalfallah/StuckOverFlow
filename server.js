import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';


import coachRoutes from './routes/coach.js';
import seanceRoutes from './routes/seance.js';
import reservationRoutes from './routes/reservation.js';
import  { notFoundError, errorHandler } from './middlewares/error-handler.js';

const app = express();
const port = process.env.PORT || 9090;
const databaseName = 'PIDEV';
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017`;

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/coach', coachRoutes);
app.use('/seance', seanceRoutes);
app.use('/reservation', reservationRoutes);

app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

const d1 = new Date (2024,5,16,12,0,0,0);
const d2 = new Date (2024,5,16,10,30,0,0);
let date =  (d1.getTime() - d2.getTime())/1000/60/60;
console.log(d1.getTime() < d2.getTime());