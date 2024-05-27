import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';


import coachRoutes from './routes/coach.js';
import seanceRoutes from './routes/seance.js';
import reservationRoutes from './routes/reservation.js';
import  { notFoundError, errorHandler } from './middlewares/error-handler.js';
import { checkDisponibilite } from './controllers/coach.js';
// import { reserver } from './controllers/seance.js';
import { ResetJob } from './controllers/coach.js';


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

// let date =  (d1.getTime() - d2.getTime())/1000/60/60;
// console.log(d1.getTime() < d2.getTime());
// console.log(checkDisponibilite("2024-05-16", "10:30:00", "12:00:00", "iheb", "khalfallah"));
// console.log(reserver("66464189bb5ce3d1e705f9fc", "664a5e2c87acae85da5d8c78"));


// console.log(reserver( "664a5fb7c230e636c273b8ed","664e5cb7d2aac66fa32ad541"));


// checkDisponibilite("664a5fb7c230e636c273b8ed", "2024-05-22", "2024-05-22T07:00:00.000+00:00", "2024-05-22T09:00:00.000+00:00")
//     .then(disponible => {
//         console.log(`Disponibilité du coach: ${disponible}`);
//     })
//     .catch(error => {
//         console.error(`Erreur: ${error.message}`);
//     });

// checkDisponibilite("66464189bb5ce3d1e705f9fc", "2024-05-16", d1.getTime(), d2.getTime())
//     .then(disponible => {
//         console.log(`Disponibilité du coach: ${disponible}`);
//     })
//     .catch(error => {
//         console.error(`Erreur: ${error.message}`);
//     });

// async function testReservation() {
//   try {
//       const result = await reserver("664e556ffe8ac3cfc6334226", "664e5cb7d2aac66fa32ad541");
//       console.log(result);
//   } catch (error) {
//       console.error(error.message);
//   }
// }

// testReservation();
// var DateSys = Date(year, month, day).now()
// let date = ("0" + date_time.getDate()).slice(-2);
// // new Date(new Date()-3600*1000*3).toISOString();
// console.log(date.)

ResetJob();