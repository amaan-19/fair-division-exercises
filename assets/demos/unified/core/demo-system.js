/**
 * Fair Division Demo System - Core
 *
 * Defines classes used by the demo system
 */

// ===== CORE CONFIGURATION =====
const DEMO_CONFIG = {
    VALIDATION: {
        REQUIRED_TOTAL: 100,
        TOLERANCE: 0.1
    },
    DEFAULT_PLAYER_VALUES: {
        player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
        player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 },
        player3: { blue: 30, red: 10, green: 15, orange: 5, pink: 25, purple: 15 }
    },
    COLORS: ['blue', 'red', 'green', 'orange', 'pink', 'purple'],
    BOUNDS: {
        blue: { start: 0, end: 75 },
        red: { start: 75, end: 100 },
        green: { start: 18.75, end: 75 },
        orange: { start: 75, end: 100 },
        pink: { start: 0, end: 18.75 },
        purple: { start: 18.75, end: 100 }
    },
    ELEMENT_IDS: [
        'algorithm-selector', 'algorithm-name', 'algorithm-description',
        'step-indicator', 'instructions', 'start-btn', 'reset-btn',
        'cut-slider', 'cut-slider-2', 'make-cut-btn',
        'cut-value', 'cut-value-2',
        'left-piece', 'right-piece', 'piece-1', 'piece-2', 'piece-3',
        'results', 'result-content', 'player3-section'
    ],
};

// ===== LOGGING UTILITY =====
class Logger {
    static debug(...args) {
        console.log('[DEMO DEBUG]', ...args);
    }

    static info(...args) {
        console.log('[DEMO INFO]', ...args);
    }

    static warn(...args) {
        console.warn('[DEMO WARN]', ...args);
    }

    static error(...args) {
        console.error('[DEMO ERROR]', ...args);
    }

    static group(title) {
        console.group('[DEMO]', title);
    }

    static groupEnd() {
        console.groupEnd();
    }
}

// ===== EVENT SYSTEM =====
class EventSystem {
    constructor() {
        this.events = {};
        Logger.debug('EventSystem initialized');
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, ...args) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                Logger.error(`Error in event handler for "${eventName}":`, error);
            }
        });
    }

    getListenerCount() {
        return Object.values(this.events).reduce((total, listeners) => total + listeners.length, 0);
    }
}

// ===== STATE MANAGEMENT =====
class StateManager {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.state = this.createInitialState();
        this.subscribers = {};

