/**
 * Fair Division Demo System - Main Controller
 *
 * Orchestrates the demo system components and provides the public API
 */

class FairDivisionDemoSystem {
    constructor() {
        this.isInitialized = false;
        Logger.info('Initializing Fair Division Demo System...');

        // Initialize core components
        this.eventSystem = new EventSystem();
        this.stateManager = new StateManager(this.eventSystem);
        this.uiController = new UIController(this.stateManager, this.eventSystem);
        this.animationEngine = new AnimationEngine();
        this.queryTracker = new QueryTracker();

        // Algorithm management
        this.algorithms = new Map();
        this.currentAlgorithm = null;
        this.registrationQueue = [];

        // Initialize system
        this.setupEventHandlers();
        this.attachHTMLListeners();
        this.setupComplexityIntegration();

        this.isInitialized = true;
        this.processRegistrationQueue();

        Logger.info('Fair Division Demo System ready');
    }

    setupEventHandlers() {
        // State changes trigger UI updates
        this.stateManager.subscribe('cutPosition', () => {
            this.uiController.updateCutLine();
            this.uiController.updatePlayerValueDisplays();

            // Notify current algorithm if it has an update method
            if (this.currentAlgorithm?.config.onStateChange) {
                try {
                    this.currentAlgorithm.config.onStateChange('cutPosition', this.stateManager.getState(), this.createAlgorithmAPI());
                } catch (error) {
                    Logger.error('Error in algorithm onStateChange:', error);
                }
            }
        });

        this.stateManager.subscribe('cutPosition2', () => {
            this.uiController.updateDualCutLines();

            // For Steinhaus algorithm, update three-piece displays
            if (this.currentAlgorithm?.id === 'steinhaus-lone-divider') {
                this.uiController.updatePlayerValueDisplays();

                // Notify algorithm of state change
                if (this.currentAlgorithm?.config.onStateChange) {
                    try {
                        this.currentAlgorithm.config.onStateChange('cutPosition2', this.stateManager.getState(), this.createAlgorithmAPI());
                    } catch (error) {
                        Logger.error('Error in algorithm onStateChange:', error);
                    }
                }
            }
        });

        this.stateManager.subscribe('playerValues', () => {
            this.uiController.updatePlayerValueDisplays();

            // Notify current algorithm
            if (this.currentAlgorithm?.config.onStateChange) {
                try {
                    this.currentAlgorithm.config.onStateChange('playerValues', this.stateManager.getState(), this.createAlgorithmAPI());
                } catch (error) {
                    Logger.error('Error in algorithm onStateChange:', error);
                }
            }
        });

        // UI events
        this.eventSystem.on('demo:start:clicked', () => {
            try {
                this.handleStartButton();
            } catch (error) {
                Logger.error('Error handling start button:', error);
            }
        });

        this.eventSystem.on('algorithm:changed', ({ value }) => {
            try {
                this.switchAlgorithm(value);
            } catch (error) {
                Logger.error('Error switching algorithm:', error);
            }
        });

        Logger.debug('Event handlers setup complete');
    }

