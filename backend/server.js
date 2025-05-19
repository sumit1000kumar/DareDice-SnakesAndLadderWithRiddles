// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;

app.use(express.static('public'));

const rooms = {}; // { roomCode: [players] }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-room', (callback) => {
    const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[roomCode] = [socket.id];
    socket.join(roomCode);
    callback(roomCode);
  });

  socket.on('join-room', ({ roomCode }, callback) => {
    if (rooms[roomCode] && rooms[roomCode].length < 8) {
      rooms[roomCode].push(socket.id);
      socket.join(roomCode);
      callback({ success: true });
      io.to(roomCode).emit('player-joined', rooms[roomCode].length);
    } else {
      callback({ success: false, message: "Room not found or full" });
    }
  });

  socket.on('roll-dice', ({ roomCode, value }) => {
    io.to(roomCode).emit('dice-rolled', value);
  });

  socket.on('disconnect', () => {
    for (let code in rooms) {
      rooms[code] = rooms[code].filter(id => id !== socket.id);
      if (rooms[code].length === 0) delete rooms[code];
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
