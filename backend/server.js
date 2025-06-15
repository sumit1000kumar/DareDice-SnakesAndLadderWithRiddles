const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now, restrict in prod
    methods: ["GET", "POST"]
  }
});

// 🔗 Serve frontend folder (including multiplayer.html, assets, etc.)
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

const rooms = {}; // { roomId: { players: [], started: false } }

io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Create room
  socket.on("createRoom", (roomId, callback) => {
    if (rooms[roomId]) {
      return callback({ success: false, message: "Room already exists!" });
    }

    rooms[roomId] = {
      players: [{ id: socket.id, name: "Player", isAdmin: true }],
      started: false
    };

    socket.join(roomId);
    callback({ success: true });

    io.to(roomId).emit("updatePlayers", rooms[roomId].players);
    console.log(`✅ Room created: ${roomId}`);
  });

  // Join room
  socket.on("joinRoom", (roomId, callback) => {
    const room = rooms[roomId];

    if (!room) {
      return callback({ success: false, message: "Room does not exist!" });
    }

    if (room.started) {
      return callback({ success: false, message: "Game already started!" });
    }

    socket.join(roomId);
    room.players.push({ id: socket.id, name: "Player", isAdmin: false });

    callback({ success: true });
    io.to(roomId).emit("updatePlayers", room.players);
    console.log(`👥 User joined room: ${roomId}`);
  });

  // Start game
  socket.on("startGame", (roomId) => {
    const room = rooms[roomId];
    if (room && !room.started) {
      room.started = true;
      io.to(roomId).emit("gameStarted");
      console.log(`🎮 Game started in room: ${roomId}`);
    }
  });

  // Disconnect logic
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const index = room.players.findIndex((p) => p.id === socket.id);

      if (index !== -1) {
        const removedPlayer = room.players.splice(index, 1)[0];
        io.to(roomId).emit("updatePlayers", room.players);
        console.log(`❌ ${removedPlayer.name} left room ${roomId}`);

        // Delete room if empty
        if (room.players.length === 0) {
          delete rooms[roomId];
          console.log(`🗑️ Room deleted: ${roomId}`);
        }

        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
