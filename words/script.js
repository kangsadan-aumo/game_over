const vocabDB = {
    A1: [
        { word: "APPLE", trans: "แอปเปิ้ล" }, { word: "BOOK", trans: "หนังสือ" }, { word: "CAT", trans: "แมว" },
        { word: "DOG", trans: "หมา" }, { word: "EGG", trans: "ไข่" }, { word: "FISH", trans: "ปลา" },
        { word: "GIRL", trans: "เด็กผู้หญิง" }, { word: "BOY", trans: "เด็กผู้ชาย" }, { word: "HAT", trans: "หมวก" },
        { word: "ICE", trans: "น้ำแข็ง" }, { word: "JUMP", trans: "กระโดด" }, { word: "KITE", trans: "ว่าว" },
        { word: "LION", trans: "สิงโต" }, { word: "MILK", trans: "นม" }, { word: "NOSE", trans: "จมูก" },
        { word: "ORANGE", trans: "ส้ม" }, { word: "PIG", trans: "หมู" }, { word: "QUEEN", trans: "ราชินี" },
        { word: "SUN", trans: "พระอาทิตย์" }, { word: "TREE", trans: "ต้นไม้" }
    ],
    A2: [
        { word: "ANIMAL", trans: "สัตว์" }, { word: "BREAD", trans: "ขนมปัง" }, { word: "CHAIR", trans: "เก้าอี้" },
        { word: "DANCE", trans: "เต้นรำ" }, { word: "EARTH", trans: "โลก" }, { word: "FLOWER", trans: "ดอกไม้" },
        { word: "GLASS", trans: "แก้ว" }, { word: "HORSE", trans: "ม้า" }, { word: "ISLAND", trans: "เกาะ" },
        { word: "JUICE", trans: "น้ำผลไม้" }, { word: "KNIFE", trans: "มีด" }, { word: "LEMON", trans: "มะนาว" },
        { word: "MONEY", trans: "เงิน" }, { word: "NIGHT", trans: "กลางคืน" }, { word: "OCEAN", trans: "มหาสมุทร" },
        { word: "PAPER", trans: "กระดาษ" }, { word: "RIVER", trans: "แม่น้ำ" }, { word: "SNAKE", trans: "งู" },
        { word: "TRAIN", trans: "รถไฟ" }, { word: "WATER", trans: "น้ำ" }
    ],
    B1: [
        { word: "BEAUTIFUL", trans: "สวยงาม" }, { word: "CAREFUL", trans: "ระมัดระวัง" }, { word: "DANGEROUS", trans: "อันตราย" },
        { word: "EDUCATION", trans: "การศึกษา" }, { word: "FAMILIAR", trans: "คุ้นเคย" }, { word: "GOVERNMENT", trans: "รัฐบาล" },
        { word: "HAPPINESS", trans: "ความสุข" }, { word: "IMPORTANT", trans: "สำคัญ" }, { word: "JEALOUS", trans: "อิจฉา" },
        { word: "KNOWLEDGE", trans: "ความรู้" }, { word: "LANGUAGE", trans: "ภาษา" }, { word: "MACHINE", trans: "เครื่องจักร" },
        { word: "NATIONAL", trans: "แห่งชาติ" }, { word: "OPPOSITE", trans: "ตรงข้าม" }, { word: "PATIENT", trans: "อดทน" },
        { word: "QUALITY", trans: "คุณภาพ" }, { word: "REASON", trans: "เหตุผล" }, { word: "SCIENCE", trans: "วิทยาศาสตร์" },
        { word: "TOGETHER", trans: "ด้วยกัน" }, { word: "USEFUL", trans: "มีประโยชน์" }
    ],
    B2: [
        { word: "ACCURATE", trans: "แม่นยำ" }, { word: "BRILLIANT", trans: "ยอดเยี่ยม" }, { word: "COMPLEX", trans: "ซับซ้อน" },
        { word: "DETERMINE", trans: "กำหนด" }, { word: "EFFICIENT", trans: "มีประสิทธิภาพ" }, { FREQUENT: "บ่อยครั้ง" },
        { word: "GENERATE", trans: "สร้างขึ้น" }, { word: "HESITATE", trans: "ลังเล" }, { word: "ILLUSION", trans: "ภาพลวงตา" },
        { word: "JUSTIFY", trans: "พิสูจน์ว่าถูกต้อง" }, { word: "LOGICAL", trans: "มีเหตุผล" }, { word: "MAINTAIN", trans: "รักษาไว้" },
        { word: "NUMEROUS", trans: "มากมาย" }, { word: "OBSERVE", trans: "สังเกต" }, { word: "PERSUADE", trans: "ชักชวน" },
        { word: "QUALIFY", trans: "มีคุณสมบัติ" }, { word: "RECOGNIZE", trans: "จำได้" }, { word: "STRATEGY", trans: "กลยุทธ์" },
        { word: "TOLERATE", trans: "อดกลั้น" }, { word: "VARIABLE", trans: "ตัวแปร" }
    ],
    C1: [
        { word: "AMBIGUOUS", trans: "กำกวม" }, { word: "BENEFICIAL", trans: "เป็นประโยชน์" }, { word: "COINCIDENCE", trans: "เรื่องบังเอิญ" },
        { word: "DEVASTATE", trans: "ทำลายล้าง" }, { word: "ELIMINATE", trans: "กำจัด" }, { word: "FASCINATE", trans: "ทำให้หลงใหล" },
        { word: "GENUINE", trans: "แท้จริง" }, { word: "HYPOCRITE", trans: "คนหน้าซื่อใจคด" }, { word: "INEVITABLE", trans: "หลีกเลี่ยงไม่ได้" },
        { word: "JEOPARDIZE", trans: "ทำให้เป็นอันตราย" }, { word: "LEGITIMATE", trans: "ถูกกฎหมาย" }, { word: "METICULOUS", trans: "พิถีพิถัน" },
        { word: "NOTORIOUS", trans: "มีชื่อเสียงในทางไม่ดี" }, { word: "OBSOLETE", trans: "ล้าสมัย" }, { word: "PARADOX", trans: "ความย้อนแย้ง" },
        { word: "QUARANTINE", trans: "กักตัว" }, { word: "RELUCTANT", trans: "ไม่เต็มใจ" }, { word: "SOPHISTICATED", trans: "ซับซ้อน/ล้ำสมัย" },
        { word: "TANGIBLE", trans: "จับต้องได้" }, { word: "UBIQUITOUS", trans: "มีอยู่ทุกหนทุกแห่ง" }
    ],
    C2: [
        { word: "ACQUIESCE", trans: "ยอมรับอย่างไม่เต็มใจ" }, { word: "CACOPHONY", trans: "เสียงที่ดังและไม่ประสานกัน" },
        { word: "EPHEMERAL", trans: "มีอายุสั้น/ชั่วคราว" }, { word: "FASTIDIOUS", trans: "จู้จี้จุกจิก" },
        { word: "GARRULOUS", trans: "พูดมาก" }, { word: "ICONOCLAST", trans: "ผู้ทำลายความเชื่อดั้งเดิม" },
        { word: "JUXTAPOSE", trans: "วางเคียงกันเพื่อเปรียบเทียบ" }, { word: "LACONIC", trans: "ใช้คำน้อย/กระชับ" },
        { word: "MELLIFLUOUS", trans: "ไพเราะหู" }, { word: "NEFARIOUS", trans: "ชั่วร้าย" },
        { word: "OBFUSCATE", trans: "ทำให้สับสน" }, { word: "PANACEA", trans: "ยารักษาสารพัดโรค" },
        { word: "QUINTESSENTIAL", trans: "เป็นตัวแทนที่สมบูรณ์แบบ" }, { word: "RECALCITRANT", trans: "ดื้อรั้น" },
        { word: "SYCOPHANT", trans: "คนประจบสอพลอ" }, { word: "TREPIDATION", trans: "ความหวาดกลัว" },
        { word: "UBIQUITY", trans: "การมีอยู่ทั่วไป" }, { word: "VICARIOUS", trans: "ซึ่งได้รับประสบการณ์ผ่านผู้อื่น" },
        { word: "WINSOME", trans: "มีเสน่ห์ดึงดูดใจ" }, { word: "ZEALOUS", trans: "กระตือรือร้นอย่างมาก" }
    ]
};