    attachHTMLListeners() {
        // Algorithm selector
        const dropdown = document.getElementById('algorithm-selector');
        if (dropdown) {
            dropdown.addEventListener('change', (e) => {
                try {
                    this.eventSystem.emit('algorithm:changed', {
                        value: e.target.value,
                        text: e.target.selectedOptions[0]?.textContent
                    });
                } catch (error) {
                    Logger.error('Error handling algorithm selection:', error);
                }
            });
        }

        // Start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                try {
                    this.eventSystem.emit('demo:start:clicked');
                } catch (error) {
                    Logger.error('Error handling start button:', error);
                }
            });
        }

        // Make cut button
        const makeCutBtn = document.getElementById('make-cut-btn');
        if (makeCutBtn) {
            makeCutBtn.addEventListener('click', () => {
                try {
                    this.handleMakeCut();
                } catch (error) {
                    Logger.error('Error handling make cut button:', error);
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                try {
                    this.resetAlgorithm();
                } catch (error) {
                    Logger.error('Error handling reset button:', error);
                }
            });
        }

        Logger.debug('HTML listeners attached');
    }

    // ===== ALGORITHM MANAGEMENT =====

    register(algorithmId, config) {
        Logger.debug(`Registering algorithm: ${config.name || config.metadata?.name} (${algorithmId})`);

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
        this.eventSystem.emit('algorithmRegistered', { algorithmId, config });

        Logger.info(`Algorithm registered successfully: ${config.name || config.metadata?.name}`);
        return true;
    }

    validateAlgorithmConfig(config) {
        const name = config.name || config.metadata?.name;
        const description = config.description || config.metadata?.description;
        const playerCount = config.playerCount || config.metadata?.playerCount;

        if (!name || !description || !playerCount) {
            Logger.error('Missing required algorithm properties: name, description, playerCount');
            return false;
        }

        if (playerCount < 2 || playerCount > 3) {
            Logger.error('Invalid player count:', playerCount);
            return false;
        }

        return true;
    }

    enhanceAlgorithmConfig(config) {
        const enhanced = { ...config };

        // Normalize config structure
        if (config.metadata) {
            enhanced.name = config.metadata.name;
            enhanced.description = config.metadata.description;
            enhanced.playerCount = config.metadata.playerCount;
        }

        // Ensure steps exist
        if (!enhanced.steps) {
            enhanced.steps = [];
        }

        // Add default reset handler if missing
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
        this.stateManager.reset();
        this.stateManager.setCurrentStep(0);

        // Update UI
        this.uiController.updateAlgorithmInfo(algorithm.config.name, algorithm.config.description);
        this.setupAlgorithmUI();
        this.initializeAlgorithm();

        this.eventSystem.emit('algorithmChanged', algorithmId);
        Logger.groupEnd();
    }

    setupAlgorithmUI() {
        const config = this.currentAlgorithm.config;

        // Show/hide player sections based on player count
        if (config.playerCount === 3) {
            this.uiController.showElement('player3-section');
        } else {
            this.uiController.hideElement('player3-section');
        }

        // Initialize step UI if steps exist
        if (config.steps && config.steps.length > 0) {
            this.enterStep(0);
        }
    }

    setupComplexityIntegration() {
        // Listen for algorithm changes
        this.eventSystem.on('algorithmChanged', (algorithmId) => {
            this.queryTracker.setCurrentAlgorithm(algorithmId);
        });

        // Listen for algorithm resets
        this.eventSystem.on('algorithmReset', () => {
            this.queryTracker.reset();
        });
    }

    initializeAlgorithm() {
        const config = this.currentAlgorithm.config;

        // Call algorithm initialization
        if (config.onInit) {
            config.onInit(this.stateManager.getState(), this.createAlgorithmAPI());
        }

        Logger.debug(`Algorithm initialized: ${config.name}`);
    }

    // ===== ALGORITHM API =====
    createAlgorithmAPI() {
        return {
            // State access
            getCutPosition: () => this.stateManager.getCutPosition(),
            getCutPosition2: () => this.stateManager.getCutPosition2(),
            getPlayerValues: (player) => this.stateManager.getPlayerValues(player),
            getState: () => this.stateManager.getState(),

            // State modification
            setCutPosition: (pos) => this.stateManager.setCutPosition(pos),
            setCutPosition2: (pos) => this.stateManager.setCutPosition2(pos),
            setAlgorithmData: (key, value) => this.stateManager.setAlgorithmData(key, value),

            // Step control
            nextStep: () => this.advanceStep(),
            setStep: (step) => this.stateManager.setCurrentStep(step),
            getCurrentStep: () => this.stateManager.getCurrentStep(),

            // UI control
            updateInstructions: (html) => this.uiController.updateInstructions(html),
            updateStepIndicator: (text) => this.uiController.updateStepIndicator(text),
            showElement: (id) => this.uiController.showElement(id),
            hideElement: (id) => this.uiController.hideElement(id),
            enableElement: (id) => this.uiController.enableElement(id),
            disableElement: (id) => this.uiController.disableElement(id),
            resetSlider: (id) => this.uiController.resetSlider(id),

            // Events
            emit: (event, data) => this.eventSystem.emit(event, data),
            on: (event, callback) => this.eventSystem.on(event, callback),

            // Calculations
            calculateRegionValues: (cut) => CalculationEngine.calculateRegionValues(cut),
            calculateThreeRegionValues: (cutPosition1, cutPosition2) => CalculationEngine.calculateThreeRegionValues(cutPosition1, cutPosition2),
            calculatePlayerValue: (regions, values) => CalculationEngine.calculatePlayerValue(regions, values),
            validatePlayerTotals: (values) => CalculationEngine.validatePlayerTotals(values),

            // Animation control
            startAnimation: (config) => this.animationEngine.start(config),
            stopAnimation: (id) => this.animationEngine.stop(id),

            // Knife visualization
            updateSingleKnife: (position) => this.uiController.updateSingleKnife(position),
            updateKnifePositions: (leftPos, rightPos) => this.uiController.updateKnifePositions(leftPos, rightPos),
            showDualKnives: () => this.uiController.showDualKnives(),
            hideDualKnives: () => this.uiController.hideDualKnives(),
            updateCutPositionDisplay: (position) => this.uiController.updateCutPositionDisplay(position),
            updatePlayerValueDisplays: () => this.uiController.updatePlayerValueDisplays(),

            // Stop button controls
            addStopButtons: () => this.uiController.addStopButtons(),
            removeStopButtons: () => this.uiController.removeStopButtons(),
            addOtherPlayerStopButton: (controllingPlayer) => this.uiController.addOtherPlayerStopButton(controllingPlayer),
            removeOtherPlayerStopButton: () => this.uiController.removeOtherPlayerStopButton(),
            setStartButtonState: (state) => this.uiController.setStartButtonState(state),

            // Three-piece overlays
            showThreePieceOverlays: (leftPos, rightPos) => this.uiController.showThreePieceOverlays(leftPos, rightPos),
            hideThreePieceOverlays: () => this.uiController.hideThreePieceOverlays(),

            // Enhanced query tracking methods
            recordCutQuery: (player, context) => {
                return this.queryTracker.recordCutQuery(player, context);
            },

            recordEvalQuery: (player, piece, value, context) => {
                return this.queryTracker.recordEvalQuery(player, piece, value, context);
            },

            getComplexityAnalysis: () => {
                return this.queryTracker.getComplexityAnalysis();
            },

            // Convenience methods for common patterns
            trackDividerCut: (position) => {
                return this.queryTracker.recordCutQuery(1,
                    `Divider cuts at position ${position} to create equal-value pieces`);
            },

            trackChooserEvaluation: (piece, value) => {
                return this.queryTracker.recordEvalQuery(2, piece, value,
                    `Chooser evaluates ${piece} and finds it worth ${value}% of total value`);
            },

            trackTrimmingEvaluation: (player, piece, value) => {
                return this.queryTracker.recordEvalQuery(player, piece, value,
                    `Player ${player} evaluates ${piece} to determine if trimming is needed`);
            }
        };
    }

    // ===== EVENT HANDLERS =====
    handleStartButton() {
        if (!this.currentAlgorithm) return;

        const config = this.currentAlgorithm.config;

        if (config.onStart) {
            config.onStart(this.stateManager.getState(), this.createAlgorithmAPI());
        } else {
            // Default behavior: advance to first step
            this.advanceStep();
        }

        this.eventSystem.emit('algorithmStarted');
    }

    handleMakeCut() {
        if (!this.currentAlgorithm?.config.onMakeCut) return;

        this.currentAlgorithm.config.onMakeCut(this.stateManager.getState(), this.createAlgorithmAPI());
        this.eventSystem.emit('cutMade');
    }

    handlePlayerStop(playerNumber) {
        if (this.currentAlgorithm?.config.onPlayerStop) {
            this.currentAlgorithm.config.onPlayerStop(playerNumber, this.stateManager.getState(), this.createAlgorithmAPI());
        }
    }

    handleOtherPlayerStop() {
        if (this.currentAlgorithm?.config.onOtherPlayerStop) {
            this.currentAlgorithm.config.onOtherPlayerStop(this.stateManager.getState(), this.createAlgorithmAPI());
        }
    }

    // ===== STEP MANAGEMENT =====
    enterStep(stepIndex) {
        const config = this.currentAlgorithm?.config;
        if (!config?.steps?.[stepIndex]) return;

        const step = config.steps[stepIndex];
        this.stateManager.setCurrentStep(stepIndex);

        Logger.debug(`Entering step ${stepIndex}: ${step.title}`);

        this.uiController.updateStepIndicator(step.title);
        this.uiController.updateInstructions(step.instructions);

        if (step.onStepEnter) {
            step.onStepEnter(this.stateManager.getState(), this.createAlgorithmAPI());
        }

        this.eventSystem.emit('stepEntered', { stepIndex, step });
    }

    exitStep(stepIndex) {
        const step = this.currentAlgorithm?.config.steps?.[stepIndex];
        if (!step) return;

        Logger.debug(`Exiting step ${stepIndex}: ${step.title}`);

        if (step.onStepExit) {
            step.onStepExit(this.stateManager.getState(), this.createAlgorithmAPI());
        }

        this.eventSystem.emit('stepExited', { stepIndex, step });
    }

    advanceStep() {
        const currentStep = this.stateManager.getCurrentStep();
        const maxSteps = this.currentAlgorithm?.config.steps?.length || 0;

        if (currentStep < maxSteps - 1) {
            this.exitStep(currentStep);
            this.enterStep(currentStep + 1);
        } else {
            Logger.debug('Algorithm completed - no more steps');
            this.eventSystem.emit('algorithmCompleted');
        }
    }

    // ===== CLEANUP =====
    cleanupCurrentAlgorithm() {
        if (!this.currentAlgorithm) return;

        Logger.debug(`Cleaning up algorithm: ${this.currentAlgorithm.config.name}`);

        const config = this.currentAlgorithm.config;
        if (config.onReset) {
            config.onReset(this.stateManager.getState(), this.createAlgorithmAPI());
        }

        this.currentAlgorithm = null;
    }

    resetAlgorithm() {
        if (!this.currentAlgorithm) return;

        Logger.info('Resetting algorithm');
        const algorithmId = this.currentAlgorithm.id;
        this.switchAlgorithm(algorithmId);
        this.eventSystem.emit('algorithmReset');
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
            state: this.stateManager.getState(),
            eventListeners: this.eventSystem.getListenerCount(),
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
    Logger.debug('DOM ready - initializing demo system');

    try {
        demoSystemInstance = new FairDivisionDemoSystem();

        // Process any queued registrations
        algorithmRegistrationQueue.forEach(({ algorithmId, config }) => {
            demoSystemInstance.register(algorithmId, config);
        });
        algorithmRegistrationQueue.length = 0;

        Logger.debug('Fair Division Demo System ready');

    } catch (error) {
        Logger.error('Failed to initialize demo system:', error);
    }
});