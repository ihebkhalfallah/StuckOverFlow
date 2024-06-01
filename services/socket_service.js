// import { WebSocketServer } from 'ws';
// const wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', function connection(ws) {
//     ws.on('message', function message(data) {
//       console.log('received: %s', data);
//     });
  
//     ws.send('something');
//   });

io.on('connection', (socket) => {
    socket.on("joinRoom", (token) => {
        let userData = usersModel.verifyToken(token);
        if (!userData) return;
        socket.join(userData.id);
    })
})
