const http = require('http');
const io = require("socket.io");
const cors = require('cors');

const httpServer = http.createServer();

// Apply the CORS configuration to the Socket.IO server
const socketIoServer = io(httpServer, {
  cors: {
    origin: "http://localhost:5500", // Allow requests from localhost:5500
    methods: ["GET", "POST"]
  }
});

const users = {};

socketIoServer.on('connection', socket => {
  socket.on('new-user-joined', name => { 
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

// Start the HTTP server
httpServer.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