        Logger.debug('StateManager initialized');
    }

    createInitialState() {
        return {
            playerValues: JSON.parse(JSON.stringify(DEMO_CONFIG.DEFAULT_PLAYER_VALUES)),
            cutPosition: 0,
            cutPosition2: 0,
            currentStep: 0,
            algorithmData: {}
        };
    }

    // ===== CORE STATE METHODS =====
    getState(key) {
        return key ? this.state[key] : { ...this.state };
    }

    setState(key, value) {
        if (this.state[key] === value) return;

        const oldValue = this.state[key];
        this.state[key] = value;

        // Emit specific state change event
        this.eventSystem.emit(`state:${key}:changed`, { value, oldValue });

        // Emit general state change event
        this.eventSystem.emit('state:changed', { key, value, oldValue });

        // Notify subscribers
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => {
                try {
                    callback({ value, oldValue });
                } catch (error) {
                    Logger.error(`Error in state subscriber for "${key}":`, error);
                }
            });
        }

        Logger.debug(`State updated: ${key} =`, value);
    }

    subscribe(key, callback) {
        if (!this.subscribers[key]) {
            this.subscribers[key] = [];
        }
        this.subscribers[key].push(callback);
    }

    reset() {
        const oldState = { ...this.state };
        this.state = this.createInitialState();
        this.eventSystem.emit('state:reset', { oldState, newState: { ...this.state } });
        Logger.debug('State reset to initial values');
    }

    // ===== CUT POSITION METHODS =====
    getCutPosition() {
        return this.state.cutPosition;
    }

    setCutPosition(position) {
        const clampedPosition = Math.max(0, Math.min(100, parseFloat(position) || 0));
        this.setState('cutPosition', clampedPosition);
    }

    getCutPosition2() {
        return this.state.cutPosition2;
    }

    setCutPosition2(position) {
        const clampedPosition = Math.max(0, Math.min(100, parseFloat(position) || 0));
        this.setState('cutPosition2', clampedPosition);
    }

    // ===== PLAYER VALUES METHODS =====
    getPlayerValues(player) {
        if (player) {
            return this.state.playerValues[player] || {};
        }
        return { ...this.state.playerValues };
    }

    setPlayerValue(player, color, value) {
        if (!this.state.playerValues[player]) {
            this.state.playerValues[player] = {};
        }

        const clampedValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        this.state.playerValues[player][color] = clampedValue;

        // Emit player values change
        this.setState('playerValues', { ...this.state.playerValues });
    }

    validatePlayerValues(player) {
        const values = this.getPlayerValues(player);
        const total = DEMO_CONFIG.COLORS.reduce((sum, color) => sum + (values[color] || 0), 0);
        const isValid = Math.abs(total - DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL) <= DEMO_CONFIG.VALIDATION.TOLERANCE;

        return {
            total,
            valid: isValid,
            expected: DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL
        };
    }

    // ===== STEP METHODS =====
    getCurrentStep() {
        return this.state.currentStep;
    }

    setCurrentStep(step) {
        this.setState('currentStep', parseInt(step) || 0);
    }

    // ===== ALGORITHM DATA METHODS =====
    getAlgorithmData(key) {
        if (key) {
            return this.state.algorithmData[key];
        }
        return { ...this.state.algorithmData };
    }

    setAlgorithmData(key, value) {
        this.state.algorithmData[key] = value;
        this.setState('algorithmData', { ...this.state.algorithmData });
    }

    clearAlgorithmData() {
        this.setState('algorithmData', {});
    }
}

// ===== CALCULATION UTILITIES =====
class CalculationEngine {
    static calculateRegionValues(cutPosition) {
        const leftValues = {};
        const rightValues = {};

        DEMO_CONFIG.COLORS.forEach(color => {
            const colorBounds = DEMO_CONFIG.BOUNDS[color];
            if (cutPosition <= colorBounds.start) {
                leftValues[color] = 0;
                rightValues[color] = 100;
            } else if (cutPosition >= colorBounds.end) {
                leftValues[color] = 100;
                rightValues[color] = 0;
            } else {
                const total = colorBounds.end - colorBounds.start;
                const left = cutPosition - colorBounds.start;
                leftValues[color] = (left / total) * 100;
                rightValues[color] = 100 - leftValues[color];
            }
        });

        return { left: leftValues, right: rightValues };
    }

    static calculateThreeRegionValues(cutPosition1, cutPosition2) {
        const cut1 = Math.min(cutPosition1, cutPosition2);
        const cut2 = Math.max(cutPosition1, cutPosition2);
        const bounds = DEMO_CONFIG.BOUNDS;
        const piece1 = {}, piece2 = {}, piece3 = {};

        DEMO_CONFIG.COLORS.forEach(color => {
            const colorBounds = bounds[color];
            if (!colorBounds) {
                piece1[color] = piece2[color] = piece3[color] = 0;
                return;
            }

            const start = colorBounds.start;
            const end = colorBounds.end;
            const total = end - start;

            const piece1End = Math.min(cut1, end);
            const piece1Start = Math.max(start, 0);
            const piece1Overlap = Math.max(0, piece1End - piece1Start);

            const piece2Start = Math.max(cut1, start);
            const piece2End = Math.min(cut2, end);
            const piece2Overlap = Math.max(0, piece2End - piece2Start);

            const piece3Start = Math.max(cut2, start);
            const piece3End = Math.max(end, cut2);
            const piece3Overlap = Math.max(0, piece3End - piece3Start);

            piece1[color] = total > 0 ? (piece1Overlap / total) * 100 : 0;
            piece2[color] = total > 0 ? (piece2Overlap / total) * 100 : 0;
            piece3[color] = total > 0 ? (piece3Overlap / total) * 100 : 0;
        });

        return { piece1, piece2, piece3 };
    }

