class SudokuGenerator {
  constructor() {}

  generateGame(difficulty) {
    const emptyCells = {
      'easy': 30,
      'medium': 45,
      'hard': 55
    }[difficulty] || 40;

    const solution = this.createSolution();
    const puzzle = this.createPuzzle(solution, emptyCells);

    const board = [];
    for (let r = 0; r < 9; r++) {
      const row = [];
      for (let c = 0; c < 9; c++) {
        const val = puzzle[r][c];
        row.push({
          value: val,
          isFixed: val !== 0,
          isError: false,
          notes: []
        });
      }
      board.push(row);
    }

    return {
      board,
      solution,
      difficulty
    };
  }

  createSolution() {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    this.solve(board);
    return board;
  }

  createPuzzle(solution, emptyCells) {
    const puzzle = solution.map(row => [...row]);
    let cellsToRemove = emptyCells;
    
    while (cellsToRemove > 0) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        cellsToRemove--;
      }
    }
    return puzzle;
  }

  solve(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of nums) {
            if (this.isValidPlacement(board, r, c, num)) {
              board[r][c] = num;
              if (this.solve(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  isValidPlacement(board, row, col, num) {
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === num) {
          return false;
        }
      }
    }
    return true;
  }

  isBoardFull(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].value === 0) return false;
      }
    }
    return true;
  }
}

window.sudokuAPI = new SudokuGenerator();
