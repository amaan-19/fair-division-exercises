/**
 * Unified UI Manager - Part 1
 * 
 * Handles all user interface interactions for the unified demo system.
 * This part covers initialization, algorithm switching, and basic UI management.
 */

class UnifiedUIManager {
    constructor(demoSystem) {
        this.demoSystem = demoSystem;
        this.currentAlgorithm = null;
        this.currentMode = 'single';

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

            // Action buttons
            executeBtn: document.getElementById('execute-algorithm-btn'),
            stepThroughBtn: document.getElementById('step-through-btn'),
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
        this.bindBasicEvents();
        this.updateUIForNoAlgorithm();
    }

    /**
     * Bind basic event listeners
     */
    bindBasicEvents() {
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

        // Action buttons
        this.elements.executeBtn?.addEventListener('click', () => {
            this.executeCurrentAlgorithm();
        });

        this.elements.stepThroughBtn?.addEventListener('click', () => {
            this.stepThroughCurrentAlgorithm();
        });

        this.elements.resetBtn?.addEventListener('click', () => {
            this.resetCurrentAlgorithm();
        });
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
        this.setButtonStates({ execute: false, stepThrough: false, reset: false });

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
        this.elements.stepIndicator.textContent = `Step 1: Setup`;
        this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Adjust player valuations and algorithm parameters, then execute the algorithm.';

        // Generate player value inputs
        this.generatePlayerValueInputs(algorithm.playerCount);

        // Generate algorithm-specific controls
        this.generateAlgorithmControls(algorithm);

        // Enable appropriate buttons
        this.setButtonStates({ execute: true, stepThrough: true, reset: true });

        // Hide results
        this.hideResults();

        // Clear any previous visualizations
        this.clearGameAreaOverlays();

        // Set up algorithm event listeners
        this.setupAlgorithmEventListeners(algorithm);
    }

    /**
     * Update algorithm metadata badges
     */
    updateAlgorithmMeta(algorithm) {
        const metaHTML = `
            <span class="meta-badge players">${algorithm.playerCount} Players</span>
            <span class="meta-badge type">${algorithm.type}</span>
            ${algorithm.properties.map(prop =>
            `<span class="meta-badge property">${prop}</span>`
        ).join('')}
        `;
        this.elements.algorithmMeta.innerHTML = metaHTML;
    }

    /**
     * Set button enabled/disabled states
     */
    setButtonStates(states) {
        if (states.execute !== undefined) {
            this.elements.executeBtn.disabled = !states.execute;
        }
        if (states.stepThrough !== undefined) {
            this.elements.stepThroughBtn.disabled = !states.stepThrough;
        }
        if (states.reset !== undefined) {
            this.elements.resetBtn.disabled = !states.reset;
        }
    }

    /**
     * Set UI mode (single vs comparison)
     */
    setMode(mode) {
        this.currentMode = mode;

        // Update button states
        this.elements.singleModeBtn.classList.toggle('active', mode === 'single');
        this.elements.comparisonModeBtn.classList.toggle('active', mode === 'comparison');

        // Show/hide content
        this.elements.singleModeContent.style.display = mode === 'single' ? 'grid' : 'none';
        this.elements.comparisonModeContent.style.display = mode === 'comparison' ? 'grid' : 'none';

        // Update demo system mode
        this.demoSystem.setMode(mode);

        console.log(`UI Mode changed to: ${mode}`);
    }

    /**
     * Clear any visual overlays in the game area
     */
    clearGameAreaOverlays() {
        // Remove any existing cut lines, piece overlays, etc.
        const existingOverlays = this.elements.backgroundSvg.querySelectorAll('.dynamic-element');
        existingOverlays.forEach(element => element.remove());
    }

    /**
     * Show error message to user
     */
    showError(message) {
        // Create or update error display
        console.error('UI Error:', message);
        // Could implement a toast notification or error panel here
    }

    /**
     * Hide results section
     */
    hideResults() {
        this.elements.resultsSection.classList.remove('visible');
    }

    // ===== PART 2: PLAYER VALUE INPUT GENERATION =====

    /**
     * Generate player value input grids
     */
    generatePlayerValueInputs(playerCount) {
        this.elements.playerGrid.className = `player-grid ${playerCount === 2 ? 'two-player' : 'three-player'}`;
        this.elements.playerGrid.innerHTML = '';

        for (let i = 1; i <= playerCount; i++) {
            const playerCard = this.createPlayerCard(i);
            this.elements.playerGrid.appendChild(playerCard);
        }

        // Initialize validation displays
        this.updateAllPlayerValidation();

        // Bind value change events
        this.bindPlayerValueEvents();
    }

    /**
     * Create a player value input card
     */
    createPlayerCard(playerNumber) {
        const playerId = `player${playerNumber}`;
        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `${playerId}-card`;

        const defaultValues = this.demoSystem.gameState.getPlayerValues(playerId);

        card.innerHTML = `
            <h4>Player ${playerNumber}</h4>
            <div class="color-inputs">
                ${Object.entries(this.colors).map(([color, colorValue]) => `
                    <div class="color-input-group">
                        <div class="color-swatch" style="background-color: ${colorValue};"></div>
                        <span style="font-size: 0.8rem; width: 60px;">${color}:</span>
                        <input type="number" 
                               class="value-input" 
                               id="${playerId}-${color}" 
                               value="${defaultValues[color]}" 
                               min="0" 
                               max="100" 
                               data-player="${playerId}" 
                               data-color="${color}">
                    </div>
                `).join('')}
            </div>
            <div class="player-total valid" id="${playerId}-total">
                Total: 100
            </div>
        `;

        return card;
    }

