class PredictionGame {
    constructor() {
        this.lastSixHits = [];
        this.currentRoundHits = [];
        this.missedHits = [];
        this.vegetables = ['🍅', '🫑', '🥕', '🌽'];
        this.meats = ['🐮', '🐟', '🍤', '🐤'];
        this.allItems = [...this.vegetables, ...this.meats];
        this.currentInput = null;
        this.choiceCounts = {};
        
        this.initializeEventListeners();
        this.initializeChoiceCounts();
    }

    initializeChoiceCounts() {
        this.allItems.forEach(item => {
            this.choiceCounts[item] = 0;
        });
    }

    initializeEventListeners() {
        // شاشة الإدخال
        document.querySelectorAll('.choice-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleChoiceSelection(e));
        });

        document.getElementById('confirmBtn').addEventListener('click', () => this.startGame());

        // شاشة التخمين
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleGameInput(e));
        });

        document.getElementById('nextRoundBtn').addEventListener('click', () => this.nextRound());
        document.getElementById('backBtn').addEventListener('click', () => this.resetGame());
        document.querySelector('.back-btn-top').addEventListener('click', () => this.resetGame());
    }

    handleChoiceSelection(event) {
        if (this.lastSixHits.length >= 6) return;

        const selectedItem = event.currentTarget;
        const value = selectedItem.dataset.value;

        // إضافة العنصر
        this.lastSixHits.push(value);
        this.choiceCounts[value]++;
        
        this.updateSelectedList();
        this.updateChoiceCounts();

        if (this.lastSixHits.length === 6) {
            document.getElementById('confirmBtn').disabled = false;
        }
    }

    updateChoiceCounts() {
        this.allItems.forEach(item => {
            const choiceElement = document.querySelector(`.choice-item[data-value="${item}"]`);
            const countElement = choiceElement.querySelector('.choice-count') || this.createCountElement(choiceElement);
            countElement.textContent = this.choiceCounts[item];
            
            if (this.choiceCounts[item] > 0) {
                choiceElement.classList.add('selected');
            } else {
                choiceElement.classList.remove('selected');
            }
        });
    }

    createCountElement(choiceElement) {
        const countElement = document.createElement('span');
        countElement.className = 'choice-count';
        choiceElement.appendChild(countElement);
        return countElement;
    }

    updateSelectedList() {
        const selectedList = document.getElementById('selectedList');
        const selectedCount = document.getElementById('selectedCount');
        
        selectedList.innerHTML = '';
        selectedCount.textContent = this.lastSixHits.length;
        
        this.lastSixHits.forEach((hit, index) => {
            const span = document.createElement('span');
            span.className = 'selected-hit';
            span.textContent = hit;
            span.title = `ضربة ${index + 1}`;
            
            // زر الإزالة
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSelectedHit(index);
            });
            
            span.appendChild(removeBtn);
            selectedList.appendChild(span);
        });
    }

    removeSelectedHit(index) {
        const removedValue = this.lastSixHits[index];
        this.lastSixHits.splice(index, 1);
        this.choiceCounts[removedValue]--;
        
        this.updateSelectedList();
        this.updateChoiceCounts();
        document.getElementById('confirmBtn').disabled = this.lastSixHits.length !== 6;
    }

    startGame() {
        if (this.lastSixHits.length !== 6) return;

        this.currentRoundHits = [...this.lastSixHits];
        this.showGuessScreen();
        this.generatePredictions();
        this.updateDisplays();
    }

    showGuessScreen() {
        document.getElementById('inputScreen').classList.remove('active');
        document.getElementById('guessScreen').classList.add('active');
    }

    updateDisplays() {
        this.updateCurrentRoundDisplay();
        this.updateMissedHitsDisplay();
    }

    updateCurrentRoundDisplay() {
        const display = document.getElementById('currentRoundHits');
        display.innerHTML = '';
        
        // عرض آخر 10 ضربات فقط (أحدث 10)
        const displayHits = this.currentRoundHits.slice(-10);
        
        displayHits.forEach((hit, index) => {
            const div = document.createElement('div');
            div.className = 'round-hit';
            div.textContent = hit;
            const globalIndex = this.currentRoundHits.length - displayHits.length + index + 1;
            div.title = `ضربة ${globalIndex}`;
            display.appendChild(div);
        });
    }

    updateMissedHitsDisplay() {
        const display = document.getElementById('missedHits');
        display.innerHTML = '';
        
        this.missedHits.forEach((hit, index) => {
            const div = document.createElement('div');
            div.className = 'missed-item';
            div.textContent = hit;
            display.appendChild(div);
        });
    }

    handleGameInput(event) {
        // إزالة التحديد السابق
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        const inputValue = event.currentTarget.dataset.value;
        this.currentInput = inputValue;
        event.currentTarget.classList.add('selected');
        
        // تفعيل زر الجولة التالية
        document.getElementById('nextRoundBtn').disabled = false;
    }

    nextRound() {
        if (!this.currentInput) {
            alert('يجب إدخال الضربة التي جاءت في اللعبة أولاً');
            return;
        }

        // إضافة الضربة الجديدة
        this.currentRoundHits.push(this.currentInput);
        
        // الحفاظ على آخر 10 ضربات فقط (إزالة الأقدم إذا تجاوزنا 10)
        if (this.currentRoundHits.length > 10) {
            this.currentRoundHits = this.currentRoundHits.slice(-10);
        }
        
        // تحديث آخر 6 ضربات (آخر 6 من الجولة الحالية)
        this.lastSixHits = this.currentRoundHits.slice(-6);

        // إعادة تعيين الإدخال الحالي
        this.currentInput = null;
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById('nextRoundBtn').disabled = true;

        // تحديث العروض وتوليد توقعات جديدة
        this.updateDisplays();
        this.generatePredictions();
    }

    generatePredictions() {
        const prediction100 = document.getElementById('prediction100');
        const prediction50 = document.getElementById('prediction50');
        
        prediction100.innerHTML = '';
        prediction50.innerHTML = '';

        // تحليل آخر 6 ضربات
        const hitCount = this.analyzeHits();
        
        // توقع 100% (الأكثر تكراراً من الخضار)
        const topVegetables = this.getTopItems(hitCount, this.vegetables, 2);
        topVegetables.forEach(item => {
            this.createPredictionItem(item, '100%', prediction100, true);
        });

        // توقع 50% (عناصر عشوائية مع مراعاة النظام)
        const randomPredictions = this.getRandomPredictions(hitCount, 2);
        randomPredictions.forEach(item => {
            this.createPredictionItem(item, '50%', prediction50, false);
        });
    }

    analyzeHits() {
        const hitCount = {};
        this.allItems.forEach(item => {
            hitCount[item] = this.lastSixHits.filter(hit => hit === item).length;
        });
        return hitCount;
    }

    getTopItems(hitCount, items, count) {
        const filtered = items.filter(item => hitCount[item] > 0);
        if (filtered.length === 0) {
            return items.slice(0, count);
        }
        return filtered
            .sort((a, b) => hitCount[b] - hitCount[a])
            .slice(0, count);
    }

    getRandomPredictions(hitCount, count) {
        const availableItems = this.allItems.filter(item => 
            !this.lastSixHits.slice(-2).includes(item)
        );
        
        const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    createPredictionItem(item, percentage, container, isHighProbability) {
        const div = document.createElement('div');
        div.className = `prediction-item ${isHighProbability ? 'prediction-100' : 'prediction-50'}`;
        div.textContent = item;
        div.title = `توقع ${percentage} - ${this.getItemName(item)}`;
        
        div.addEventListener('click', () => this.handlePredictionClick(item, percentage));
        container.appendChild(div);
    }

    handlePredictionClick(item, percentage) {
        alert(`توقعت: ${item} (${percentage}) - ${this.getItemName(item)}`);
        
        // إضافة الضربة الفائتة إذا كانت خاطئة
        if (this.currentInput && this.currentInput !== item) {
            this.addMissedHit(item);
        }
    }

    addMissedHit(item) {
        if (!this.missedHits.includes(item)) {
            this.missedHits.push(item);
            this.updateMissedHitsDisplay();
        }
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
        this.initializeChoiceCounts();
        
        // إعادة تعيين الواجهة
        document.querySelectorAll('.choice-item').forEach(item => {
            item.classList.remove('selected');
            const countElement = item.querySelector('.choice-count');
            if (countElement) countElement.remove();
        });
        
        document.getElementById('confirmBtn').disabled = true;
        document.getElementById('nextRoundBtn').disabled = true;
        
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('guessScreen').classList.remove('active');
        document.getElementById('inputScreen').classList.add('active');
        
        this.updateSelectedList();
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new PredictionGame();
});