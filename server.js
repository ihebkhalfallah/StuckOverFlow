import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { WebSocketServer } from 'ws';

import reclamationRoutes from './routes/reclamationRoutes.js';
import reclamationTypeRoutes from './routes/reclamationTypeRoutes.js';
import reclamationResponseRoutes from './routes/reclamationResponse.js';
import  { notFoundError, errorHandler } from './middlewares/error-handler.js';

const app = express();
const wss = new WebSocketServer({ port: 8080 });
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

export { io };