    static calculatePlayerValue(regionValues, playerValues) {
        return DEMO_CONFIG.COLORS.reduce((total, color) => {
            const regionPercent = regionValues[color] || 0;
            const playerValue = playerValues[color] || 0;
            return total + (regionPercent / 100) * playerValue;
        }, 0);
    }

    static validatePlayerTotals(playerValues) {
        const results = {};

        Object.entries(playerValues).forEach(([player, values]) => {
            const total = DEMO_CONFIG.COLORS.reduce((sum, color) => sum + (values[color] || 0), 0);
            const isValid = Math.abs(total - DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL) <= DEMO_CONFIG.VALIDATION.TOLERANCE;

            results[player] = {
                total,
                valid: isValid,
                expected: DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL
            };
        });

        return results;
    }
}

// ===== UI CONTROLLER =====
class UIController {
    constructor(stateManager, eventSystem) {
        this.state = stateManager;
        this.events = eventSystem;
        this.elements = new Map();
        this.activeListeners = [];

        Logger.debug('UIController initialized');
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        const elementIds = DEMO_CONFIG.ELEMENT_IDS;

        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.elements.set(id, element);
            } else {
                Logger.warn(`Element not found: ${id}`);
            }
        });
        Logger.debug(`Cached ${this.elements.size} UI elements`);
    }

    setupEventListeners() {
        // Cut slider
        const cutSlider = this.elements.get('cut-slider');
        if (cutSlider) {
            const listener = (e) => {
                const value = parseFloat(e.target.value);
                this.state.setCutPosition(value);
            };
            cutSlider.addEventListener('input', listener);
            this.activeListeners.push({ element: cutSlider, event: 'input', listener });
        }

        // Second cut slider
        const cutSlider2 = this.elements.get('cut-slider-2');
        if (cutSlider2) {
            const listener = (e) => {
                const value = parseFloat(e.target.value);
                this.state.setCutPosition2(value);
            };
            cutSlider2.addEventListener('input', listener);
            this.activeListeners.push({ element: cutSlider2, event: 'input', listener });
        }

        // Player value inputs
        this.setupPlayerValueListeners();

        Logger.debug(`Setup ${this.activeListeners.length} UI event listeners`);
    }

    setupPlayerValueListeners() {
        ['p1', 'p2', 'p3'].forEach(playerPrefix => {
            const playerKey = playerPrefix === 'p1' ? 'player1' :
                playerPrefix === 'p2' ? 'player2' : 'player3';

            DEMO_CONFIG.COLORS.forEach(color => {
                const input = document.getElementById(`${playerPrefix}-${color}`);
                if (input) {
                    const listener = (e) => {
                        const value = parseInt(e.target.value) || 0;
                        this.state.setPlayerValue(playerKey, color, value);
                        this.updatePlayerValidation(playerKey, playerPrefix);
                    };
                    input.addEventListener('input', listener);
                    this.activeListeners.push({ element: input, event: 'input', listener });
                }
            });
        });
    }

    // ===== UI UPDATE METHODS =====
    updateStepIndicator(text) {
        const element = this.elements.get('step-indicator');
        if (element) {
            element.textContent = text;
        }
    }

    updateInstructions(html) {
        const element = this.elements.get('instructions');
        if (element) {
            element.innerHTML = html;
        }
    }

    updateAlgorithmInfo(name, description) {
        const nameEl = this.elements.get('algorithm-name');
        const descEl = this.elements.get('algorithm-description');

        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = description;
    }

    updatePlayerValidation(playerKey, playerPrefix) {
        const validation = this.state.validatePlayerValues(playerKey);
        const errorElement = document.getElementById(`${playerPrefix}-error`);

        if (errorElement) {
            if (!validation.valid) {
                errorElement.textContent = `Total must be ${validation.expected} (currently ${validation.total})`;
                errorElement.style.display = 'block';
                errorElement.className = 'error';
            } else {
                errorElement.style.display = 'none';
            }
        }
    }

    // ===== ELEMENT CONTROL METHODS =====
    showElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.style.display = '';
        }
    }

    hideElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    enableElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.disabled = false;
            element.style.opacity = '1';
            element.style.cursor = '';
        }
    }

    disableElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
        }
    }

    resetSlider(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.value = 0;
        }
    }

    // ===== VISUAL UPDATE METHODS =====
    updateCutLine() {
        const position = this.state.getCutPosition();
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            const x = (position / 100) * 800;
            cutLine.setAttribute('x1', x.toString());
            cutLine.setAttribute('x2', x.toString());
            cutLine.style.display = 'block';
        }
        this.updateCutPositionDisplay(position);
    }

    updateCutPositionDisplay(position) {
        const element = document.getElementById('cut-value');
        if (element) {
            element.textContent = `${position.toFixed(1)}%`;
        }
    }

    updateCutPosition2Display(position) {
        const element = document.getElementById('cut-value-2');
        if (element) {
            element.textContent = `${position.toFixed(1)}%`;
        }
    }

    updateDualCutLines() {
        const pos1 = this.state.getCutPosition();
        const pos2 = this.state.getCutPosition2();

        const cutLine1 = document.getElementById('cut-line');
        const cutLine2 = document.getElementById('cut-line-2');

        if (cutLine1) {
            const x1 = (pos1 / 100) * 800;
            cutLine1.setAttribute('x1', x1);
            cutLine1.setAttribute('x2', x1);
            cutLine1.style.display = 'block';
        }

        if (cutLine2) {
            const x2 = (pos2 / 100) * 800;
            cutLine2.setAttribute('x1', x2);
            cutLine2.setAttribute('x2', x2);
            cutLine2.style.display = 'block';
        }

        this.updateCutPositionDisplay(pos1);
        this.updateCutPosition2Display(pos2);
    }

    updatePlayerValueDisplays() {
        const playerValues = this.state.getPlayerValues();
        const regionValues = CalculationEngine.calculateRegionValues(this.state.getCutPosition());

        ['player1', 'player2', 'player3'].forEach(player => {
            if (!playerValues[player]) return;

            const leftValue = CalculationEngine.calculatePlayerValue(regionValues.left, playerValues[player]);
            const rightValue = CalculationEngine.calculatePlayerValue(regionValues.right, playerValues[player]);

            const displayElement = document.getElementById(`${player}-values`);
            if (displayElement) {
                displayElement.textContent = `Left: ${leftValue.toFixed(1)} | Right: ${rightValue.toFixed(1)}`;
            }
        });
        return playerValues;
    }

    // ===== ADDITIONAL UI METHODS =====
    updateSingleKnife(position) {
        const knife = document.getElementById('moving-knife-line');
        if (knife) {
            knife.setAttribute('x1', position);
            knife.setAttribute('x2', position);
            knife.style.display = 'block';
        }
    }

    updateKnifePositions(leftPos, rightPos) {
        const leftKnife = document.getElementById('left-knife-line');
        const rightKnife = document.getElementById('right-knife-line');

        if (leftKnife) {
            leftKnife.setAttribute('x1', leftPos);
            leftKnife.setAttribute('x2', leftPos);
        }
        if (rightKnife) {
            rightKnife.setAttribute('x1', rightPos);
            rightKnife.setAttribute('x2', rightPos);
        }
    }

    showDualKnives() {
        ['left-knife-line', 'right-knife-line'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'block';
        });
        this.hideElement('moving-knife-line');
    }

    hideDualKnives() {
        ['left-knife-line', 'right-knife-line'].forEach(id => {
            this.hideElement(id);
        });
    }

    addStopButtons() {
        const container = document.getElementById('stop-buttons-container');
        if (container) {
            container.innerHTML = `
            <button id="player1-stop-btn" class="stop-button">Player 1 STOP</button>
            <button id="player2-stop-btn" class="stop-button">Player 2 STOP</button>
        `;
            container.style.display = 'block';

            document.getElementById('player1-stop-btn').onclick = () => {
                window.FairDivisionCore.getInstance().handlePlayerStop(1);
            };
            document.getElementById('player2-stop-btn').onclick = () => {
                window.FairDivisionCore.getInstance().handlePlayerStop(2);
            };
        }
    }

    removeStopButtons() {
        const container = document.getElementById('stop-buttons-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    setStartButtonState(state) {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            switch (state) {
                case 'enabled':
                    startBtn.disabled = false;
                    startBtn.textContent = 'Start';
                    startBtn.style.display = 'block';
                    break;
                case 'disabled':
                    startBtn.disabled = true;
                    startBtn.textContent = 'Start';
                    startBtn.style.display = 'block';
                    break;
                case 'loading':
                    startBtn.disabled = true;
                    startBtn.textContent = 'Running...';
                    startBtn.style.display = 'block';
                    break;
                case 'hidden':
                    startBtn.style.display = 'none';
                    break;
            }
        }
    }

    addOtherPlayerStopButton(controllingPlayer) {
        const otherPlayer = controllingPlayer === 1 ? 2 : 1;
        const container = document.getElementById('stop-buttons-container');
        if (container) {
            container.innerHTML = `
            <button id="player${otherPlayer}-stop-btn" class="stop-button">
                Player ${otherPlayer} STOP
            </button>
        `;
            container.style.display = 'block';

            document.getElementById(`player${otherPlayer}-stop-btn`).onclick = () => {
                window.FairDivisionCore.getInstance().handleOtherPlayerStop();
            };
        }
    }

    removeOtherPlayerStopButton() {
        this.removeStopButtons();
    }

    showThreePieceOverlays(leftPos, rightPos) {
        const leftOverlay = document.getElementById('left-piece-overlay');
        const middleOverlay = document.getElementById('middle-piece-overlay');
        const rightOverlay = document.getElementById('right-piece-overlay');

        if (leftOverlay && middleOverlay && rightOverlay) {
            leftOverlay.setAttribute('width', leftPos);
            leftOverlay.style.display = 'block';

            middleOverlay.setAttribute('x', leftPos);
            middleOverlay.setAttribute('width', rightPos - leftPos);
            middleOverlay.style.display = 'block';

            rightOverlay.setAttribute('x', rightPos);
            rightOverlay.setAttribute('width', 800 - rightPos);
            rightOverlay.style.display = 'block';
        }
    }

    hideThreePieceOverlays() {
        ['left-piece-overlay', 'middle-piece-overlay', 'right-piece-overlay'].forEach(id => {
            this.hideElement(id);
        });
    }

    cleanup() {
        Logger.debug('Cleaning up UI event listeners');
        this.activeListeners.forEach(({ element, event, listener }) => {
            element.removeEventListener(event, listener);
        });
        this.activeListeners = [];
    }
}

