/**
 * Fair Division Demo System
 *
 * Contains classes used by the demo system
 */

// ===== CORE CONFIGURATION =====
const DEMO_CONFIG = {
    DEBUG: true,
    VALIDATION: {
        REQUIRED_TOTAL: 100,
        TOLERANCE: 0.1
    },
    DEFAULT_PLAYER_VALUES: {
        player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
        player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 },
        player3: { blue: 30, red: 10, green: 15, orange: 5, pink: 25, purple: 15 },
        player4: {blue: 25, red: 10, green: 30, orange: 5, pink: 20, purple: 10}
    },
    COLORS: ['blue', 'red', 'green', 'orange', 'pink', 'purple']
};

// ===== LOGGING UTILITY =====
class Logger {
    static debug(...args) {
        if (DEMO_CONFIG.DEBUG) {
            console.log('[DEMO DEBUG]', ...args);
        }
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

    static group(label) {
        if (DEMO_CONFIG.DEBUG) {
            console.group(`[DEMO] ${label}`);
        }
    }

    static groupEnd() {
        if (DEMO_CONFIG.DEBUG) {
            console.groupEnd();
        }
    }
}

// ===== STATE MANAGEMENT =====
class StateManager {
    constructor() {
        this.state = this.createInitialState();
        this.observers = new Map();
        this.history = [];
        Logger.debug('StateManager initialized');
    }

    createInitialState() {
        return {
            cutPosition: 0,
            cutPosition2: 0,
            playerValues: JSON.parse(JSON.stringify(DEMO_CONFIG.DEFAULT_PLAYER_VALUES)),
            algorithmData: {},
            currentStep: 0,
            isValid: true,
            errors: []
        };
    }

    // State getters with validation
    getState() {
        return { ...this.state };
    }

    getCutPosition() {
        return this.state.cutPosition;
    }

    getCutPosition2() {
        return this.state.cutPosition2;
    }

    getPlayerValues(player = null) {
        if (player) {
            return { ...this.state.playerValues[player] };
        }
        return JSON.parse(JSON.stringify(this.state.playerValues));
    }

    getAlgorithmData(key = null) {
        if (key) {
            return this.state.algorithmData[key];
        }
        return { ...this.state.algorithmData };
    }

    getCurrentStep() {
        return this.state.currentStep;
    }

    // State setters with validation and notifications
    setCutPosition(position, notify = true) {
        const oldValue = this.state.cutPosition;
        this.state.cutPosition = Math.max(0, Math.min(100, position));

        if (notify && oldValue !== this.state.cutPosition) {
            this.notifyObservers('cutPosition', this.state.cutPosition, oldValue);
        }

        Logger.debug(`Cut position updated: ${oldValue} → ${this.state.cutPosition}`);
    }

    setCutPosition2(position, notify = true) {
        const oldValue = this.state.cutPosition2;
        this.state.cutPosition2 = Math.max(0, Math.min(100, position));

        if (notify && oldValue !== this.state.cutPosition2) {
            this.notifyObservers('cutPosition2', this.state.cutPosition2, oldValue);
        }

        Logger.debug(`Cut position 2 updated: ${oldValue} → ${this.state.cutPosition2}`);
    }

    setPlayerValue(player, color, value, notify = true) {
        const oldValue = this.state.playerValues[player][color];
        this.state.playerValues[player][color] = Math.max(0, Math.min(100, value));

        // Validate player totals
        this.validatePlayerValues(player);

        if (notify && oldValue !== this.state.playerValues[player][color]) {
            this.notifyObservers('playerValues', { player, color, value: this.state.playerValues[player][color] }, oldValue);
        }

        Logger.debug(`Player ${player} ${color} value: ${oldValue} → ${this.state.playerValues[player][color]}`);
    }

    setAlgorithmData(key, value, notify = true) {
        const oldValue = this.state.algorithmData[key];
        this.state.algorithmData[key] = value;

        if (notify) {
            this.notifyObservers('algorithmData', { key, value }, oldValue);
        }

        Logger.debug(`Algorithm data ${key} updated:`, value);
    }

    setCurrentStep(step, notify = true) {
        const oldStep = this.state.currentStep;
        this.state.currentStep = step;

        if (notify && oldStep !== step) {
            this.notifyObservers('currentStep', step, oldStep);
        }

        Logger.debug(`Step changed: ${oldStep} → ${step}`);
    }

