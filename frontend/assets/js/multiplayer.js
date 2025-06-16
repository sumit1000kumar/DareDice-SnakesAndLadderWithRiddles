const joinLeaveAudio = new Audio("/assets/audio/booster-sound.wav");
const diceRollAudio = new Audio("/assets/audio/dice-sound.wav");

const socket = io("https://daredice-backend.onrender.com");
let isAdmin = false;
let currentRoomId = "";

// DOM references
const roomInput = document.getElementById("room-id-input");
const createBtn = document.getElementById("create-room-btn");
const createRandomBtn = document.getElementById("create-random-btn");
const joinBtn = document.getElementById("join-room-btn");
const playerList = document.getElementById("player-list");
const copySection = document.getElementById("copy-room-section");
const roomIdDisplay = document.getElementById("room-id-display");
const copyBtn = document.getElementById("copy-btn");
const startGameBtn = document.getElementById("start-game-btn");
const gameSection = document.getElementById("game-section");
const board = document.getElementById("board");
const dice = document.getElementById("dice");

const gameState = {
  players: [],
  currentPlayer: 0,
  diceValue: 0,
  gameActive: false,
  snakes: {
    23: 3, 34: 12, 49: 30, 57: 18, 62: 19,
    70: 33, 76: 50, 88: 11, 96: 29, 98: 53
  },
  ladders: {
    7: 24, 16: 21, 20: 39, 27: 46, 42: 68,
    52: 89, 65: 74, 79: 92
  },
  boosterCells: [45, 10, 71, 60, 54, 28, 87, 18, 50, 40, 66, 82, 5]
};

createBtn?.addEventListener("click", () => {
  const roomId = roomInput.value.trim();
  if (!roomId) return alert("Enter a room ID");
  socket.emit("createRoom", roomId, (response) => {
    if (response.success) joinSuccess(roomId, true);
    else alert(response.message);
  });
});

createRandomBtn?.addEventListener("click", () => {
  const randomId = "ROOM_" + Math.random().toString(36).substring(2, 8).toUpperCase();
  socket.emit("createRoom", randomId, (response) => {
    if (response.success) joinSuccess(randomId, true);
    else alert("Failed to create room");
  });
});

joinBtn?.addEventListener("click", () => {
  const roomId = roomInput.value.trim();
  if (!roomId) return alert("Enter a room ID");
  socket.emit("joinRoom", roomId, (response) => {
    if (response.success) joinSuccess(roomId, false);
    else alert(response.message);
  });
});

copyBtn?.addEventListener("click", () => {
  navigator.clipboard.writeText(currentRoomId);
  alert("Room ID copied!");
});

function joinSuccess(roomId, adminFlag) {
  isAdmin = adminFlag;
  currentRoomId = roomId;
  roomIdDisplay.textContent = roomId;
  copySection.style.display = "inline-block";
  gameSection.style.display = "block";
  startGameBtn.style.display = isAdmin ? "inline-block" : "none";
  createBoard();
}

startGameBtn?.addEventListener("click", () => {
  socket.emit("startGame", currentRoomId);
  startGameBtn.classList.add("hidden");
});

socket.on("updatePlayers", (players) => {
  playerList.innerHTML = "";
  players.forEach((player, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${player.name} ${player.isAdmin ? "👑" : ""}`;
    playerList.appendChild(li);
  });

  gameState.players = players.map((p, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    position: 1,
    color: getRandomColor(),
    socketId: p.id,
  }));

  const currentUser = players.find(p => p.id === socket.id);
  isAdmin = currentUser?.isAdmin;
  startGameBtn.style.display = isAdmin ? "inline-block" : "none";
});

socket.on("playerLeft", (playerName) => {
  const li = document.createElement("li");
  li.textContent = `${playerName} left the game.`;
  li.style.color = "red";
  li.style.fontStyle = "italic";
  playerList.appendChild(li);
  joinLeaveAudio.play();
});

socket.on("adminReassigned", (newAdminName) => {
  alert(`Admin reassigned to ${newAdminName}`);
});

socket.on("gameStarted", () => {
  alert("Game Started!");
  gameState.gameActive = true;
  createBoard();
  renderPlayers();
});

socket.on("diceRolled", ({ value, playerIndex }) => {
  gameState.diceValue = value;
  gameState.currentPlayer = playerIndex;
  dice.textContent = value;
  dice.classList.add("dice-rolling");
  diceRollAudio.play();
  setTimeout(() => dice.classList.remove("dice-rolling"), 600);
  movePlayer();
});

dice?.addEventListener("click", () => {
  if (!gameState.gameActive) return;

  const currentPlayer = gameState.players[gameState.currentPlayer];
  if (socket.id !== currentPlayer.socketId) return;

  const value = Math.floor(Math.random() * 6) + 1;
  socket.emit("rollDice", { roomId: currentRoomId, value, playerIndex: gameState.currentPlayer });
});

function movePlayer() {
  const player = gameState.players[gameState.currentPlayer];
  const start = player.position;
  const end = Math.min(start + gameState.diceValue, 100);
  let step = start + 1;

  const interval = setInterval(() => {
    // Remove player from previous position
    const prevCell = document.querySelector(`.cell[data-number='${player.position}']`);
    if (prevCell) {
      const prevToken = prevCell.querySelector(`.player-${player.id}`);
      if (prevToken) prevToken.remove();
    }

    // Move one step forward
    player.position = step;
    renderPlayers();
    step++;

    if (step > end) {
      clearInterval(interval);

      // Check for snake or ladder after moving
      if (gameState.snakes[player.position]) {
        player.position = gameState.snakes[player.position];
        renderPlayers();
      } else if (gameState.ladders[player.position]) {
        player.position = gameState.ladders[player.position];
        renderPlayers();
      }

      // Check for win condition
      if (player.position === 100) {
        alert(`${player.name} wins! 🏆`);
        gameState.gameActive = false;
      } else {
        // Next player's turn
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        dice.textContent = "?";
      }
    }
  }, 200); // Adjust this value for speed
}


function createBoard() {
  board.innerHTML = "";
  let cellNumber = 100;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.number = cellNumber;

      const numberSpan = document.createElement("span");
      numberSpan.className = "cell-number";
      numberSpan.textContent = cellNumber;
      cell.appendChild(numberSpan);

      if (gameState.snakes[cellNumber]) {
        cell.classList.add("snake");
        cell.setAttribute("title", `Snake to ${gameState.snakes[cellNumber]}`);
      }
      if (gameState.ladders[cellNumber]) {
        cell.classList.add("ladder");
        cell.setAttribute("title", `Ladder to ${gameState.ladders[cellNumber]}`);
      }
      if (gameState.boosterCells.includes(cellNumber)) {
        cell.classList.add("booster");
        cell.setAttribute("title", "Booster cell");
      }

      board.appendChild(cell);
      cellNumber--;
    }
  }
}

function renderPlayers() {
  document.querySelectorAll(".player").forEach(el => el.remove());
  gameState.players.forEach(player => {
    const cell = document.querySelector(`.cell[data-number='${player.position}']`);
    if (cell) {
      const p = document.createElement("div");
      p.className = `player player-${player.id}`;
      p.style.backgroundColor = player.color;
      p.textContent = ["🐻", "😎", "😈", "💀", "🎃", "🐯", "🦍", "🤴🏻"][player.id - 1];
      cell.appendChild(p);
    }
  });
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}