// ===== ANIMATION ENGINE =====
class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.animationId = 0;
    }

    start(config) {
        const id = ++this.animationId;
        const animation = {
            id,
            config,
            isRunning: true,
            isPaused: false,
            frameId: null
        };

        this.animations.set(id, animation);
        this.runAnimation(animation);
        return id;
    }

    runAnimation(animation) {
        if (!animation.isRunning || animation.isPaused) return;

        animation.frameId = requestAnimationFrame(() => {
            if (animation.config.onFrame) {
                animation.config.onFrame(animation.id);
            }
            this.runAnimation(animation);
        });
    }

    stop(id) {
        const animation = this.animations.get(id);
        if (animation) {
            animation.isRunning = false;
            if (animation.frameId) {
                cancelAnimationFrame(animation.frameId);
            }
            this.animations.delete(id);
        }
    }
}

class QueryCounter {
    constructor() {
        this.cutQueries = 0;
        this.evalQueries = 0;
        this.createUI();
    }

    createUI() {
        const queryPanel = document.createElement('div');
        queryPanel.className = 'query-panel';
        queryPanel.innerHTML = `
            <div class="query-header">
                <h4>Robertson-Webb Query Count</h4>
                <button class="info-button" onclick="showQueryInfo()">ℹ️</button>
            </div>
            <div class="query-stats">
                <div class="query-stat">
                    <span class="query-count" id="cut-count">0</span>
                    <span class="query-label">Cut Queries</span>
                </div>
                <div class="query-stat">
                    <span class="query-count" id="eval-count">0</span>
                    <span class="query-label">Eval Queries</span>
                </div>
                <div class="query-stat total">
                    <span class="query-count" id="total-count">0</span>
                    <span class="query-label">Total</span>
                </div>
            </div>
        `;

        // Insert into demo interface
        const demoContainer = document.querySelector('.demo-section');
        demoContainer.insertBefore(queryPanel, demoContainer.firstChild);
    }

