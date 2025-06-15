const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {}; // Keeps track of all rooms and players
const MAX_PLAYERS = 4;

io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  socket.on("createRoom", (roomId, callback) => {
    if (rooms[roomId]) {
      return callback({ success: false, message: "Room already exists." });
    }
    rooms[roomId] = {
      players: [{ id: socket.id, name: `Player`, isAdmin: true }],
      started: false,
      currentTurn: 0,
    };
    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    return callback({ success: true });
  });

  socket.on("joinRoom", (roomId, callback) => {
    const room = rooms[roomId];
    if (!room) {
      return callback({ success: false, message: "Room does not exist." });
    }
    if (room.started) {
      return callback({ success: false, message: "Game already started." });
    }
    if (room.players.length >= MAX_PLAYERS) {
      return callback({ success: false, message: "Room is full." });
    }
    room.players.push({ id: socket.id, name: `Player`, isAdmin: false });
    socket.join(roomId);
    io.to(roomId).emit("updatePlayers", room.players);
    return callback({ success: true });
  });

  socket.on("startGame", (roomId) => {
    const room = rooms[roomId];
    if (room && !room.started) {
      room.started = true;
      room.currentTurn = 0;
      io.to(roomId).emit("gameStarted");
      console.log(`🎮 Game started in room: ${roomId}`);
    }
  });

  // 🎲 Real-time dice sync with logging and turn validation
  socket.on("rollDice", ({ roomId, value, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.started) return;

    const currentPlayer = room.players[room.currentTurn];
    if (currentPlayer.id !== socket.id) return; // not your turn

    console.log(`🎲 Player ${playerIndex + 1} in room ${roomId} rolled a ${value}`);

    io.to(roomId).emit("diceRolled", { value, playerIndex });

    // Update turn
    room.currentTurn = (room.currentTurn + 1) % room.players.length;
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const index = room.players.findIndex((p) => p.id === socket.id);
      if (index !== -1) {
        const player = room.players[index];
        const playerName = player.name;
        const wasAdmin = player.isAdmin;
        room.players.splice(index, 1);

        // 👑 Reassign admin if admin left
        if (wasAdmin && room.players.length > 0) {
          room.players[0].isAdmin = true;
          io.to(roomId).emit("adminReassigned", room.players[0].name);
        }

        io.to(roomId).emit("updatePlayers", room.players);
        io.to(roomId).emit("playerLeft", playerName);

        if (room.players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

// Serve frontend files if needed
app.use(express.static(path.join(__dirname, "../frontend")));

// Redirect root to multiplayer.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "multiplayer.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
