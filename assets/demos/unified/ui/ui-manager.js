/**
 * Simplified Unified UI Manager
 * 
 * Streamlined version with only a "Start Procedure" button that triggers algorithm flow
 */

class UnifiedUIManager {
    constructor(demoSystem) {
        this.demoSystem = demoSystem;
        this.currentAlgorithm = null;
        this.currentMode = 'single';
        this.isRunning = false;

        // Cache DOM elements
        this.elements = this.cacheElements();

        // Color definitions for UI
        this.colors = {
            blue: '#0066ff',
            red: '#ff3366',
            green: '#3f9633',
            orange: '#ff6600',
            pink: '#ff66ff',
            purple: '#9966ff'
        };

        // Initialize UI
        this.initialize();

        console.log('UnifiedUIManager: Initialized');
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        return {
            // Algorithm selection
            algorithmSelector: document.getElementById('algorithm-selector'),
            algorithmName: document.getElementById('current-algorithm-name'),
            algorithmDescription: document.getElementById('current-algorithm-description'),
            algorithmMeta: document.getElementById('current-algorithm-meta'),

            // Mode controls
            singleModeBtn: document.getElementById('single-mode-btn'),
            comparisonModeBtn: document.getElementById('comparison-mode-btn'),
            singleModeContent: document.getElementById('single-mode-content'),
            comparisonModeContent: document.getElementById('comparison-mode-content'),

            // Game area
            stepIndicator: document.getElementById('step-indicator'),
            instructions: document.getElementById('instructions'),
            gameArea: document.getElementById('game-area'),
            backgroundSvg: document.querySelector('.background-svg'),

            // Player values
            playerGrid: document.getElementById('player-grid'),

            // Dynamic controls
            algorithmControls: document.getElementById('algorithm-controls'),
            dynamicControls: document.getElementById('dynamic-controls'),

            // Simplified action buttons (only one now)
            startBtn: document.getElementById('start-procedure-btn'),
            resetBtn: document.getElementById('reset-btn'),

            // Results
            resultsSection: document.getElementById('results-section'),
            resultsContent: document.getElementById('results-content')
        };
    }

    /**
     * Initialize the UI manager
     */
    initialize() {
        this.bindEvents();
        this.updateUIForNoAlgorithm();

        // Set up algorithm system events
        this.demoSystem.on('algorithm:switched', (algorithm) => {
            this.handleAlgorithmSwitch(algorithm);
        });

        this.demoSystem.on('algorithm:executed', (result) => {
            this.handleAlgorithmComplete(result);
        });

        this.demoSystem.on('algorithm:step', (stepResult) => {
            this.handleAlgorithmStep(stepResult);
        });

        this.demoSystem.on('algorithm:error', (error) => {
            this.handleAlgorithmError(error);
        });
    }

    /**
     * Bind event listeners - simplified to just start and reset
     */
    bindEvents() {
        // Algorithm selector
        this.elements.algorithmSelector?.addEventListener('change', (e) => {
            this.handleAlgorithmSelection(e.target.value);
        });

        // Mode toggle
        this.elements.singleModeBtn?.addEventListener('click', () => {
            this.setMode('single');
        });

        this.elements.comparisonModeBtn?.addEventListener('click', () => {
            this.setMode('comparison');
        });

        // Simplified action buttons
        this.elements.startBtn?.addEventListener('click', () => {
            this.startProcedure();
        });

        this.elements.resetBtn?.addEventListener('click', () => {
            this.resetProcedure();
        });
    }

    /**
     * Main procedure starter - replaces both execute and step-through
     */
    async startProcedure() {
        if (!this.currentAlgorithm || this.isRunning) return;

        try {
            this.isRunning = true;
            this.setProcedureState(true);

            // Start the algorithm procedure with automatic flow
            await this.runAlgorithmFlow();

        } catch (error) {
            console.error('Procedure execution failed:', error);
            this.showError('Procedure failed. Please try again.');
        } finally {
            this.isRunning = false;
            this.setProcedureState(false);
        }
    }