    recordCutQuery(player, position, targetValue) {
        this.cutQueries++;
        this.updateDisplay();
        this.logQuery('CUT', `Player ${player} cuts at position ${position} for value ${targetValue}`);
    }

    recordEvalQuery(player, piece, value) {
        this.evalQueries++;
        this.updateDisplay();
        this.logQuery('EVAL', `Player ${player} evaluates piece as ${value}`);
    }

    updateDisplay() {
        document.getElementById('cut-count').textContent = this.cutQueries;
        document.getElementById('eval-count').textContent = this.evalQueries;
        document.getElementById('total-count').textContent = this.cutQueries + this.evalQueries;
    }

    logQuery(type, description) {
        console.log(`[${type} QUERY ${this.cutQueries + this.evalQueries}] ${description}`);

        // Visual feedback
        const queryCount = document.querySelector('.query-panel');
        queryCount.style.animation = 'highlight 0.5s ease-out';
        setTimeout(() => {
            queryCount.style.animation = '';
        }, 500);
    }

    reset() {
        this.cutQueries = 0;
        this.evalQueries = 0;
        this.updateDisplay();
    }

    getComplexityAnalysis(algorithm) {
        const analyses = {
            'divide-and-choose': {
                theoretical: 2,
                optimal: true,
                explanation: 'Optimal for 2-player proportional division'
            },
            'austins-moving-knife': {
                theoretical: 'O(n)',
                optimal: false,
                explanation: 'Continuous queries until stopping condition'
            },
            'steinhaus-lone-divider': {
                theoretical: 'O(n²)',
                optimal: false,
                explanation: 'Multiple rounds may be needed for 3+ players'
            }
        };

        return analyses[algorithm] || { theoretical: 'Unknown', optimal: false };
    }
}

function showQueryInfo() {
    const modal = document.createElement('div');
    modal.className = 'query-info-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Robertson-Webb Query Model</h3>
            <p><strong>Cut Queries:</strong> Ask a player to cut at a position where one piece has a specific value.</p>
            <p><strong>Eval Queries:</strong> Ask a player to evaluate the value of a given piece.</p>
            <p>This model measures algorithm efficiency by counting these preference queries rather than computational operations.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Export for use in algorithm modules
window.DemoSystem = {
    Logger,
    StateManager,
    EventSystem,
    CalculationEngine,
    UIController,
    AnimationEngine,
    QueryCounter,
    DEMO_CONFIG
};