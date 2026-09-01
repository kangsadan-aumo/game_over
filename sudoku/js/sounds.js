class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio play failed', e);
    }
  }

  playClick() {
    this.playTone(600, 'sine', 0.05, 0.05);
  }

  playInput() {
    this.playTone(800, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1200, 'sine', 0.1, 0.05), 50);
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.3, 0.05);
  }

  playWin() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.1), i * 150);
      });
      
      setTimeout(() => this.playTone(880, 'sine', 0.6, 0.1), notes.length * 150);
    } catch (e) {
       console.error('Audio play failed', e);
    }
  }
}

window.sounds = new SoundEngine();
