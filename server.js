import express from 'express';
import mongoose from 'mongoose';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';

import reclamationRoute from './routes/reclamation.js';
import serviceRoute from './routes/service.js';
import commentRoute from './routes/commentaire.js';


import morgan from 'morgan';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 9090;
const database = "Evento";

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)
.then(() => {
  console.log(`Connected to ${database} database`);
})
.catch(err => {
  console.log(`Error connecting to ${database} database`, err);
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/doc', express.static('public/documents'));



app.use('/reclamation', reclamationRoute);
app.use('/service', serviceRoute);
app.use('/comment', commentRoute);


app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});