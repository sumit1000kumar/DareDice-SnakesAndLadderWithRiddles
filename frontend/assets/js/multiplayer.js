// merged multiplayer.js with full game logic from script.js

const socket = io();
let isAdmin = false;
let currentRoomId = "";

// DOM references for room controls
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

// DOM references for gameplay
const board = document.getElementById("board");
const dice = document.getElementById("dice");

// --- Game State ---
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

// --- Socket.IO Room Setup ---

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
  if (!isAdmin) startGameBtn.style.display = "none";
  createBoard(); // Show board background even before game starts

  // Minimize layout impact of buttons
  document.querySelector(".room-controls").style.flexWrap = "wrap";
  document.querySelector(".room-controls").style.gap = "0.25rem";
  document.querySelector(".room-controls").style.marginBottom = "0.5rem";
  const inputs = document.querySelectorAll(".room-controls input, .room-controls button");
  inputs.forEach(el => {
    el.style.fontSize = "0.85rem";
    el.style.padding = "0.4rem 0.6rem";
    el.style.flex = "none";
    el.style.width = "auto";
  });
}

startGameBtn?.addEventListener("click", () => {
  socket.emit("startGame", currentRoomId);
});

socket.on("updatePlayers", (players) => {
  playerList.innerHTML = "";
  players.forEach((player, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${player.name} ${player.isAdmin ? "(Admin)" : ""}`;
    playerList.appendChild(li);
  });

  gameState.players = players.map((p, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    position: 1,
    color: getRandomColor(),
  }));
});

socket.on("gameStarted", () => {
  alert("Game Started!");
  gameState.gameActive = true;
  createBoard();
  renderPlayers();
});

// --- Game Logic ---
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

dice?.addEventListener("click", () => {
  if (!isAdmin || !gameState.gameActive) return;
  rollDice();
});

function rollDice() {
  dice.style.pointerEvents = "none";
  let rolls = 0;
  const interval = setInterval(() => {
    gameState.diceValue = Math.floor(Math.random() * 6) + 1;
    dice.textContent = gameState.diceValue;
    rolls++;
    if (rolls >= 10) {
      clearInterval(interval);
      movePlayer();
      dice.style.pointerEvents = "auto";
    }
  }, 100);
}

function movePlayer() {
  const player = gameState.players[gameState.currentPlayer];
  player.position = Math.min(player.position + gameState.diceValue, 100);
  renderPlayers();
  if (player.position === 100) {
    alert(`${player.name} wins! 🏆`);
    gameState.gameActive = false;
  } else {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
    dice.textContent = "?";
  }
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
      p.textContent = ["🐻","😎","😈","💀","🎃","🐯","🦍","🤴🏻"][player.id - 1];
      cell.appendChild(p);
    }
  });
}
