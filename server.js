const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });
app.use(express.static('public'));

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('clickEvent', function(data) {
    socket.broadcast.emit('clickEvent', data);
    console.log(data);
  });
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
