const STORE_KEY = 'sudoku-game-vanilla-v1';

const defaultSettings = {
  isMuted: false,
  theme: 'default',
};

const defaultProgress = () => ({ easy: {}, medium: {}, hard: {} });

class Store {
  constructor() {
    this.state = this.loadState();
    
    // Apply initial settings
    window.sounds.setMuted(this.state.settings.isMuted);
    document.body.className = this.state.settings.theme !== 'default' ? `theme-${this.state.settings.theme}` : '';
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(STORE_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (e) {
      console.warn('Failed to load state from local storage', e);
    }
    return {
      progress: defaultProgress(),
      bestTimes: defaultProgress(),
      bestScores: defaultProgress(),
      totalScore: 0,
      activeGame: null,
      settings: defaultSettings,
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to local storage', e);
    }
  }

  completeLevel(level, difficulty, time, score, stars) {
    const state = this.state;
    
    const prevStars = state.progress[difficulty][level] || 0;
    const newStars = Math.max(prevStars, stars);

    const prevBestTime = state.bestTimes[difficulty][level];
    const isNewBestTime = prevBestTime === undefined || time < prevBestTime;

    const prevBestScore = state.bestScores[difficulty][level];
    const isNewBestScore = prevBestScore === undefined || score > prevBestScore;
    
    let addedScore = 0;
    if (prevBestScore === undefined) {
      addedScore = Math.max(0, score);
    } else if (isNewBestScore) {
      addedScore = Math.max(0, score - prevBestScore);
    }

    state.progress[difficulty][level] = newStars;
    if (isNewBestTime) state.bestTimes[difficulty][level] = time;
    if (isNewBestScore) state.bestScores[difficulty][level] = score;
    
    state.totalScore += addedScore;
    state.activeGame = null; // Clear auto-save

    this.saveState();
  }

  isLevelUnlocked(level, difficulty) {
    if (level === 1) return true;
    const prevLevelStars = this.state.progress[difficulty][level - 1];
    return prevLevelStars !== undefined && prevLevelStars > 0;
  }

  getStarsForLevel(level, difficulty) {
    return this.state.progress[difficulty][level] || 0;
  }

  getTotalStarsForDifficulty(difficulty) {
    const diffProgress = this.state.progress[difficulty] || {};
    return Object.values(diffProgress).reduce((total, stars) => total + stars, 0);
  }

  getTotalStarsAcrossAll() {
    let total = 0;
    ['easy', 'medium', 'hard'].forEach(diff => {
      total += this.getTotalStarsForDifficulty(diff);
    });
    return total;
  }

  saveActiveGame(game) {
    this.state.activeGame = game;
    this.saveState();
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    window.sounds.setMuted(this.state.settings.isMuted);
    document.body.className = this.state.settings.theme !== 'default' ? `theme-${this.state.settings.theme}` : '';
    this.saveState();
  }

  resetProgress() {
    this.state = {
      progress: defaultProgress(),
      bestTimes: defaultProgress(),
      bestScores: defaultProgress(),
      totalScore: 0,
      activeGame: null,
      settings: this.state.settings, // keep settings
    };
    this.saveState();
  }
}

window.store = new Store();
