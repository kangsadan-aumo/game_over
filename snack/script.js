const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const progressFill = document.getElementById('progress-fill');
const gameOverScreen = document.getElementById('gameOverScreen');
const startScreen = document.getElementById('startScreen');
const restartBtn = document.getElementById('restartBtn');

// The canvas size is set in HTML to 260x180
const gridSize = 10; // Smaller grid for a more detailed textured snake
const tileCountX = canvas.width / gridSize; // 26
const tileCountY = canvas.height / gridSize; // 18

let snake = [];
let food = { x: 10, y: 10 };
let bonusFood = null;
let foodsEaten = 0;
let obstacles = [];
let dx = 0;
let dy = 0;
let lastDx = 0;
let lastDy = 0;
let score = 0;
let gameInterval;
let isGameOver = false;
let isGameStarted = false;
let currentMode = 'box'; 

const initialSpeed = 120;
const minSpeed = 50;
let currentSpeed = initialSpeed;

const colorPixel = '#363620';
const colorBg = '#aeaf43'; // Match CSS var --nokia-screen-bg

gameOverScreen.style.display = 'none';

function padScore(num) {
    return num.toString().padStart(4, '0');
}

function updateProgress() {
    // Fill up to max score of say 2000 for visual effect
    const maxScore = 2000;
    const percentage = Math.min((score / maxScore) * 100, 100);
    progressFill.style.width = percentage + '%';
}

function initGame() {
    const modeRadios = document.getElementsByName('gameMode');
    for (let radio of modeRadios) {
        if (radio.checked) {
            currentMode = radio.value;
            break;
        }
    }

    // Snake starts 3 segments long
    snake = [
        { x: 13, y: 9 },
        { x: 13, y: 10 },
        { x: 13, y: 11 },
    ];
    dx = 0;
    dy = -1; 
    lastDx = 0;
    lastDy = -1;
    score = 0;
    currentSpeed = initialSpeed;
    
    scoreDisplay.textContent = padScore(score);
    updateProgress();

    isGameOver = false;
    isGameStarted = true;
    
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    
    obstacles = [];
    if (currentMode === 'obstacles') {
        generateObstacles();
    }
    
    foodsEaten = 0;
    bonusFood = null;
    food = getRandomFoodPosition();

    if (gameInterval) clearTimeout(gameInterval);
    gameLoop();
}

function generateObstacles() {
    const numObstacles = 10;
    for (let i = 0; i < numObstacles; i++) {
        let obs;
        let valid = false;
        while (!valid) {
            obs = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            
            // Check not near center
            const isNearSpawn = Math.abs(obs.x - 13) < 4 && Math.abs(obs.y - 9) < 5;
            const isDup = obstacles.some(o => o.x === obs.x && o.y === obs.y);

            if (!isNearSpawn && !isDup) {
                obstacles.push(obs);
                valid = true;
            }
        }
    }
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    if (!isGameOver) {
        gameInterval = setTimeout(gameLoop, currentSpeed);
    }
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (currentMode === 'wrap') {
        if (head.x < 0) head.x = tileCountX - 1;
        else if (head.x >= tileCountX) head.x = 0;
        if (head.y < 0) head.y = tileCountY - 1;
        else if (head.y >= tileCountY) head.y = 0;
    } else {
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            handleGameOver();
            return;
        }
    }

    // Self Collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            handleGameOver();
            return;
        }
    }

    // Obstacle Collision
    if (currentMode === 'obstacles') {
        for (let obs of obstacles) {
            if (head.x === obs.x && head.y === obs.y) {
                handleGameOver();
                return;
            }
        }
    }

    snake.unshift(head); 

    let ateBonus = false;
    // Bonus Food Collision (2x2 blocks)
    if (bonusFood && 
        head.x >= bonusFood.x && head.x <= bonusFood.x + 1 && 
        head.y >= bonusFood.y && head.y <= bonusFood.y + 1) {
        score += 50; // Big bonus
        scoreDisplay.textContent = padScore(score);
        updateProgress();
        bonusFood = null;
        ateBonus = true;
    }

    // Food Collision
    if (head.x === food.x && head.y === food.y) {
        score += 8; // Adjust score increment to feel authentic
        scoreDisplay.textContent = padScore(score);
        updateProgress();
        
        if (currentSpeed > minSpeed) {
            currentSpeed -= 2;
        }
        foodsEaten++;
        food = getRandomFoodPosition();

        // Spawn bonus food every 5 normal foods
        if (foodsEaten % 5 === 0 && !bonusFood) {
            bonusFood = getRandomFoodPosition(true); // Pass true for bonus
            bonusFood.timer = 60; // Bonus lasts for 60 ticks
        }
    } else if (!ateBonus) {
        snake.pop(); 
    }

    // Update bonus timer
    if (bonusFood) {
        bonusFood.timer--;
        if (bonusFood.timer <= 0) {
            bonusFood = null;
        }
    }

    lastDx = dx;
    lastDy = dy;
}