    // Validation
    validatePlayerValues(player) {
        const values = this.state.playerValues[player];
        const total = DEMO_CONFIG.COLORS.reduce((sum, color) => sum + (values[color] || 0), 0);
        const isValid = Math.abs(total - DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL) <= DEMO_CONFIG.VALIDATION.TOLERANCE;

        if (!isValid) {
            Logger.warn(`Player ${player} values sum to ${total}, expected ${DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL}`);
        }

        return { valid: isValid, total, expected: DEMO_CONFIG.VALIDATION.REQUIRED_TOTAL };
    }

    validateAllPlayers() {
        const results = {};
        Object.keys(this.state.playerValues).forEach(player => {
            results[player] = this.validatePlayerValues(player);
        });
        return results;
    }

    // Observer pattern for state changes
    subscribe(event, callback) {
        if (!this.observers.has(event)) {
            this.observers.set(event, new Set());
        }
        this.observers.get(event).add(callback);

        Logger.debug(`Subscribed to state event: ${event}`);

        // Return unsubscribe function
        return () => {
            this.observers.get(event)?.delete(callback);
        };
    }

    notifyObservers(event, newValue, oldValue) {
        const eventObservers = this.observers.get(event);
        if (eventObservers) {
            eventObservers.forEach(callback => {
                try {
                    callback(newValue, oldValue, event);
                } catch (error) {
                    Logger.error('Observer callback failed:', error);
                }
            });
        }
    }

    reset() {
        Logger.group('Resetting state');
        const oldState = { ...this.state };
        this.state = this.createInitialState();
        this.notifyObservers('reset', this.state, oldState);
        Logger.debug('State reset complete');
        Logger.groupEnd();
    }
}

// ===== EVENT SYSTEM =====
class EventSystem {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
        Logger.debug('EventSystem initialized');
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        Logger.debug(`Event listener added: ${event}`);

        // Return cleanup function
        return () => this.off(event, callback);
    }

    once(event, callback) {
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }
        this.onceListeners.get(event).add(callback);

        Logger.debug(`One-time event listener added: ${event}`);

        return () => this.off(event, callback);
    }

    off(event, callback) {
        this.listeners.get(event)?.delete(callback);
        this.onceListeners.get(event)?.delete(callback);
        Logger.debug(`Event listener removed: ${event}`);
    }

    emit(event, data = null) {
        Logger.debug(`Event emitted: ${event}`, data);

        // Handle regular listeners
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                try {
                    callback(data, event);
                } catch (error) {
                    Logger.error(`Event listener failed for ${event}:`, error);
                }
            });
        }

        // Handle one-time listeners
        const onceListeners = this.onceListeners.get(event);
        if (onceListeners) {
            onceListeners.forEach(callback => {
                try {
                    callback(data, event);
                } catch (error) {
                    Logger.error(`One-time event listener failed for ${event}:`, error);
                }
            });
            // Clear one-time listeners after execution
            this.onceListeners.delete(event);
        }
    }

    removeAllListeners(event = null) {
        if (event) {
            this.listeners.delete(event);
            this.onceListeners.delete(event);
            Logger.debug(`All listeners removed for event: ${event}`);
        } else {
            this.listeners.clear();
            this.onceListeners.clear();
            Logger.debug('All event listeners cleared');
        }
    }

    // Debug utilities
    getListenerCount(event = null) {
        if (event) {
            const regular = this.listeners.get(event)?.size || 0;
            const once = this.onceListeners.get(event)?.size || 0;
            return { regular, once, total: regular + once };
        }

        let totalRegular = 0, totalOnce = 0;
        this.listeners.forEach(set => totalRegular += set.size);
        this.onceListeners.forEach(set => totalOnce += set.size);

        return { regular: totalRegular, once: totalOnce, total: totalRegular + totalOnce };
    }

    listEvents() {
        const events = new Set([
            ...this.listeners.keys(),
            ...this.onceListeners.keys()
        ]);
        return Array.from(events);
    }
}

