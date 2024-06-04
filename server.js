import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import http from 'http';
import { Server } from 'socket.io'; // Import Server from socket.io


import reclamationRoutes from './routes/reclamationRoutes.js';
import reclamationTypeRoutes from './routes/reclamationTypeRoutes.js';
import reclamationResponseRoutes from './routes/reclamationResponse.js';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

app.use('/reclamation', reclamationRoutes);
app.use('/reclamationResponse', reclamationResponseRoutes);
app.use('/reclamationType', reclamationTypeRoutes);

app.use(notFoundError);
app.use(errorHandler);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
export { io };