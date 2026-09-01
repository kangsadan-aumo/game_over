class UIManager {
  constructor() {
    this.container = document.getElementById('app-container');
    this.modalContainer = document.getElementById('modal-container');
  }

  // Helper to create elements with classes
  createEl(tag, className, innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  }

  clear() {
    this.container.innerHTML = '';
  }

  clearModal() {
    this.modalContainer.innerHTML = '';
  }

  renderMainMenu(onSelectDifficulty, onOpenSettings) {
    this.clear();
    const totalStars = window.store.getTotalStarsAcrossAll();
    const totalScore = window.store.state.totalScore;

    const div = this.createEl('div', 'main-menu-container animate-fade-in');
    
    div.innerHTML = `
      <div class="top-bar">
        <div class="global-stats glass">
          <div class="stat-item">
            <i data-lucide="star" class="star filled" style="color: var(--star-filled); fill: var(--star-filled);"></i>
            <span>${totalStars}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item text-primary">
            <i data-lucide="trophy"></i>
            <span>${totalScore.toLocaleString()} pts</span>
          </div>
        </div>
        <button class="settings-btn glass-button" id="btn-settings">
          <i data-lucide="settings"></i>
        </button>
      </div>
      <header class="menu-header">
        <h1 class="title">Sudoku Master</h1>
        <p class="subtitle">Select your difficulty</p>
      </header>
      <div class="difficulty-cards">
        <button class="diff-card glass easy" data-diff="easy">
          <h2>Easy</h2>
          <p>Perfect for relaxing</p>
        </button>
        <button class="diff-card glass medium" data-diff="medium">
          <h2>Medium</h2>
          <p>A balanced challenge</p>
        </button>
        <button class="diff-card glass hard" data-diff="hard">
          <h2>Hard</h2>
          <p>For true masters</p>
        </button>
      </div>
    `;

    this.container.appendChild(div);

    div.querySelector('#btn-settings').addEventListener('click', () => {
      window.sounds.playClick();
      onOpenSettings();
    });

    div.querySelectorAll('.diff-card').forEach(card => {
      card.addEventListener('click', (e) => {
        window.sounds.playClick();
        onSelectDifficulty(e.currentTarget.dataset.diff);
      });
    });

    lucide.createIcons();
  }

  renderSettingsModal(onClose) {
    this.clearModal();
    const settings = window.store.state.settings;

    const overlay = this.createEl('div', 'modal-overlay');
    const content = this.createEl('div', 'modal-content glass settings-modal');
    
    content.innerHTML = `
      <h2>Settings</h2>
      <div class="settings-section">
        <h3>Sound</h3>
        <button class="glass-button w-full" id="btn-toggle-sound" style="width:100%; justify-content:space-between;">
          <span>Sound Effects</span>
          <i data-lucide="${settings.isMuted ? 'volume-x' : 'volume-2'}"></i>
        </button>
      </div>
      <div class="settings-section">
        <h3>Theme</h3>
        <div class="theme-options">
          <button class="glass-button theme-btn ${settings.theme === 'default' ? 'active' : ''}" data-theme="default">Default</button>
          <button class="glass-button theme-btn ${settings.theme === 'matcha' ? 'active' : ''}" data-theme="matcha">Matcha</button>
          <button class="glass-button theme-btn ${settings.theme === 'sunset' ? 'active' : ''}" data-theme="sunset">Sunset</button>
          <button class="glass-button theme-btn ${settings.theme === 'ice' ? 'active' : ''}" data-theme="ice">Ice</button>
        </div>
      </div>
      <div class="settings-section" style="margin-top: 2rem;">
        <button class="glass-button text-error" id="btn-reset" style="width:100%;">Reset Progress</button>
      </div>
      <button class="primary-button" id="btn-close-settings" style="width:100%; margin-top: 1rem;">Close</button>
    `;

    overlay.appendChild(content);
    this.modalContainer.appendChild(overlay);

    overlay.querySelector('#btn-toggle-sound').addEventListener('click', (e) => {
      const newMuted = !window.store.state.settings.isMuted;
      window.store.updateSettings({ isMuted: newMuted });
      if (!newMuted) window.sounds.playClick();
      const icon = e.currentTarget.querySelector('i');
      icon.setAttribute('data-lucide', newMuted ? 'volume-x' : 'volume-2');
      lucide.createIcons();
    });

    overlay.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.sounds.playClick();
        overlay.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        window.store.updateSettings({ theme: e.currentTarget.dataset.theme });
      });
    });

    overlay.querySelector('#btn-reset').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        window.sounds.playClick();
        window.store.resetProgress();
        this.clearModal();
        window.app.showMainMenu(); // Refresh stats
      }
    });

    overlay.querySelector('#btn-close-settings').addEventListener('click', () => {
      window.sounds.playClick();
      this.clearModal();
    });

    lucide.createIcons();
  }

  renderLevelSelector(difficulty, onSelectLevel, onBack) {
    this.clear();
    const TOTAL_LEVELS = 20;
    const MAX_STARS = TOTAL_LEVELS * 3;
    const totalStars = window.store.getTotalStarsForDifficulty(difficulty);
    const progressPercent = Math.round((totalStars / MAX_STARS) * 100);

    const div = this.createEl('div', 'level-selector-container animate-fade-in');
    
    let html = `
      <header class="level-header">
        <div style="display: flex; alignItems: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
          <button class="glass-button" id="btn-back" style="padding: 0.5rem; border-radius: 50%;">
            <i data-lucide="chevron-left"></i>
          </button>
          <h1 class="title" style="margin: 0;">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode</h1>
        </div>
        <div class="progress-container">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill ${difficulty}" style="width: ${progressPercent}%"></div>
          </div>
          <p class="progress-text">${progressPercent}% Completed (${totalStars}/${MAX_STARS} Stars)</p>
        </div>
      </header>
      <div class="level-grid">
    `;

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const unlocked = window.store.isLevelUnlocked(i, difficulty);
      const stars = window.store.getStarsForLevel(i, difficulty);
      
      html += `
        <button class="level-card glass ${unlocked ? 'unlocked' : 'locked'}" data-level="${i}" ${!unlocked ? 'disabled' : ''}>
          <div class="level-number">${i}</div>
          ${unlocked ? `
            <div class="stars-container">
              ${[0,1,2].map(s => `
                <i data-lucide="star" class="star ${s < stars ? 'filled' : 'empty'}" ${s < stars ? 'style="color: var(--star-filled); fill: var(--star-filled);"' : ''}></i>
              `).join('')}
            </div>
          ` : `
            <div class="lock-icon"><i data-lucide="lock"></i></div>
          `}
        </button>
      `;
    }

    html += `</div>`;
    div.innerHTML = html;
    this.container.appendChild(div);

    div.querySelector('#btn-back').addEventListener('click', () => {
      window.sounds.playClick();
      onBack();
    });

    div.querySelectorAll('.level-card.unlocked').forEach(card => {
      card.addEventListener('click', (e) => {
        window.sounds.playClick();
        onSelectLevel(parseInt(e.currentTarget.dataset.level));
      });
    });

    lucide.createIcons();
  }

  renderVictoryModal(level, difficulty, timeStr, score, stars, onClose) {
    this.clearModal();
    const overlay = this.createEl('div', 'modal-overlay');
    const content = this.createEl('div', 'modal-content glass animate-fade-in victory-content');
    
    content.innerHTML = `
      <h2 class="text-primary" style="font-size: 2rem; font-weight: 800; margin-bottom: 0;">Level Complete!</h2>
      <p class="text-muted" style="margin-bottom: 1rem;">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} - Level ${level}</p>
      
      <div class="victory-stars">
        ${[1, 2, 3].map(i => `
          <i data-lucide="star" class="star ${i <= stars ? 'earned' : ''}" style="${i <= stars ? 'fill: var(--star-filled);' : 'color: var(--star-empty);'}"></i>
        `).join('')}
      </div>

      <div class="victory-stats">
        <div class="v-stat">
          <span class="label">Time</span>
          <span class="val">${timeStr}</span>
        </div>
        <div class="v-stat">
          <span class="label">Score</span>
          <span class="val">+${score}</span>
        </div>
      </div>

      <button class="primary-button" id="btn-victory-continue" style="width: 100%; margin-top: 2rem; padding: 1rem; font-size: 1.1rem;">
        Continue
      </button>
    `;

    overlay.appendChild(content);
    this.modalContainer.appendChild(overlay);

    overlay.querySelector('#btn-victory-continue').addEventListener('click', () => {
      window.sounds.playClick();
      this.clearModal();
      onClose();
    });

    lucide.createIcons();
  }
}

window.ui = new UIManager();
