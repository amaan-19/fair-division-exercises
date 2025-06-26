/**
 * Fair Division Demo System - Main Controller
 *
 * Orchestrates the demo system components and provides the public API
 */

class FairDivisionDemoSystem {
    constructor() {
        Logger.info('Initializing Fair Division Demo System');

        // Core components
        this.state = new StateManager();
        this.events = new EventSystem();
        this.ui = new UIController(this.state, this.events);

        // Algorithm management
        this.algorithms = new Map();
        this.currentAlgorithm = null;
        this.registrationQueue = [];

        // System state
        this.isInitialized = false;

        this.initializeSystem();
    }

    initializeSystem() {
        Logger.group('System Initialization');

        try {
            this.setupCoreEventListeners();
            this.setupStateSubscriptions();
            this.setupUIEventHandlers();

            this.isInitialized = true;
            Logger.info('Demo system initialization complete');

            // Process any queued algorithm registrations
            this.processRegistrationQueue();

            this.events.emit('systemReady');

        } catch (error) {
            Logger.error('Failed to initialize demo system:', error);
            throw error;
        }

        Logger.groupEnd();
    }

    setupCoreEventListeners() {
        // Handle cut position changes
        this.state.subscribe('cutPosition', () => {
            this.ui.updateCutLine();
            this.ui.updatePlayerValueDisplays();
            this.events.emit('visualUpdate', 'cutPosition');
        });

        this.state.subscribe('cutPosition2', () => {
            this.ui.updateDualCutLines();
            this.events.emit('visualUpdate', 'cutPosition2');
        });

        // Handle player value changes
        this.state.subscribe('playerValues', (data) => {
            this.ui.updatePlayerValueDisplays();
            this.events.emit('visualUpdate', 'playerValues');

            // Notify current algorithm if it's listening
            if (this.currentAlgorithm?.config.onPlayerValueChange) {
                this.currentAlgorithm.config.onPlayerValueChange(this.state.getState(), this.createAlgorithmAPI());
            }
        });

        Logger.debug('Core event listeners setup complete');
    }

    setupStateSubscriptions() {
        // Log state changes in debug mode
        if (DEMO_CONFIG.DEBUG) {
            ['cutPosition', 'cutPosition2', 'playerValues', 'currentStep'].forEach(event => {
                this.state.subscribe(event, (newValue, oldValue) => {
                    Logger.debug(`State change - ${event}:`, { old: oldValue, new: newValue });
                });
            });
        }
    }

    setupUIEventHandlers() {
        // Algorithm selector
        const algorithmSelector = document.getElementById('algorithm-selector');
        if (algorithmSelector) {
            algorithmSelector.addEventListener('change', (e) => {
                this.switchAlgorithm(e.target.value);
            });
        }

        // Control buttons
        this.setupButtonHandlers();

        Logger.debug('UI event handlers setup complete');
    }

