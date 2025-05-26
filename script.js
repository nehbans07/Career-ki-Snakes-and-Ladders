// Game State
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameBoard: [],
    isGameActive: false,
    gameTimer: null,
    timeRemaining: 3600, // 60 minutes in seconds
    snakePositions: [16, 47, 62, 64, 87, 93, 95, 98],
    ladderPositions: [1, 4, 9, 21, 28, 36, 51, 71, 80],
    currentScenario: null,
    usedScenarios: {},
    editingPlayer: null,
    currentTab: 'ladder'
};

// Player tokens and default names
const playerTokens = ['🔵', '🟡', '🔴', '🟢'];
const defaultPlayerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

// Analytics helper function
function safeTrackEvent(eventName, parameters = {}) {
    try {
        if (typeof trackEvent === 'function') {
            trackEvent(eventName, parameters);
        }
        if (window.gameAnalytics && typeof window.gameAnalytics[eventName] === 'function') {
            window.gameAnalytics[eventName](parameters);
        }
    } catch (error) {
        console.log('Analytics tracking error:', error);
    }
}

// Ladder Scenarios (Career Growth Actions) - Now editable
let ladderScenarios = [
    {
        id: 1,
        title: "LinkedIn Showoff",
        description: "You built a LinkedIn profile with updated, relevant experience, skills, and project links.",
        evidence: "Evidence: Show a live LinkedIn profile and take AI feedback."
    },
    {
        id: 2,
        title: "LinkedIn Activity Power",
        description: "You've actively posted about your work, projects, courses, and reflections on LinkedIn.",
        evidence: "Evidence: Show at least two posts in the past 2 months."
    },
    {
        id: 3,
        title: "Projects Prowess",
        description: "You worked on at least 2 relevant, problem-solving projects aligned with your job interest.",
        evidence: "Evidence: Show GitHub links."
    },
    {
        id: 4,
        title: "Student Volunteer Star",
        description: "You have taken up volunteering or leadership roles on campus.",
        evidence: "Evidence: Mention on resume/LinkedIn or certification"
    },
    {
        id: 5,
        title: "Tailored Resume Master",
        description: "You created at least 2 custom resumes for different job roles.",
        evidence: "Evidence: Show both resumes and explain 1 key difference."
    },
    {
        id: 6,
        title: "ATS Resume Score Challenge",
        description: "Your resume scores 70+ on an ATS scanner.",
        evidence: "Evidence: Screenshot from Jobscan or AI tools like ChatGPT."
    },
    {
        id: 7,
        title: "Certifications Bravo",
        description: "You completed at least 2 relevant courses from platforms like Coursera, Udemy, etc., in the last year.",
        evidence: "Evidence: Show certificates and add them to resume/LinkedIn."
    },
    {
        id: 8,
        title: "Resume Decor",
        description: "Your resume follows professional formatting, structure, and contains no grammar errors.",
        evidence: "Evidence: Peer-reviewed resume or updated file."
    },
    {
        id: 9,
        title: "Feedback Friendly",
        description: "You politely reached out to a recruiter or HR for feedback post-interview.",
        evidence: "Evidence: Screenshot of email/message sent."
    },
    {
        id: 10,
        title: "English Learning Champion",
        description: "You made consistent efforts for at least 1 month to improve English learning levels.",
        evidence: "Evidence: Show scores, writing samples, or feedback journal."
    },
    {
        id: 11,
        title: "Mock Interview Proof",
        description: "You've completed at least 2 mock interviews and received feedback.",
        evidence: "Evidence: Screenshot, notes, or video clip with feedback."
    },
    {
        id: 12,
        title: "Job Tracker Maintainer",
        description: "You use a job application tracker with at least 5 detailed entries.",
        evidence: "Evidence: Excel, or Google Sheet view."
    },
    {
        id: 13,
        title: "Cover Letter Crusader",
        description: "You have written at least one job-specific cover letter.",
        evidence: "Evidence: Show tailored letter."
    },
    {
        id: 14,
        title: "GitHub Glory",
        description: "Your GitHub has at least 3 relevant repositories.",
        evidence: "Evidence: Show GitHub link."
    },
    {
        id: 15,
        title: "Company Research Champion",
        description: "You prepared a research doc with company info: mission, culture, roles, recent news.",
        evidence: "Evidence: Share research doc."
    }
];