    /**
     * Run the algorithm with automated step flow
     */
    async runAlgorithmFlow() {
        if (!this.currentAlgorithm) return;

        // Initialize algorithm if needed
        if (!this.currentAlgorithm.isInitialized) {
            await this.currentAlgorithm.initializeAlgorithm(this.demoSystem.gameState);
        }

        // Execute algorithm with automatic progression
        const steps = this.currentAlgorithm.steps || [];

        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            try {
                // Update UI to show current step
                this.updateStepProgress(stepIndex, steps.length);

                // Execute the step
                const stepResult = await this.currentAlgorithm.executeStepByStep(
                    this.demoSystem.gameState,
                    stepIndex
                );

                // Update UI with step result
                this.updateUIFromStepResult(stepResult);

                // Add a small delay for visual clarity (optional)
                await this.delay(800);

            } catch (error) {
                console.error(`Step ${stepIndex} failed:`, error);
                throw error;
            }
        }

        // Complete the procedure
        this.completeProcedure();
    }

    /**
     * Reset procedure to initial state
     */
    async resetProcedure() {
        if (!this.currentAlgorithm) return;

        try {
            // Reset algorithm state
            this.currentAlgorithm.resetAlgorithmState();
            await this.currentAlgorithm.initializeAlgorithm(this.demoSystem.gameState);

            // Reset UI
            this.resetUIToInitialState();

            // Reset player values to defaults
            this.resetPlayerValues();

            // Sync controls with reset state
            this.syncControlsWithAlgorithmState();

            this.showStatusMessage('Procedure reset to initial state', 'info');

        } catch (error) {
            console.error('Reset failed:', error);
            this.showError('Failed to reset procedure');
        }
    }

    /**
     * Set procedure execution state (loading, disabled controls, etc.)
     */
    setProcedureState(isRunning) {
        // Update start button
        this.elements.startBtn.disabled = isRunning;
        this.elements.startBtn.textContent = isRunning ? 'Running Procedure...' : 'Start Procedure';

        // Update reset button
        this.elements.resetBtn.disabled = isRunning;

        // Disable/enable controls during execution
        this.setControlsEnabled(!isRunning);

        // Add loading class if needed
        if (isRunning) {
            this.elements.dynamicControls.classList.add('loading');
        } else {
            this.elements.dynamicControls.classList.remove('loading');
        }
    }

    /**
     * Update step progress indicator
     */
    updateStepProgress(currentStep, totalSteps) {
        const stepName = this.currentAlgorithm.steps[currentStep] || `Step ${currentStep + 1}`;
        this.elements.stepIndicator.textContent = `${stepName} (${currentStep + 1}/${totalSteps})`;
    }

    /**
     * Complete procedure execution
     */
    completeProcedure() {
        this.elements.startBtn.disabled = true;
        this.elements.startBtn.textContent = 'Procedure Complete';
        this.elements.resetBtn.disabled = false;

        this.elements.stepIndicator.textContent = 'Procedure Complete';
        this.showStatusMessage('Procedure completed successfully!', 'success');
    }

    /**
     * Handle algorithm selection from dropdown
     */
    async handleAlgorithmSelection(algorithmId) {
        if (!algorithmId) {
            this.updateUIForNoAlgorithm();
            return;
        }

        try {
            await this.demoSystem.switchAlgorithm(algorithmId);
        } catch (error) {
            console.error('Error switching algorithm:', error);
            this.showError('Failed to load algorithm. Please try again.');
        }
    }

    /**
     * Handle algorithm switch event
     */
    handleAlgorithmSwitch(algorithm) {
        this.currentAlgorithm = algorithm;
        this.updateUIForAlgorithm(algorithm);
    }

    /**
     * Handle algorithm completion
     */
    handleAlgorithmComplete(result) {
        this.showResults(result);
        this.completeProcedure();
    }

    /**
     * Handle algorithm step
     */
    handleAlgorithmStep(stepResult) {
        this.updateUIFromStepResult(stepResult);
    }

    /**
     * Handle algorithm error
     */
    handleAlgorithmError(error) {
        this.showError('Algorithm execution failed');
        this.setProcedureState(false);
    }

    /**
     * Update UI when no algorithm is selected
     */
    updateUIForNoAlgorithm() {
        this.elements.algorithmName.textContent = 'Select Algorithm';
        this.elements.algorithmDescription.textContent = 'Choose an algorithm to begin';
        this.elements.algorithmMeta.innerHTML = '';

        this.elements.stepIndicator.textContent = 'Ready to begin';
        this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Select an algorithm from the dropdown above to start the interactive demo.';

        // Clear dynamic content
        this.elements.playerGrid.innerHTML = '';
        this.elements.dynamicControls.innerHTML = '';

        // Disable buttons
        this.setButtonStates({ start: false, reset: false });

        this.hideResults();
        this.clearGameAreaOverlays();
    }

    /**
     * Update UI for specific algorithm
     */
    updateUIForAlgorithm(algorithm) {
        // Update algorithm info
        this.elements.algorithmName.textContent = algorithm.name;
        this.elements.algorithmDescription.textContent = algorithm.description;
        this.updateAlgorithmMeta(algorithm);

        // Update instructions
        this.elements.stepIndicator.textContent = `Ready to start`;
        this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Adjust player valuations and algorithm parameters, then click "Start Procedure" to run the algorithm.';

        // Generate player value inputs
        this.generatePlayerValueInputs(algorithm);

        // Generate algorithm-specific controls
        this.generateAlgorithmControls(algorithm);

        // Enable buttons
        this.setButtonStates({ start: true, reset: true });

        // Clear any previous results
        this.hideResults();
        this.clearGameAreaOverlays();

        // Initialize algorithm
        algorithm.initializeAlgorithm(this.demoSystem.gameState)
            .then(() => {
                this.syncControlsWithAlgorithmState();
            })
            .catch(error => {
                console.error('Algorithm initialization failed:', error);
                this.showError('Failed to initialize algorithm');
            });
    }

    /**
     * Set button states - simplified to just start and reset
     */
    setButtonStates(states) {
        if (states.start !== undefined) {
            this.elements.startBtn.disabled = !states.start;
        }
        if (states.reset !== undefined) {
            this.elements.resetBtn.disabled = !states.reset;
        }
    }

    /**
     * Utility delay function for visual pacing
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // The rest of the methods (updateUIFromStepResult, generatePlayerValueInputs, etc.) 
    // remain the same as the original implementation, just removing references to 
    // the old execute and step-through buttons

    /**
     * Update UI from step execution result
     */
    updateUIFromStepResult(stepResult) {
        // Update step display
        this.updateStepDisplay(stepResult);
        this.updateInstructions(stepResult);

        // Apply UI updates
        if (stepResult.uiUpdates) {
            this.applyUIUpdates(stepResult.uiUpdates);
        }

        // Update controls if needed
        if (stepResult.controlUpdates) {
            this.applyControlUpdates(stepResult.controlUpdates);
        }

        // Show step-specific visualizations
        if (stepResult.visualization) {
            this.applyVisualizationUpdates(stepResult.visualization);
        }
    }

    /**
     * Reset UI to initial state
     */
    resetUIToInitialState() {
        // Reset step indicator and instructions
        this.elements.stepIndicator.textContent = 'Ready to start';
        this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Adjust player valuations and algorithm parameters, then click "Start Procedure" to run the algorithm.';

        // Clear visualizations
        this.clearGameAreaOverlays();
        this.clearPieceOverlays();

        // Reset button states
        this.setButtonStates({ start: true, reset: true });
        this.elements.startBtn.textContent = 'Start Procedure';

        // Clear results
        this.hideResults();

        // Clear player highlights
        this.clearPlayerHighlights();

        // Enable controls
        this.setControlsEnabled(true);
    }

    // ... (include other necessary methods from the original implementation)
    // Note: You would need to copy over the other utility methods like:
    // - generatePlayerValueInputs()
    // - generateAlgorithmControls() 
    // - updateAlgorithmMeta()
    // - showResults()
    // - showError()
    // - showStatusMessage()
    // - setControlsEnabled()
    // - clearGameAreaOverlays()
    // etc.
}