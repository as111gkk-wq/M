class BalancedPredictionGame {
    constructor() {
        this.lastSixHits = [];
        this.currentRoundHits = [];
        this.missedHits = [];
        this.vegetables = ['🍅', '🫑', '🥕', '🌽'];
        this.meats = ['🐮', '🐟', '🍤', '🐤'];
        this.allItems = [...this.vegetables, ...this.meats];
        this.currentInput = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        try {
            document.querySelectorAll('.choice-item').forEach(item => {
                item.addEventListener('click', (e) => this.handleChoiceSelection(e));
            });

            const confirmBtn = document.getElementById('confirmBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => this.startGame());
            }

            document.querySelectorAll('.input-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleGameInput(e));
            });

            const nextRoundBtn = document.getElementById('nextRoundBtn');
            if (nextRoundBtn) {
                nextRoundBtn.addEventListener('click', () => this.nextRound());
            }

            const backBtn = document.getElementById('backBtn');
            if (backBtn) {
                backBtn.addEventListener('click', () => this.resetGame());
            }

            const backTop = document.querySelector('.back-btn-top');
            if (backTop) {
                backTop.addEventListener('click', () => this.resetGame());
            }

            console.log('✅ تم تحميل اللعبة بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تحميل اللعبة:', error);
        }
    }

    handleChoiceSelection(event) {
        if (this.lastSixHits.length >= 6) return;

        const selectedItem = event.currentTarget;
        const value = selectedItem.dataset.value;

        this.lastSixHits.push(value);
        this.updateSelectedList();

        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.disabled = !(this.lastSixHits.length === 6);
    }

    updateSelectedList() {
        const selectedList = document.getElementById('selectedList');
        const selectedCount = document.getElementById('selectedCount');

        if (selectedList) selectedList.innerHTML = '';
        if (selectedCount) selectedCount.textContent = this.lastSixHits.length;

        this.lastSixHits.forEach((hit, index) => {
            const span = document.createElement('span');
            span.className = 'selected-hit';
            span.textContent = hit;
            span.title = `ضربة ${index + 1}`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSelectedHit(index);
            });

            span.appendChild(removeBtn);
            if (selectedList) selectedList.appendChild(span);
        });
    }

    removeSelectedHit(index) {
        this.lastSixHits.splice(index, 1);
        this.updateSelectedList();
        
        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.disabled = this.lastSixHits.length !== 6;
    }

    startGame() {
        if (this.lastSixHits.length !== 6) {
            alert('⚠️ يجب اختيار 6 ضربات أولاً');
            return;
        }

        this.currentRoundHits = [...this.lastSixHits];
        this.showGuessScreen();
        this.generateBalancedPredictions();
        this.updateDisplays();
    }

    showGuessScreen() {
        const inputScreen = document.getElementById('inputScreen');
        const guessScreen = document.getElementById('guessScreen');
        
        if (inputScreen) inputScreen.classList.remove('active');
        if (guessScreen) guessScreen.classList.add('active');
    }

    updateDisplays() {
        this.updateCurrentRoundDisplay();
        this.updateMissedHitsDisplay();
    }

    updateCurrentRoundDisplay() {
        const display = document.getElementById('currentRoundHits');
        if (!display) return;
        
        display.innerHTML = '';
        this.currentRoundHits.forEach((hit, index) => {
            const div = document.createElement('div');
            div.className = 'round-hit';
            div.textContent = hit;
            div.title = `ضربة ${index + 1}`;
            display.appendChild(div);
        });
    }

    updateMissedHitsDisplay() {
        const display = document.getElementById('missedHits');
        if (!display) return;
        
        display.innerHTML = '';
        this.missedHits.forEach((hit) => {
            const div = document.createElement('div');
            div.className = 'missed-item';
            div.textContent = hit;
            display.appendChild(div);
        });
    }

    handleGameInput(event) {
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const inputValue = event.currentTarget.dataset.value;
        this.currentInput = inputValue;
        event.currentTarget.classList.add('selected');

        const nextRoundBtn = document.getElementById('nextRoundBtn');
        if (nextRoundBtn) nextRoundBtn.disabled = false;
    }

    nextRound() {
        if (!this.currentInput) {
            alert('⚠️ يجب إدخال الضربة التي جاءت في اللعبة أولاً');
            return;
        }

        this.currentRoundHits.push(this.currentInput);
        this.lastSixHits = this.currentRoundHits.slice(-6);

        this.checkMissedPredictions();

        this.currentInput = null;
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const nextRoundBtn = document.getElementById('nextRoundBtn');
        if (nextRoundBtn) nextRoundBtn.disabled = true;

        this.updateDisplays();
        this.generateBalancedPredictions();
    }

    // ⚖️ خوارزمية متوازنة بـ 3 خضار و 3 لحوم
    generateBalancedPredictions() {
        const prediction100 = document.getElementById('prediction100');
        const prediction50 = document.getElementById('prediction50');

        if (prediction100) prediction100.innerHTML = '';
        if (prediction50) prediction50.innerHTML = '';

        const predictions = this.calculateBalancedPredictions();

        // تقسيم 3 خضار و 3 لحوم بالتساوي
        const vegetables = predictions.filter(item => this.vegetables.includes(item));
        const meats = predictions.filter(item => this.meats.includes(item));

        // عرض 3 خضار في التوقعات العالية
        vegetables.slice(0, 3).forEach((item, index) => {
            const confidence = 85 - (index * 8);
            this.createPredictionItem(item, 'عالية', prediction100, true, confidence, '🥦');
        });

        // عرض 3 لحوم في التوقعات المتوسطة
        meats.slice(0, 3).forEach((item, index) => {
            const confidence = 75 - (index * 8);
            this.createPredictionItem(item, 'متوسطة', prediction50, false, confidence, '🍖');
        });
    }

    calculateBalancedPredictions() {
        if (this.currentRoundHits.length === 0) {
            return this.getPerfectlyBalancedItems();
        }

        const scores = {};
        this.allItems.forEach(item => scores[item] = 0);

        // 1. تحليل التوازن الحالي
        this.analyzeCurrentBalance(scores);

        // 2. تحليل التسلسل الأخير
        this.analyzeRecentPatterns(scores);

        // 3. استراتيجيات ذكية للتوازن
        this.applyBalancingStrategies(scores);

        // 4. تعزيز العناصر النادرة
        this.boostRareItems(scores);

        // فصل الخضار واللحوم وترتيبهم بشكل منفصل
        const vegetableScores = Object.entries(scores)
            .filter(([item]) => this.vegetables.includes(item))
            .sort(([,a], [,b]) => b - a)
            .map(([item]) => item)
            .slice(0, 3);

        const meatScores = Object.entries(scores)
            .filter(([item]) => this.meats.includes(item))
            .sort(([,a], [,b]) => b - a)
            .map(([item]) => item)
            .slice(0, 3);

        // دمج النتائج مع الحفاظ على التوازن
        return [...vegetableScores, ...meatScores];
    }

    analyzeCurrentBalance(scores) {
        const lastSix = this.lastSixHits;
        const vegCount = lastSix.filter(item => this.vegetables.includes(item)).length;
        const meatCount = lastSix.filter(item => this.meats.includes(item)).length;

        console.log(`📊 الإحصاء الحالي: ${vegCount} خضار, ${meatCount} لحوم`);

        // هدفنا: 3 خضار و 3 لحوم
        const targetBalance = 3;

        // تصحيح عدم التوازن
        if (vegCount > targetBalance) {
            // زيادة في الخضار، نعزز اللحوم
            this.meats.forEach(meat => {
                scores[meat] += (vegCount - targetBalance) * 4;
            });
        } else if (meatCount > targetBalance) {
            // زيادة في اللحوم، نعزز الخضار
            this.vegetables.forEach(veg => {
                scores[veg] += (meatCount - targetBalance) * 4;
            });
        }

        // إذا كان التوازن جيداً، نعزز النوع الآخر عن الأخير
        const lastHit = lastSix[lastSix.length - 1];
        if (lastHit) {
            if (this.vegetables.includes(lastHit)) {
                this.meats.forEach(meat => scores[meat] += 3);
            } else {
                this.vegetables.forEach(veg => scores[veg] += 3);
            }
        }
    }

    analyzeRecentPatterns(scores) {
        const lastThree = this.lastSixHits.slice(-3);
        const vegInLastThree = lastThree.filter(item => this.vegetables.includes(item)).length;
        const meatInLastThree = lastThree.filter(item => this.meats.includes(item)).length;

        // إذا كان هناك تكرار لنفس النوع، نعزز النوع المعاكس
        if (vegInLastThree >= 2) {
            console.log('🔄 تكرار خضار → نعزز اللحوم');
            this.meats.forEach(meat => {
                scores[meat] += vegInLastThree * 3;
            });
        }

        if (meatInLastThree >= 2) {
            console.log('🔄 تكرار لحوم → نعزز الخضار');
            this.vegetables.forEach(veg => {
                scores[veg] += meatInLastThree * 3;
            });
        }

        // تحليل التسلسل المباشر
        lastThree.forEach((hit, index) => {
            const weight = (3 - index) * 2;
            scores[hit] += weight;
        });
    }

    applyBalancingStrategies(scores) {
        const lastHit = this.lastSixHits[this.lastSixHits.length - 1];
        const secondLastHit = this.lastSixHits[this.lastSixHits.length - 2];

        // استراتيجية التناوب الذكي
        if (lastHit && secondLastHit) {
            const lastIsVeg = this.vegetables.includes(lastHit);
            const secondLastIsVeg = this.vegetables.includes(secondLastHit);

            if (lastIsVeg === secondLastIsVeg) {
                // تكرار نفس النوع، نعزز النوع المعاكس
                if (lastIsVeg) {
                    this.meats.forEach(meat => scores[meat] += 4);
                } else {
                    this.vegetables.forEach(veg => scores[veg] += 4);
                }
            } else {
                // تناوب، نستمر في التناوب ولكن بنفس النوع
                if (lastIsVeg) {
                    this.vegetables.forEach(veg => {
                        if (veg !== lastHit) scores[veg] += 2;
                    });
                } else {
                    this.meats.forEach(meat => {
                        if (meat !== lastHit) scores[meat] += 2;
                    });
                }
            }
        }

        // منع التكرار المباشر لنفس العنصر
        if (lastHit) {
            scores[lastHit] -= 3;
        }
    }

    boostRareItems(scores) {
        const lastTen = this.currentRoundHits.slice(-10);
        
        // تعزيز العناصر النادرة مع الحفاظ على التوازن
        this.allItems.forEach(item => {
            const recentAppearances = lastTen.filter(hit => hit === item).length;
            if (recentAppearances === 0) {
                scores[item] += 4; // عنصر لم يظهر أبداً
            } else if (recentAppearances === 1) {
                scores[item] += 2; // عنصر نادر
            }
        });

        // تعزيز إضافي للحفاظ على تنوع الخضار واللحوم
        const recentVeg = lastTen.filter(item => this.vegetables.includes(item));
        const recentMeat = lastTen.filter(item => this.meats.includes(item));
        
        // إذا كان نوع معين نادراً، نعززه
        if (recentVeg.length < 3) {
            this.vegetables.forEach(veg => {
                const vegAppearances = recentVeg.filter(hit => hit === veg).length;
                if (vegAppearances === 0) {
                    scores[veg] += 3;
                }
            });
        }

        if (recentMeat.length < 3) {
            this.meats.forEach(meat => {
                const meatAppearances = recentMeat.filter(hit => hit === meat).length;
                if (meatAppearances === 0) {
                    scores[meat] += 3;
                }
            });
        }
    }

    getPerfectlyBalancedItems() {
        // إرجاع 3 خضار و 3 لحوم بشكل متوازن
        const shuffledVeg = [...this.vegetables].sort(() => 0.5 - Math.random());
        const shuffledMeat = [...this.meats].sort(() => 0.5 - Math.random());
        
        const threeVeg = shuffledVeg.slice(0, 3);
        const threeMeat = shuffledMeat.slice(0, 3);
        
        return [...threeVeg, ...threeMeat].sort(() => 0.5 - Math.random());
    }

    checkMissedPredictions() {
        const predictionItems = document.querySelectorAll('.prediction-item');
        predictionItems.forEach(item => {
            const emoji = item.querySelector('.pred-emoji').textContent;
            if (emoji !== this.currentInput) {
                this.addMissedHit(emoji);
            }
        });
    }

    addMissedHit(item) {
        if (!this.missedHits.includes(item)) {
            this.missedHits.push(item);
            this.updateMissedHitsDisplay();
        }
    }

    createPredictionItem(item, label, container, isHighProbability, confidence = 50, typeEmoji = '') {
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = `prediction-item ${isHighProbability ? 'prediction-100' : 'prediction-50'}`;
        
        const type = this.vegetables.includes(item) ? 'خضار' : 'لحوم';
        const emoji = this.vegetables.includes(item) ? '🥦' : '🍖';

        div.innerHTML = `
            <div class="pred-row">
                <span class="pred-emoji">${item}</span>
                <span class="pred-type">${emoji}</span>
                <span class="pred-label">${label}</span>
                <span class="pred-conf">${confidence}%</span>
            </div>
            <div class="confidence-bar" style="width: ${confidence}%"></div>
        `;

        div.title = `${this.getItemName(item)} - ${type} - ثقة ${confidence}%`;
        div.addEventListener('click', () => this.handlePredictionClick(item, label, type));
        container.appendChild(div);
    }

    handlePredictionClick(item, percentage, type) {
        alert(`🎯 توقع: ${item} ${this.getItemName(item)} (${type}) - ${percentage} ثقة`);
    }

    getItemName(emoji) {
        const names = {
            '🍅': 'طماطم', '🫑': 'فلفل', '🥕': 'جزر', '🌽': 'ذرة',
            '🐮': 'بقرة', '🐟': 'سمكة', '🍤': 'جمبري', '🐤': 'كتكوت'
        };
        return names[emoji] || emoji;
    }

    resetGame() {
        this.lastSixHits = [];
        this.currentRoundHits = [];
        this.missedHits = [];
        this.currentInput = null;

        const confirmBtn = document.getElementById('confirmBtn');
        if (confirmBtn) confirmBtn.disabled = true;
        
        const nextRoundBtn = document.getElementById('nextRoundBtn');
        if (nextRoundBtn) nextRoundBtn.disabled = true;

        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const guessScreen = document.getElementById('guessScreen');
        const inputScreen = document.getElementById('inputScreen');
        
        if (guessScreen) guessScreen.classList.remove('active');
        if (inputScreen) inputScreen.classList.add('active');

        this.updateSelectedList();
        this.updateDisplays();
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new BalancedPredictionGame();
});

if (document.readyState === 'complete') {
    new BalancedPredictionGame();
}