function drawTexturedBlock(x, y, type) {
    const px = x * gridSize;
    const py = y * gridSize;
    ctx.fillStyle = colorPixel;
    
    if (type === 'bonus') {
        // Draw a 2x2 blocks large textured round food
        ctx.fillRect(px + 4, py + 2, 12, 16);
        ctx.fillRect(px + 2, py + 4, 16, 12);
        
        ctx.clearRect(px + 6, py + 6, 4, 4);
        ctx.clearRect(px + 10, py + 10, 4, 4);
        ctx.clearRect(px + 10, py + 6, 4, 4);
        ctx.clearRect(px + 6, py + 10, 4, 4); // Checker pattern inside 20x20
    } else if (type === 'snake') {
        // Snake body texture (checkered)
        ctx.fillRect(px + 1, py + 1, 8, 8);
        ctx.clearRect(px + 3, py + 3, 2, 2);
        ctx.clearRect(px + 5, py + 5, 2, 2);
        ctx.clearRect(px + 3, py + 7, 2, 2);
        ctx.clearRect(px + 7, py + 3, 2, 2);
    } else if (type === 'normal') {
        // Normal food (small egg/dot)
        const padding = 2;
        ctx.fillRect(px + padding, py + padding, gridSize - padding * 2, gridSize - padding * 2);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMode === 'obstacles') {
        ctx.fillStyle = colorPixel;
        obstacles.forEach(obs => {
            const px = obs.x * gridSize;
            const py = obs.y * gridSize;
            ctx.fillRect(px + 1, py + 1, gridSize - 2, gridSize - 2);
            ctx.clearRect(px + 3, py + 3, gridSize - 6, gridSize - 6);
            ctx.fillRect(px + 4, py + 4, gridSize - 8, gridSize - 8);
        });
    }

    // Draw snake with texture
    snake.forEach((part, index) => {
        drawTexturedBlock(part.x, part.y, 'snake');
    });

    // Draw normal food
    drawTexturedBlock(food.x, food.y, 'normal');

    // Draw bonus food if active
    if (bonusFood) {
        // Blink when running out of time (last 15 ticks)
        if (bonusFood.timer > 15 || bonusFood.timer % 4 < 2) {
            drawTexturedBlock(bonusFood.x, bonusFood.y, 'bonus');
        }
    }
}

function getRandomFoodPosition(isBonus = false) {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * (tileCountX - (isBonus ? 1 : 0))),
            y: Math.floor(Math.random() * (tileCountY - (isBonus ? 1 : 0)))
        };
        
        let tilesToCheck = [{x: newFood.x, y: newFood.y}];
        if (isBonus) {
            tilesToCheck.push({x: newFood.x + 1, y: newFood.y});
            tilesToCheck.push({x: newFood.x, y: newFood.y + 1});
            tilesToCheck.push({x: newFood.x + 1, y: newFood.y + 1});
        }
        
        let isOnSnake = false;
        let isOnObstacle = false;
        
        for (let t of tilesToCheck) {
            if (snake.some(p => p.x === t.x && p.y === t.y)) isOnSnake = true;
            if (currentMode === 'obstacles' && obstacles.some(o => o.x === t.x && o.y === t.y)) isOnObstacle = true;
        }

        let isOnFood = food && tilesToCheck.some(t => t.x === food.x && t.y === food.y);
        let isOnBonus = bonusFood && tilesToCheck.some(t => 
            t.x >= bonusFood.x && t.x <= bonusFood.x + 1 && 
            t.y >= bonusFood.y && t.y <= bonusFood.y + 1
        );

        if (!isOnSnake && !isOnObstacle && !isOnFood && (!isOnBonus || isBonus)) return newFood;
    }
}

function handleGameOver() {
    isGameOver = true;
    gameOverScreen.style.display = 'flex';
}

function handleInput(newDx, newDy) {
    if (!isGameStarted && !isGameOver) {
        initGame();
        // Prevent moving backwards at start
        if (newDx !== 0 && lastDx === -newDx) return;
        if (newDy !== 0 && lastDy === -newDy) return;
        dx = newDx;
        dy = newDy;
        return;
    }

    if (isGameOver) return;

    if (newDx !== 0 && lastDx === -newDx) return;
    if (newDy !== 0 && lastDy === -newDy) return;

    dx = newDx;
    dy = newDy;
}

// Keyboard
document.addEventListener('keydown', e => {
    if (!isGameStarted && (e.key.startsWith('Arrow') || ['w','a','s','d',' '].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        if(e.key === ' ' || e.key === 'Enter') initGame();
    }

    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': case '2':
            handleInput(0, -1); break;
        case 'ArrowDown': case 's': case 'S': case '8':
            handleInput(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': case '4':
            handleInput(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': case '6':
            handleInput(1, 0); break;
    }
});

// Touch / Mouse on D-Pad
const setupBtn = (id, newDx, newDy) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput(newDx, newDy);
    }, { passive: false });
    
    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleInput(newDx, newDy);
    });
};

setupBtn('btn-up', 0, -1);
setupBtn('btn-down', 0, 1);
setupBtn('btn-left', -1, 0);
setupBtn('btn-right', 1, 0);

// Numpad support for movement (2, 4, 6, 8)
const numpadBtns = document.querySelectorAll('.num-btn');
numpadBtns.forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
        const text = e.currentTarget.childNodes[0].textContent.trim();
        if (text === '2') handleInput(0, -1);
        if (text === '8') handleInput(0, 1);
        if (text === '4') handleInput(-1, 0);
        if (text === '6') handleInput(1, 0);
    });
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const text = e.currentTarget.childNodes[0].textContent.trim();
        if (text === '2') handleInput(0, -1);
        if (text === '8') handleInput(0, 1);
        if (text === '4') handleInput(-1, 0);
        if (text === '6') handleInput(1, 0);
    }, { passive: false });
});

restartBtn.addEventListener('click', () => {
    initGame();
});

// Initial draw
ctx.clearRect(0, 0, canvas.width, canvas.height);
