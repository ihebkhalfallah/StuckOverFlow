import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv'

import userRoutes from './routes/user.js'


dotenv.config({path:'.env'})

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

const app = express();
const port = process.env.PORT;
const databaseName = process.env.DATABASENAME;
const db_url = process.env.DB_URL;


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

  app.use('/user',userRoutes);


app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});