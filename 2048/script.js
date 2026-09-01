// Sound Controller using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = localStorage.getItem('2048_muted') === 'true';

function playSound(type) {
    if (isMuted) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'move') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'merge') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }
}

// Elements
const gridContainer = document.getElementById('grid-container');
const tileContainer = document.getElementById('tile-container');
const scoreElem = document.getElementById('score');
const bestScoreElem = document.getElementById('best-score');
const scoreAdditionElem = document.getElementById('score-addition');
const undoBtn = document.getElementById('undo-btn');
const retryBtn = document.getElementById('retry-btn');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');

// Top bar & Modals
const settingsBtn = document.getElementById('settings-btn');
const statsBtn = document.getElementById('stats-btn');
const settingsModal = document.getElementById('settings-modal');
const statsModal = document.getElementById('stats-modal');

// Settings Elements
const themeBtn = document.getElementById('theme-btn');
const soundBtn = document.getElementById('sound-btn');
const sizeSelect = document.getElementById('size-select');
const skinSelect = document.getElementById('skin-select');
const speedSelect = document.getElementById('speed-select');
const newGameBtn = document.getElementById('new-game-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

// Stats Elements
const statPlayed = document.getElementById('stat-played');
const statWins = document.getElementById('stat-wins');
const statHighest = document.getElementById('stat-highest');
const closeStatsBtn = document.getElementById('close-stats-btn');

// Share Buttons
const shareStatsBtn = document.getElementById('share-stats-btn');
const shareGameOverBtn = document.getElementById('share-game-over-btn');

// State Variables
let SIZE = parseInt(localStorage.getItem('2048_size')) || 4;
let grid = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;
let isGameWon = false;
let history = []; 
let tileIdCounter = 0;

// Stats Data
let stats = JSON.parse(localStorage.getItem('2048_stats')) || { played: 0, wins: 0, highest: 0 };

function getStorageKeys() {
    return {
        state: `gameState2048_${SIZE}`,
        best: `bestScore2048_${SIZE}`
    };
}

function init() {
    // Apply Settings
    if (localStorage.getItem('2048_theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    
    const skin = localStorage.getItem('2048_skin') || 'classic';
    skinSelect.value = skin;
    document.body.className = document.body.className.replace(/skin-\w+/g, '');
    document.body.classList.add(`skin-${skin}`);
    
    const speed = localStorage.getItem('2048_speed') || 'normal';
    speedSelect.value = speed;
    if (speed === 'fast') document.body.classList.add('speed-fast');

    updateSoundBtnIcon();
    sizeSelect.value = SIZE;

    loadBestScore();
    createGridCells();
    setupInput();
    
    const savedState = loadState();
    if (savedState) {
        grid = savedState.grid;
        score = savedState.score;
        history = savedState.history;
        tileIdCounter = savedState.tileIdCounter;
        updateScore(0);
        renderTiles(true);
        updateUndoButton();
    } else {
        resetGame(true);
    }
}

function loadBestScore() {
    const keys = getStorageKeys();
    bestScore = parseInt(localStorage.getItem(keys.best)) || 0;
    bestScoreElem.textContent = bestScore;
}

function saveState() {
    const keys = getStorageKeys();
    const state = {
        grid: grid,
        score: score,
        history: history,
        tileIdCounter: tileIdCounter
    };
    localStorage.setItem(keys.state, JSON.stringify(state));
}

function loadState() {
    const keys = getStorageKeys();
    const saved = localStorage.getItem(keys.state);
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return null; }
    }
    return null;
}

function clearState() {
    const keys = getStorageKeys();
    localStorage.removeItem(keys.state);
}

function saveStats() {
    localStorage.setItem('2048_stats', JSON.stringify(stats));
}

function updateStatsHighest(val) {
    if (val > stats.highest) {
        stats.highest = val;
        saveStats();
    }
}

function pushHistory() {
    history.push({
        grid: grid.map(row => row.map(cell => cell ? {...cell} : null)),
        score: score,
        tileIdCounter: tileIdCounter
    });
    updateUndoButton();
}

function undo() {
    if (history.length === 0) return;
    const previous = history.pop();
    grid = previous.grid;
    score = previous.score;
    tileIdCounter = previous.tileIdCounter;
    
    scoreElem.textContent = score;
    isGameOver = false;
    isGameWon = false;
    gameMessage.classList.remove('active', 'game-over');
    
    renderTiles(true); 
    updateUndoButton();
    saveState();
}

function updateUndoButton() {
    undoBtn.disabled = history.length === 0;
}

function createGridCells() {
    gridContainer.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${SIZE}, 1fr)`;
    gridContainer.innerHTML = '';
    
    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridContainer.appendChild(cell);
    }
}

function resetGame(isNewGameSession = false) {
    if (isNewGameSession) {
        stats.played++;
        saveStats();
    }

    grid = Array(SIZE).fill().map(() => Array(SIZE).fill(null));
    score = 0;
    history = [];
    tileIdCounter = 0;
    isGameOver = false;
    isGameWon = false;
    
    updateScore(0);
    gameMessage.classList.remove('active', 'game-over');
    tileContainer.innerHTML = ''; 
    updateUndoButton();
    clearState();
    
    addRandomTile();
    addRandomTile();
    renderTiles();
    saveState();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === null) emptyCells.push({ r, c });
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const val = Math.random() < 0.9 ? 2 : 4;
        grid[randomCell.r][randomCell.c] = {
            id: tileIdCounter++,
            value: val,
            isNew: true
        };
        updateStatsHighest(val);
    }
}

function updateScore(points) {
    score += points;
    scoreElem.textContent = score;
    
    if (points > 0) {
        scoreAdditionElem.textContent = `+${points}`;
        scoreAdditionElem.classList.remove('active');
        void scoreAdditionElem.offsetWidth; 
        scoreAdditionElem.classList.add('active');
    }
    
    if (score > bestScore) {
        bestScore = score;
        bestScoreElem.textContent = bestScore;
        const keys = getStorageKeys();
        localStorage.setItem(keys.best, bestScore);
    }
}

function renderTiles(forceRecreate = false) {
    if (forceRecreate) tileContainer.innerHTML = '';
    
    const existingElements = Array.from(tileContainer.children);
    const elementsToKeep = new Set();
    
    const gap = 12;
    const percentage = 100 / SIZE;
    
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const tileData = grid[r][c];
            if (tileData) {
                const elId = `tile-${tileData.id}`;
                let el = document.getElementById(elId);
                
                if (!el) {
                    el = document.createElement('div');
                    el.id = elId;
                    el.classList.add('tile');
                    tileContainer.appendChild(el);
                    
                    if (tileData.isNew) {
                        el.classList.add('tile-new');
                        tileData.isNew = false;
                    }
                }
                
                elementsToKeep.add(el);
                
                // Position and Size
                el.style.width = `calc(${percentage}% - ${(gap * (SIZE - 1) / SIZE)}px)`;
                el.style.height = `calc(${percentage}% - ${(gap * (SIZE - 1) / SIZE)}px)`;
                el.style.top = `calc(${r * percentage}% + ${(r * gap / SIZE)}px)`;
                el.style.left = `calc(${c * percentage}% + ${(c * gap / SIZE)}px)`;
                
                el.className = `tile tile-color-${tileData.value > 2048 ? 'super' : tileData.value}`;
                el.textContent = tileData.value;
                
                if (tileData.isMerged) {
                    el.classList.add('tile-merged');
                    tileData.isMerged = false;
                    setTimeout(() => el.classList.remove('tile-merged'), 200);
                }
            }
        }
    }
    
    existingElements.forEach(el => {
        if (!elementsToKeep.has(el)) {
            el.style.zIndex = "9";
            setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 150); 
        }
    });
}

function move(dir) {
    if (isGameOver) return;
    
    let moved = false;
    let scoreGained = 0;
    let hasMergedSound = false;
    
    let newGrid = Array(SIZE).fill().map(() => Array(SIZE).fill(null));
    pushHistory();
    
    const slide = (rowArray) => {
        let filtered = rowArray.filter(cell => cell.tileData !== null);
        let newRow = [];
        let i = 0;
        
        while (i < filtered.length) {
            if (i < filtered.length - 1 && filtered[i].tileData.value === filtered[i+1].tileData.value) {
                const mergedValue = filtered[i].tileData.value * 2;
                scoreGained += mergedValue;
                hasMergedSound = true;
                updateStatsHighest(mergedValue);
                
                const newTile = { id: tileIdCounter++, value: mergedValue, isMerged: true };
                newRow.push(newTile);
                newRow[newRow.length - 1].mergedFrom = [filtered[i].tileData.id, filtered[i+1].tileData.id];
                i += 2;
            } else {
                newRow.push(filtered[i].tileData);
                i++;
            }
        }
        while (newRow.length < SIZE) newRow.push(null);
        return { newRow };
    };

    let oldTilesToMove = [];
    
    if (dir === 'left' || dir === 'right') {
        for (let r = 0; r < SIZE; r++) {
            let rowObjects = grid[r].map((tileData, c) => ({tileData, r, c}));
            if (dir === 'right') rowObjects = rowObjects.reverse();
            
            let { newRow } = slide(rowObjects);
            if (dir === 'right') newRow = newRow.reverse();
            
            for (let c = 0; c < SIZE; c++) {
                if ((grid[r][c] && !newRow[c]) || (!grid[r][c] && newRow[c]) || (grid[r][c] && newRow[c] && grid[r][c].id !== newRow[c].id)) {
                    moved = true;
                }
                newGrid[r][c] = newRow[c];
                
                if (newRow[c] && newRow[c].mergedFrom) {
                    newRow[c].mergedFrom.forEach(oldId => oldTilesToMove.push({ id: oldId, targetR: r, targetC: c }));
                    delete newRow[c].mergedFrom;
                }
            }
        }
    } else if (dir === 'up' || dir === 'down') {
        for (let c = 0; c < SIZE; c++) {
            let colObjects = [];
            for (let r = 0; r < SIZE; r++) colObjects.push({tileData: grid[r][c], r, c});
            if (dir === 'down') colObjects = colObjects.reverse();
            
            let { newRow: newCol } = slide(colObjects);
            if (dir === 'down') newCol = newCol.reverse();
            
            for (let r = 0; r < SIZE; r++) {
                if ((grid[r][c] && !newCol[r]) || (!grid[r][c] && newCol[r]) || (grid[r][c] && newCol[r] && grid[r][c].id !== newCol[r].id)) {
                    moved = true;
                }
                newGrid[r][c] = newCol[r];
                
                if (newCol[r] && newCol[r].mergedFrom) {
                    newCol[r].mergedFrom.forEach(oldId => oldTilesToMove.push({ id: oldId, targetR: r, targetC: c }));
                    delete newCol[r].mergedFrom;
                }
            }
        }
    }
    
    if (moved) {
        const gap = 12;
        const percentage = 100 / SIZE;
        oldTilesToMove.forEach(ot => {
            const el = document.getElementById(`tile-${ot.id}`);
            if (el) {
                el.style.top = `calc(${ot.targetR * percentage}% + ${(ot.targetR * gap / SIZE)}px)`;
                el.style.left = `calc(${ot.targetC * percentage}% + ${(ot.targetC * gap / SIZE)}px)`;
            }
        });

        grid = newGrid;
        if (scoreGained > 0) updateScore(scoreGained);
        
        addRandomTile();
        renderTiles();
        
        if (hasMergedSound) playSound('merge');
        else playSound('move');
        
        saveState();
        checkGameState();
    } else {
        history.pop();
        updateUndoButton();
    }
}

function checkGameState() {
    if (!isGameWon) {
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (grid[r][c] && grid[r][c].value === 2048) {
                    isGameWon = true;
                    stats.wins++;
                    saveStats();
                    triggerConfetti();
                }
            }
        }
    }
    
    let hasEmpty = false;
    let canMerge = false;
    
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === null) hasEmpty = true;
            if (r < SIZE - 1 && grid[r][c] && grid[r+1][c] && grid[r][c].value === grid[r+1][c].value) canMerge = true;
            if (c < SIZE - 1 && grid[r][c] && grid[r][c+1] && grid[r][c].value === grid[r][c+1].value) canMerge = true;
        }
    }
    
    if (!hasEmpty && !canMerge) {
        isGameOver = true;
        messageText.textContent = 'Game Over!';
        gameMessage.className = 'game-message active game-over';
    }
}

function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 150,
            spread: 180,
            origin: { y: 0.6 },
            zIndex: 1001
        });
    }
}

// Share Feature
function generateShareString() {
    let str = `2048 Premium (${SIZE}x${SIZE})\nScore: ${score}\n\n`;
    const isLightMode = document.body.classList.contains('light-mode');
    
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === null) {
                str += isLightMode ? "⬜" : "⬛";
            } else {
                const v = grid[r][c].value;
                if (v <= 4) str += "🟦";
                else if (v <= 16) str += "🟪";
                else if (v <= 64) str += "🟥";
                else if (v <= 256) str += "🟧";
                else if (v <= 1024) str += "🟩";
                else str += "🟨";
            }
        }
        str += "\n";
    }
    return str;
}

async function shareScore(btnElement) {
    const shareStr = generateShareString();
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: '2048 Premium',
                text: shareStr,
            });
        } else {
            await navigator.clipboard.writeText(shareStr);
            const originalText = btnElement.textContent;
            btnElement.textContent = "Copied! ✅";
            setTimeout(() => btnElement.textContent = originalText, 2000);
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}

// UI Setup
function setupInput() {
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
        }
    });
    
    let touchStartX = 0, touchStartY = 0;
    gridContainer.parentElement.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: false}); 
    gridContainer.parentElement.addEventListener('touchmove', (e) => e.preventDefault(), {passive: false});
    gridContainer.parentElement.addEventListener('touchend', (e) => handleSwipe(touchStartX, touchStartY, e.changedTouches[0].screenX, e.changedTouches[0].screenY));

    let isMouseDown = false;
    let mouseStartX = 0, mouseStartY = 0;
    gridContainer.parentElement.addEventListener('mousedown', (e) => { isMouseDown = true; mouseStartX = e.screenX; mouseStartY = e.screenY; });
    gridContainer.parentElement.addEventListener('mousemove', (e) => { if (isMouseDown) e.preventDefault(); });
    gridContainer.parentElement.addEventListener('mouseup', (e) => { if (!isMouseDown) return; isMouseDown = false; handleSwipe(mouseStartX, mouseStartY, e.screenX, e.screenY); });
    gridContainer.parentElement.addEventListener('mouseleave', (e) => { if (!isMouseDown) return; isMouseDown = false; handleSwipe(mouseStartX, mouseStartY, e.screenX, e.screenY); });
    
    undoBtn.addEventListener('click', undo);
    retryBtn.addEventListener('click', () => resetGame(true));
    
    shareStatsBtn.addEventListener('click', (e) => shareScore(e.target));
    shareGameOverBtn.addEventListener('click', (e) => shareScore(e.target));

    // Modals
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    
    statsBtn.addEventListener('click', () => {
        statPlayed.textContent = stats.played;
        statWins.textContent = stats.wins;
        statHighest.textContent = stats.highest;
        statsModal.classList.add('active');
    });
    closeStatsBtn.addEventListener('click', () => statsModal.classList.remove('active'));

    // Settings Controls
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('2048_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        localStorage.setItem('2048_muted', isMuted);
        updateSoundBtnIcon();
    });

    skinSelect.addEventListener('change', (e) => {
        const skin = e.target.value;
        localStorage.setItem('2048_skin', skin);
        document.body.className = document.body.className.replace(/skin-\w+/g, '');
        document.body.classList.add(`skin-${skin}`);
    });

    speedSelect.addEventListener('change', (e) => {
        const speed = e.target.value;
        localStorage.setItem('2048_speed', speed);
        if (speed === 'fast') document.body.classList.add('speed-fast');
        else document.body.classList.remove('speed-fast');
    });

    sizeSelect.addEventListener('change', (e) => {
        SIZE = parseInt(e.target.value);
        localStorage.setItem('2048_size', SIZE);
        loadBestScore();
        createGridCells();
        const savedState = loadState();
        if (savedState) {
            grid = savedState.grid;
            score = savedState.score;
            history = savedState.history;
            tileIdCounter = savedState.tileIdCounter;
            updateScore(0);
            renderTiles(true);
            updateUndoButton();
        } else {
            resetGame(true);
        }
    });
    
    newGameBtn.addEventListener('click', () => {
        if (score > 0) {
            if (!confirm("Are you sure you want to abandon your current game and start a new one?")) {
                return;
            }
        }
        resetGame(true);
        settingsModal.classList.remove('active');
    });
}

function updateSoundBtnIcon() {
    soundBtn.textContent = isMuted ? '🔇' : '🔊';
    if (isMuted) soundBtn.classList.add('muted');
    else soundBtn.classList.remove('muted');
}

function handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX, diffY = endY - startY;
    const threshold = 30;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) move(diffX > 0 ? 'right' : 'left');
    } else {
        if (Math.abs(diffY) > threshold) move(diffY > 0 ? 'down' : 'up');
    }
}

init();