// ===== CALCULATION UTILITIES =====
class CalculationEngine {
    static calculateRegionValues(cutPosition, regionBounds = null) {
        // Default region bounds for standard demo layout
        const bounds = regionBounds || {
            blue: { start: 0, end: 75 },
            red: { start: 75, end: 100 },
            green: { start: 18.75, end: 75 },
            orange: { start: 75, end: 100 },
            pink: { start: 0, end: 18.75 },
            purple: { start: 18.75, end: 100 }
        };

        const leftValues = {};
        const rightValues = {};

        DEMO_CONFIG.COLORS.forEach(color => {
            const colorBounds = bounds[color];
            if (!colorBounds) {
                leftValues[color] = 0;
                rightValues[color] = 0;
                return;
            }

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

    static calculateThreeRegionValues(cutPosition1, cutPosition2, regionBounds = null) {
        // Ensure cuts are in order
        const cut1 = Math.min(cutPosition1, cutPosition2);
        const cut2 = Math.max(cutPosition1, cutPosition2);

        const bounds = regionBounds || {
            blue: { start: 0, end: 75 },
            red: { start: 75, end: 100 },
            green: { start: 18.75, end: 75 },
            orange: { start: 75, end: 100 },
            pink: { start: 0, end: 18.75 },
            purple: { start: 18.75, end: 100 }
        };

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

            // Calculate overlaps with each piece
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
        // Simple element caching with standardized IDs
        const elementIds = [
            'algorithm-selector', 'algorithm-name', 'algorithm-description',
            'step-indicator', 'instructions', 'start-btn', 'reset-btn',
            'cut-slider', 'cut-slider-2', 'make-cut-btn',
            'cut-value', 'cut-value-2',
            'left-piece', 'right-piece', 'piece-1', 'piece-2', 'piece-3',
            'results', 'result-content', 'player3-section'
        ];

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
        // Cut slider (0-100 percentage values)
        const cutSlider = this.elements.get('cut-slider');
        if (cutSlider) {
            const listener = (e) => {
                const value = parseFloat(e.target.value);
                this.state.setCutPosition(value);
                this.updateCutPositionDisplay(value);
                this.events.emit('cutPositionChanged', value);
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
                this.updateCutPosition2Display(value);
                this.events.emit('cutPosition2Changed', value);
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
                        this.events.emit('playerValueChanged', { player: playerKey, color, value });
                        this.updatePlayerValidation(playerKey, playerPrefix);
                    };
                    input.addEventListener('input', listener);
                    this.activeListeners.push({ element: input, event: 'input', listener });
                }
            });
        });
    }

    // UI Update Methods
    updateStepIndicator(text) {
        const element = this.elements.get('step-indicator');
        if (element) {
            element.textContent = text;
            Logger.debug(`Step indicator updated: ${text}`);
        }
    }

    updateInstructions(html) {
        const element = this.elements.get('instructions');
        if (element) {
            element.innerHTML = html;
            Logger.debug('Instructions updated');
        }
    }

    updateAlgorithmInfo(name, description) {
        const nameEl = this.elements.get('algorithm-name');
        const descEl = this.elements.get('algorithm-description');

        if (nameEl) nameEl.textContent = name;
        if (descEl) descEl.textContent = description;

        Logger.debug(`Algorithm info updated: ${name}`);
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

    // Element Control Methods
    showElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.style.display = '';
            Logger.debug(`Showed element: ${id}`);
        }
    }

    hideElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            Logger.debug(`Hidden element: ${id}`);
        }
    }

    enableElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.disabled = false;
            element.style.opacity = '1';
            element.style.cursor = '';
            Logger.debug(`Enabled element: ${id}`);
        }
    }

    disableElement(id) {
        const element = this.elements.get(id) || document.getElementById(id);
        if (element) {
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
            Logger.debug(`Disabled element: ${id}`);
        }
    }

    // Visual Updates
    updateCutLine() {
        const position = this.state.getCutPosition();
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            const x = (position / 100) * 800; // Convert percentage to SVG coordinates
            cutLine.setAttribute('x1', x);
            cutLine.setAttribute('x2', x);
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

        // Update for each player
        ['player1', 'player2', 'player3'].forEach(player => {
            if (!playerValues[player]) return;

            const leftValue = CalculationEngine.calculatePlayerValue(regionValues.left, playerValues[player]);
            const rightValue = CalculationEngine.calculatePlayerValue(regionValues.right, playerValues[player]);

            const displayElement = document.getElementById(`${player}-values`);
            if (displayElement) {
                displayElement.textContent = `Left: ${leftValue.toFixed(1)} | Right: ${rightValue.toFixed(1)}`;
            }
        });

        Logger.debug('Player value displays updated');
    }

    // Cleanup
    cleanup() {
        Logger.debug('Cleaning up UI event listeners');
        this.activeListeners.forEach(({ element, event, listener }) => {
            element.removeEventListener(event, listener);
        });
        this.activeListeners = [];
    }
}

// Export for use in algorithm modules
window.DemoSystem = {
    Logger,
    StateManager,
    EventSystem,
    CalculationEngine,
    UIController,
    DEMO_CONFIG
};