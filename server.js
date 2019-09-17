const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;
let clients = [];
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });
app.use(express.static('public'));

io.sockets.on('connection', function(socket) {
  clients.push(socket.id);
  console.log(clients);
  if (clients.length == 1) {
    turn = 1;
    socket.emit('ehlo', turn);
  }
  if (clients.length == 2) {
    turn = -1;
    socket.emit('ehlo', turn);
  }
  if (clients.length > 3) {
    turn = null;
    socket.emit('ehlo', turn);
  }

  socket.on('clickEvent', function(data) {
    socket.broadcast.emit('clickEvent', data);
    console.log(data);
  });

  socket.on('disconnect', function() {
    io.sockets.emit('user disconnected');
    clients.pop();
    console.log('disconnect');
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
