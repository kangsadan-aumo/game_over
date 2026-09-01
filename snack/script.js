const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('gameOverScreen');
const startScreen = document.getElementById('startScreen');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restartBtn');
const gameHeader = document.getElementById('gameHeader');

// Setup grid
canvas.width = 260;
canvas.height = 260;

const gridSize = 13;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [];
let food = { x: 10, y: 10 };
let obstacles = [];
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('nokiaSnake2HighScore') || 0;
let gameInterval;
let isGameOver = false;
let isGameStarted = false;
let currentMode = 'box'; // 'box', 'wrap', 'obstacles'

// Speed controls
const initialSpeed = 150;
const minSpeed = 50;
let currentSpeed = initialSpeed;

// Nokia Colors
const colorPixel = '#202b1c';
const colorBg = '#8ba870';

// Initialize
highScoreElement.textContent = highScore;
gameOverScreen.style.display = 'none';

function initGame() {
    // Determine mode
    const modeRadios = document.getElementsByName('gameMode');
    for (let radio of modeRadios) {
        if (radio.checked) {
            currentMode = radio.value;
            break;
        }
    }

    snake = [
        { x: 10, y: 15 },
        { x: 10, y: 16 },
        { x: 10, y: 17 },
    ];
    dx = 0;
    dy = -1; 
    score = 0;
    currentSpeed = initialSpeed;
    scoreElement.textContent = score;
    isGameOver = false;
    isGameStarted = true;
    
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    gameHeader.style.display = 'flex';
    
    obstacles = [];
    if (currentMode === 'obstacles') {
        generateObstacles();
    }
    
    food = getRandomFoodPosition();

    if (gameInterval) clearTimeout(gameInterval);
    gameLoop();
}

function generateObstacles() {
    const numObstacles = 8;
    for (let i = 0; i < numObstacles; i++) {
        let obs;
        let valid = false;
        while (!valid) {
            obs = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            
            // Check not on snake initial spawn area
            const isNearSpawn = Math.abs(obs.x - 10) < 4 && Math.abs(obs.y - 15) < 6;
            
            // Check not duplicate
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

    // Wall logic based on mode
    if (currentMode === 'wrap') {
        if (head.x < 0) head.x = tileCountX - 1;
        else if (head.x >= tileCountX) head.x = 0;
        if (head.y < 0) head.y = tileCountY - 1;
        else if (head.y >= tileCountY) head.y = 0;
    } else {
        // Box or Obstacles mode -> walls kill you
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

    // Food Collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        if (currentSpeed > minSpeed) {
            currentSpeed -= 3; // Get faster
        }

        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('nokiaSnake2HighScore', highScore);
        }
        food = getRandomFoodPosition();
    } else {
        snake.pop(); 
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles if mode active
    if (currentMode === 'obstacles') {
        ctx.fillStyle = colorPixel;
        obstacles.forEach(obs => {
            // Draw a cross/block pattern for obstacles
            const px = obs.x * gridSize;
            const py = obs.y * gridSize;
            ctx.fillRect(px + 1, py + 1, gridSize - 2, gridSize - 2);
            ctx.clearRect(px + 4, py + 4, gridSize - 8, gridSize - 8);
            ctx.fillRect(px + 5, py + 5, gridSize - 10, gridSize - 10);
        });
    }

    // Draw snake (Snake II style)
    ctx.fillStyle = colorPixel;
    snake.forEach((part, index) => {
        const padding = 1;
        ctx.fillRect(part.x * gridSize + padding, part.y * gridSize + padding, gridSize - padding * 2, gridSize - padding * 2);
    });

    // Draw food (different shape, maybe a bug/dot)
    const px = food.x * gridSize;
    const py = food.y * gridSize;
    ctx.fillRect(px + 3, py + 3, gridSize - 6, gridSize - 6);
    ctx.fillRect(px + 5, py + 1, gridSize - 10, 2);
    ctx.fillRect(px + 5, py + gridSize - 3, gridSize - 10, 2);
    ctx.fillRect(px + 1, py + 5, 2, gridSize - 10);
    ctx.fillRect(px + gridSize - 3, py + 5, 2, gridSize - 10);
}

function getRandomFoodPosition() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };
        
        // Check snake
        let isOnSnake = snake.some(p => p.x === newFood.x && p.y === newFood.y);
        
        // Check obstacles
        let isOnObstacle = false;
        if (currentMode === 'obstacles') {
            isOnObstacle = obstacles.some(o => o.x === newFood.x && o.y === newFood.y);
        }

        if (!isOnSnake && !isOnObstacle) return newFood;
    }
}

function handleGameOver() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';
}

function handleInput(newDx, newDy) {
    if (!isGameStarted && !isGameOver) {
        initGame();
        dx = newDx;
        dy = newDy;
        return;
    }

    if (isGameOver) return;

    if (newDx !== 0 && dx === -newDx) return;
    if (newDy !== 0 && dy === -newDy) return;

    dx = newDx;
    dy = newDy;
}

// Keyboard Controls
document.addEventListener('keydown', e => {
    // If not started, prevent default scrolling with arrows to allow starting cleanly
    if (!isGameStarted && (e.key.startsWith('Arrow') || ['w','a','s','d',' '].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        
        // Determine default starting direction if space/enter is pressed instead of an arrow
        if(e.key === ' ' || e.key === 'Enter') {
            initGame();
        } else {
            // Let the switch statement handle it
        }
    }

    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
            handleInput(0, -1); break;
        case 'ArrowDown': case 's': case 'S':
            handleInput(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A':
            handleInput(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D':
            handleInput(1, 0); break;
    }
});

// Touch / Mouse Controls
const setupBtn = (id, newDx, newDy) => {
    const btn = document.getElementById(id);
    
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

restartBtn.addEventListener('click', () => {
    initGame();
});

// Draw initial state before starting
ctx.clearRect(0, 0, canvas.width, canvas.height);
