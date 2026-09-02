class GameApp {
  constructor() {
    this.currentScreen = 'main'; // main, levels, game
    this.selectedDifficulty = null;
    this.selectedLevel = null;
    
    // Game state
    this.game = null;
    this.selectedCell = null;
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.timer = 0;
    this.isWon = false;
    this.isGameOver = false;
    this.isPencilMode = false;
    this.isPaused = false;
    this.timerInterval = null;

    this.init();
  }

  init() {
    this.showMainMenu();
    this.setupKeyboard();
  }

  showMainMenu() {
    this.currentScreen = 'main';
    this.stopTimer();
    window.ui.renderMainMenu(
      (diff) => {
        this.selectedDifficulty = diff;
        this.showLevelSelector();
      },
      () => {
        window.ui.renderSettingsModal();
      }
    );
  }

  showLevelSelector() {
    this.currentScreen = 'levels';
    this.stopTimer();
    window.ui.renderLevelSelector(
      this.selectedDifficulty,
      (level) => {
        this.selectedLevel = level;
        this.startGame();
      },
      () => this.showMainMenu()
    );
  }

  startGame() {
    this.currentScreen = 'game';
    this.isWon = false;
    this.isGameOver = false;
    this.isPaused = false;
    this.isPencilMode = false;
    this.selectedCell = null;

    const activeGame = window.store.state.activeGame;
    if (activeGame && activeGame.level === this.selectedLevel && activeGame.difficulty === this.selectedDifficulty) {
      this.game = {
        board: activeGame.board,
        solution: activeGame.solution,
        difficulty: activeGame.difficulty
      };
      this.mistakes = activeGame.mistakes;
      this.timer = activeGame.timer;
      this.hintsUsed = activeGame.hintsUsed || 0;
    } else {
      this.game = window.sudokuAPI.generateGame(this.selectedDifficulty);
      this.mistakes = 0;
      this.hintsUsed = 0;
      this.timer = 0;
    }

    this.renderGameScreen();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && !this.isWon && !this.isGameOver) {
        this.timer++;
        
        // Update timer UI only
        const timerEl = document.getElementById('game-timer-display');
        if (timerEl) {
          timerEl.textContent = this.formatTime(this.timer);
        }

        // Auto-save every 5 seconds
        if (this.timer % 5 === 0) {
          this.performSave();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getBaseScore(diff) {
    if (diff === 'easy') return 500;
    if (diff === 'medium') return 1000;
    return 2000;
  }

  calculateScore() {
    const base = this.getBaseScore(this.selectedDifficulty);
    const timeBonus = Math.max(0, base - this.timer);
    const hintPenalty = this.hintsUsed * 100;
    const mistakePenalty = this.mistakes * 50;
    return Math.max(0, base + timeBonus - hintPenalty - mistakePenalty);
  }

  performSave() {
    if (this.game && !this.isWon && !this.isGameOver) {
      window.store.saveActiveGame({
        level: this.selectedLevel,
        difficulty: this.selectedDifficulty,
        board: this.game.board,
        solution: this.game.solution,
        mistakes: this.mistakes,
        hintsUsed: this.hintsUsed,
        timer: this.timer
      });
    }
  }

  handleBackFromGame() {
    this.performSave();
    this.showLevelSelector();
  }

  handleCellClick(r, c) {
    if (this.isWon || this.isGameOver || this.isPaused) return;
    window.sounds.playClick();
    this.selectedCell = { r, c };
    this.renderGameScreen();
  }

  togglePencilMode() {
    window.sounds.playClick();
    this.isPencilMode = !this.isPencilMode;
    this.renderGameScreen();
  }

  togglePause() {
    if (this.isWon || this.isGameOver) return;
    window.sounds.playClick();
    if (!this.isPaused) {
      this.performSave();
    }
    this.isPaused = !this.isPaused;
    this.renderGameScreen();
  }

  getRemainingCount(num) {
    if (!this.game) return 9;
    let count = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.game.board[r][c].value === num) count++;
      }
    }
    return 9 - count;
  }

  handleInput(num) {
    if (!this.game || !this.selectedCell || this.isWon || this.isGameOver || this.isPaused) return;
    
    const { r, c } = this.selectedCell;
    const currentCell = this.game.board[r][c];

    if (currentCell.isFixed || (currentCell.value !== 0 && !this.isPencilMode)) return;

    if (this.isPencilMode) {
      if (currentCell.value !== 0) return;
      const notes = currentCell.notes || [];
      if (notes.includes(num)) {
        currentCell.notes = notes.filter(n => n !== num);
      } else {
        currentCell.notes = [...notes, num].sort();
      }
      window.sounds.playClick();
      this.renderGameScreen();
    } else {
      const isValid = this.game.solution[r][c] === num;

      if (isValid) {
        window.sounds.playInput();
        currentCell.value = num;
        currentCell.isError = false;
        currentCell.notes = [];

        // Auto remove notes
        for (let i = 0; i < 9; i++) {
          if (this.game.board[r][i].notes.includes(num)) {
            this.game.board[r][i].notes = this.game.board[r][i].notes.filter(n => n !== num);
          }
          if (this.game.board[i][c].notes.includes(num)) {
            this.game.board[i][c].notes = this.game.board[i][c].notes.filter(n => n !== num);
          }
        }
        const startR = Math.floor(r / 3) * 3;
        const startC = Math.floor(c / 3) * 3;
        for (let i = startR; i < startR + 3; i++) {
          for (let j = startC; j < startC + 3; j++) {
            if (this.game.board[i][j].notes.includes(num)) {
              this.game.board[i][j].notes = this.game.board[i][j].notes.filter(n => n !== num);
            }
          }
        }

        this.renderGameScreen();

        // Check for completed row/col/box and animate
        const isRowComplete = this.game.board[r].every(cell => cell.value !== 0);
        const isColComplete = this.game.board.every(row => row[c].value !== 0);
        let isBoxComplete = true;
        for (let i = startR; i < startR + 3; i++) {
          for (let j = startC; j < startC + 3; j++) {
            if (this.game.board[i][j].value === 0) isBoxComplete = false;
          }
        }

        const animateCells = [];
        if (isRowComplete) {
          for (let i = 0; i < 9; i++) animateCells.push({r, c: i});
        }
        if (isColComplete) {
          for (let i = 0; i < 9; i++) animateCells.push({r: i, c});
        }
        if (isBoxComplete) {
          for (let i = startR; i < startR + 3; i++) {
            for (let j = startC; j < startC + 3; j++) {
              animateCells.push({r: i, c: j});
            }
          }
        }

        if (animateCells.length > 0) {
          const div = document.querySelector('.game-screen');
          if (div) {
            animateCells.forEach(cellPos => {
              const cellEl = div.querySelector(`.cell[data-r="${cellPos.r}"][data-c="${cellPos.c}"]`);
              if (cellEl) {
                cellEl.classList.remove('completed-group');
                void cellEl.offsetWidth; // Force reflow
                cellEl.classList.add('completed-group');
              }
            });
            window.sounds.playGroupComplete();
          }
        }

        if (window.sudokuAPI.isBoardFull(this.game.board)) {
          this.isWon = true;
          window.sounds.playWin();
          const score = this.calculateScore();
          const stars = Math.max(1, 3 - this.mistakes);
          window.store.completeLevel(this.selectedLevel, this.selectedDifficulty, this.timer, score, stars);
          
          window.ui.renderVictoryModal(this.selectedLevel, this.selectedDifficulty, this.formatTime(this.timer), score, stars, () => {
            this.showLevelSelector();
          });
        }
      } else {
        window.sounds.playError();
        currentCell.isError = true;
        this.mistakes++;
        
        if (this.mistakes >= 3) {
          this.isGameOver = true;
          window.store.saveActiveGame(null);
        } else {
          setTimeout(() => {
            if (this.game && !this.game.board[r][c].isFixed && this.game.board[r][c].isError) {
              this.game.board[r][c].isError = false;
              this.game.board[r][c].value = 0;
              this.renderGameScreen();
            }
          }, 500);
        }
        this.renderGameScreen();
      }
    }
  }

  handleErase() {
    if (!this.game || !this.selectedCell || this.isWon || this.isGameOver || this.isPaused) return;
    const { r, c } = this.selectedCell;
    if (this.game.board[r][c].isFixed) return;
    
    window.sounds.playClick();
    this.game.board[r][c].value = 0;
    this.game.board[r][c].isError = false;
    this.game.board[r][c].notes = [];
    this.renderGameScreen();
  }

  handleHint() {
    if (!this.game || !this.selectedCell || this.isWon || this.isGameOver || this.isPaused) return;
    const { r, c } = this.selectedCell;
    if (this.game.board[r][c].isFixed || this.game.board[r][c].value !== 0) return;
    
    this.hintsUsed++;
    const wasPencil = this.isPencilMode;
    this.isPencilMode = false;
    this.handleInput(this.game.solution[r][c]);
    this.isPencilMode = wasPencil;
  }

  handleRestart() {
    window.sounds.playClick();
    this.game = window.sudokuAPI.generateGame(this.selectedDifficulty);
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.timer = 0;
    this.isGameOver = false;
    this.isWon = false;
    this.isPaused = false;
    this.selectedCell = null;
    this.renderGameScreen();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.currentScreen !== 'game') return;
      if (e.key >= '1' && e.key <= '9') {
        this.handleInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        this.handleErase();
      } else if (e.key.toLowerCase() === 'p') {
        this.togglePencilMode();
      }
    });
  }

  renderGameScreen() {
    let div = document.querySelector('.game-screen');
    const isNew = !div;
    
    if (isNew) {
      window.ui.clear();
      div = window.ui.createEl('div', 'game-screen animate-fade-in');
    }

    let boardHtml = '';
    for (let r = 0; r < 9; r++) {
      boardHtml += '<div class="board-row">';
      for (let c = 0; c < 9; c++) {
        const cell = this.game.board[r][c];
        const isSelected = this.selectedCell?.r === r && this.selectedCell?.c === c;
        const isHighlighted = !this.isPaused && !this.isGameOver && this.selectedCell && 
          (this.selectedCell.r === r || this.selectedCell.c === c || 
          (Math.floor(this.selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(this.selectedCell.c / 3) === Math.floor(c / 3)));
        const isSameValue = !this.isPaused && !this.isGameOver && cell.value !== 0 && this.selectedCell && 
          this.game.board[this.selectedCell.r][this.selectedCell.c].value === cell.value;

        let cellClass = 'cell';
        if (isSelected) cellClass += ' selected';
        else if (isSameValue) cellClass += ' same-value';
        else if (isHighlighted) cellClass += ' highlighted';
        
        if (cell.isFixed) cellClass += ' fixed';
        if (cell.isError) cellClass += ' error';
        if (r === 2 || r === 5) cellClass += ' border-bottom-thick';
        if (c === 2 || c === 5) cellClass += ' border-right-thick';

        let inner = '';
        if (cell.value !== 0) {
          inner = `<span class="${!cell.isFixed ? 'value-pop' : ''}">${cell.value}</span>`;
        } else {
          inner = '<div class="notes-grid">';
          for (let n = 1; n <= 9; n++) {
            inner += `<span class="note-num">${cell.notes.includes(n) ? n : ''}</span>`;
          }
          inner += '</div>';
        }

        boardHtml += `<div class="${cellClass}" data-r="${r}" data-c="${c}">${inner}</div>`;
      }
      boardHtml += '</div>';
    }

    let numpadHtml = '';
    for (let num = 1; num <= 9; num++) {
      const remain = this.getRemainingCount(num);
      const isDone = remain <= 0;
      numpadHtml += `
        <button class="num-btn glass-button ${isDone ? 'done' : ''}" data-num="${num}" ${isDone || this.isWon || this.isGameOver || this.isPaused ? 'disabled' : ''}>
          ${num}
          ${!isDone ? `<span class="num-badge">${remain}</span>` : ''}
        </button>
      `;
    }

    div.innerHTML = `
      <header class="game-header">
        <button class="back-btn glass-button" id="btn-game-back">
          <i data-lucide="chevron-left"></i>
        </button>
        <div class="game-info">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Level ${this.selectedLevel} - ${this.selectedDifficulty.charAt(0).toUpperCase() + this.selectedDifficulty.slice(1)}</h2>
            <button class="glass-button pause-btn" id="btn-game-pause">
              <i data-lucide="${this.isPaused ? 'play' : 'pause'}"></i>
            </button>
          </div>
          <div class="stats">
            <span class="mistakes ${this.mistakes >= 2 ? 'text-error' : ''}">Mistakes: ${this.mistakes} / 3</span>
            <span class="timer" id="game-timer-display">${this.formatTime(this.timer)}</span>
          </div>
        </div>
      </header>

      <div class="board-container relative">
        ${this.isPaused && !this.isGameOver && !this.isWon ? `
          <div class="pause-overlay glass">
            <h2>Paused</h2>
            <button class="primary-button" id="btn-resume">Resume</button>
          </div>
        ` : ''}
        ${this.isGameOver ? `
          <div class="pause-overlay glass">
            <h2 class="text-error">Game Over</h2>
            <p class="text-muted" style="margin-bottom: 1rem;">You made 3 mistakes!</p>
            <div style="display: flex; gap: 1rem;">
              <button class="glass-button" id="btn-game-exit">Exit</button>
              <button class="primary-button" id="btn-game-restart">
                <i data-lucide="rotate-ccw" style="margin-right: 0.5rem; width:20px;"></i>
                Try Again
              </button>
            </div>
          </div>
        ` : ''}
        <div class="sudoku-board glass ${this.isPaused || this.isGameOver ? 'blurred' : ''}">
          ${boardHtml}
        </div>
      </div>

      <div class="controls">
        <div class="tools">
          <button class="tool-btn glass-button ${this.isPencilMode ? 'active' : ''}" id="btn-tool-pencil">
            <i data-lucide="pencil" class="${this.isPencilMode ? 'text-primary' : ''}"></i>
            <span>Notes</span>
          </button>
          <button class="tool-btn glass-button" id="btn-tool-erase">
            <i data-lucide="eraser"></i>
            <span>Erase</span>
          </button>
          <button class="tool-btn glass-button" id="btn-tool-hint">
            <i data-lucide="lightbulb"></i>
            <span>Hint</span>
          </button>
        </div>
        <div class="numpad">
          ${numpadHtml}
        </div>
      </div>
    `;

    if (isNew) {
      window.ui.container.appendChild(div);
    }

    // Attach events
    div.querySelector('#btn-game-back').addEventListener('click', () => this.handleBackFromGame());
    div.querySelector('#btn-game-pause').addEventListener('click', () => this.togglePause());
    
    if (this.isPaused && !this.isGameOver && !this.isWon) {
      div.querySelector('#btn-resume').addEventListener('click', () => this.togglePause());
    }
    if (this.isGameOver) {
      div.querySelector('#btn-game-exit').addEventListener('click', () => this.handleBackFromGame());
      div.querySelector('#btn-game-restart').addEventListener('click', () => this.handleRestart());
    }

    div.querySelectorAll('.cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const r = parseInt(e.currentTarget.dataset.r);
        const c = parseInt(e.currentTarget.dataset.c);
        this.handleCellClick(r, c);
      });
    });

    div.querySelector('#btn-tool-pencil').addEventListener('click', () => this.togglePencilMode());
    div.querySelector('#btn-tool-erase').addEventListener('click', () => this.handleErase());
    div.querySelector('#btn-tool-hint').addEventListener('click', () => this.handleHint());

    div.querySelectorAll('.num-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const num = parseInt(e.currentTarget.dataset.num);
        this.handleInput(num);
      });
    });

    lucide.createIcons();
  }
}

// Start app
window.addEventListener('DOMContentLoaded', () => {
  window.app = new GameApp();
});
