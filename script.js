// ==================== GLOBAL STATE ====================
let gameState = {
    xp: 0,
    level: 1,
    streak: 0,
    lastVisit: null,
    badges: {},
    game1Complete: false,
    game2Complete: false,
    game3Complete: false,
    quizPassed: false
};

// Badge Definitions
const BADGES = {
    first_step: { name: "First Step", icon: "🎯", desc: "Started learning" },
    concept_master: { name: "Concept Master", icon: "🧠", desc: "Revealed all concepts" },
    game1_rookie: { name: "Grid Explorer", icon: "🎮", desc: "Completed 5 episodes in Game 1" },
    game1_pro: { name: "Path Master", icon: "🏆", desc: "Completed 20 episodes in Game 1" },
    game2_starter: { name: "Business Starter", icon: "💼", desc: "Made 10 decisions in Game 2" },
    game2_mogul: { name: "Business Mogul", icon: "💰", desc: "Reached ₹50K revenue" },
    game3_novice: { name: "Notice Handler", icon: "📋", desc: "Handled 5 tax notices" },
    game3_expert: { name: "Tax Expert", icon: "⚖️", desc: "80% success rate with 10+ notices" },
    quiz_taker: { name: "Quiz Taker", icon: "📝", desc: "Attempted the quiz" },
    quiz_master: { name: "Quiz Master", icon: "🎓", desc: "Scored 80%+ on quiz" },
    level_5: { name: "Level 5", icon: "⭐", desc: "Reached level 5" },
    level_10: { name: "Level 10", icon: "🌟", desc: "Reached level 10" },
    streak_3: { name: "3-Day Streak", icon: "🔥", desc: "Visited 3 days in a row" },
    streak_7: { name: "Week Warrior", icon: "💪", desc: "Visited 7 days in a row" },
    completionist: { name: "Completionist", icon: "👑", desc: "Completed everything" }
};

// XP Levels
const XP_LEVELS = [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900, 3500];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initializeGames();
    updateUI();
    checkStreak();
    renderBadges();
    renderLeaderboard();
});

