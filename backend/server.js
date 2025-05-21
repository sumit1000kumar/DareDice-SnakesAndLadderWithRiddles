const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // ✅ Create server first

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "https://www.sumitbuilds.live";

// ✅ Use CORS middleware for HTTP requests (optional here)
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

// ✅ Configure Socket.IO CORS after server is created
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

let rooms = {}; // roomId => { admin: socketId, players: [] }

io.on('connection', socket => {
  console.log("User connected:", socket.id);

  socket.on('create-room', (roomId, callback) => {
    if (rooms[roomId]) {
      return callback({ success: false, message: 'Room already exists' });
    }
    rooms[roomId] = {
      admin: socket.id,
      players: [{ id: socket.id, name: 'Player 1' }]
    };
    socket.join(roomId);
    callback({ success: true });
    io.to(roomId).emit('players-update', rooms[roomId].players);
  });

  socket.on('join-room', (roomId, callback) => {
    if (!rooms[roomId]) {
      return callback({ success: false, message: 'Room not found' });
    }
    const playerNumber = rooms[roomId].players.length + 1;
    rooms[roomId].players.push({ id: socket.id, name: `Player ${playerNumber}` });
    socket.join(roomId);
    callback({ success: true, playerName: `Player ${playerNumber}` });
    io.to(roomId).emit('players-update', rooms[roomId].players);
  });

  socket.on('start-game', (roomId) => {
    console.log("🔴 start-game emitted to room", roomId);
    if (rooms[roomId]) {
      io.to(roomId).emit('start-game');
    }
  });

  socket.on('dice-rolled', ({ roomId, playerId, diceValue }) => {
    console.log(`🎲 Dice rolled by ${playerId} in room ${roomId}: ${diceValue}`);
    io.to(roomId).emit('dice-rolled', { playerId, diceValue });
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`🔴 ${socket.id} left room ${roomId}`);

    if (rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);

      if (rooms[roomId].admin === socket.id) {
        io.to(roomId).emit('admin-left');
        delete rooms[roomId];
        console.log(`❌ Room ${roomId} closed (admin left)`);
      } else {
        io.to(roomId).emit('players-update', rooms[roomId].players);
      }
    }
  });

  socket.on('disconnect', () => {
    for (let roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);

      if (rooms[roomId].admin === socket.id) {
        io.to(roomId).emit('admin-left');
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('players-update', rooms[roomId].players);
      }
    }
  });
});

// ✅ Use PORT from environment or fallback
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