// Anti-Venom Scenarios (Preventive Actions) - Now editable
let antivenomScenarios = [
    {
        id: 1,
        title: "LinkedIn Showoff",
        description: "Your LinkedIn profile is up to date with relevant info and projects.",
        evidence: "Evidence: Show profile and take AI feedback."
    },
    {
        id: 2,
        title: "LinkedIn Activity Power",
        description: "You've actively posted about your work—projects, courses, reflections—on LinkedIn.",
        evidence: "Evidence: Show at least two posts in the past 2 months."
    },
    {
        id: 3,
        title: "Projects Prowess",
        description: "You can show a completed or in-progress project with application to your career goals.",
        evidence: "Evidence: GitHub link or screenshots."
    },
    {
        id: 4,
        title: "Resume Refresh",
        description: "You have created and used 2+ tailored resumes for different job roles.",
        evidence: "Evidence: Show documents, explain use cases."
    },
    {
        id: 5,
        title: "Certifications Bravo",
        description: "You've completed relevant certifications in the past 12 months.",
        evidence: "Evidence: Certificates visible on resume or LinkedIn."
    },
    {
        id: 6,
        title: "Resume Decor",
        description: "Resume is formatted well and free of typos, clutter, and outdated info.",
        evidence: "Evidence: Share file for peer validation."
    },
    {
        id: 7,
        title: "Feedback Friendly",
        description: "You've asked for feedback from HR/recruiters post-interview.",
        evidence: "Evidence: Email/message screenshot."
    },
    {
        id: 8,
        title: "English Learning Champion",
        description: "Evidence of regular improvement in English speaking levels over 2 months.",
        evidence: "Evidence: Screenshots of progress (e.g., Scores)."
    },
    {
        id: 9,
        title: "Mock Interview Log",
        description: "You've participated in mock interviews with at least 1 peer or mentor.",
        evidence: "Evidence: Screenshot or summary."
    },
    {
        id: 10,
        title: "Job Application Tracker",
        description: "You track your job applications and reflect on follow-ups/responses.",
        evidence: "Evidence: Show tracking file with date and status."
    },
    {
        id: 11,
        title: "Cover Letter Preparedness",
        description: "You have at least one customized cover letter with company-specific language.",
        evidence: "Evidence: Document showing personalized content."
    },
    {
        id: 12,
        title: "GitHub Portfolio",
        description: "You've created or contributed to 3+ GitHub repositories.",
        evidence: "Evidence: Live link with relevant READMEs."
    },
    {
        id: 13,
        title: "Company Research Notes",
        description: "You've prepared a note or slide deck on a target company before applying.",
        evidence: "Evidence: Document showing research."
    },
    {
        id: 14,
        title: "Student Volunteer Star",
        description: "You have taken up volunteering or leadership roles on campus.",
        evidence: "Evidence: Mention on resume/LinkedIn or certification"
    }
];

// Initialize the game
function initGame() {
    createBoard();
    initializePlayers();
    createCards();
    updateUI();
    bindEvents();
    resetTimer();
    
    // Track game initialization
    safeTrackEvent('page_view', { 
        custom_parameter_1: 'game_loaded',
        custom_parameter_2: 'initialization' 
    });
}

// Create the game board
function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameState.gameBoard = [];

    // Create board cells (1-100, arranged in snake pattern)
    for (let i = 0; i < 100; i++) {
        const cellNumber = getBoardNumber(i);
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.position = cellNumber;
        
        const cellNumberDiv = document.createElement('div');
        cellNumberDiv.className = 'cell-number';
        cellNumberDiv.textContent = cellNumber;
        
        const cellContent = document.createElement('div');
        cellContent.className = 'cell-content';
        
        cell.appendChild(cellNumberDiv);
        cell.appendChild(cellContent);
        
        // Add snake or ladder if present
        if (gameState.snakePositions.includes(cellNumber)) {
            cell.classList.add('snake');
            const snakeEmoji = document.createElement('div');
            snakeEmoji.className = 'snake-emoji';
            snakeEmoji.textContent = '🐍';
            snakeEmoji.title = 'Snake: Need Anti-Venom evidence to avoid sliding down!';
            cell.appendChild(snakeEmoji);
        }
        
        if (gameState.ladderPositions.includes(cellNumber)) {
            cell.classList.add('ladder');
            const ladderEmoji = document.createElement('div');
            ladderEmoji.className = 'ladder-emoji';
            ladderEmoji.textContent = '🪜';
            ladderEmoji.title = 'Ladder: Show evidence to climb up!';
            cell.appendChild(ladderEmoji);
        }
        
        board.appendChild(cell);
        gameState.gameBoard.push(cell);
    }
}