// ==================== LOCAL STORAGE ====================
function loadGameState() {
    const saved = localStorage.getItem('rlQuestState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

function saveGameState() {
    localStorage.setItem('rlQuestState', JSON.stringify(gameState));
    updateUI();
}

// ==================== XP & LEVELING SYSTEM ====================
function addXP(amount) {
    gameState.xp += amount;
    checkLevelUp();
    saveGameState();
    showToast(`+${amount} XP earned! 🎉`);
}

function checkLevelUp() {
    while (gameState.level < XP_LEVELS.length && gameState.xp >= XP_LEVELS[gameState.level]) {
        gameState.level++;
        showToast(`🎊 Level Up! You're now Level ${gameState.level}!`);
        if (gameState.level === 5) unlockBadge('level_5');
        if (gameState.level === 10) unlockBadge('level_10');
    }
}

function updateUI() {
    document.getElementById('totalXP').textContent = gameState.xp;
    document.getElementById('playerLevel').textContent = gameState.level;
    document.getElementById('streakCount').textContent = gameState.streak;

    // Update XP progress bar
    const currentLevelXP = XP_LEVELS[gameState.level - 1] || 0;
    const nextLevelXP = XP_LEVELS[gameState.level] || XP_LEVELS[XP_LEVELS.length - 1];
    const progress = ((gameState.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    document.getElementById('xpProgressBar').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('xpProgressText').textContent = 
        `${gameState.xp - currentLevelXP}/${nextLevelXP - currentLevelXP} XP to Level ${gameState.level + 1}`;

    checkCertificateEligibility();
}

// ==================== BADGE SYSTEM ====================
function unlockBadge(badgeId) {
    if (!gameState.badges[badgeId]) {
        gameState.badges[badgeId] = true;
        saveGameState();
        showBadgeUnlock(badgeId);
        renderBadges();
    }
}

function showBadgeUnlock(badgeId) {
    const badge = BADGES[badgeId];
    showToast(`🏆 Badge Unlocked: ${badge.icon} ${badge.name}!`);
}

function renderBadges() {
    const grid = document.getElementById('badgeGrid');
    grid.innerHTML = '';

    Object.entries(BADGES).forEach(([id, badge]) => {
        const isUnlocked = gameState.badges[id];
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        badgeEl.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.desc}</div>
        `;
        grid.appendChild(badgeEl);
    });
}

function toggleBadges() {
    const modal = document.getElementById('badgeModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// ==================== STREAK SYSTEM ====================
function checkStreak() {
    const today = new Date().toDateString();
    const lastVisit = gameState.lastVisit;

    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            gameState.streak++;
            if (gameState.streak === 3) unlockBadge('streak_3');
            if (gameState.streak === 7) unlockBadge('streak_7');
        } else if (daysDiff > 1) {
            gameState.streak = 1;
        }
    } else {
        gameState.streak = 1;
    }

    gameState.lastVisit = today;
    saveGameState();
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==================== CONCEPT REVEAL ====================
let revealedConcepts = 0;

function revealConcept(card, conceptId) {
    const detail = card.querySelector('.concept-detail');
    const preview = card.querySelector('.concept-preview');

    if (detail.classList.contains('hidden')) {
        detail.classList.remove('hidden');
        detail.classList.add('visible');
        preview.style.display = 'none';
        revealedConcepts++;
        addXP(5);

        if (revealedConcepts === 6) {
            unlockBadge('concept_master');
            addXP(20);
        }
    }
}

// ==================== GAME 1: CA EXAM PREP SIMULATOR ====================
let game1State = {
    gridSize: 7,
    episodes: 0,
    qTable: {},
    epsilon: 1.0,
    rewardHistory: [],
    currentReward: 0,
    isTraining: false,
    isRunning: false
};

function initializeGames() {
    resetGame1();
    resetGame2();
    resetGame3();
}

function resetGame1() {
    const difficulty = document.getElementById('game1Difficulty').value;
    game1State.gridSize = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 10 : 7;
    game1State.episodes = 0;
    game1State.qTable = {};
    game1State.epsilon = 1.0;
    game1State.rewardHistory = [];
    game1State.currentReward = 0;
    game1State.isTraining = false;
    game1State.isRunning = false;

    createGrid();
    updateGame1UI();
    renderQTable();
}

function createGrid() {
    const grid = document.getElementById('game1Grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${game1State.gridSize}, 50px)`;

    for (let i = 0; i < game1State.gridSize * game1State.gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;

        // Randomly assign cell types
        const rand = Math.random();
        if (i === 0) {
            cell.textContent = '🎓';
            cell.classList.add('agent');
        } else if (i === game1State.gridSize * game1State.gridSize - 1) {
            cell.textContent = '⭐';
            cell.classList.add('goal');
        } else if (rand < 0.3) {
            cell.classList.add('good');
            cell.dataset.reward = '10';
        } else if (rand < 0.45) {
            cell.classList.add('bad');
            cell.dataset.reward = '-5';
        } else {
            cell.dataset.reward = '-1';
        }

        grid.appendChild(cell);
    }
}

async function runGame1Episode() {
    if (game1State.isRunning) return;
    game1State.isRunning = true;

    const cells = document.querySelectorAll('#game1Grid .grid-cell');
    let position = 0;
    let episodeReward = 0;
    const path = [position];
    let steps = 0;
    const maxSteps = game1State.gridSize * game1State.gridSize * 2;

    return new Promise((resolve) => {
        const moveInterval = setInterval(() => {
            steps++;

            // Prevent infinite loops
            if (steps > maxSteps) {
                clearInterval(moveInterval);
                completeEpisode(episodeReward);
                game1State.isRunning = false;
                resolve();
                return;
            }

            // Choose action (epsilon-greedy)
            const action = chooseAction(position);
            const newPosition = getNewPosition(position, action);

            if (newPosition === position) {
                // Invalid move, try again
                return;
            }

            // Get reward
            const cell = cells[newPosition];
            const reward = cell.classList.contains('goal') ? 20 : 
                          parseInt(cell.dataset.reward) || 0;
            episodeReward += reward;

            // Update Q-table
            updateQTable(position, action, reward, newPosition);

            // Move agent
            cells[position].classList.remove('agent');
            cells[position].textContent = '';
            cells[newPosition].classList.add('agent');
            cells[newPosition].textContent = '🎓';

            position = newPosition;
            path.push(position);

            // Check if goal reached
            if (cells[position].classList.contains('goal')) {
                clearInterval(moveInterval);
                completeEpisode(episodeReward);

                // Highlight path
                setTimeout(() => {
                    path.forEach(p => {
                        if (!cells[p].classList.contains('goal') && !cells[p].classList.contains('agent')) {
                            cells[p].classList.add('path');
                        }
                    });
                }, 500);

                game1State.isRunning = false;
                resolve();
            }
        }, 200);
    });
}

function chooseAction(state) {
    // Epsilon-greedy policy
    if (Math.random() < game1State.epsilon) {
        // Explore: random action
        return Math.floor(Math.random() * 4); // 0=up, 1=right, 2=down, 3=left
    } else {
        // Exploit: best known action
        const qValues = game1State.qTable[state] || [0, 0, 0, 0];
        return qValues.indexOf(Math.max(...qValues));
    }
}

function getNewPosition(pos, action) {
    const row = Math.floor(pos / game1State.gridSize);
    const col = pos % game1State.gridSize;

    let newRow = row;
    let newCol = col;

    if (action === 0 && row > 0) newRow--; // up
    if (action === 1 && col < game1State.gridSize - 1) newCol++; // right
    if (action === 2 && row < game1State.gridSize - 1) newRow++; // down
    if (action === 3 && col > 0) newCol--; // left

    return newRow * game1State.gridSize + newCol;
}

function updateQTable(state, action, reward, nextState) {
    if (!game1State.qTable[state]) {
        game1State.qTable[state] = [0, 0, 0, 0];
    }

    const alpha = 0.1; // Learning rate
    const gamma = 0.9; // Discount factor

    const maxNextQ = game1State.qTable[nextState] ? 
        Math.max(...game1State.qTable[nextState]) : 0;

    game1State.qTable[state][action] += alpha * 
        (reward + gamma * maxNextQ - game1State.qTable[state][action]);
}

function completeEpisode(reward) {
    game1State.episodes++;
    game1State.currentReward = reward;
    game1State.rewardHistory.push(reward);
    game1State.epsilon = Math.max(0.1, game1State.epsilon * 0.95); // Decay epsilon

    updateGame1UI();
    renderQTable();
    drawChart();

    addXP(10);

    if (game1State.episodes === 5) unlockBadge('game1_rookie');
    if (game1State.episodes === 20) {
        unlockBadge('game1_pro');
        gameState.game1Complete = true;
        saveGameState();
        showToast('🎉 Game 1 Completed! You can now earn the certificate!');
    }

    // Reset grid for next episode
    setTimeout(() => createGrid(), 1500);
}

async function trainGame1() {
    if (game1State.isTraining) return;

    game1State.isTraining = true;
    const trainBtn = document.getElementById('trainBtn');
    trainBtn.disabled = true;
    trainBtn.textContent = 'Training...';

    for (let i = 0; i < 10; i++) {
        await runGame1Episode();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    game1State.isTraining = false;
    trainBtn.disabled = false;
    trainBtn.textContent = '🚀 Auto-Train (10 Episodes)';
}

function updateGame1UI() {
    document.getElementById('game1Episode').textContent = game1State.episodes;
    document.getElementById('game1Reward').textContent = game1State.currentReward;
    document.getElementById('game1Epsilon').textContent = game1State.epsilon.toFixed(2);
}

function renderQTable() {
    const container = document.getElementById('game1QTable');
    container.innerHTML = '<p><strong>Q-Table Values Explained:</strong></p>';
    container.innerHTML += '<p style="margin-bottom: 1rem;">Each row shows a position number and the expected reward for moving Up (↑), Right (→), Down (↓), or Left (←). Green cells indicate good moves (positive values), and the agent learns these through experience!</p>';

    const keyStates = [0, 1, 2, game1State.gridSize, game1State.gridSize * game1State.gridSize - 1];

    keyStates.forEach(state => {
        if (game1State.qTable[state]) {
            const row = document.createElement('div');
            row.className = 'qtable-row';
            row.innerHTML = `
                <div class="qtable-cell">Pos ${state}</div>
                <div class="qtable-cell ${game1State.qTable[state][0] > 0 ? 'high' : ''}">
                    ↑ ${game1State.qTable[state][0].toFixed(2)}
                </div>
                <div class="qtable-cell ${game1State.qTable[state][1] > 0 ? 'high' : ''}">
                    → ${game1State.qTable[state][1].toFixed(2)}
                </div>
                <div class="qtable-cell ${game1State.qTable[state][2] > 0 ? 'high' : ''}">
                    ↓ ${game1State.qTable[state][2].toFixed(2)}
                </div>
                <div class="qtable-cell ${game1State.qTable[state][3] > 0 ? 'high' : ''}">
                    ← ${game1State.qTable[state][3].toFixed(2)}
                </div>
            `;
            container.appendChild(row);
        }
    });
}

function drawChart() {
    const canvas = document.getElementById('game1Chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (game1State.rewardHistory.length < 2) return;

    const maxReward = Math.max(...game1State.rewardHistory, 0);
    const minReward = Math.min(...game1State.rewardHistory, 0);
    const range = maxReward - minReward || 1;

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width, height - 30);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xStep = (width - 50) / (game1State.rewardHistory.length - 1);

    game1State.rewardHistory.forEach((reward, i) => {
        const x = 40 + i * xStep;
        const y = height - 30 - ((reward - minReward) / range) * (height - 40);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Episode', width / 2, height - 5);
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reward', 0, 0);
    ctx.restore();
}

// ==================== GAME 2: BUSINESS DECISION GAME ====================
let game2State = {
    month: 1,
    revenue: 0,
    clients: 5,
    health: 50,
    decisions: [],
    revenueHistory: [],
    lastDecision: null,
    consecutiveCount: 0
};

function resetGame2() {
    game2State = {
        month: 1,
        revenue: 0,
        clients: 5,
        health: 50,
        decisions: [],
        revenueHistory: [],
        lastDecision: null,
        consecutiveCount: 0
    };
    updateGame2UI();
    document.getElementById('game2Log').innerHTML = '<p>Start making decisions... Remember: Variety is key!</p>';
}

function makeDecision(decision) {
    const difficulty = document.getElementById('game2Difficulty').value;
    let reward = 0;
    let message = '';
    let clientChange = 0;

    // Check for consecutive same decisions and apply diminishing returns
    let multiplier = 1.0;
    if (decision === game2State.lastDecision) {
        game2State.consecutiveCount++;
        // Diminishing returns: reduce by 20% for each consecutive same decision
        multiplier = Math.max(0.2, 1.0 - (game2State.consecutiveCount * 0.2));
        if (game2State.consecutiveCount >= 3) {
            message += '⚠️ Warning: Repeating same strategy has diminishing returns! ';
        }
    } else {
        game2State.consecutiveCount = 0;
        game2State.lastDecision = decision;
    }

    switch(decision) {
        case 'low_price':
            reward = difficulty === 'easy' ? 5000 : difficulty === 'hard' ? 3000 : 4000;
            clientChange = 2;
            message += '💵 Low pricing attracted new clients!';
            break;
        case 'med_price':
            reward = difficulty === 'easy' ? 8000 : difficulty === 'hard' ? 5000 : 7000;
            clientChange = 0;
            message += '💰 Balanced pricing maintained stability.';
            break;
        case 'high_price':
            reward = difficulty === 'easy' ? 12000 : difficulty === 'hard' ? 6000 : 10000;
            clientChange = -1;
            message += '💎 Premium pricing increased revenue but lost a client.';
            break;
        case 'premium':
            reward = difficulty === 'easy' ? 15000 : difficulty === 'hard' ? 8000 : 12000;
            clientChange = 1;
            message += '⭐ Premium service impressed clients!';
            break;
    }

    // Apply diminishing returns multiplier
    reward = Math.floor(reward * multiplier);

    // Add penalty message if multiplier is applied
    if (multiplier < 1.0) {
        message += ` (${Math.round(multiplier * 100)}% effectiveness due to repetition)`;
    }

    game2State.month++;
    game2State.revenue += reward;
    game2State.clients += clientChange;
    game2State.clients = Math.max(1, game2State.clients); // At least 1 client
    game2State.health = Math.min(100, Math.max(0, 
        game2State.health + (reward > 7000 ? 10 : -5)));
    game2State.decisions.push(decision);
    game2State.revenueHistory.push(game2State.revenue);

    logDecision(message, reward);
    updateGame2UI();
    drawGame2Chart();

    addXP(5);

    if (game2State.decisions.length === 10) unlockBadge('game2_starter');
    if (game2State.revenue >= 50000) {
        unlockBadge('game2_mogul');
        gameState.game2Complete = true;
        saveGameState();
        showToast('🎉 Game 2 Completed! You can now earn the certificate!');
    }
}

function logDecision(message, revenue) {
    const log = document.getElementById('game2Log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <strong>Month ${game2State.month - 1}:</strong> ${message}<br>
        <small>Revenue: +₹${revenue.toLocaleString()}</small>
    `;
    log.insertBefore(entry, log.firstChild);
}

function updateGame2UI() {
    document.getElementById('game2Month').textContent = game2State.month;
    document.getElementById('game2Revenue').textContent = game2State.revenue.toLocaleString();
    document.getElementById('game2Clients').textContent = game2State.clients;
    document.getElementById('healthBar').style.width = game2State.health + '%';
}

function drawGame2Chart() {
    const canvas = document.getElementById('game2Chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (game2State.revenueHistory.length < 2) return;

    const maxRevenue = Math.max(...game2State.revenueHistory);

    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width, height - 30);
    ctx.stroke();

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const xStep = (width - 50) / (game2State.revenueHistory.length - 1);

    game2State.revenueHistory.forEach((revenue, i) => {
        const x = 40 + i * xStep;
        const y = height - 30 - (revenue / maxRevenue) * (height - 40);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Months', width / 2, height - 5);
}

// ==================== GAME 3: TAX NOTICE RESPONSE ====================
let game3State = {
    noticesHandled: 0,
    successCount: 0,
    explorationRate: 0.8,
    scenarios: [
        {
            title: "📨 Notice: TDS Mismatch Detected",
            desc: "Form 26AS shows TDS of ₹50,000 but you claimed ₹55,000 in ITR. Department asking for clarification.",
            options: [
                { text: "Respond immediately with all documents", reward: 0.9, strategy: "aggressive" },
                { text: "First verify with deductor, then respond", reward: 1.0, strategy: "balanced" },
                { text: "File revised return immediately", reward: 0.5, strategy: "defensive" },
                { text: "Wait for final notice", reward: 0.2, strategy: "risky" }
            ]
        },
        {
            title: "📨 Notice: Section 143(1) Intimation",
            desc: "Adjustment made in ITR due to disallowance of ₹80C deduction. Demand raised.",
            options: [
                { text: "Pay demand and move on", reward: 0.5, strategy: "defensive" },
                { text: "File rectification with proof", reward: 1.0, strategy: "balanced" },
                { text: "Ignore if amount is small", reward: 0.1, strategy: "risky" },
                { text: "Consult senior CA first", reward: 0.8, strategy: "cautious" }
            ]
        },
        {
            title: "📨 Notice: Unexplained Cash Deposit",
            desc: "Bank statements show cash deposits of ₹5L. Department asking for source.",
            options: [
                { text: "Provide complete source documentation", reward: 1.0, strategy: "balanced" },
                { text: "Say it was old savings", reward: 0.3, strategy: "risky" },
                { text: "Submit gift deed from relatives", reward: 0.7, strategy: "defensive" },
                { text: "Claim agricultural income", reward: 0.4, strategy: "risky" }
            ]
        }
    ],
    currentScenario: 0,
    knownStrategies: {}
};

function resetGame3() {
    game3State.noticesHandled = 0;
    game3State.successCount = 0;
    game3State.explorationRate = 0.8;
    game3State.currentScenario = 0;
    loadNewNotice();
    updateGame3UI();
}

function loadNewNotice() {
    game3State.currentScenario = Math.floor(Math.random() * game3State.scenarios.length);
    const scenario = game3State.scenarios[game3State.currentScenario];

    document.getElementById('noticeTitle').textContent = scenario.title;
    document.getElementById('noticeDesc').textContent = scenario.desc;

    const optionsContainer = document.getElementById('scenarioOptions');
    optionsContainer.innerHTML = '';

    scenario.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => handleResponse(index);
        optionsContainer.appendChild(btn);
    });

    updateExplorationSlider();
}

function handleResponse(optionIndex) {
    const scenario = game3State.scenarios[game3State.currentScenario];
    const option = scenario.options[optionIndex];

    game3State.noticesHandled++;

    // Learn from this decision
    if (!game3State.knownStrategies[game3State.currentScenario]) {
        game3State.knownStrategies[game3State.currentScenario] = [];
    }
    game3State.knownStrategies[game3State.currentScenario].push(option.reward);

    // Determine success
    const success = option.reward >= 0.8;
    if (success) {
        game3State.successCount++;
        showToast(`✅ Great choice! ${option.strategy} strategy worked!`);
    } else {
        showToast(`⚠️ Could be better. Try a different approach next time.`);
    }

    // Reduce exploration over time
    game3State.explorationRate = Math.max(0.2, game3State.explorationRate * 0.9);

    updateGame3UI();
    addXP(10);

    if (game3State.noticesHandled === 5) unlockBadge('game3_novice');
    if (game3State.noticesHandled >= 10 && 
        (game3State.successCount / game3State.noticesHandled) >= 0.8) {
        unlockBadge('game3_expert');
        gameState.game3Complete = true;
        saveGameState();
        showToast('🎉 Game 3 Completed! You can now earn the certificate!');
    }

    setTimeout(loadNewNotice, 2000);
}

function updateGame3UI() {
    document.getElementById('noticesHandled').textContent = game3State.noticesHandled;
    const successRate = game3State.noticesHandled > 0 ? 
        ((game3State.successCount / game3State.noticesHandled) * 100).toFixed(0) : 0;
    document.getElementById('successRate').textContent = successRate + '%';

    const strategy = game3State.explorationRate > 0.5 ? 'Exploring' : 'Exploiting';
    document.getElementById('currentStrategy').textContent = strategy;

    updateExplorationSlider();
}

function updateExplorationSlider() {
    const slider = document.getElementById('explorationSlider');
    slider.style.width = (game3State.explorationRate * 100) + '%';
}

// ==================== QUIZ ====================
const quizQuestions = [
    {
        q: "What is the main component that makes decisions in RL?",
        options: ["Environment", "Agent", "Reward", "Policy"],
        correct: 1
    },
    {
        q: "What does 'reward' represent in Reinforcement Learning?",
        options: ["Punishment only", "Feedback for actions", "Final score", "Number of states"],
        correct: 1
    },
    {
        q: "In the CA exam simulator, what does exploration mean?",
        options: ["Always taking the best known path", "Trying new/different paths", "Staying in one place", "Skipping chapters"],
        correct: 1
    },
    {
        q: "What is a Q-table used for?",
        options: ["Storing rewards", "Storing learned values for state-action pairs", "Counting episodes", "Measuring time"],
        correct: 1
    },
    {
        q: "What happens to epsilon (ε) during training?",
        options: ["Increases", "Stays same", "Decreases", "Becomes random"],
        correct: 2
    }
];

let quizState = {
    currentQuestion: 0,
    score: 0,
    answers: []
};

function startQuiz() {
    quizState = { currentQuestion: 0, score: 0, answers: [] };
    renderQuiz();
}

function renderQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';

    quizQuestions.forEach((q, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `<h3>Q${qIndex + 1}: ${q.q}</h3>`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';

        q.options.forEach((option, oIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.onclick = () => selectOption(qIndex, oIndex, optionDiv);
            optionsDiv.appendChild(optionDiv);
        });

        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'cta-btn';
    submitBtn.textContent = 'Submit Quiz';
    submitBtn.onclick = submitQuiz;
    container.appendChild(submitBtn);
}

function selectOption(qIndex, oIndex, element) {
    const options = element.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    quizState.answers[qIndex] = oIndex;
}

function submitQuiz() {
    let correct = 0;

    quizQuestions.forEach((q, index) => {
        const userAnswer = quizState.answers[index];
        if (userAnswer === q.correct) {
            correct++;
        }

        const options = document.querySelectorAll('.quiz-question')[index]
            .querySelectorAll('.quiz-option');
        options[q.correct].classList.add('correct');
        if (userAnswer !== q.correct && userAnswer !== undefined) {
            options[userAnswer].classList.add('incorrect');
        }
    });

    const percentage = (correct / quizQuestions.length) * 100;

    unlockBadge('quiz_taker');
    addXP(50);

    if (percentage >= 80) {
        unlockBadge('quiz_master');
        gameState.quizPassed = true;
        saveGameState();
        showToast(`🎉 Excellent! You scored ${percentage.toFixed(0)}%!`);
        addXP(50);
    } else {
        showToast(`You scored ${percentage.toFixed(0)}%. Try again for 80%+!`);
    }
}

// ==================== CERTIFICATE ====================
function checkCertificateEligibility() {
    const req1 = gameState.game1Complete;
    const req2 = gameState.game2Complete;
    const req3 = gameState.game3Complete;
    const req4 = gameState.quizPassed;
    const req5 = gameState.level >= 5;

    if (req1) document.getElementById('req1').classList.add('completed');
    if (req2) document.getElementById('req2').classList.add('completed');
    if (req3) document.getElementById('req3').classList.add('completed');
    if (req4) document.getElementById('req4').classList.add('completed');
    if (req5) document.getElementById('req5').classList.add('completed');

    const allComplete = req1 && req2 && req3 && req4 && req5;
    document.getElementById('certBtn').disabled = !allComplete;

    if (allComplete) {
        unlockBadge('completionist');
    }
}

function generateCertificate() {
    const name = prompt("Enter your name for the certificate:");
    if (!name) return;

    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Georgia', serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                }
                .certificate {
                    background: white;
                    padding: 3rem;
                    border: 15px solid gold;
                    text-align: center;
                    max-width: 700px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                h1 {
                    color: #667eea;
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .name {
                    color: #764ba2;
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin: 2rem 0;
                    border-bottom: 3px solid #764ba2;
                    padding-bottom: 0.5rem;
                }
                .stats {
                    margin: 2rem 0;
                    font-size: 1.1rem;
                }
                .footer {
                    margin-top: 2rem;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1>🏆 Certificate of Achievement 🏆</h1>
                <p style="font-size: 1.2rem; margin: 2rem 0;">This certifies that</p>
                <div class="name">${name}</div>
                <p style="font-size: 1.2rem; margin: 2rem 0;">has successfully completed</p>
                <h2 style="color: #667eea; font-size: 1.8rem;">RL Quest: Reinforcement Learning Mastery</h2>
                <div class="stats">
                    <p>✓ Completed all three interactive games</p>
                    <p>✓ Achieved Level ${gameState.level}</p>
                    <p>✓ Earned ${Object.keys(gameState.badges).length} badges</p>
                    <p>✓ Total XP: ${gameState.xp}</p>
                </div>
                <div class="footer">
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p style="margin-top: 1rem;">Created by CA Tanmay Rajendra Bhavar (Nashik)<br>FCA, DISA (ICAI) | ICITSS/AICITSS/AURA Faculty</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const win = window.open('', '_blank');
    win.document.write(certHTML);
    win.document.title = 'RL Quest Certificate - ' + name;

    addXP(100);
    showToast('🎓 Certificate generated! You can print or save it.');
}

// ==================== LEADERBOARD ====================
function addToLeaderboard() {
    const name = prompt("Enter your name for the leaderboard:");
    if (!name) return;

    const leaderboard = JSON.parse(localStorage.getItem('rlQuestLeaderboard') || '[]');

    leaderboard.push({
        name: name,
        level: gameState.level,
        xp: gameState.xp,
        badges: Object.keys(gameState.badges).length,
        date: new Date().toISOString()
    });

    leaderboard.sort((a, b) => b.xp - a.xp);
    localStorage.setItem('rlQuestLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));

    renderLeaderboard();
    showToast('📊 Added to leaderboard!');
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('rlQuestLeaderboard') || '[]');
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No entries yet. Be the first!</td></tr>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.level}</td>
            <td>${entry.xp}</td>
            <td>${entry.badges}</td>
        `;
    });
}

// ==================== UTILITY ====================
// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('badgeModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

console.log('🎮 RL Quest initialized! Start your learning journey!');
