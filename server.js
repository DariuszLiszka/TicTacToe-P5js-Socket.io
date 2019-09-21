const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// use abstractaction for inmemory database or use some library (memcached || redis)
let clients = [];
let moves = [];

// separate client code from server code
app.use(express.static('public'));

// more layers

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
    // no validaiton for movment
    socket.broadcast.emit('clickEvent', data);
  });

  socket.on('disconnect', function() {
    io.sockets.emit('user disconnected');
    clients.pop();
    console.log('disconnect');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