// Fix typo in B2 list
vocabDB.B2[5] = { word: "FREQUENT", trans: "บ่อยครั้ง" };

const app = {
    state: {
        level: 'A1',
        mode: 1, // 1 = Anagram, 2 = Image Guess
        currentWords: [],
        wordIndex: 0,
        score: 0,
        time: 0,
        timerInterval: null,
        stars: parseInt(localStorage.getItem('vocabStars')) || 0,
        combo: 0,
        unlockedLevels: JSON.parse(localStorage.getItem('vocabUnlockedLevels')) || ['A1'],
        highScores: JSON.parse(localStorage.getItem('vocabHighScores')) || {},
        settings: JSON.parse(localStorage.getItem('vocabSettings')) || { soundOn: true },
        missedWords: [],
        currentInput: [],
        scrambledLetters: [],
        availableLetters: [] // For Mode 1
    },
    audioCtx: null,

    showSettings() {
        document.getElementById('settings-modal').classList.remove('hidden');
        const soundBtn = document.getElementById('btn-toggle-sound');
        soundBtn.innerHTML = this.state.settings.soundOn ? '<i class="fas fa-volume-up"></i> ON' : '<i class="fas fa-volume-mute"></i> OFF';
    },

    hideSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    },

    toggleSound() {
        this.state.settings.soundOn = !this.state.settings.soundOn;
        localStorage.setItem('vocabSettings', JSON.stringify(this.state.settings));
        const soundBtn = document.getElementById('btn-toggle-sound');
        soundBtn.innerHTML = this.state.settings.soundOn ? '<i class="fas fa-volume-up"></i> ON' : '<i class="fas fa-volume-mute"></i> OFF';
    },

    resetProgress() {
        if(confirm('Are you sure you want to reset all progress?')) {
            localStorage.clear();
            location.reload();
        }
    },
    audioCtx: null,

    init() {
        document.getElementById('total-stars-display').textContent = this.state.stars;
        this.showMainMenu();
        this.setupKeyboard();
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    showMainMenu() {
        this.showScreen('main-menu');
        document.getElementById('total-stars-display').textContent = this.state.stars;
    },

    showLevelSelect() {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const buttons = document.querySelectorAll('.btn-level');
        buttons.forEach((btn, index) => {
            const lvl = levels[index];
            if (this.state.unlockedLevels.includes(lvl)) {
                btn.classList.remove('locked');
                let scoreText = this.state.highScores[lvl] ? `High Score: ${this.state.highScores[lvl].score}` : 'No Score Yet';
                if (!btn.querySelector('.high-score-display')) {
                    btn.innerHTML += `<div class="high-score-display">${scoreText}</div>`;
                } else {
                    btn.querySelector('.high-score-display').textContent = scoreText;
                }
            } else {
                btn.classList.add('locked');
                // Ensure lock icon exists
                if (!btn.querySelector('.fa-lock')) {
                    btn.innerHTML = `<i class="fas fa-lock"></i> ` + btn.innerHTML;
                }
                if (btn.querySelector('.high-score-display')) {
                    btn.querySelector('.high-score-display').remove();
                }
            }
        });
        this.showScreen('level-select');
    },

    selectLevel(level) {
        if (!this.state.unlockedLevels.includes(level)) {
            this.showToast('Level Locked!');
            return;
        }
        this.state.level = level;
        document.getElementById('mode-level-display').textContent = level;
        this.showScreen('mode-select');
    },

    playSound(type) {
        if (!this.state.settings.soundOn) return;
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, this.audioCtx.currentTime + 0.1); // C6
            gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.3);
        }
    },

    playPronunciation() {
        if (!this.state.settings.soundOn) return;
        const word = this.state.currentWords[this.state.wordIndex].word;
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    },

    updateComboDisplay() {
        const comboEl = document.getElementById('combo-display');
        if (this.state.combo > 1) {
            comboEl.textContent = `x${this.state.combo}`;
            comboEl.classList.remove('hidden');
            comboEl.classList.add('active');
            setTimeout(() => comboEl.classList.remove('active'), 500);
        } else {
            comboEl.classList.add('hidden');
        }
    },

    startGame(mode) {
        this.state.mode = mode;
        this.state.score = 0;
        this.state.time = 0;
        this.state.wordIndex = 0;
        this.state.combo = 0;
        this.state.missedWords = [];
        this.updateComboDisplay();
        
        // Randomize 20 words from selected level
        const allLevelWords = [...vocabDB[this.state.level]];
        this.state.currentWords = allLevelWords.sort(() => 0.5 - Math.random()).slice(0, 20);
        
        document.getElementById('score').textContent = '0';
        document.getElementById('timer').textContent = '00:00';
        
        this.showScreen('gameplay');
        
        // UI prep based on mode
        if (mode === 1) {
            document.getElementById('image-container').classList.add('hidden');
            document.getElementById('letters-pool').classList.remove('hidden');
            document.getElementById('keyboard').classList.add('hidden');
        } else {
            document.getElementById('image-container').classList.remove('hidden');
            document.getElementById('letters-pool').classList.add('hidden');
            document.getElementById('keyboard').classList.remove('hidden');
        }
        
        this.startTimer();
        this.loadWord();
    },

    startTimer() {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = setInterval(() => {
            this.state.time++;
            const mins = Math.floor(this.state.time / 60).toString().padStart(2, '0');
            const secs = (this.state.time % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${mins}:${secs}`;
        }, 1000);
    },

    quitGame() {
        clearInterval(this.state.timerInterval);
        this.showLevelSelect();
    },

    loadWord() {
        const wordObj = this.state.currentWords[this.state.wordIndex];
        const wordStr = wordObj.word;
        
        document.getElementById('word-progress').textContent = `${this.state.wordIndex + 1}/20`;
        document.getElementById('translation-text').textContent = wordObj.trans;
        if (this.state.mode === 1) {
            document.getElementById('translation-box').classList.remove('hidden');
        } else {
            document.getElementById('translation-box').classList.add('hidden');
        }
        document.getElementById('btn-next').classList.add('hidden');
        
        this.state.currentInput = Array(wordStr.length).fill('');
        this.renderWordSlots();

        if (this.state.mode === 1) {
            // Anagram setup
            let letters = wordStr.split('');
            // Ensure it's actually scrambled
            do {
                letters.sort(() => 0.5 - Math.random());
            } while (letters.join('') === wordStr && wordStr.length > 1);
            
            this.state.availableLetters = letters.map((l, i) => ({ id: i, char: l, used: false }));
            this.renderLettersPool();
        } else {
            // Image setup
            const imgEl = document.getElementById('word-image');
            const loader = document.querySelector('.image-loader');
            imgEl.style.display = 'none';
            loader.style.display = 'block';
            
            // Using loremflickr for faster relevant images
            imgEl.src = `https://loremflickr.com/400/200/${encodeURIComponent(wordStr.toLowerCase())}`;
            imgEl.onload = () => {
                loader.style.display = 'none';
                imgEl.style.display = 'block';
            };
        }
    },

    renderWordSlots() {
        const container = document.getElementById('word-slots');
        container.innerHTML = '';
        const wordStr = this.state.currentWords[this.state.wordIndex].word;
        
        for (let i = 0; i < wordStr.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            if (this.state.currentInput[i]) {
                const val = typeof this.state.currentInput[i] === 'object' ? this.state.currentInput[i].char : this.state.currentInput[i];
                slot.textContent = val;
                slot.classList.add('filled');
            }
            // Allow clicking to remove letter in Mode 1
            if (this.state.mode === 1 && this.state.currentInput[i]) {
                slot.onclick = () => this.removeLetter(i);
            }
            container.appendChild(slot);
        }
    },

    renderLettersPool() {
        const container = document.getElementById('letters-pool');
        container.innerHTML = '';
        
        this.state.availableLetters.forEach(item => {
            const btn = document.createElement('button');
            btn.className = `letter-btn ${item.used ? 'used' : ''}`;
            btn.textContent = item.char;
            btn.onclick = () => this.addLetter(item);
            container.appendChild(btn);
        });
    },

    addLetter(item) {
        if (item.used) return;
        const emptyIndex = this.state.currentInput.findIndex(val => val === '');
        if (emptyIndex !== -1) {
            this.state.currentInput[emptyIndex] = item.char;
            
            // In Mode 1, mark the specific item as used
            if (this.state.mode === 1) {
                // Store the id of the used letter to map it back on remove
                this.state.currentInput[emptyIndex] = { char: item.char, id: item.id };
                item.used = true;
                this.renderLettersPool();
            }
            
            this.renderWordSlots();
            this.checkAnswer();
        }
    },

    removeLetter(index) {
        if (this.state.mode === 1 && this.state.currentInput[index]) {
            const item = this.state.currentInput[index];
            if (typeof item === 'object') {
                const poolItem = this.state.availableLetters.find(l => l.id === item.id);
                if (poolItem) poolItem.used = false;
            }
            this.state.currentInput[index] = '';
            this.renderLettersPool();
            this.renderWordSlots();
        }
    },

    handleKeyboardInput(char) {
        if (char === 'DEL') {
            // Find last filled index
            let lastIndex = -1;
            for (let i = this.state.currentInput.length - 1; i >= 0; i--) {
                if (this.state.currentInput[i] !== '') {
                    lastIndex = i;
                    break;
                }
            }
            if (lastIndex !== -1) {
                this.state.currentInput[lastIndex] = '';
                this.renderWordSlots();
            }
        } else {
            const emptyIndex = this.state.currentInput.findIndex(val => val === '');
            if (emptyIndex !== -1) {
                this.state.currentInput[emptyIndex] = char;
                this.renderWordSlots();
                this.checkAnswer();
            }
        }
    },

    setupKeyboard() {
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
        ];
        const container = document.getElementById('keyboard');
        container.innerHTML = '';
        
        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const btn = document.createElement('button');
                btn.className = `key-btn ${key === 'DEL' ? 'action' : ''}`;
                btn.textContent = key === 'DEL' ? '⌫' : key;
                btn.onclick = () => this.handleKeyboardInput(key);
                rowDiv.appendChild(btn);
            });
            container.appendChild(rowDiv);
        });
    },

    useHint() {
        const targetWord = this.state.currentWords[this.state.wordIndex].word;
        // Find an empty slot
        const emptyIndices = [];
        for (let i = 0; i < targetWord.length; i++) {
            const val = this.state.mode === 1 && typeof this.state.currentInput[i] === 'object' 
                ? this.state.currentInput[i].char 
                : this.state.currentInput[i];
                
            if (val !== targetWord[i]) {
                emptyIndices.push(i);
            }
        }

        if (emptyIndices.length > 0) {
            if (this.state.score >= 5) {
                this.state.score -= 5;
                document.getElementById('score').textContent = this.state.score;
            } else {
                this.showToast("Not enough points! (Need 5)");
                return;
            }

            const targetIndex = emptyIndices[0];
            const targetChar = targetWord[targetIndex];

            // If mode 1, we need to find the correct letter in the pool and place it
            if (this.state.mode === 1) {
                // If there's already a wrong letter here, return it to pool
                if (this.state.currentInput[targetIndex]) {
                    this.removeLetter(targetIndex);
                }

                const availablePoolItem = this.state.availableLetters.find(l => !l.used && l.char === targetChar);
                if (availablePoolItem) {
                    this.state.currentInput[targetIndex] = { char: targetChar, id: availablePoolItem.id };
                    availablePoolItem.used = true;
                    this.renderLettersPool();
                }
            } else {
                this.state.currentInput[targetIndex] = targetChar;
            }
            
            this.renderWordSlots();
            
            // Add a little highlight animation
            const slots = document.querySelectorAll('.slot');
            if (slots[targetIndex]) {
                slots[targetIndex].style.borderColor = 'var(--warning)';
                setTimeout(() => {
                    slots[targetIndex].style.borderColor = '';
                }, 1000);
            }
            
            this.checkAnswer();
        }
    },

    checkAnswer() {
        const targetWord = this.state.currentWords[this.state.wordIndex].word;
        const currentStr = this.state.currentInput.map(val => typeof val === 'object' ? val.char : val).join('');
        
        if (currentStr.length === targetWord.length) {
            if (currentStr === targetWord) {
                // Correct
                this.playSound('correct');
                this.state.combo++;
                this.updateComboDisplay();
                
                const points = 10 * this.state.combo;
                this.state.score += points;
                document.getElementById('score').textContent = this.state.score;
                this.playPronunciation();
                
                const slots = document.querySelectorAll('.slot');
                slots.forEach(slot => {
                    slot.classList.remove('filled', 'wrong');
                    slot.classList.add('correct');
                });
                
                // Show Translation
                document.getElementById('translation-text').textContent = this.state.currentWords[this.state.wordIndex].trans;
                document.getElementById('translation-box').classList.remove('hidden');
                
                // Disable inputs
                if (this.state.mode === 1) {
                    document.getElementById('letters-pool').classList.add('hidden');
                } else {
                    document.getElementById('keyboard').classList.add('hidden');
                }
                
                document.getElementById('btn-next').classList.remove('hidden');
            } else {
                // Wrong
                if (!this.state.missedWords.find(w => w.word === targetWord)) {
                    this.state.missedWords.push(this.state.currentWords[this.state.wordIndex]);
                }
                this.playSound('wrong');
                this.state.combo = 0;
                this.updateComboDisplay();
                
                const slots = document.querySelectorAll('.slot');
                slots.forEach(slot => {
                    slot.classList.remove('filled');
                    slot.classList.add('wrong');
                    setTimeout(() => slot.classList.remove('wrong', 'filled'), 400); // Remove after animation
                });
                
                // Reset input
                if (this.state.mode === 1) {
                    this.state.availableLetters.forEach(l => l.used = false);
                    this.state.currentInput = Array(targetWord.length).fill('');
                    setTimeout(() => {
                        this.renderLettersPool();
                        this.renderWordSlots();
                    }, 400);
                } else {
                    this.state.currentInput = Array(targetWord.length).fill('');
                    setTimeout(() => this.renderWordSlots(), 400);
                }
            }
        }
    },

    skipWord() {
        const targetWord = this.state.currentWords[this.state.wordIndex].word;
        if (!this.state.missedWords.find(w => w.word === targetWord)) {
            this.state.missedWords.push(this.state.currentWords[this.state.wordIndex]);
        }
        this.playSound('wrong');
        this.state.combo = 0;
        this.updateComboDisplay();
        
        // Show correct answer briefly then move to next
        const targetWord = this.state.currentWords[this.state.wordIndex].word;
        const slots = document.querySelectorAll('.slot');
        slots.forEach((slot, i) => {
            slot.textContent = targetWord[i];
            slot.classList.add('filled', 'wrong');
        });
        
        document.getElementById('translation-text').textContent = this.state.currentWords[this.state.wordIndex].trans;
        document.getElementById('translation-box').classList.remove('hidden');
        
        setTimeout(() => this.nextWord(), 1500);
    },

    nextWord() {
        this.state.wordIndex++;
        if (this.state.wordIndex >= this.state.currentWords.length) {
            this.finishStage();
        } else {
            if (this.state.mode === 1) {
                document.getElementById('letters-pool').classList.remove('hidden');
            } else {
                document.getElementById('keyboard').classList.remove('hidden');
            }
            this.loadWord();
        }
    },

    finishStage() {
        clearInterval(this.state.timerInterval);
        
        // Calculate stars based on score and time
        // Max score = 20 * 10 = 200
        let starsEarned = 1;
        if (this.state.score > 150 && this.state.time < 180) starsEarned = 3;
        else if (this.state.score > 100) starsEarned = 2;
        
        this.state.stars += starsEarned;
        localStorage.setItem('vocabStars', this.state.stars);
        
        document.getElementById('final-score').textContent = this.state.score;
        const mins = Math.floor(this.state.time / 60).toString().padStart(2, '0');
        const secs = (this.state.time % 60).toString().padStart(2, '0');
        document.getElementById('final-time').textContent = `${mins}:${secs}`;
        
        const starIcons = document.querySelectorAll('.stars-earned i');
        starIcons.forEach((icon, index) => {
            icon.className = index < starsEarned ? 'fas fa-star' : 'far fa-star';
        });
        
        // Unlock next level if stars earned > 0
        if (starsEarned > 0) {
            const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            const currentIndex = levels.indexOf(this.state.level);
            if (currentIndex < levels.length - 1) {
                const nextLevel = levels[currentIndex + 1];
                if (!this.state.unlockedLevels.includes(nextLevel)) {
                    this.state.unlockedLevels.push(nextLevel);
                    localStorage.setItem('vocabUnlockedLevels', JSON.stringify(this.state.unlockedLevels));
                }
            }
        }
        // High Scores
        const currentLvl = this.state.level;
        if (!this.state.highScores[currentLvl] || this.state.score > this.state.highScores[currentLvl].score) {
            this.state.highScores[currentLvl] = { score: this.state.score, time: this.state.time };
            localStorage.setItem('vocabHighScores', JSON.stringify(this.state.highScores));
        }
        
        // Review List
        const reviewContainer = document.getElementById('review-list-container');
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';
        if (this.state.missedWords.length > 0) {
            this.state.missedWords.forEach(w => {
                reviewList.innerHTML += `<li><span class="review-word">${w.word}</span> <span class="review-trans">${w.trans}</span></li>`;
            });
            reviewContainer.classList.remove('hidden');
        } else {
            reviewContainer.classList.add('hidden');
        }
        
        this.showScreen('result');
    },

    replayGame() {
        this.startGame(this.state.mode);
    },

    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
};

window.onload = () => app.init();