// Get board number for snake-like arrangement
function getBoardNumber(index) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    
    if (row % 2 === 0) {
        // Even rows: left to right (1-10, 21-30, etc.)
        return (row * 10) + col + 1;
    } else {
        // Odd rows: right to left (11-20, 31-40, etc.)
        return (row * 10) + (10 - col);
    }
}

// Initialize players
function initializePlayers() {
    gameState.players = [
        { name: defaultPlayerNames[0], token: playerTokens[0], position: 0 },
        { name: defaultPlayerNames[1], token: playerTokens[1], position: 0 }
    ];
    gameState.currentPlayerIndex = 0;
    gameState.isGameActive = true;
    gameState.usedScenarios = {};
}

// Create scenario cards
function createCards() {
    createLadderCards();
    createAntivenomCards();
}

function createLadderCards() {
    const container = document.getElementById('ladderCards');
    container.innerHTML = '';
    
    ladderScenarios.forEach(scenario => {
        const card = document.createElement('div');
        card.className = 'card ladder-card';
        card.dataset.scenarioId = scenario.id;
        
        card.innerHTML = `
            <div class="card-title">${scenario.title}</div>
            <div class="card-description">${scenario.description}</div>
            <div class="card-evidence">${scenario.evidence}</div>
        `;
        
        container.appendChild(card);
    });
}

function createAntivenomCards() {
    const container = document.getElementById('antivenomCards');
    container.innerHTML = '';
    
    antivenomScenarios.forEach(scenario => {
        const card = document.createElement('div');
        card.className = 'card antivenom-card';
        card.dataset.scenarioId = scenario.id;
        
        card.innerHTML = `
            <div class="card-title">${scenario.title}</div>
            <div class="card-description">${scenario.description}</div>
            <div class="card-evidence">${scenario.evidence}</div>
        `;
        
        container.appendChild(card);
    });
}

// Add a new player
function addPlayer() {
    if (gameState.players.length >= 4) {
        showMessage('Maximum 4 players allowed!');
        return;
    }
    
    const newPlayerIndex = gameState.players.length;
    gameState.players.push({
        name: defaultPlayerNames[newPlayerIndex],
        token: playerTokens[newPlayerIndex],
        position: 0
    });
    
    updateUI();
    showMessage(`${defaultPlayerNames[newPlayerIndex]} joined the game!`);
    
    // Track player addition
    if (window.gameAnalytics) {
        window.gameAnalytics.trackPlayerAdded();
    }
}

// Update the UI
function updateUI() {
    updatePlayersList();
    updateCurrentPlayer();
    updateBoard();
}

