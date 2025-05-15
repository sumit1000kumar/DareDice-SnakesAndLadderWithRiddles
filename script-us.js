document.addEventListener('DOMContentLoaded', function () {
    // Game state
    const gameState = {
        players: [],
        currentPlayer: 0,
        diceValue: 0,
        soundEnabled: true,
        gameActive: false,
        snakes: {
            17: 7, 27: 20, 49: 15, 43: 8, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 79
        },
        ladders: {
            4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
        },
        riddles: [
            { question: "What goes up but never comes down?", answer: "age" },
            { question: "Chabi hai par talaa nahi kholti?", answer: "piano" },
            { question: "What has hands but can’t clap?", answer: "clock" },
            { question: "Use istemaal karne se pehle todna padta hai?", answer: "egg" },
            { question: "What can fill a room but takes up no space?", answer: "light" },
            { question: "Main bina muh ke bolta hoon, bina kaan ke sunta hoon?", answer: "telephone" },
            { question: "What can you catch but not throw?", answer: "cold" },
            { question: "Jo upar jaata hai par kabhi neeche nahi aata?", answer: "age" },
            { question: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?", answer: "keyboard" },
            { question: "Bachpan mein lamba, budhape mein chhota?", answer: "candle" },
            { question: "What has a neck but no head?", answer: "bottle" },
            { question: "Main sabse pyara hoon, jab chhota hota hoon?", answer: "child" },
            { question: "What has an eye but cannot see?", answer: "needle" },
            { question: "Main bina pair ke daudta hoon?", answer: "river" },
            { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
            { question: "Na dikhai deta, na chhoo sakte ho, phir bhi sab mehsoos karte hain?", answer: "emotion" },
            { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "letter m" },
            { question: "Jo hamesha tumhare saamne hai par dikhta nahi?", answer: "future" },
            { question: "What has a head and a tail but no body?", answer: "coin" },
            { question: "Main bina haathon ke pakadta hoon?", answer: "glue" },
            { question: "What gets wetter as it dries?", answer: "towel" },
            { question: "Main sabse tez hoon, par kabhi rukta nahi hoon?", answer: "time" },
            { question: "What has one eye but can’t see?", answer: "needle" },
            { question: "Main sab kuch sunta hoon, par bolta kuch nahi?", answer: "microphone" },
            { question: "What belongs to you, but other people use it more than you do?", answer: "your name" },
            { question: "Main sabko sikhaata hoon, bina kuch bole?", answer: "experience" },
            { question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "candle" },
            { question: "Kaunsa mahina jisme 28 din hote hai?", answer: "sabhi mahine" },
            { question: "What has to be broken before you can use it?", answer: "egg" },
            { question: "Sab mujhe pehente hain, par main kapda nahi hoon?", answer: "watch" },
            { question: "What gets bigger the more you take away from it?", answer: "hole" },
            { question: "Main roshni deta hoon, lekin aag nahi hoon?", answer: "bulb" },
            { question: "What can travel around the world while staying in the same corner?", answer: "stamp" },
            { question: "Main bolta nahi, par sabko hansaata hoon?", answer: "meme" },
            { question: "What has four legs in the morning, two at noon, and three in the evening?", answer: "human" },
            { question: "Main bina chaliye sabko le jaata hoon?", answer: "dream" },
            { question: "I am full of holes but still holds water. What am I?", answer: "sponge" },
            { question: "Main bina daant ke kaat sakta hoon?", answer: "scissors" },
            { question: "What comes down but never goes up?", answer: "rain" },
            { question: "Main bina muh ke bolta hoon?", answer: "speaker" },
            { question: "What has many teeth but cannot bite?", answer: "comb" },
            { question: "Main sab kuch dikhata hoon, lekin khud nahi dikhta?", answer: "screen" },
            { question: "What has words but never speaks?", answer: "book" },
            { question: "Main sabko dikhai deta hoon, par sab mujhe samajh nahi paate?", answer: "art" },
            { question: "I shave every day, but my beard stays the same. Who am I?", answer: "barber" },
            { question: "Main andhera nahi, roshni laata hoon?", answer: "sunrise" },
            { question: "What kind of band never plays music?", answer: "rubber band" },
            { question: "Main sab jagah hoon, par dikhai nahi deta?", answer: "wifi" },
            { question: "What has a bottom at the top?", answer: "your legs" },
            { question: "Main bina pair ke nachta hoon?", answer: "flame" },
            { question: "What is so fragile that saying its name breaks it?", answer: "silence" },
            { question: "Muh hai par baat nahi karta, kaan hai par sunta nahi, jism nahi par hawa ke saath nachta hai?", answer: "echo" },
            { question: "What has a face and two hands but no arms or legs?", answer: "clock" },
            { question: "Main bina paani ke tair sakta hoon?", answer: "cloud" },
            { question: "What runs but never walks, has a bed but never sleeps?", answer: "river" },
            { question: "Main bina battery ke bhi chalta hoon?", answer: "clock" },
            { question: "I’m light as a feather, yet the strongest man can’t hold me for more than a minute. What am I?", answer: "breath" },
            { question: "Main bina ungli ke chhuta hoon?", answer: "button" },
            { question: "What has ears but cannot hear?", answer: "corn" },
            { question: "Main peeta nahi, phir bhi bottle mein hota hoon?", answer: "perfume" },
            { question: "What goes through cities and fields but never moves?", answer: "road" },
            { question: "Main sab kuch batata hoon, par kabhi jhooth nahi bolta?", answer: "mirror" },
            { question: "What kind of tree can you carry in your hand?", answer: "palm" },
            { question: "Main kabhi budha nahi hota, hamesha jawaan rehta hoon?", answer: "idea" },
            { question: "What has roots as nobody sees, is taller than trees, up, up it goes, and yet never grows?", answer: "mountain" },
            { question: "Main udta hoon, lekin kabhi girta nahi?", answer: "time" },
            { question: "What has legs but doesn’t walk?", answer: "table" },
            { question: "Main jalta hoon, lekin roshni nahi deta?", answer: "anger" },
            { question: "What begins with T, ends with T, and has T in it?", answer: "teapot" },
            { question: "Main sabse sundar dikhta hoon, jab toot jaata hoon?", answer: "mirror" },
            { question: "What comes in a minute, twice in a moment, but never in a thousand years?", answer: "letter m" },
            { question: "Main sab kuch sunta hoon, bina kaan ke?", answer: "radio" },
            { question: "What has many keys but can’t open a single lock?", answer: "piano" },
            { question: "Main sirf hawa mein chal sakta hoon?", answer: "kite" },
            { question: "What can be cracked, made, told, and played?", answer: "joke" },
            { question: "Main sabse jyada bolta hoon TV par?", answer: "anchor" },
            { question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?", answer: "map" },
            { question: "Jitna lete jaaoge, utna peeche chhodte jaaoge?", answer: "footsteps" },
            { question: "What can’t talk but will reply when spoken to?", answer: "echo" },
            { question: "Main sabse badi cheez hoon, par dikhai nahi deti?", answer: "air" },
            { question: "What has a ring but no finger?", answer: "telephone" },
            { question: "Main sabko milata hoon, lekin khud akela hoon?", answer: "network" },
            { question: "What has no beginning, end, or middle?", answer: "doughnut" },
            { question: "Main sabko chhoo sakta hoon, par kabhi pakad nahi sakte?", answer: "wind" },
            { question: "What comes after thunder and before lightning?", answer: "nothing" },
            { question: "Main sabse meetha hoon, par khaaya nahi jaata?", answer: "smile" },
            { question: "What can run but never walks, has a mouth but never talks?", answer: "river" }
        ],
        dares: [
            "Talk with your mouth closed for one minute",
            "Eat a random snack and describe it like a food critic.",
            "Open your window and scream “Bharat Mata ki Jai”",
            "Drop your phone and catch it with your foot",
            "Drop your best pickup line",
            "Turn to the left and start a rap battle with the person next to you.",
            "Spell your full name backwards.",
            "Give us a review on the worst movie you’ve ever seen.",
            "Hum a random song (without any lyrics) and see if we can guess it.",
            "Create a sales pitch for any random object in the room.",
            "Have a staring contest with the person around you.",
            "Try to walk around with a book on your head.",
            "Wave at five strangers the next time you go outside.",
            "Paint each nail a different color.",
            "Brush your teeth with ketchup.",
            "Spin around 10 times and run to the other side of the room in a straight line.",
            "Hold water in your mouth while everyone tries to make you laugh.",
            "Try to build a house of cards unnder 1 min",
        ],
        currentSnake: null,
        currentDare: null,
        boosterCells: [5, 12, 15, 22, 25, 35, 45, 50, 55, 65, 75, 80, 85, 95],
        currentBooster: null,
        funnyMessages: {
            snakeBite: [
                "Oops! That snake had other plans for you.",
                "Bit of a setback – but the game’s still on!",
                "Slid down! Looks like the snake played its move well.",
                "Down you go – that’s how snakes roll in this game.",
                "Every climb has its fall – you’ll bounce back!"
            ],
            ladderClimb: [
                "Nice! That ladder just gave you a boost!",
                "Up you go – smart moves pay off!",
                "Climbing with style – well done!",
                "Look at you go! That was a smooth rise.",
                "Great! That ladder was waiting just for you."
            ],
            correctAnswer: [
                "Spot on! You’ve got your thinking cap on.",
                "That’s the right call – sharp mind!",
                "Correct! You’re clearly paying attention.",
                "Good job! That was a confident answer.",
                "Yes! You nailed it."
            ],
            wrongAnswer: [
                "Not quite right – give it another shot!",
                "That one missed the mark.",
                "Close, but not the answer we were looking for.",
                "Oops! Let’s try to focus a bit more.",
                "That’s okay – every mistake is a step to learn."
            ],
            dareComplete: [
                "Well done! That was brave.",
                "You took it on and nailed it!",
                "Challenge accepted – and completed!",
                "You made that look easy!",
                "Impressive – that was a solid performance."
            ],
            boosterWin: [
                "Bonus unlocked! That’s a +6 move!",
                "Momentum gained – keep it up!",
                "Nice one! Extra steps coming your way!",
                "Power play! You just gained an edge.",
                "Well played – bonus steps added."
            ],
            gameWin: [
                "Congratulations – you won the game!",
                "Victory! That was a well-played round.",
                "You made it to the top – great job!",
                "Well deserved win – hats off!",
                "Champion of the board – that’s you!"
            ]

        }
    };

    // Player colors
    const playerColors = [
        '#4b6cb7', // Blue
        '#ff6b6b', // Red
        '#6bff6b', // Green
        '#ffcc00', // Yellow
        '#cc66ff', // Purple
        '#ff9966', // Orange
        '#66ffff', // Cyan
        '#ff66cc', // Pink
        '#a1ff00', // Lime
        '#9999ff'  // Lavender Blue
    ];

    // DOM elements
    const board = document.getElementById('board');
    const dice = document.getElementById('dice');
    const currentPlayerDisplay = document.getElementById('current-player');
    const riddleModal = document.getElementById('riddle-modal');
    const riddleQuestion = document.getElementById('riddle-question');
    const riddleAnswer = document.getElementById('riddle-answer');
    const submitAnswer = document.getElementById('submit-answer');
    const boosterModal = document.getElementById('booster-modal');
    const boosterText = document.getElementById('booster-text');
    const boosterAnswer = document.getElementById('booster-answer');
    const submitBooster = document.getElementById('submit-booster');
    const dareModal = document.getElementById('dare-modal');
    const dareText = document.getElementById('dare-text');
    const completeDareBtn = document.getElementById('complete-dare');
    const playerSelect = document.getElementById('player-select');
    const startBtn = document.getElementById('start-btn');
    const soundBtn = document.getElementById('sound-btn');
    const restartBtn = document.getElementById('restart-btn');
    const hamburger = document.getElementById('hamburger');
    const mobileControls = document.getElementById('mobile-controls');
    const playerSelectMobile = document.getElementById('player-select-mobile');
    const startBtnMobile = document.getElementById('start-btn-mobile');
    const soundBtnMobile = document.getElementById('sound-btn-mobile');
    const restartBtnMobile = document.getElementById('restart-btn-mobile');

    // Audio elements
    const diceSound = document.getElementById('dice-sound');
    const moveSound = document.getElementById('move-sound');
    const ladderSound = document.getElementById('ladder-sound');
    const snakeSound = document.getElementById('snake-sound');
    const winSound = document.getElementById('win-sound');
    const boosterSound = document.getElementById('booster-sound');

    // Initialize the game board
    createBoard();

    // Event listeners
    startBtn.addEventListener('click', startGame);
    startBtnMobile.addEventListener('click', startGame);
    dice.addEventListener('click', rollDice);
    soundBtn.addEventListener('click', toggleSound);
    soundBtnMobile.addEventListener('click', toggleSound);
    restartBtn.addEventListener('click', restartGame);
    restartBtnMobile.addEventListener('click', restartGame);
    submitAnswer.addEventListener('click', checkRiddleAnswer);
    submitBooster.addEventListener('click', checkBoosterAnswer);
    completeDareBtn.addEventListener('click', completeDare);
    hamburger.addEventListener('click', toggleMobileControls);
    riddleAnswer.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkRiddleAnswer();
    });
    boosterAnswer.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkBoosterAnswer();
    });

    // Start new game with selected players
    function startGame(event) {
        let checkboxes;

        // Determine which button was clicked
        if (event.target.id === 'start-btn-mobile') {
            checkboxes = document.querySelectorAll('#player-selection-mobile input[type="checkbox"]');
        } else {
            checkboxes = document.querySelectorAll('#player-selection-desktop input[type="checkbox"]');
        }

        const selectedNames = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedNames.length === 0) {
            alert('Please select at least one player.');
            return;
        }

        gameState.players = [];

        selectedNames.forEach((name, index) => {
            gameState.players.push({
                id: index + 1,
                name: name,
                position: 1,
                color: playerColors[index % playerColors.length]
            });
        });

        gameState.currentPlayer = 0;
        gameState.diceValue = 0;
        gameState.gameActive = true;

        dice.textContent = '?';
        updatePlayerDisplay();
        renderPlayers();

        mobileControls.classList.remove('active');
    }





    // Create the game board
    function createBoard() {
        board.innerHTML = '';

        let cellNumber = 100;
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.number = cellNumber;

                // Add cell number
                const numberSpan = document.createElement('span');
                numberSpan.className = 'cell-number';
                numberSpan.textContent = cellNumber;
                cell.appendChild(numberSpan);

                // Check for snakes
                if (gameState.snakes[cellNumber]) {
                    cell.classList.add('snake');
                    cell.setAttribute('data-snake-to', gameState.snakes[cellNumber]);
                    cell.setAttribute('title', `Slide to ${gameState.snakes[cellNumber]}`);
                }

                // Check for ladders
                if (gameState.ladders[cellNumber]) {
                    cell.classList.add('ladder');
                    cell.setAttribute('data-ladder-to', gameState.ladders[cellNumber]);
                    cell.setAttribute('title', `Climb to ${gameState.ladders[cellNumber]}`);
                }

                // Check for boosters
                if (gameState.boosterCells.includes(cellNumber)) {
                    cell.classList.add('booster');
                }

                // Add trophy to cell 100
                if (cellNumber === 100) {
                    cell.classList.add('trophy-cell');
                }

                // Alternate row direction
                if (row % 2 === 0) {
                    cell.style.gridColumn = (10 - col);
                } else {
                    cell.style.gridColumn = (col + 1);
                }

                cell.style.gridRow = (row + 1);
                board.appendChild(cell);
                cellNumber--;
            }
        }
    }

    // Roll the dice
    function rollDice() {
        console.log("Dice clicked");

        if (!gameState.gameActive || !gameState.players.length) return;

        // Play dice sound
        if (gameState.soundEnabled) {
            diceSound.currentTime = 0;
            diceSound.play();
        }

        // Disable dice during animation
        dice.style.pointerEvents = 'none';

        // Dice roll animation
        let rolls = 0;
        const maxRolls = 10;
        const animationInterval = setInterval(() => {
            gameState.diceValue = Math.floor(Math.random() * 6) + 1;
            dice.textContent = gameState.diceValue;
            rolls++;

            if (rolls >= maxRolls) {
                clearInterval(animationInterval);
                dice.textContent = gameState.diceValue;
                movePlayer();
                dice.style.pointerEvents = 'auto';
            }
        }, 100);
    }

    function movePlayer() {
        const player = gameState.players[gameState.currentPlayer];
        const targetPosition = Math.min(player.position + gameState.diceValue, 100);

        // Play move sound
        if (gameState.soundEnabled) {
            moveSound.currentTime = 0;
            moveSound.play();
        }

        // Animate player to target position step-by-step
        animateMovement(player, targetPosition, () => {
            // Now that movement is complete, check for win or special cells
            if (player.position === 100) {
                endGame(player);
            } else {
                setTimeout(() => {
                    checkSpecialCells(player);
                }, 500);
            }
        });
    }



    // Check for special cells at current position
    function checkSpecialCells(player) {
        const pos = Number(player.position);

        // Booster
        if (gameState.boosterCells.includes(pos)) {
            const randomMessage = gameState.funnyMessages.boosterWin[
                Math.floor(Math.random() * gameState.funnyMessages.boosterWin.length)
            ];
            alert(randomMessage);

            if (Math.random() < 0.5) {
                showBoosterModal();
            } else {
                showDareModal();
            }
            return;
        }

        // Ladder
        if (gameState.ladders[pos]) {
            const newPosition = gameState.ladders[pos];

            if (gameState.soundEnabled) ladderSound.play();

            const randomLadderMsg = gameState.funnyMessages.ladderClimb[
                Math.floor(Math.random() * gameState.funnyMessages.ladderClimb.length)
            ];
            alert(randomLadderMsg);

            animateMovement(player, newPosition, () => {
                player.position = newPosition;
                renderPlayers();
                nextPlayer(); // ✅ switch after ladder
            });
            return;
        }

        // Snake
        if (gameState.snakes[pos]) {
            if (gameState.soundEnabled) snakeSound.play();

            const randomSnakeMsg = gameState.funnyMessages.snakeBite[
                Math.floor(Math.random() * gameState.funnyMessages.snakeBite.length)
            ];
            alert(randomSnakeMsg);

            gameState.currentSnake = {
                from: pos,
                to: gameState.snakes[pos]
            };

            showRiddleModal();
            return;
        }

        // ✅ No special cell, just move to next player
        nextPlayer();
    }


    // Show riddle modal for snake
    function showRiddleModal() {
        const randomRiddle = gameState.riddles[Math.floor(Math.random() * gameState.riddles.length)];
        riddleQuestion.textContent = randomRiddle.question;
        riddleAnswer.value = '';
        riddleModal.style.display = 'flex';
        gameState.currentRiddleAnswer = randomRiddle.answer.toLowerCase();
        riddleAnswer.focus();
    }

    // Show booster opportunity modal (riddle version)
    function showBoosterModal() {
        const randomRiddle = gameState.riddles[Math.floor(Math.random() * gameState.riddles.length)];
        boosterText.textContent = `Sahi jawab do aur pao +6 steps ka bonus!\n\n${randomRiddle.question}`;
        boosterAnswer.value = '';
        boosterModal.style.display = 'flex';
        gameState.currentBooster = {
            answer: randomRiddle.answer.toLowerCase(),
            position: gameState.players[gameState.currentPlayer].position
        };
        boosterAnswer.focus();
    }

    // Show dare modal
    function showDareModal() {
        const randomDare = gameState.dares[Math.floor(Math.random() * gameState.dares.length)];
        dareText.textContent = randomDare;
        dareModal.style.display = 'flex';
        gameState.currentDare = randomDare;
    }

    // Complete dare
    function completeDare() {
        if (gameState.soundEnabled) {
            boosterSound.currentTime = 0;
            boosterSound.play();
        }

        const randomDareComplete = gameState.funnyMessages.dareComplete[
            Math.floor(Math.random() * gameState.funnyMessages.dareComplete.length)
        ];
        alert(randomDareComplete);

        dareModal.style.display = 'none';
        const player = gameState.players[gameState.currentPlayer];
        const newPosition = Math.min(player.position + 6, 100);

        animateMovement(player, newPosition, () => {
            player.position = newPosition;
            renderPlayers();

            if (player.position === 100) {
                endGame(player);
            } else {
                setTimeout(() => {
                    checkSpecialCells(player);
                }, 500);
            }
        });
    }

    // Check riddle answer for snake
    function checkRiddleAnswer() {
        const player = gameState.players[gameState.currentPlayer];
        const userAnswer = riddleAnswer.value.trim().toLowerCase();

        if (userAnswer === gameState.currentRiddleAnswer) {
            const randomCorrect = gameState.funnyMessages.correctAnswer[
                Math.floor(Math.random() * gameState.funnyMessages.correctAnswer.length)
            ];
            alert(randomCorrect);
            riddleModal.style.display = 'none';
            nextPlayer();
        } else {
            const randomWrong = gameState.funnyMessages.wrongAnswer[
                Math.floor(Math.random() * gameState.funnyMessages.wrongAnswer.length)
            ];
            alert(`${randomWrong}\nSahi jawab tha: "${gameState.currentRiddleAnswer}". Ab neeche slide karo!`);
            riddleModal.style.display = 'none';

            animateMovement(player, gameState.currentSnake.to, () => {
                player.position = gameState.currentSnake.to;
                renderPlayers();
                nextPlayer();
            });
        }
    }

    // Check booster riddle answer
    function checkBoosterAnswer() {
        const player = gameState.players[gameState.currentPlayer];
        const userAnswer = boosterAnswer.value.trim().toLowerCase();

        if (userAnswer === gameState.currentBooster.answer) {
            if (gameState.soundEnabled) {
                boosterSound.currentTime = 0;
                boosterSound.play();
            }

            const randomCorrect = gameState.funnyMessages.correctAnswer[
                Math.floor(Math.random() * gameState.funnyMessages.correctAnswer.length)
            ];
            alert(`${randomCorrect}\n+6 steps ka bonus mila! Jaldi pahuncho 100 pe!`);
            boosterModal.style.display = 'none';

            // Apply booster
            const newPosition = Math.min(player.position + 6, 100);
            animateMovement(player, newPosition, () => {
                player.position = newPosition;
                renderPlayers();

                // Check if player won
                if (player.position === 100) {
                    endGame(player);
                } else {
                    // Check for special cells after booster
                    setTimeout(() => {
                        checkSpecialCells(player);
                    }, 500);
                }
            });
        } else {
            const randomWrong = gameState.funnyMessages.wrongAnswer[
                Math.floor(Math.random() * gameState.funnyMessages.wrongAnswer.length)
            ];
            alert(`${randomWrong}\nSahi jawab tha: "${gameState.currentBooster.answer}". Bonus nahi mila!`);
            boosterModal.style.display = 'none';
            nextPlayer();
        }
    }

    // Animate player movement
    function animateMovement(player, newPosition, callback) {
        const steps = Math.abs(newPosition - player.position);
        const direction = newPosition > player.position ? 1 : -1;
        let currentStep = 0;

        // Highlight player during movement
        const playerElement = document.querySelector(`.player-${player.id}`);
        if (playerElement) {
            playerElement.style.boxShadow = '0 0 10px 5px rgba(255, 255, 255, 0.8)';
            playerElement.style.transform = 'scale(1.2)';
        }

        const animationInterval = setInterval(() => {
            if (currentStep < steps) {
                player.position += direction; // 👈 THIS is the line
                renderPlayers();
                currentStep++;

                if (gameState.soundEnabled) {
                    moveSound.currentTime = 0;
                    moveSound.play();
                }
            } else {
                clearInterval(animationInterval);
                // Reset player highlight
                if (playerElement) {
                    playerElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
                    playerElement.style.transform = 'scale(1)';
                }
                if (callback) callback(); // 🚀 This runs checkSpecialCells() later
            }
        }, 300);

    }

    // Move to next player
    function nextPlayer() {
        gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
        updatePlayerDisplay();
        gameState.diceValue = 0;
        dice.textContent = '?';
    }

    // Update player display
    function updatePlayerDisplay() {
        const player = gameState.players[gameState.currentPlayer];
        currentPlayerDisplay.textContent = player.name;
        currentPlayerDisplay.style.color = player.color;
    }

    // Render players on the board
    function renderPlayers() {
        // Clear all players from the board
        document.querySelectorAll('.player').forEach(el => el.remove());

        // Place players on the board
        gameState.players.forEach(player => {
            const cell = document.querySelector(`.cell[data-number="${player.position}"]`);
            if (cell) {
                const playerElement = document.createElement('div');
                playerElement.className = `player player-${player.id}`;
                playerElement.style.backgroundColor = player.color;
                playerElement.textContent = player.id;
                cell.appendChild(playerElement);
            }
        });
    }

    // End the game
    function endGame(winner) {
        gameState.gameActive = false;

        if (gameState.soundEnabled) {
            winSound.currentTime = 0;
            winSound.play();
        }

        const randomWinMsg = gameState.funnyMessages.gameWin[
            Math.floor(Math.random() * gameState.funnyMessages.gameWin.length)
        ];

        setTimeout(() => {
            alert(`${winner.name} jeet gaya!\n${randomWinMsg}`);
        }, 500);
    }

    // Toggle sound
    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        const soundText = `Sound: ${gameState.soundEnabled ? 'ON' : 'OFF'}`;
        soundBtn.textContent = soundText;
        soundBtnMobile.textContent = soundText;
    }

    // Toggle mobile controls
    function toggleMobileControls() {
        mobileControls.classList.toggle('active');
    }

    // Restart game
    function restartGame() {
        // Reset game state
        gameState.players = [];
        gameState.currentPlayer = 0;
        gameState.diceValue = 0;
        gameState.gameActive = false;

        // Update UI
        dice.textContent = '?';
        currentPlayerDisplay.textContent = 'Player 1';
        currentPlayerDisplay.style.color = '#fff';
        renderPlayers();

        // Hide modals if open
        riddleModal.style.display = 'none';
        boosterModal.style.display = 'none';
        dareModal.style.display = 'none';
        mobileControls.classList.remove('active');
    }

    // Secret cheat activation
    document.getElementById("secret-cheat").addEventListener("click", () => {
        if (gameState.cheatUsed || !gameState.gameActive) return;
        gameState.cheatUsed = true;
        const player = gameState.players[gameState.currentPlayer];
        gameState.cheatPlayerId = player.id;

        document.getElementById("secret-cheat").classList.add("active-hack");
        document.getElementById("secret-cheat").style.color = player.color;

        // alert(`${player.name} has unlocked a secret power! 🚀`);

        // Override checkSpecialCells to skip snakes for the cheater
        const originalCheckSpecial = checkSpecialCells;
        checkSpecialCells = function (player) {
            if (player.id === gameState.cheatPlayerId) {
                const pos = Number(player.position);

                // Booster
                if (gameState.boosterCells.includes(pos)) {
                    showBoosterModal();
                    return;
                }

                // Ladder
                if (gameState.ladders[pos]) {
                    const newPosition = gameState.ladders[pos];
                    if (gameState.soundEnabled) ladderSound.play();
                    animateMovement(player, newPosition, () => {
                        player.position = newPosition;
                        renderPlayers();
                        nextPlayer();
                    });
                    return;
                }

                // ✅ Skip snake logic, just move forward
                nextPlayer();
            } else {
                originalCheckSpecial(player);
            }
        };
    });

});