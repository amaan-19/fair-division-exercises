/**
 * Fair Division Demo System - Core
 * 
 * Main system that manages algorithms, state, and provides the API
 */

class FairDivisionCore {
    constructor() {
        this.algorithms = new Map();
        this.currentAlgorithm = null;
        this.currentStep = 0;
        this.state = this.createInitialState();
        this.eventCleanup = [];

        this.initializeUI();
    }

    createInitialState() {
        return {
            cutPosition: 50,
            playerValues: {
                player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
                player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
            },
            algorithmData: {}
        };
    }

    initializeUI() {
        // Set up core event listeners
        this.setupCoreEvents();

        // Initialize UI state
        this.updateAlgorithmSelector();
        this.updateCutLine();
        this.updatePlayerValueDisplays();
    }

    setupCoreEvents() {
        // Algorithm selector
        const selector = document.getElementById('algorithm-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.switchAlgorithm(e.target.value);
            });
        }

        // Core buttons
        const executeBtn = document.getElementById('execute-btn');
        if (executeBtn) {
            executeBtn.addEventListener('click', () => {
                if (this.currentAlgorithm) {
                    this.currentAlgorithm.config.onExecute(this.state, this.createAPI());
                }
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAlgorithm();
            });
        }

        // Cut slider
        const cutSlider = document.getElementById('cut-slider');
        if (cutSlider) {
            cutSlider.addEventListener('input', (e) => {
                this.state.cutPosition = parseFloat(e.target.value);
                this.updateCutLine();
                this.updatePlayerValueDisplays();
                if (this.currentAlgorithm) {
                    this.currentAlgorithm.config.onPlayerValueChange?.(this.state, this.createAPI());
                }
            });
        }

        // Player value inputs
        this.setupPlayerValueEvents();
    }

    setupPlayerValueEvents() {
        const colors = ['blue', 'red', 'green', 'orange', 'pink', 'purple'];
        ['p1', 'p2'].forEach(player => {
            colors.forEach(color => {
                const input = document.getElementById(`${player}-${color}`);
                if (input) {
                    input.addEventListener('input', (e) => {
                        const playerKey = player === 'p1' ? 'player1' : 'player2';
                        this.state.playerValues[playerKey][color] = parseInt(e.target.value) || 0;
                        // check if values sum to 100
                        const total = colors.reduce((sum, clr) => sum + (this.state.playerValues[playerKey][clr] || 0), 0);
                        if (total !== 100) {
                            console.error(`Error: ${playerKey} values must sum to 100. Current total: ${total}`);
                            // Optional: show visual error
                            const errorElement = document.getElementById(`${player}-error`);
                            if (errorElement) {
                                errorElement.textContent = `Total must be 100 (currently ${total})`;
                                errorElement.style.display = 'block';
                            }
                        } else {
                            const errorElement = document.getElementById(`${player}-error`);
                            if (errorElement) {
                                errorElement.style.display = 'none';
                            }
                        }
                        this.updatePlayerValueDisplays();
                        if (this.currentAlgorithm) {
                            this.currentAlgorithm.config.onPlayerValueChange?.(this.state, this.createAPI());
                        }
                    });
                }
            });
        });
    }

    register(id, config) {
        this.algorithms.set(id, { id, config });
        this.updateAlgorithmSelector();
        console.log(`Algorithm registered: ${config.name}`);
    }

    switchAlgorithm(id) {
        if (!id) return;

        const algorithm = this.algorithms.get(id);
        if (!algorithm) return;

        // Cleanup current algorithm
        this.cleanupCurrentAlgorithm();

        // Switch to new algorithm
        this.currentAlgorithm = algorithm;
        this.currentStep = 0;
        this.state = this.createInitialState();

        // Initialize new algorithm
        this.initializeAlgorithm();
    }

    cleanupCurrentAlgorithm() {
        if (!this.currentAlgorithm) return;

        // Clean up event listeners
        this.eventCleanup.forEach(cleanup => cleanup());
        this.eventCleanup = [];

        // Call algorithm cleanup if exists
        if (this.currentAlgorithm.config.onReset) {
            this.currentAlgorithm.config.onReset(this.state, this.createAPI());
        }
    }

    initializeAlgorithm() {
        if (!this.currentAlgorithm) return;

        const config = this.currentAlgorithm.config;

        // Update UI for algorithm
        document.getElementById('algorithm-name').textContent = config.name;
        document.getElementById('algorithm-description').textContent = config.description;

        // Enter first step
        if (config.steps && config.steps.length > 0) {
            this.enterStep(0);
        }
    }

    enterStep(stepIndex) {
        if (!this.currentAlgorithm || !this.currentAlgorithm.config.steps) return;

        const step = this.currentAlgorithm.config.steps[stepIndex];
        if (!step) return;

        this.currentStep = stepIndex;

        // Update UI for step
        const api = this.createAPI();
        api.updateUI({
            stepTitle: step.title,
            instructions: step.instructions,
            enabledControls: step.enabledControls || []
        });

        // Call step enter handler
        if (step.onStepEnter) {
            step.onStepEnter(this.state, api);
        }
    }

    resetAlgorithm() {
        if (!this.currentAlgorithm) return;

        this.state = this.createInitialState();
        this.currentStep = 0;
        this.updateCutLine();
        this.updatePlayerValueDisplays();

        // Re-initialize algorithm
        this.initializeAlgorithm();
    }

    createAPI() {
        return {
            // State management
            updateState: (changes) => {
                Object.assign(this.state, changes);
            },

            getState: () => ({ ...this.state }),

            setCutPosition: (percentage) => {
                this.state.cutPosition = percentage;
                this.updateCutLine();
                document.getElementById('cut-slider').value = percentage;
            },

            // Step control
            requestStepProgression: () => {
                if (this.currentAlgorithm && this.currentAlgorithm.config.steps) {
                    const nextStep = this.currentStep + 1;
                    if (nextStep < this.currentAlgorithm.config.steps.length) {
                        this.enterStep(nextStep);
                    }
                }
            },

            getCurrentStep: () => this.currentStep,

            // UI control
            updateUI: ({ stepTitle, instructions, enabledControls = [] }) => {
                if (stepTitle) {
                    const el = document.getElementById('step-indicator');
                    if (el) el.textContent = stepTitle;
                }

                if (instructions) {
                    const el = document.getElementById('instructions');
                    if (el) el.innerHTML = instructions;
                }

                this.updateControlStates(enabledControls);
            },

            showResults: (config) => {
                const resultsEl = document.getElementById('results');
                const contentEl = document.getElementById('result-content');

                if (contentEl && config.text) {
                    contentEl.innerHTML = config.text;
                }

                if (resultsEl) {
                    resultsEl.style.display = 'block';
                }
            },

            // Event handling
            addEventListener: (eventType, handler) => {
                if (eventType === 'pieceClick') {
                    const leftPiece = document.getElementById('left-piece');
                    const rightPiece = document.getElementById('right-piece');

                    const leftHandler = () => handler('left');
                    const rightHandler = () => handler('right');

                    if (leftPiece) leftPiece.addEventListener('click', leftHandler);
                    if (rightPiece) rightPiece.addEventListener('click', rightHandler);

                    this.eventCleanup.push(() => {
                        if (leftPiece) leftPiece.removeEventListener('click', leftHandler);
                        if (rightPiece) rightPiece.removeEventListener('click', rightHandler);
                    });
                }
            },

            // Utilities
            calculateRegionValues: (cutPosition) => {
                return this.calculateRegionValues(cutPosition);
            },

            calculatePlayerValue: (regionValues, playerValues) => {
                return this.calculatePlayerValue(regionValues, playerValues);
            }
        };
    }

    updateControlStates(enabledControls) {
        const controlMap = {
            'cutSlider': 'cut-slider',
            'executeButton': 'execute-btn',
            'resetButton': 'reset-btn',
            'pieceSelection': ['left-piece', 'right-piece']
        };

        // Disable all controls first
        Object.values(controlMap).flat().forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.disabled = true;
                el.style.cursor = 'not-allowed';
                el.style.opacity = '0.5';
            }
        });

        // Enable specified controls
        enabledControls.forEach(control => {
            const ids = Array.isArray(controlMap[control]) ? controlMap[control] : [controlMap[control]];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.disabled = false;
                    el.style.cursor = '';
                    el.style.opacity = '';
                }
            });
        });

        // Special handling for piece selection
        if (enabledControls.includes('pieceSelection')) {
            ['left-piece', 'right-piece'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'pointer';
                    el.style.stroke = '#3182ce';
                    el.style.strokeWidth = '3';
                    el.style.fill = 'rgba(49, 130, 206, 0.1)';
                }
            });
        } else {
            ['left-piece', 'right-piece'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'default';
                    el.style.stroke = 'rgba(0,0,0,0)';
                    el.style.fill = 'rgba(0,0,0,0)';
                }
            });
        }
    }

    updateAlgorithmSelector() {
        const selector = document.getElementById('algorithm-selector');
        if (!selector) return;

        selector.innerHTML = '<option value="">Choose Algorithm...</option>';

        for (const [id, algorithm] of this.algorithms) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = algorithm.config.name;
            selector.appendChild(option);
        }
    }

    updateCutLine() {
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            const cutX = (this.state.cutPosition / 100) * 800;
            cutLine.setAttribute('x1', cutX);
            cutLine.setAttribute('x2', cutX);
        }

        const cutValue = document.getElementById('cut-value');
        if (cutValue) {
            cutValue.textContent = `${this.state.cutPosition.toFixed(1)}%`;
        }
    }

    updatePlayerValueDisplays() {
        const regionValues = this.calculateRegionValues(this.state.cutPosition);

        ['player1', 'player2'].forEach((player, index) => {
            const playerNum = index + 1;
            const leftValue = this.calculatePlayerValue(regionValues.left, this.state.playerValues[player]);
            const rightValue = this.calculatePlayerValue(regionValues.right, this.state.playerValues[player]);

            const display = document.getElementById(`player${playerNum}-values`);
            if (display) {
                display.textContent = `Left: ${leftValue.toFixed(1)} | Right: ${rightValue.toFixed(1)}`;
            }
        });
    }

    calculateRegionValues(cutPosition) {
        const cutX = (cutPosition / 100) * 800;
        const regions = {
            blue: { start: 0, end: 600 },
            red: { start: 600, end: 800 },
            green: { start: 150, end: 600 },
            orange: { start: 600, end: 800 },
            pink: { start: 0, end: 150 },
            purple: { start: 150, end: 800 }
        };

        const leftValues = {}, rightValues = {};

        for (const [color, bounds] of Object.entries(regions)) {
            if (cutX <= bounds.start) {
                leftValues[color] = 0;
                rightValues[color] = 100;
            } else if (cutX >= bounds.end) {
                leftValues[color] = 100;
                rightValues[color] = 0;
            } else {
                const total = bounds.end - bounds.start;
                const left = cutX - bounds.start;
                leftValues[color] = (left / total) * 100;
                rightValues[color] = 100 - leftValues[color];
            }
        }

        return { left: leftValues, right: rightValues };
    }

    calculatePlayerValue(regionValues, playerValues) {
        return Object.entries(regionValues)
            .reduce((total, [color, percentage]) => {
                return total + (percentage / 100) * (playerValues[color] || 0);
            }, 0);
    }
}

// Global instance
let demoSystem = null;
const registrationQueue = [];

// Make registration available immediately when script loads
window.FairDivisionCore = {
    register: function (id, config) {
        console.log(`Registration attempt for: ${id}`);
        if (demoSystem) {
            console.log(`Registering immediately: ${id}`);
            demoSystem.register(id, config);
        } else {
            console.log(`Queueing registration: ${id}`);
            registrationQueue.push({ id, config });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing system...');
    demoSystem = new FairDivisionCore();

    // Process any queued registrations
    console.log(`Processing ${registrationQueue.length} queued registrations`);
    registrationQueue.forEach(({ id, config }) => {
        console.log(`Processing queued registration: ${id}`);
        demoSystem.register(id, config);
    });
    registrationQueue.length = 0; // Clear the queue

    // Keep the register function available after initialization
    window.FairDivisionCore.register = function (id, config) {
        console.log(`Direct registration after init: ${id}`);
        demoSystem.register(id, config);
    };

    console.log('Fair Division Demo System ready');
});