const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;
let clients = [];
let moves = [];

app.use(express.static('public'));

io.sockets.on('connection', function(socket) {
  clients.push(socket.id);

  if (clients.length == 1) {
    turn = 1;
    socket.emit('newConnectedUser', turn);
  }
  if (clients.length == 2) {
    turn = -1;
    socket.emit('newConnectedUser', turn);
  }
  if (clients.length > 3) {
    turn = null;
    socket.emit('newConnectedUser', turn);
  }

  socket.on('clickEvent', function(data) {
    socket.broadcast.emit('clickEvent', data);
  });

  socket.on('disconnect', function() {
    io.sockets.emit('user disconnected');
    clients.pop();
    console.log('disconnect');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