    setupButtonHandlers() {
        // Start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.handleStartButton();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAlgorithm();
            });
        }

        // Make cut button
        const makeCutBtn = document.getElementById('make-cut-btn');
        if (makeCutBtn) {
            makeCutBtn.addEventListener('click', () => {
                this.handleMakeCut();
            });
        }
    }

    // ===== ALGORITHM MANAGEMENT =====

    register(algorithmId, config) {
        Logger.info(`Registering algorithm: ${config.name} (${algorithmId})`);

        if (!this.validateAlgorithmConfig(config)) {
            Logger.error(`Invalid algorithm configuration for ${algorithmId}`);
            return false;
        }

        if (!this.isInitialized) {
            Logger.debug(`System not ready, queueing registration: ${algorithmId}`);
            this.registrationQueue.push({ algorithmId, config });
            return true;
        }

        this.algorithms.set(algorithmId, {
            id: algorithmId,
            config: this.enhanceAlgorithmConfig(config)
        });

        this.updateAlgorithmSelector();
        this.events.emit('algorithmRegistered', { algorithmId, config });

        Logger.info(`Algorithm registered successfully: ${config.name}`);
        return true;
    }

    validateAlgorithmConfig(config) {
        const required = ['name', 'description', 'playerCount'];
        const missing = required.filter(prop => !config[prop]);

        if (missing.length > 0) {
            Logger.error('Missing required algorithm properties:', missing);
            return false;
        }

        if (config.playerCount < 2 || config.playerCount > 3) {
            Logger.error('Invalid player count:', config.playerCount);
            return false;
        }

        return true;
    }

    enhanceAlgorithmConfig(config) {
        // Add default handlers and validation
        const enhanced = { ...config };

        // Ensure step structure exists
        if (!enhanced.steps) {
            enhanced.steps = [];
        }

        // Add default lifecycle methods if missing
        if (!enhanced.onReset) {
            enhanced.onReset = () => Logger.debug(`Default reset handler for ${enhanced.name}`);
        }

        return enhanced;
    }

    processRegistrationQueue() {
        Logger.debug(`Processing ${this.registrationQueue.length} queued registrations`);

        this.registrationQueue.forEach(({ algorithmId, config }) => {
            this.register(algorithmId, config);
        });

        this.registrationQueue = [];
    }

    switchAlgorithm(algorithmId) {
        if (!algorithmId) return;

        const algorithm = this.algorithms.get(algorithmId);
        if (!algorithm) {
            Logger.error(`Algorithm not found: ${algorithmId}`);
            return;
        }

        Logger.group(`Switching to algorithm: ${algorithm.config.name}`);

        // Cleanup current algorithm
        this.cleanupCurrentAlgorithm();

        // Set new algorithm
        this.currentAlgorithm = algorithm;
        this.state.reset();
        this.state.setCurrentStep(0);

        // Update UI
        this.ui.updateAlgorithmInfo(algorithm.config.name, algorithm.config.description);
        this.setupAlgorithmUI();
        this.initializeAlgorithm();

        this.events.emit('algorithmChanged', algorithmId);
        Logger.groupEnd();
    }

    setupAlgorithmUI() {
        const config = this.currentAlgorithm.config;

        // Show/hide player sections based on player count
        if (config.playerCount === 3) {
            this.ui.showElement('player3-section');
        } else {
            this.ui.hideElement('player3-section');
        }

        // Initialize step UI if steps exist
        if (config.steps && config.steps.length > 0) {
            this.enterStep(0);
        }
    }

    initializeAlgorithm() {
        const config = this.currentAlgorithm.config;

        // Call algorithm initialization
        if (config.onInit) {
            config.onInit(this.state.getState(), this.createAlgorithmAPI());
        }

        Logger.debug(`Algorithm initialized: ${config.name}`);
    }

    // ===== ALGORITHM API =====
    createAlgorithmAPI() {
        return {
            // State access
            getState: () => this.state.getState(),
            getCutPosition: () => this.state.getCutPosition(),
            getCutPosition2: () => this.state.getCutPosition2(),
            getPlayerValues: (player) => this.state.getPlayerValues(player),

            // State modification
            setCutPosition: (pos) => this.state.setCutPosition(pos),
            setCutPosition2: (pos) => this.state.setCutPosition2(pos),
            setAlgorithmData: (key, value) => this.state.setAlgorithmData(key, value),

            // Step control
            nextStep: () => this.advanceStep(),
            setStep: (step) => this.setStep(step),
            getCurrentStep: () => this.state.getCurrentStep(),

            // UI control
            updateInstructions: (html) => this.ui.updateInstructions(html),
            updateStepIndicator: (text) => this.ui.updateStepIndicator(text),
            showElement: (id) => this.ui.showElement(id),
            hideElement: (id) => this.ui.hideElement(id),
            enableElement: (id) => this.ui.enableElement(id),
            disableElement: (id) => this.ui.disableElement(id),

            // Events
            emit: (event, data) => this.events.emit(event, data),
            on: (event, callback) => this.events.on(event, callback),

            // Calculations
            calculateRegionValues: (cut, bounds) => CalculationEngine.calculateRegionValues(cut, bounds),
            calculatePlayerValue: (regions, values) => CalculationEngine.calculatePlayerValue(regions, values),
            validatePlayerTotals: (values) => CalculationEngine.validatePlayerTotals(values)
        };
    }

    // ===== EVENT HANDLERS =====
    handleStartButton() {
        if (!this.currentAlgorithm) return;

        const config = this.currentAlgorithm.config;

        if (config.onStart) {
            config.onStart(this.state.getState(), this.createAlgorithmAPI());
        } else {
            // Default behavior: advance to first step
            this.advanceStep();
        }

        this.events.emit('algorithmStarted');
    }

    handleMakeCut() {
        if (!this.currentAlgorithm?.config.onMakeCut) return;

        this.currentAlgorithm.config.onMakeCut(this.state.getState(), this.createAlgorithmAPI());
        this.events.emit('cutMade');
    }

    // ===== STEP MANAGEMENT =====
    enterStep(stepIndex) {
        const config = this.currentAlgorithm?.config;
        if (!config?.steps?.[stepIndex]) return;

        const step = config.steps[stepIndex];
        this.state.setCurrentStep(stepIndex);

        Logger.debug(`Entering step ${stepIndex}: ${step.title}`);

        this.ui.updateStepIndicator(step.title);
        this.ui.updateInstructions(step.instructions);

        if (step.onStepEnter) {
            step.onStepEnter(this.state.getState(), this.createAlgorithmAPI());
        }

        this.events.emit('stepEntered', { stepIndex, step });
    }

    exitStep(stepIndex) {
        const step = this.currentAlgorithm?.config.steps?.[stepIndex];
        if (!step) return;

        Logger.debug(`Exiting step ${stepIndex}: ${step.title}`);

        if (step.onStepExit) {
            step.onStepExit(this.state.getState(), this.createAlgorithmAPI());
        }

        this.events.emit('stepExited', { stepIndex, step });
    }

    advanceStep() {
        const currentStep = this.state.getCurrentStep();
        const maxSteps = this.currentAlgorithm?.config.steps?.length || 0;

        if (currentStep < maxSteps - 1) {
            this.exitStep(currentStep);
            this.enterStep(currentStep + 1);
        } else {
            Logger.debug('Algorithm completed - no more steps');
            this.events.emit('algorithmCompleted');
        }
    }

    // ===== CLEANUP =====
    cleanupCurrentAlgorithm() {
        if (!this.currentAlgorithm) return;

        Logger.debug(`Cleaning up algorithm: ${this.currentAlgorithm.config.name}`);

        const config = this.currentAlgorithm.config;
        if (config.onReset) {
            config.onReset(this.state.getState(), this.createAlgorithmAPI());
        }

        this.currentAlgorithm = null;
    }

    resetAlgorithm() {
        Logger.info('Resetting algorithm');

        this.cleanupCurrentAlgorithm();
        this.state.reset();
        this.ui.updatePlayerValueDisplays();
        this.ui.updateCutLine();

        this.events.emit('algorithmReset');
    }

    updateAlgorithmSelector() {
        const selector = document.getElementById('algorithm-selector');
        if (!selector) return;

        // Clear existing options except placeholder
        const placeholder = selector.querySelector('option[value=""]');
        selector.innerHTML = '';
        if (placeholder) selector.appendChild(placeholder);

        // Add algorithm options
        this.algorithms.forEach((algorithm, id) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = algorithm.config.name;
            selector.appendChild(option);
        });

        Logger.debug(`Algorithm selector updated with ${this.algorithms.size} options`);
    }

    // ===== DEBUG UTILITIES =====
    getDebugInfo() {
        return {
            algorithms: Array.from(this.algorithms.keys()),
            currentAlgorithm: this.currentAlgorithm?.id || null,
            state: this.state.getState(),
            eventListeners: this.events.getListenerCount(),
            isInitialized: this.isInitialized
        };
    }

    logDebugInfo() {
        Logger.group('Debug Information');
        console.table(this.getDebugInfo());
        Logger.groupEnd();
    }
}

// Global initialization
let demoSystemInstance = null;
const algorithmRegistrationQueue = [];

// Public registration API
window.FairDivisionCore = {
    register: function(algorithmId, config) {
        if (demoSystemInstance) {
            return demoSystemInstance.register(algorithmId, config);
        } else {
            Logger.debug(`System not ready, queueing registration: ${algorithmId}`);
            algorithmRegistrationQueue.push({ algorithmId, config });
            return true;
        }
    },

    getInstance: function() {
        return demoSystemInstance;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Logger.info('DOM ready - initializing demo system');

    try {
        demoSystemInstance = new FairDivisionDemoSystem();

        // Process any queued registrations
        algorithmRegistrationQueue.forEach(({ algorithmId, config }) => {
            demoSystemInstance.register(algorithmId, config);
        });
        algorithmRegistrationQueue.length = 0;

        Logger.info('Fair Division Demo System ready');

    } catch (error) {
        Logger.error('Failed to initialize demo system:', error);
    }
});