    /**
     * Bind player value input events
     */
    bindPlayerValueEvents() {
        const inputs = document.querySelectorAll('.value-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handlePlayerValueChange(e.target);
            });

            input.addEventListener('blur', (e) => {
                this.validateAndClampInput(e.target);
            });
        });
    }

    /**
     * Handle player value input changes
     */
    handlePlayerValueChange(input) {
        const playerId = input.dataset.player;
        const color = input.dataset.color;
        const value = parseInt(input.value) || 0;

        // Update game state
        this.demoSystem.gameState.setPlayerValue(playerId, color, value);

        // Update validation display
        this.updatePlayerValidation(playerId);

        // Check if algorithm needs to update (for real-time algorithms)
        this.handleAlgorithmValueUpdate();
    }

    /**
     * Validate and clamp input values
     */
    validateAndClampInput(input) {
        const value = parseInt(input.value);

        if (isNaN(value) || value < 0) {
            input.value = 0;
        } else if (value > 100) {
            input.value = 100;
        }

        // Trigger change event if value was clamped
        if (parseInt(input.value) !== value) {
            this.handlePlayerValueChange(input);
        }
    }

    /**
     * Update player validation display
     */
    updatePlayerValidation(playerId) {
        const validation = this.demoSystem.gameState.validatePlayerTotals();
        const totalElement = document.getElementById(`${playerId}-total`);

        if (totalElement && validation[playerId]) {
            const isValid = validation[playerId].valid;
            const total = validation[playerId].total;

            totalElement.className = `player-total ${isValid ? 'valid' : 'invalid'}`;
            totalElement.textContent = `Total: ${total}${isValid ? '' : ' (need 100)'}`;
        }

        // Update execute button state based on overall validation
        this.updateExecuteButtonState();
    }

    /**
     * Update all player validation displays
     */
    updateAllPlayerValidation() {
        if (!this.currentAlgorithm) return;

        for (let i = 1; i <= this.currentAlgorithm.playerCount; i++) {
            this.updatePlayerValidation(`player${i}`);
        }
    }

    /**
     * Update execute button state based on validation
     */
    updateExecuteButtonState() {
        if (!this.currentAlgorithm) return;

        const isValid = this.demoSystem.gameState.isValid(this.currentAlgorithm.playerCount);
        this.elements.executeBtn.disabled = !isValid;

        if (!isValid) {
            this.elements.executeBtn.textContent = 'Fix Valuations First';
        } else {
            this.elements.executeBtn.textContent = 'Execute Algorithm';
        }
    }

    /**
     * Handle algorithm updates when values change
     */
    handleAlgorithmValueUpdate() {
        if (!this.currentAlgorithm) return;

        // For algorithms with real-time updates (like Divide-and-Choose)
        if (typeof this.currentAlgorithm.updatePieceValues === 'function') {
            try {
                this.currentAlgorithm.updatePieceValues(this.demoSystem.gameState);
            } catch (error) {
                console.warn('Error updating algorithm values:', error);
            }
        }
    }

    /**
     * Reset player values to defaults
     */
    resetPlayerValues() {
        if (!this.currentAlgorithm) return;

        for (let i = 1; i <= this.currentAlgorithm.playerCount; i++) {
            const playerId = `player${i}`;
            this.demoSystem.gameState.resetPlayerValues(playerId);

            // Update UI inputs
            Object.keys(this.colors).forEach(color => {
                const input = document.getElementById(`${playerId}-${color}`);
                if (input) {
                    const newValue = this.demoSystem.gameState.getPlayerValues(playerId)[color];
                    input.value = newValue;
                }
            });
        }

        // Update validation displays
        this.updateAllPlayerValidation();

        // Trigger algorithm update
        this.handleAlgorithmValueUpdate();
    }

    /**
     * Get current player values from UI
     */
    getCurrentPlayerValuesFromUI() {
        const values = {};

        if (!this.currentAlgorithm) return values;

        for (let i = 1; i <= this.currentAlgorithm.playerCount; i++) {
            const playerId = `player${i}`;
            values[playerId] = {};

            Object.keys(this.colors).forEach(color => {
                const input = document.getElementById(`${playerId}-${color}`);
                if (input) {
                    values[playerId][color] = parseInt(input.value) || 0;
                }
            });
        }

        return values;
    }

    /**
     * Sync UI with game state (useful after resets or imports)
     */
    syncPlayerValuesWithGameState() {
        if (!this.currentAlgorithm) return;

        for (let i = 1; i <= this.currentAlgorithm.playerCount; i++) {
            const playerId = `player${i}`;
            const gameStateValues = this.demoSystem.gameState.getPlayerValues(playerId);

            Object.keys(this.colors).forEach(color => {
                const input = document.getElementById(`${playerId}-${color}`);
                if (input && gameStateValues[color] !== undefined) {
                    input.value = gameStateValues[color];
                }
            });
        }

        this.updateAllPlayerValidation();
    }

    /**
     * Highlight specific player card (for algorithm steps)
     */
    highlightPlayerCard(playerId, highlight = true) {
        const card = document.getElementById(`${playerId}-card`);
        if (card) {
            if (highlight) {
                card.classList.add('highlight');
            } else {
                card.classList.remove('highlight');
            }
        }
    }

    /**
     * Clear all player card highlights
     */
    clearPlayerHighlights() {
        const cards = document.querySelectorAll('.player-card');
        cards.forEach(card => card.classList.remove('highlight'));
    }

    // ===== PART 3: DYNAMIC ALGORITHM CONTROL GENERATION =====

    /**
     * Generate algorithm-specific controls
     */
    generateAlgorithmControls(algorithm) {
        try {
            const controlSpecs = algorithm.getRequiredControls();
            this.elements.dynamicControls.innerHTML = '';

            controlSpecs.forEach(spec => {
                const controlElement = this.createControlElement(spec);
                if (controlElement) {
                    this.elements.dynamicControls.appendChild(controlElement);
                }
            });

            // Bind events for the new controls
            this.bindAlgorithmControlEvents();

        } catch (error) {
            console.error('Error generating algorithm controls:', error);
            this.elements.dynamicControls.innerHTML = '<p class="error">Error loading algorithm controls</p>';
        }
    }

    /**
     * Create a control element based on specification
     */
    createControlElement(spec) {
        const container = document.createElement('div');
        container.className = 'control-item';
        container.id = `control-${spec.id}`;

        switch (spec.type) {
            case 'slider':
                return this.createSliderControl(spec);
            case 'button':
                return this.createButtonControl(spec);
            case 'display':
                return this.createDisplayControl(spec);
            default:
                console.warn(`Unknown control type: ${spec.type}`);
                return null;
        }
    }

    /**
     * Create slider control
     */
    createSliderControl(spec) {
        const container = document.createElement('div');
        container.className = 'slider-container';
        container.id = `control-${spec.id}`;

        container.innerHTML = `
            <label for="slider-${spec.id}">
                ${spec.label}
                ${spec.unit ? `<span class="slider-value" id="value-${spec.id}">${spec.value}${spec.unit}</span>` : ''}
            </label>
            <input type="range" 
                   id="slider-${spec.id}"
                   class="slider algorithm-slider"
                   min="${spec.min}"
                   max="${spec.max}"
                   value="${spec.value}"
                   step="${spec.step || 1}"
                   data-spec-id="${spec.id}"
                   ${spec.realTimeUpdate ? 'data-realtime="true"' : ''}>
            ${spec.description ? `<div class="control-description">${spec.description}</div>` : ''}
            ${spec.showOptimalHint ? `<div class="optimal-hint" id="hint-${spec.id}" style="display: none;"></div>` : ''}
        `;

        return container;
    }

    /**
     * Create button control
     */
    createButtonControl(spec) {
        const container = document.createElement('div');
        container.className = 'button-container';
        container.id = `control-${spec.id}`;

        const button = document.createElement('button');
        button.id = `button-${spec.id}`;
        button.className = `button ${spec.variant || 'primary'}`;
        button.textContent = spec.label;
        button.disabled = spec.enabled === false;
        button.dataset.specId = spec.id;

        if (spec.description) {
            button.title = spec.description;
        }

        container.appendChild(button);

        if (spec.description) {
            const description = document.createElement('div');
            description.className = 'control-description';
            description.textContent = spec.description;
            container.appendChild(description);
        }

        return container;
    }

    /**
     * Create display control
     */
    createDisplayControl(spec) {
        const container = document.createElement('div');
        container.className = 'display-container';
        container.id = `control-${spec.id}`;

        container.innerHTML = `
            <h4>${spec.label}</h4>
            <div class="display-content" id="display-${spec.id}">
                ${spec.description || 'Ready for algorithm execution'}
            </div>
        `;

        return container;
    }

    /**
     * Bind events for algorithm controls
     */
    bindAlgorithmControlEvents() {
        // Slider events
        const sliders = this.elements.dynamicControls.querySelectorAll('.algorithm-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleSliderChange(e.target);
            });
        });

        // Button events
        const buttons = this.elements.dynamicControls.querySelectorAll('.button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleAlgorithmButtonClick(e.target);
            });
        });
    }

    /**
     * Handle slider value changes
     */
    handleSliderChange(slider) {
        const specId = slider.dataset.specId;
        const value = parseFloat(slider.value);

        // Update value display if it exists
        const valueDisplay = document.getElementById(`value-${specId}`);
        if (valueDisplay) {
            const unit = this.getSliderUnit(specId);
            valueDisplay.textContent = `${value}${unit}`;
        }

        // Handle specific sliders
        switch (specId) {
            case 'cut-position-slider':
                this.handleCutPositionChange(value);
                break;
            case 'cut-slider-1':
                this.handleDualCutChange(1, value);
                break;
            case 'cut-slider-2':
                this.handleDualCutChange(2, value);
                break;
            default:
                // Generic algorithm parameter update
                this.handleGenericParameterChange(specId, value);
        }

        // Real-time updates if specified
        if (slider.dataset.realtime === 'true' && this.currentAlgorithm) {
            this.triggerAlgorithmUpdate();
        }
    }

    /**
     * Handle algorithm button clicks
     */
    handleAlgorithmButtonClick(button) {
        const specId = button.dataset.specId;

        switch (specId) {
            case 'make-cut-button':
                this.handleMakeCut();
                break;
            case 'find-optimal-button':
                this.handleFindOptimal();
                break;
            case 'step-through-button':
                this.stepThroughCurrentAlgorithm();
                break;
            default:
                console.log(`Algorithm button clicked: ${specId}`);
        }
    }

    /**
     * Handle cut position changes (for Divide-and-Choose)
     */
    async handleCutPositionChange(value) {
        if (!this.currentAlgorithm || typeof this.currentAlgorithm.updateCutPosition !== 'function') {
            return;
        }

        try {
            await this.currentAlgorithm.updateCutPosition(value, this.demoSystem.gameState);

            // Update display if it exists
            this.updatePieceValueDisplay();

            // Update visual cut line
            this.updateCutLineVisualization(value);

        } catch (error) {
            console.error('Error updating cut position:', error);
        }
    }

    /**
     * Handle dual cut changes (for Steinhaus)
     */
    async handleDualCutChange(cutNumber, value) {
        if (!this.currentAlgorithm) return;

        const cut1 = parseFloat(document.getElementById('slider-cut-slider-1')?.value || 0);
        const cut2 = parseFloat(document.getElementById('slider-cut-slider-2')?.value || 0);

        // Ensure cuts don't overlap
        if (cutNumber === 1 && value >= cut2) {
            document.getElementById('slider-cut-slider-2').value = value + 10;
        } else if (cutNumber === 2 && value <= cut1) {
            document.getElementById('slider-cut-slider-1').value = value - 10;
        }

        // Update algorithm state
        if (typeof this.currentAlgorithm.updateDualCuts === 'function') {
            await this.currentAlgorithm.updateDualCuts(cut1, cut2, this.demoSystem.gameState);
        }

        this.updateDualCutVisualization(cut1, cut2);
    }

    /**
     * Handle generic parameter changes
     */
    handleGenericParameterChange(paramId, value) {
        if (this.currentAlgorithm) {
            this.demoSystem.gameState.setAlgorithmState(this.currentAlgorithm.id, paramId, value);
        }
    }

    /**
     * Handle "Make Cut" button
     */
    async handleMakeCut() {
        if (!this.currentAlgorithm || typeof this.currentAlgorithm.executeCuttingStep !== 'function') {
            return;
        }

        try {
            const result = await this.currentAlgorithm.executeCuttingStep(this.demoSystem.gameState);
            this.updateUIFromStepResult(result);
        } catch (error) {
            console.error('Error making cut:', error);
            this.showError('Failed to make cut');
        }
    }

    /**
     * Handle "Find Optimal" button
     */
    async handleFindOptimal() {
        if (!this.currentAlgorithm || typeof this.currentAlgorithm.findOptimalCut !== 'function') {
            return;
        }

        try {
            const optimalPosition = await this.currentAlgorithm.findOptimalCut(this.demoSystem.gameState);

            // Update slider to optimal position
            const slider = document.getElementById('slider-cut-position-slider');
            if (slider) {
                slider.value = optimalPosition;
                this.handleSliderChange(slider);
            }

        } catch (error) {
            console.error('Error finding optimal cut:', error);
            this.showError('Failed to find optimal cut');
        }
    }

    /**
     * Update piece value display
     */
    updatePieceValueDisplay() {
        const display = document.getElementById('display-piece-values-display');
        if (!display || !this.currentAlgorithm) return;

        try {
            if (typeof this.currentAlgorithm.getCurrentAnalysis === 'function') {
                this.currentAlgorithm.getCurrentAnalysis(this.demoSystem.gameState).then(analysis => {
                    const html = this.formatPieceValuesHTML(analysis);
                    display.innerHTML = html;
                });
            }
        } catch (error) {
            console.warn('Error updating piece value display:', error);
        }
    }

    /**
     * Format piece values for display
     */
    formatPieceValuesHTML(analysis) {
        if (!analysis || !analysis.playerValues) {
            return 'No data available';
        }

        let html = '<div class="piece-values-grid">';

        Object.entries(analysis.playerValues).forEach(([playerId, values]) => {
            const playerNum = playerId.replace('player', '');
            html += `<div class="player-piece-values">`;
            html += `<strong>Player ${playerNum}:</strong><br>`;

            Object.entries(values).forEach(([piece, value]) => {
                html += `${piece}: ${this.formatNumber(value)}<br>`;
            });

            html += `</div>`;
        });

        html += '</div>';
        return html;
    }

    /**
     * Get slider unit for display
     */
    getSliderUnit(specId) {
        // This could be enhanced to read from control specs
        if (specId.includes('position')) return '%';
        return '';
    }

    /**
     * Trigger algorithm update for real-time controls
     */
    triggerAlgorithmUpdate() {
        if (this.currentAlgorithm && typeof this.currentAlgorithm.updatePieceValues === 'function') {
            this.currentAlgorithm.updatePieceValues(this.demoSystem.gameState);
        }
    }

    /**
     * Enable/disable algorithm controls
     */
    setControlsEnabled(enabled) {
        const controls = this.elements.dynamicControls.querySelectorAll('input, button');
        controls.forEach(control => {
            control.disabled = !enabled;
        });
    }

    /**
     * Update control values from algorithm state
     */
    syncControlsWithAlgorithmState() {
        if (!this.currentAlgorithm) return;

        const sliders = this.elements.dynamicControls.querySelectorAll('.algorithm-slider');
        sliders.forEach(slider => {
            const specId = slider.dataset.specId;
            const value = this.demoSystem.gameState.getAlgorithmState(this.currentAlgorithm.id, specId);

            if (value !== null && value !== undefined) {
                slider.value = value;
                this.handleSliderChange(slider);
            }
        });
    }

    /**
     * Format number for display
     */
    formatNumber(num, decimals = 1) {
        return Number(num).toFixed(decimals);
    }

    // ===== PART 4: ALGORITHM EVENT HANDLING AND VISUALIZATION =====

    /**
     * Set up algorithm-specific event listeners
     */
    setupAlgorithmEventListeners(algorithm) {
        // Clear any existing listeners
        this.clearAlgorithmEventListeners();

        // Algorithm-specific event bindings
        switch (algorithm.id) {
            case 'divide-and-choose':
                this.setupDivideAndChooseEvents(algorithm);
                break;
            case 'austins-moving-knife':
                this.setupAustinsEvents(algorithm);
                break;
            case 'steinhaus-lone-divider':
                this.setupSteinhausEvents(algorithm);
                break;
        }

        // Common algorithm events
        algorithm.on('piece-values:updated', (data) => {
            this.handlePieceValuesUpdate(data);
        });

        algorithm.on('cut-position:changed', (data) => {
            this.handleCutPositionUpdate(data);
        });

        algorithm.on('step:completed', (data) => {
            this.handleStepCompleted(data);
        });

        algorithm.on('optimal-cut:applied', (data) => {
            this.handleOptimalCutApplied(data);
        });
    }

    /**
     * Set up Divide-and-Choose specific events
     */
    setupDivideAndChooseEvents(algorithm) {
        algorithm.on('cut-position:changed', (data) => {
            this.updateCutLineVisualization(data.newPosition);
            this.updatePieceValueDisplay();
            this.updateOptimalHint(data.optimization);
        });
    }

    /**
     * Set up Austin's Moving Knife specific events
     */
    setupAustinsEvents(algorithm) {
        algorithm.on('knife:moving', (data) => {
            this.updateMovingKnifeVisualization(data);
        });

        algorithm.on('dual-knives:active', (data) => {
            this.updateDualKnivesVisualization(data);
        });
    }

    /**
     * Set up Steinhaus Lone-Divider specific events
     */
    setupSteinhausEvents(algorithm) {
        algorithm.on('cuts:changed', (data) => {
            this.updateDualCutVisualization(data.cut1, data.cut2);
        });

        algorithm.on('pieces:analyzed', (data) => {
            this.updatePieceAcceptabilityVisualization(data);
        });
    }

    /**
     * Clear algorithm event listeners
     */
    clearAlgorithmEventListeners() {
        // This would be implemented to remove existing listeners
        // For now, algorithms handle their own cleanup
    }

    /**
     * Handle piece values update
     */
    handlePieceValuesUpdate(data) {
        this.updatePieceValueDisplay();

        // Update any piece hover information
        this.updatePieceTooltips(data);
    }

    /**
     * Handle cut position updates
     */
    handleCutPositionUpdate(data) {
        // Update visual cut line
        this.updateCutLineVisualization(data.newPosition);

        // Update piece value displays
        if (data.analysis) {
            this.updatePieceValueDisplay();
        }

        // Update optimization hints
        if (data.optimization) {
            this.updateOptimalHint(data.optimization);
        }
    }

    /**
     * Handle step completion
     */
    handleStepCompleted(data) {
        this.updateStepDisplay(data);
        this.updateInstructions(data);

        // Update UI based on step requirements
        if (data.uiUpdates) {
            this.applyUIUpdates(data.uiUpdates);
        }
    }

    /**
     * Handle optimal cut application
     */
    handleOptimalCutApplied(data) {
        // Update slider to show new position
        const slider = document.getElementById('slider-cut-position-slider');
        if (slider) {
            slider.value = data.position;
            const valueDisplay = document.getElementById('value-cut-position-slider');
            if (valueDisplay) {
                valueDisplay.textContent = `${data.position}%`;
            }
        }

        // Show success message
        this.showOptimalMessage(data);
    }

    /**
     * Update cut line visualization
     */
    updateCutLineVisualization(positionPercent) {
        const cutX = (positionPercent / 100) * 800;

        // Remove existing cut line
        const existingLine = this.elements.backgroundSvg.querySelector('#cut-line');
        if (existingLine) {
            existingLine.remove();
        }

        // Create new cut line
        const cutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cutLine.id = 'cut-line';
        cutLine.className = 'dynamic-element';
        cutLine.setAttribute('x1', cutX);
        cutLine.setAttribute('y1', 0);
        cutLine.setAttribute('x2', cutX);
        cutLine.setAttribute('y2', 400);
        cutLine.setAttribute('stroke', '#dc3545');
        cutLine.setAttribute('stroke-width', '4');
        cutLine.setAttribute('stroke-dasharray', '10,5');

        this.elements.backgroundSvg.appendChild(cutLine);
    }

    /**
     * Update dual cut visualization (for Steinhaus)
     */
    updateDualCutVisualization(cut1Percent, cut2Percent) {
        const cut1X = (cut1Percent / 100) * 800;
        const cut2X = (cut2Percent / 100) * 800;

        // Remove existing cut lines
        this.elements.backgroundSvg.querySelectorAll('.cut-line').forEach(line => line.remove());

        // Create cut lines
        [cut1X, cut2X].forEach((cutX, index) => {
            const cutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            cutLine.className = 'dynamic-element cut-line';
            cutLine.setAttribute('x1', cutX);
            cutLine.setAttribute('y1', 0);
            cutLine.setAttribute('x2', cutX);
            cutLine.setAttribute('y2', 400);
            cutLine.setAttribute('stroke', index === 0 ? '#dc3545' : '#28a745');
            cutLine.setAttribute('stroke-width', '4');
            cutLine.setAttribute('stroke-dasharray', '10,5');

            this.elements.backgroundSvg.appendChild(cutLine);
        });
    }

    /**
     * Update moving knife visualization (for Austin's)
     */
    updateMovingKnifeVisualization(data) {
        const knifeX = data.position;

        // Update or create moving knife
        let knife = this.elements.backgroundSvg.querySelector('#moving-knife');
        if (!knife) {
            knife = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            knife.id = 'moving-knife';
            knife.className = 'dynamic-element';
            knife.setAttribute('y1', 0);
            knife.setAttribute('y2', 400);
            knife.setAttribute('stroke', '#ffc107');
            knife.setAttribute('stroke-width', '3');
            this.elements.backgroundSvg.appendChild(knife);
        }

        knife.setAttribute('x1', knifeX);
        knife.setAttribute('x2', knifeX);
    }

    /**
     * Show piece overlays for selection
     */
    showPieceOverlays(pieces) {
        this.clearPieceOverlays();

        pieces.forEach((piece, index) => {
            const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            overlay.className = 'dynamic-element piece-overlay';
            overlay.id = `piece-overlay-${index}`;
            overlay.setAttribute('x', piece.x);
            overlay.setAttribute('y', piece.y || 0);
            overlay.setAttribute('width', piece.width);
            overlay.setAttribute('height', piece.height || 400);
            overlay.setAttribute('fill', piece.color || 'rgba(49,130,206,0.2)');
            overlay.setAttribute('stroke', piece.borderColor || '#3182ce');
            overlay.setAttribute('stroke-width', '3');
            overlay.style.cursor = 'pointer';

            // Add click handler
            overlay.addEventListener('click', () => {
                this.handlePieceSelection(index, piece);
            });

            this.elements.backgroundSvg.appendChild(overlay);
        });
    }

    /**
     * Clear piece overlays
     */
    clearPieceOverlays() {
        this.elements.backgroundSvg.querySelectorAll('.piece-overlay').forEach(overlay => {
            overlay.remove();
        });
    }

    /**
     * Handle piece selection
     */
    handlePieceSelection(pieceIndex, piece) {
        if (!this.currentAlgorithm || typeof this.currentAlgorithm.selectPiece !== 'function') {
            return;
        }

        try {
            this.currentAlgorithm.selectPiece(pieceIndex, this.demoSystem.gameState);
            this.highlightSelectedPiece(pieceIndex);
        } catch (error) {
            console.error('Error selecting piece:', error);
        }
    }

    /**
     * Highlight selected piece
     */
    highlightSelectedPiece(pieceIndex) {
        // Remove existing highlights
        this.elements.backgroundSvg.querySelectorAll('.piece-overlay').forEach(overlay => {
            overlay.classList.remove('selected');
        });

        // Add highlight to selected piece
        const selectedOverlay = document.getElementById(`piece-overlay-${pieceIndex}`);
        if (selectedOverlay) {
            selectedOverlay.classList.add('selected');
            selectedOverlay.setAttribute('stroke-width', '6');
        }
    }

    /**
     * Update step display
     */
    updateStepDisplay(stepData) {
        if (stepData.stepName) {
            this.elements.stepIndicator.textContent =
                `Step ${(stepData.stepIndex || 0) + 1}: ${stepData.stepName}`;
        }
    }

    /**
     * Update instructions
     */
    updateInstructions(stepData) {
        if (stepData.instructions) {
            this.elements.instructions.innerHTML =
                `<strong>Instructions:</strong> ${stepData.instructions}`;
        }
    }

    /**
     * Apply UI updates from step data
     */
    applyUIUpdates(uiUpdates) {
        // Show/hide elements
        if (uiUpdates.showCutSlider !== undefined) {
            this.setControlsEnabled(uiUpdates.showCutSlider);
        }

        if (uiUpdates.showPieceValues) {
            this.updatePieceValueDisplay();
        }

        if (uiUpdates.highlightPlayer) {
            this.clearPlayerHighlights();
            this.highlightPlayerCard(uiUpdates.highlightPlayer);
        }

        if (uiUpdates.showPieceSelection && uiUpdates.pieces) {
            this.showPieceOverlays(uiUpdates.pieces);
        }

        if (uiUpdates.message) {
            this.showStatusMessage(uiUpdates.message);
        }
    }

    /**
     * Update optimal hint display
     */
    updateOptimalHint(optimization) {
        const hintElement = document.getElementById('hint-cut-position-slider');
        if (!hintElement || !optimization) return;

        if (optimization.improvementAvailable) {
            hintElement.style.display = 'block';
            hintElement.innerHTML = `
                <small style="color: #f59e0b;">
                    💡 Tip: ${optimization.improvementSuggestion} for better balance
                </small>
            `;
        } else if (optimization.isOptimal) {
            hintElement.style.display = 'block';
            hintElement.innerHTML = `
                <small style="color: #38a169;">
                    ✓ Excellent! This cut creates well-balanced pieces
                </small>
            `;
        } else {
            hintElement.style.display = 'none';
        }
    }

    /**
     * Show status message
     */
    showStatusMessage(message, type = 'info') {
        // Could implement a toast notification system
        console.log(`Status (${type}):`, message);

        // For now, update instructions with the message
        const currentInstructions = this.elements.instructions.innerHTML;
        this.elements.instructions.innerHTML = `
            ${currentInstructions}
            <div class="status-message ${type}" style="margin-top: 0.5rem; padding: 0.5rem; background: #f0f9ff; border-radius: 4px;">
                ${message}
            </div>
        `;
    }

    /**
     * Show optimal cut applied message
     */
    showOptimalMessage(data) {
        this.showStatusMessage(
            `Cut moved to optimal position (${this.formatNumber(data.position)}%). Improvement: ${this.formatNumber(data.improvement)} points.`,
            'success'
        );
    }

    /**
     * Update piece tooltips
     */
    updatePieceTooltips(data) {
        // Add hover tooltips to piece overlays showing values
        this.elements.backgroundSvg.querySelectorAll('.piece-overlay').forEach((overlay, index) => {
            if (data.analysis && data.analysis.playerValues) {
                const tooltipData = this.formatTooltipData(data.analysis.playerValues, index);
                overlay.setAttribute('title', tooltipData);
            }
        });
    }

    /**
     * Format tooltip data for pieces
     */
    formatTooltipData(playerValues, pieceIndex) {
        let tooltip = `Piece ${pieceIndex + 1}:\n`;
        Object.entries(playerValues).forEach(([playerId, values]) => {
            const playerNum = playerId.replace('player', '');
            const pieceKeys = Object.keys(values);
            if (pieceKeys[pieceIndex]) {
                const value = values[pieceKeys[pieceIndex]];
                tooltip += `Player ${playerNum}: ${this.formatNumber(value)}\n`;
            }
        });
        return tooltip;
    }

    // ===== PART 5: RESULTS DISPLAY AND EXECUTION MANAGEMENT =====

    /**
     * Execute current algorithm
     */
    async executeCurrentAlgorithm() {
        if (!this.currentAlgorithm || !this.demoSystem.gameState.isValid(this.currentAlgorithm.playerCount)) {
            this.showError('Please fix player valuations before executing');
            return;
        }

        try {
            // Update UI for execution
            this.setExecutionState(true);

            // Execute algorithm
            const result = await this.demoSystem.executeCurrentAlgorithm();

            // Show results
            this.showResults(result);

        } catch (error) {
            console.error('Algorithm execution failed:', error);
            this.showError('Algorithm execution failed. Please try again.');
        } finally {
            this.setExecutionState(false);
        }
    }

    /**
     * Step through current algorithm
     */
    async stepThroughCurrentAlgorithm() {
        if (!this.currentAlgorithm) return;

        try {
            const currentStep = this.currentAlgorithm.currentStep || 0;
            const result = await this.currentAlgorithm.executeStepByStep(this.demoSystem.gameState, currentStep);

            this.updateUIFromStepResult(result);

            // Check if algorithm is complete
            if (currentStep >= this.currentAlgorithm.steps.length - 1) {
                this.completeStepExecution();
            }

        } catch (error) {
            console.error('Step execution failed:', error);
            this.showError('Step execution failed');
        }
    }

    /**
     * Reset current algorithm
     */
    async resetCurrentAlgorithm() {
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

            this.showStatusMessage('Algorithm reset to initial state', 'info');

        } catch (error) {
            console.error('Reset failed:', error);
            this.showError('Failed to reset algorithm');
        }
    }

    /**
     * Set execution state (loading, disabled controls, etc.)
     */
    setExecutionState(isExecuting) {
        // Update execute button
        this.elements.executeBtn.disabled = isExecuting;
        this.elements.executeBtn.textContent = isExecuting ? 'Executing...' : 'Execute Algorithm';

        // Disable/enable controls during execution
        this.setControlsEnabled(!isExecuting);

        // Add loading class if needed
        if (isExecuting) {
            this.elements.dynamicControls.classList.add('loading');
        } else {
            this.elements.dynamicControls.classList.remove('loading');
        }
    }

    /**
     * Show algorithm results
     */
    showResults(result) {
        this.elements.resultsSection.classList.add('visible');

        const html = this.formatResultsHTML(result);
        this.elements.resultsContent.innerHTML = html;

        // Update step indicator
        this.elements.stepIndicator.textContent = 'Algorithm Complete';
        this.elements.instructions.innerHTML = '<strong>Results:</strong> Algorithm execution completed successfully.';

        // Disable execution controls
        this.elements.executeBtn.disabled = true;
        this.elements.stepThroughBtn.disabled = true;
    }

    /**
     * Format results for HTML display
     */
    formatResultsHTML(result) {
        let html = '<div class="results-content">';

        // Algorithm summary
        html += `
            <div class="result-section">
                <h4>${result.algorithm.name} Results</h4>
                <div class="algorithm-summary">
                    <p><strong>Type:</strong> ${result.algorithm.type}</p>
                    <p><strong>Players:</strong> ${result.algorithm.playerCount}</p>
                    <p><strong>Execution Time:</strong> ${result.execution.executionTime}ms</p>
                </div>
            </div>
        `;

        // Player allocations
        html += `
            <div class="result-section">
                <h4>Final Allocation</h4>
                <div class="allocation-grid">
        `;

        Object.entries(result.playerValues).forEach(([playerId, value]) => {
            const playerNum = playerId.replace('player', '');
            const piece = result.allocation[playerId];
            html += `
                <div class="allocation-item">
                    <strong>Player ${playerNum}:</strong><br>
                    Gets ${piece} piece<br>
                    Value: ${this.formatNumber(value)}%
                </div>
            `;
        });

        html += '</div></div>';

        // Fairness analysis
        if (result.fairnessAnalysis) {
            html += this.formatFairnessAnalysisHTML(result.fairnessAnalysis);
        }

        // Performance metrics
        if (result.metrics) {
            html += this.formatMetricsHTML(result.metrics);
        }

        // Additional algorithm-specific data
        html += this.formatAlgorithmSpecificData(result);

        html += '</div>';
        return html;
    }

    /**
     * Format fairness analysis for display
     */
    formatFairnessAnalysisHTML(fairnessAnalysis) {
        let html = `
            <div class="result-section">
                <h4>Fairness Analysis</h4>
                <div class="fairness-grid">
        `;

        Object.entries(fairnessAnalysis).forEach(([property, result]) => {
            if (typeof result === 'object' && result.type) {
                const statusIcon = result.satisfied ? '✅' : '❌';
                const statusClass = result.satisfied ? 'success' : 'failure';

                html += `
                    <div class="fairness-item ${statusClass}">
                        ${statusIcon} <strong>${this.capitalizeFirst(property)}:</strong>
                        ${result.satisfied ? 'Satisfied' : 'Not satisfied'}
                    </div>
                `;
            }
        });

        // Overall fairness score
        if (fairnessAnalysis.summary) {
            html += `
                <div class="fairness-summary">
                    <strong>Overall Score:</strong> ${fairnessAnalysis.summary.satisfiedProperties}/${fairnessAnalysis.summary.totalProperties} properties satisfied
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    /**
     * Format performance metrics
     */
    formatMetricsHTML(metrics) {
        return `
            <div class="result-section">
                <h4>Performance Metrics</h4>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <strong>Total Utility:</strong> ${this.formatNumber(metrics.totalUtility)}
                    </div>
                    <div class="metric-item">
                        <strong>Efficiency:</strong> ${this.formatNumber(metrics.efficiency)}%
                    </div>
                    <div class="metric-item">
                        <strong>Fairness Score:</strong> ${this.formatNumber(metrics.fairnessScore)}%
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Format algorithm-specific result data
     */
    formatAlgorithmSpecificData(result) {
        let html = '';

        // Algorithm-specific details
        if (result.cutPosition !== undefined) {
            html += `
                <div class="result-section">
                    <h4>Algorithm Details</h4>
                    <p><strong>Cut Position:</strong> ${this.formatNumber(result.cutPosition)}%</p>
            `;

            if (result.selectedPiece) {
                html += `<p><strong>Chosen Piece:</strong> ${result.selectedPiece}</p>`;
            }

            if (result.optimizationData) {
                const opt = result.optimizationData;
                html += `
                    <p><strong>Cut Quality:</strong> ${this.formatNumber(opt.qualityScore)}/100</p>
                    <p><strong>Optimal:</strong> ${opt.isOptimal ? 'Yes' : 'Could improve'}</p>
                `;
            }

            html += '</div>';
        }

        return html;
    }

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
     * Complete step-through execution
     */
    completeStepExecution() {
        this.elements.stepThroughBtn.disabled = true;
        this.elements.stepThroughBtn.textContent = 'Steps Complete';

        this.showStatusMessage('Step-by-step execution completed!', 'success');
    }

    /**
     * Reset UI to initial state
     */
    resetUIToInitialState() {
        // Reset step indicator and instructions
        this.elements.stepIndicator.textContent = 'Step 1: Setup';
        this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Adjust player valuations and algorithm parameters, then execute the algorithm.';

        // Clear visualizations
        this.clearGameAreaOverlays();
        this.clearPieceOverlays();

        // Reset button states
        this.setButtonStates({ execute: true, stepThrough: true, reset: true });
        this.elements.executeBtn.textContent = 'Execute Algorithm';
        this.elements.stepThroughBtn.textContent = 'Step Through';

        // Clear results
        this.hideResults();

        // Clear player highlights
        this.clearPlayerHighlights();

        // Enable controls
        this.setControlsEnabled(true);
    }

    /**
     * Apply control updates from step results
     */
    applyControlUpdates(controlUpdates) {
        Object.entries(controlUpdates).forEach(([controlId, update]) => {
            const element = document.getElementById(`control-${controlId}`) ||
                document.getElementById(controlId);

            if (element && update.enabled !== undefined) {
                const inputs = element.querySelectorAll('input, button');
                inputs.forEach(input => {
                    input.disabled = !update.enabled;
                });
            }

            if (element && update.value !== undefined) {
                const input = element.querySelector('input');
                if (input) {
                    input.value = update.value;
                }
            }
        });
    }

    /**
     * Apply visualization updates
     */
    applyVisualizationUpdates(visualization) {
        if (visualization.cutLines) {
            visualization.cutLines.forEach(line => {
                this.updateCutLineVisualization(line.position);
            });
        }

        if (visualization.pieces) {
            this.showPieceOverlays(visualization.pieces);
        }

        if (visualization.highlights) {
            visualization.highlights.forEach(highlight => {
                if (highlight.type === 'player') {
                    this.highlightPlayerCard(highlight.target);
                } else if (highlight.type === 'piece') {
                    this.highlightSelectedPiece(highlight.target);
                }
            });
        }
    }

    /**
     * Capitalize first letter of string
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Show error message to user
     */
    showError(message) {
        this.showStatusMessage(message, 'error');
        console.error('UI Error:', message);
    }

    /**
     * Get current UI state for debugging
     */
    getUIDebugInfo() {
        return {
            currentAlgorithm: this.currentAlgorithm?.name || null,
            currentMode: this.currentMode,
            executionState: {
                executeDisabled: this.elements.executeBtn.disabled,
                stepThroughDisabled: this.elements.stepThroughBtn.disabled,
                resetDisabled: this.elements.resetBtn.disabled
            },
            validation: this.demoSystem.gameState.getValidationStatus(),
            resultsVisible: this.elements.resultsSection.classList.contains('visible')
        };
    }
}