// Update players list with edit functionality
function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player-info ${index === gameState.currentPlayerIndex ? 'current' : ''}`;
        playerDiv.dataset.playerIndex = index;
        
        playerDiv.innerHTML = `
            <span class="player-token">${player.token}</span>
            <span class="player-name">${player.name}</span>
            <span class="player-position">Position: ${player.position}</span>
            <span class="edit-player-icon">✏️</span>
        `;
        
        // Add click event for editing player name
        playerDiv.addEventListener('click', () => editPlayerName(index));
        
        playersList.appendChild(playerDiv);
    });
}

// Edit player name
function editPlayerName(playerIndex) {
    gameState.editingPlayer = playerIndex;
    const player = gameState.players[playerIndex];
    
    const modal = document.getElementById('playerEditModal');
    const input = document.getElementById('playerNameInput');
    
    input.value = player.name;
    modal.style.display = 'flex';
    
    // Focus on input
    setTimeout(() => input.focus(), 100);
}

// Save player name
function savePlayerName() {
    const input = document.getElementById('playerNameInput');
    const newName = input.value.trim();
    
    if (newName && gameState.editingPlayer !== null) {
        gameState.players[gameState.editingPlayer].name = newName;
        updateUI();
        showMessage(`Player name updated to ${newName}!`);
    }
    
    closePlayerEditModal();
}

// Close player edit modal
function closePlayerEditModal() {
    const modal = document.getElementById('playerEditModal');
    modal.style.display = 'none';
    gameState.editingPlayer = null;
}

// Open card edit modal
function openCardEditModal() {
    const modal = document.getElementById('cardEditModal');
    modal.style.display = 'flex';
    
    // Show ladder cards by default
    gameState.currentTab = 'ladder';
    updateCardEditList();
}

// Update card edit list
function updateCardEditList() {
    const list = document.getElementById('cardEditList');
    list.innerHTML = '';
    
    const scenarios = gameState.currentTab === 'ladder' ? ladderScenarios : antivenomScenarios;
    
    scenarios.forEach((scenario, index) => {
        const item = document.createElement('div');
        item.className = 'card-edit-item';
        
        item.innerHTML = `
            <input type="text" value="${scenario.title}" placeholder="Card Title" data-field="title" data-index="${index}">
            <textarea placeholder="Description" data-field="description" data-index="${index}">${scenario.description}</textarea>
            <textarea placeholder="Evidence Required" data-field="evidence" data-index="${index}">${scenario.evidence}</textarea>
            <button class="delete-card-button" onclick="deleteCard('${gameState.currentTab}', ${index})">🗑️ Delete</button>
        `;
        
        list.appendChild(item);
    });
}

// Add new card
function addNewCard() {
    const scenarios = gameState.currentTab === 'ladder' ? ladderScenarios : antivenomScenarios;
    const newId = Math.max(...scenarios.map(s => s.id), 0) + 1;
    
    scenarios.push({
        id: newId,
        title: "New Scenario",
        description: "Enter description here",
        evidence: "Evidence: Enter evidence requirements"
    });
    
    updateCardEditList();
}

// Delete card
function deleteCard(type, index) {
    const scenarios = type === 'ladder' ? ladderScenarios : antivenomScenarios;
    
    if (scenarios.length > 5) { // Keep minimum 5 cards
        scenarios.splice(index, 1);
        updateCardEditList();
    } else {
        showMessage('Minimum 5 cards required!');
    }
}

// Save card changes
function saveCardChanges() {
    const inputs = document.querySelectorAll('#cardEditList input, #cardEditList textarea');
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = parseInt(input.dataset.index);
        const scenarios = gameState.currentTab === 'ladder' ? ladderScenarios : antivenomScenarios;
        
        if (scenarios[index]) {
            scenarios[index][field] = input.value;
        }
    });
    
    // Refresh the card displays
    createCards();
    closeCardEditModal();
    showMessage('Cards updated successfully!');
}

// Close card edit modal
function closeCardEditModal() {
    const modal = document.getElementById('cardEditModal');
    modal.style.display = 'none';
}

// Update current player display
function updateCurrentPlayer() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPlayerDiv = document.getElementById('currentPlayer');
    
    currentPlayerDiv.innerHTML = `
        <span class="player-token">${currentPlayer.token}</span>
        <span class="player-name">${currentPlayer.name}</span>
    `;
}

// Update board with player positions
function updateBoard() {
    // Clear all player pieces from board
    gameState.gameBoard.forEach(cell => {
        const cellContent = cell.querySelector('.cell-content');
        cellContent.innerHTML = '';
    });
    
    // Place players on board
    gameState.players.forEach(player => {
        if (player.position > 0 && player.position <= 100) {
            const cell = gameState.gameBoard.find(cell => 
                parseInt(cell.dataset.position) === player.position
            );
            if (cell) {
                const cellContent = cell.querySelector('.cell-content');
                const playerPiece = document.createElement('span');
                playerPiece.className = 'player-piece';
                playerPiece.textContent = player.token;
                playerPiece.title = `${player.name} (Position: ${player.position})`;
                cellContent.appendChild(playerPiece);
            }
        }
    });
}

// Timer functions
function startTimer() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    gameState.gameTimer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            endGameByTime();
        }
    }, 1000);
    
    document.getElementById('startTimerButton').textContent = 'Timer Running';
    document.getElementById('startTimerButton').disabled = true;
    
    // Track timer start
    safeTrackEvent('timer_started', { 
        custom_parameter_1: 'game_timer',
        value: 3600 
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('gameTimer').textContent = display;
}

function resetTimer() {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    gameState.timeRemaining = 3600; // 60 minutes
    updateTimerDisplay();
    document.getElementById('startTimerButton').textContent = 'Start Timer';
    document.getElementById('startTimerButton').disabled = false;
}

function endGameByTime() {
    clearInterval(gameState.gameTimer);
    gameState.isGameActive = false;
    
    // Find player closest to 100
    let winner = gameState.players[0];
    gameState.players.forEach(player => {
        if (player.position > winner.position) {
            winner = player;
        }
    });
    
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.className = 'game-message winner';
    gameMessage.innerHTML = `
        ⏰ Time's Up! 🎉<br>
        ${winner.token} ${winner.name} wins with position ${winner.position}!
    `;
    gameMessage.style.display = 'block';
    
    // Track time-based game end
    if (window.gameAnalytics) {
        window.gameAnalytics.trackGameEnd(`${winner.name}_time_up`);
    }
    
    setTimeout(() => {
        gameMessage.style.display = 'none';
    }, 5000);
}

// Roll the dice
function rollDice() {
    if (!gameState.isGameActive) {
        showMessage('Game is not active! Start a new game.');
        return;
    }
    
    const rollButton = document.getElementById('rollButton');
    const dice = document.getElementById('dice');
    const diceValue = document.getElementById('diceValue');
    
    // Disable roll button temporarily
    rollButton.disabled = true;
    
    // Animate dice roll
    dice.style.animation = 'none';
    setTimeout(() => {
        dice.style.animation = 'roll 0.5s ease';
    }, 10);
    
    // Generate random number (1-6)
    const roll = Math.floor(Math.random() * 6) + 1;
    
    // Track dice roll
    safeTrackEvent('dice_rolled', { 
        custom_parameter_1: 'player_action',
        custom_parameter_2: `player_${gameState.currentPlayerIndex + 1}`,
        value: roll 
    });
    
    setTimeout(() => {
        diceValue.textContent = roll;
        dice.textContent = getDiceEmoji(roll);
        movePlayer(roll);
        rollButton.disabled = false;
    }, 500);
}

// Get dice emoji based on number
function getDiceEmoji(number) {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[number - 1];
}

// Move player
function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const newPosition = currentPlayer.position + steps;
    
    if (newPosition > 100) {
        // Can't move beyond 100, stay in current position
        showMessage(`${currentPlayer.name} needs exactly ${100 - currentPlayer.position} to win!`);
        nextTurn();
        return;
    }
    
    // Animate movement
    animateMovement(currentPlayer, newPosition);
}

// Animate player movement
function animateMovement(player, newPosition) {
    let currentPos = player.position;
    const moveInterval = setInterval(() => {
        currentPos++;
        player.position = currentPos;
        updateBoard();
        
        if (currentPos >= newPosition) {
            clearInterval(moveInterval);
            
            // Check for win condition
            if (newPosition === 100) {
                gameWon(player);
            } else {
                // Check for snake or ladder
                checkSpecialSquare(player, newPosition);
            }
        }
    }, 300);
}

// Check for special squares (snakes/ladders)
function checkSpecialSquare(player, position) {
    if (gameState.ladderPositions.includes(position)) {
        // Landed on ladder
        handleLadder(player, position);
    } else if (gameState.snakePositions.includes(position)) {
        // Landed on snake
        handleSnake(player, position);
    } else {
        // Normal square
        nextTurn();
    }
}

// Handle ladder encounter
function handleLadder(player, position) {
    const scenario = getRandomScenario(ladderScenarios, 'ladder');
    if (!scenario) {
        showMessage('No more ladder scenarios available!');
        nextTurn();
        return;
    }
    
    gameState.currentScenario = {
        type: 'ladder',
        scenario: scenario,
        player: player,
        position: position
    };
    
    showScenario(scenario, 'ladder');
    
    // Track ladder encounter
    safeTrackEvent('ladder_encountered', { 
        custom_parameter_1: 'game_event',
        custom_parameter_2: scenario.title,
        value: position 
    });
}

// Handle snake encounter
function handleSnake(player, position) {
    const scenario = getRandomScenario(antivenomScenarios, 'antivenom');
    if (!scenario) {
        showMessage('No more anti-venom scenarios available!');
        // Slide down the snake
        const slidePosition = Math.max(1, position - 20);
        player.position = slidePosition;
        updateBoard();
        showMessage(`🐍 ${player.name} slides down to position ${slidePosition}!`);
        setTimeout(() => nextTurn(), 2000);
        return;
    }
    
    gameState.currentScenario = {
        type: 'snake',
        scenario: scenario,
        player: player,
        position: position
    };
    
    showScenario(scenario, 'snake');
    
    // Track snake encounter
    safeTrackEvent('snake_encountered', { 
        custom_parameter_1: 'game_event',
        custom_parameter_2: scenario.title,
        value: position 
    });
}

// Get random scenario that hasn't been used by current player
function getRandomScenario(scenarios, type) {
    const playerId = gameState.currentPlayerIndex;
    const usedByPlayer = gameState.usedScenarios[playerId] || { ladder: [], antivenom: [] };
    const available = scenarios.filter(s => !usedByPlayer[type].includes(s.id));
    
    if (available.length === 0) {
        return null;
    }
    
    return available[Math.floor(Math.random() * available.length)];
}

// Show scenario
function showScenario(scenario, type) {
    const scenarioDisplay = document.getElementById('scenarioDisplay');
    const scenarioText = scenarioDisplay.querySelector('.scenario-text');
    const scenarioActions = document.getElementById('scenarioActions');
    
    const typeText = type === 'ladder' ? '🪜 Ladder' : '🐍💉 Anti-Venom';
    scenarioText.innerHTML = `
        <strong>${typeText}: ${scenario.title}</strong><br>
        ${scenario.description}<br>
        <em>${scenario.evidence}</em>
    `;
    
    scenarioActions.style.display = 'flex';
}

// Handle evidence response
function handleEvidence(hasEvidence) {
    const scenario = gameState.currentScenario;
    if (!scenario) return;
    
    // Mark scenario as used
    const playerId = gameState.currentPlayerIndex;
    if (!gameState.usedScenarios[playerId]) {
        gameState.usedScenarios[playerId] = { ladder: [], antivenom: [] };
    }
    gameState.usedScenarios[playerId][scenario.type].push(scenario.scenario.id);
    
    // Track evidence response
    if (window.gameAnalytics) {
        window.gameAnalytics.trackScenario(scenario.type, hasEvidence);
    }
    
    if (scenario.type === 'ladder') {
        if (hasEvidence) {
            // Climb the ladder
            const climbPosition = Math.min(100, scenario.position + 15);
            scenario.player.position = climbPosition;
            updateBoard();
            showMessage(`🪜 ${scenario.player.name} climbs the ladder to position ${climbPosition}!`);
            
            // Track successful ladder climb
            safeTrackEvent('ladder_climbed', { 
                custom_parameter_1: 'evidence_success',
                custom_parameter_2: scenario.scenario.title,
                value: 15 
            });
            
            if (climbPosition === 100) {
                setTimeout(() => gameWon(scenario.player), 2000);
                return;
            }
        } else {
            showMessage(`${scenario.player.name} missed the ladder opportunity - no evidence provided!`);
            
            // Track missed ladder opportunity
            safeTrackEvent('ladder_missed', { 
                custom_parameter_1: 'no_evidence',
                custom_parameter_2: scenario.scenario.title,
                value: 0 
            });
        }
    } else { // snake
        if (hasEvidence) {
            // Avoid the snake
            showMessage(`🐍💉 ${scenario.player.name} uses anti-venom and avoids the snake!`);
            
            // Track successful snake avoidance
            safeTrackEvent('snake_avoided', { 
                custom_parameter_1: 'evidence_success',
                custom_parameter_2: scenario.scenario.title,
                value: 20 
            });
        } else {
            // Slide down the snake
            const slidePosition = Math.max(1, scenario.position - 20);
            scenario.player.position = slidePosition;
            updateBoard();
            showMessage(`🐍 ${scenario.player.name} slides down the snake to position ${slidePosition}!`);
            
            // Track snake slide
            safeTrackEvent('snake_slide', { 
                custom_parameter_1: 'no_evidence',
                custom_parameter_2: scenario.scenario.title,
                value: -20 
            });
        }
    }
    
    // Clear scenario
    gameState.currentScenario = null;
    hideScenario();
    
    setTimeout(() => nextTurn(), 2000);
}

// Hide scenario
function hideScenario() {
    const scenarioText = document.querySelector('.scenario-text');
    const scenarioActions = document.getElementById('scenarioActions');
    
    scenarioText.textContent = 'Roll the dice to continue playing!';
    scenarioActions.style.display = 'none';
}

// Handle game win
function gameWon(player) {
    gameState.isGameActive = false;
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.className = 'game-message winner';
    gameMessage.innerHTML = `
        🎉 ${player.token} ${player.name} WINS! 🎉<br>
        <small>Career ready and reached position 100!</small>
    `;
    gameMessage.style.display = 'block';
    
    // Track game win
    if (window.gameAnalytics) {
        window.gameAnalytics.trackGameEnd(player.name);
    }
    
    safeTrackEvent('game_won', { 
        custom_parameter_1: 'victory',
        custom_parameter_2: player.name,
        value: 100 
    });
    
    setTimeout(() => {
        gameMessage.style.display = 'none';
    }, 5000);
}

// Move to next turn
function nextTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateUI();
}

// Show message to user
function showMessage(message, duration = 3000) {
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.className = 'game-message';
    gameMessage.textContent = message;
    gameMessage.style.display = 'block';
    
    setTimeout(() => {
        gameMessage.style.display = 'none';
    }, duration);
}

// Start new game
function newGame() {
    gameState.players.forEach(player => {
        player.position = 0;
    });
    gameState.currentPlayerIndex = 0;
    gameState.isGameActive = true;
    gameState.currentScenario = null;
    gameState.usedScenarios = {};
    
    const diceValue = document.getElementById('diceValue');
    const dice = document.getElementById('dice');
    diceValue.textContent = '-';
    dice.textContent = '🎲';
    
    resetTimer();
    hideScenario();
    updateUI();
    showMessage('New game started! Good luck with your career journey!');
    
    // Track new game start
    if (window.gameAnalytics) {
        window.gameAnalytics.trackGameStart();
    }
}

// Bind event listeners
function bindEvents() {
    document.getElementById('rollButton').addEventListener('click', rollDice);
    document.getElementById('newGameButton').addEventListener('click', newGame);
    document.getElementById('addPlayerButton').addEventListener('click', addPlayer);
    document.getElementById('startTimerButton').addEventListener('click', startTimer);
    document.getElementById('editCardsButton').addEventListener('click', openCardEditModal);
    
    // Evidence buttons
    document.getElementById('showEvidenceButton').addEventListener('click', () => handleEvidence(true));
    document.getElementById('noEvidenceButton').addEventListener('click', () => handleEvidence(false));
    
    // Player edit modal
    document.getElementById('savePlayerName').addEventListener('click', savePlayerName);
    document.getElementById('cancelPlayerEdit').addEventListener('click', closePlayerEditModal);
    
    // Card edit modal
    document.getElementById('saveCards').addEventListener('click', saveCardChanges);
    document.getElementById('cancelCardEdit').addEventListener('click', closeCardEditModal);
    document.getElementById('addNewCard').addEventListener('click', addNewCard);
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.currentTab = e.target.dataset.tab;
            updateCardEditList();
        });
    });
    
    // Allow dice click to roll
    document.getElementById('dice').addEventListener('click', rollDice);
    
    // Enter key on player name input
    document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            savePlayerName();
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            if (gameState.currentScenario) {
                // If scenario is active, don't roll dice
                return;
            }
            rollDice();
        }
        if (e.code === 'KeyN') {
            newGame();
        }
        if (e.code === 'KeyA') {
            addPlayer();
        }
        if (e.code === 'KeyT') {
            startTimer();
        }
    });
}

// Make deleteCard function global for onclick
window.deleteCard = deleteCard;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame); 