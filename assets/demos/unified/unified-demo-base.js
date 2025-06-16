/**
 * Unified Fair Division Demo - Base System
 * 
 * This file contains the core demo infrastructure that manages algorithm
 * registration, UI coordination, and event handling. Individual algorithms
 * are loaded separately and register themselves with this system.
 */


// ===== BASE CONFIGURATION =====

const BASE_CONFIG = {
    CANVAS: { WIDTH: 800, HEIGHT: 400 },
    VALIDATION: { REQUIRED_TOTAL: 100, MIN_VALUE: 0, MAX_VALUE: 100 },
    TIMING: { SELECTION_DELAY: 1000 },

    // UI Element IDs that algorithms can interact with
    UI_ELEMENTS: {
        STEP_INDICATOR: 'step-indicator',
        INSTRUCTIONS: 'instructions',
        CUT_LINE: 'cut-line',
        CUT_SLIDER: 'cut-slider',
        CUT_POSITION: 'cut-position',
        LEFT_PIECE: 'left-piece',
        RIGHT_PIECE: 'right-piece',
        MAKE_CUT_BTN: 'make-cut-btn',
        RESET_BTN: 'reset-btn',
        WARNING: 'warning',
        RESULTS: 'results'
    }
};

// ===== ALGORITHM INTERFACE =====

/**
 * Base class that all algorithms should extend or implement
 * This defines the contract between the demo system and individual algorithms
 */
class AlgorithmInterface {
    constructor() {
        this.name = 'Unknown Algorithm';
        this.description = 'No description provided';
        this.playerCount = 2;
        this.type = 'discrete'; // 'discrete' or 'continuous'
        this.properties = []; // e.g., ['proportional', 'envy-free']
    }

    // ===== REQUIRED METHODS =====

    /**
     * Initialize the algorithm state and UI
     */
    initialize() {
        throw new Error('Algorithm must implement initialize() method');
    }

    /**
     * Execute the main algorithm action (e.g., make cut, next step)
     */
    execute() {
        throw new Error('Algorithm must implement execute() method');
    }

    /**
     * Reset algorithm to initial state
     */
    reset() {
        throw new Error('Algorithm must implement reset() method');
    }

    // ===== OPTIONAL METHODS =====

    /**
     * Handle cut slider changes (if algorithm uses cuts)
     */
    handleCutSliderChange() {
        // Default: do nothing
    }

    /**
     * Handle player valuation input changes
     */
    handlePlayerValueChange() {
        // Default: do nothing
    }

    /**
     * Handle piece selection clicks
     * @param {string} pieceId - identifier for the clicked piece
     */
    handlePieceClick(pieceId) {
        // Default: do nothing
    }

    /**
     * Get algorithm-specific regions/colors
     * @returns {Object} regions configuration
     */
    getRegions() {
        return {};
    }

    /**
     * Get algorithm-specific UI configuration
     * @returns {Object} UI configuration
     */
    getUIConfig() {
        return {
            showCutSlider: true,
            showPlayerValues: true,
            enablePieceSelection: false
        };
    }

    // ===== UTILITY METHODS FOR ALGORITHMS =====

    /**
     * Update an element's text content safely
     */
    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Update an element's HTML content safely
     */
    updateElementHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }

    /**
     * Show or hide an element
     */
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Add a CSS class to an element
     */
    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Remove a CSS class from an element
     */
    removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }
}

// ===== ALGORITHM REGISTRY =====

class AlgorithmRegistry {
    constructor() {
        this.algorithms = new Map();
        this.currentAlgorithm = null;
    }

    /**
     * Register a new algorithm
     * @param {string} id - unique identifier for the algorithm
     * @param {AlgorithmInterface} algorithm - algorithm instance
     */
    register(id, algorithm) {
        if (!(algorithm instanceof AlgorithmInterface)) {
            console.warn(`Algorithm ${id} does not extend AlgorithmInterface`);
        }

        this.algorithms.set(id, algorithm);
        console.log(`Registered algorithm: ${id}`);

        // Update selector dropdown
        this.updateAlgorithmSelector();
    }

    /**
     * Get an algorithm by ID
     */
    get(id) {
        return this.algorithms.get(id);
    }

    /**
     * Get all registered algorithms
     */
    getAll() {
        return Array.from(this.algorithms.entries());
    }

    /**
     * Switch to a different algorithm
     */
    switchTo(id) {
        const algorithm = this.algorithms.get(id);
        if (!algorithm) {
            console.error(`Algorithm ${id} not found`);
            return false;
        }

        this.currentAlgorithm = algorithm;
        return true;
    }

    /**
     * Get the currently active algorithm
     */
    getCurrent() {
        return this.currentAlgorithm;
    }

    /**
     * Update the algorithm selector dropdown
     */
    updateAlgorithmSelector() {
        const selector = document.getElementById('algorithm-selector');
        if (!selector) return;

        // Clear existing options
        selector.innerHTML = '';

        // Add options for each registered algorithm
        for (const [id, algorithm] of this.algorithms) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = algorithm.name;
            selector.appendChild(option);
        }
    }
}

// ===== MAIN DEMO SYSTEM =====

class UnifiedDemoSystem {
    constructor() {
        this.registry = new AlgorithmRegistry();
        this.isInitialized = false;
        this.eventCleanupFunctions = [];
    }

    async initialize() {
        console.log('Initializing Unified Demo System...');

        this.initializeBaseEventListeners();

        // Wait for algorithms to register themselves
        await this.waitForAlgorithms();

        this.isInitialized = true;
        console.log('Demo system ready!');
    }

    /**
     * Wait for at least one algorithm to be registered
     */
    async waitForAlgorithms() {
        return new Promise((resolve) => {
            const checkAlgorithms = () => {
                if (this.registry.algorithms.size > 0) {
                    // Switch to the first available algorithm
                    const firstAlgorithm = this.registry.algorithms.keys().next().value;
                    this.switchAlgorithm(firstAlgorithm);
                    resolve();
                } else {
                    setTimeout(checkAlgorithms, 50);
                }
            };
            checkAlgorithms();
        });
    }

    /**
     * Switch to a different algorithm
     */
    switchAlgorithm(algorithmId) {
        console.log(`Switching to algorithm: ${algorithmId}`);

        // Cleanup current algorithm
        if (this.registry.getCurrent()) {
            this.cleanupAlgorithmEventListeners();
        }

        // Switch to new algorithm
        if (!this.registry.switchTo(algorithmId)) {
            return;
        }

        const algorithm = this.registry.getCurrent();

        // Update UI to reflect new algorithm
        this.updateAlgorithmInfoDisplay(algorithm);
        this.setupAlgorithmEventListeners(algorithm);

        // Initialize the algorithm
        algorithm.initialize();
    }

    /**
     * Update the algorithm information display
     */
    updateAlgorithmInfoDisplay(algorithm) {
        const nameElement = document.getElementById('algorithm-name');
        if (nameElement) {
            nameElement.textContent = algorithm.name;
        }

        const metaElement = document.getElementById('algorithm-meta');
        if (metaElement) {
            metaElement.innerHTML = `
                <span class="meta-badge players-badge">${algorithm.playerCount} Players</span>
                <span class="meta-badge complexity-badge">${algorithm.type}</span>
            `;
        }

        // Update algorithm selector
        const selector = document.getElementById('algorithm-selector');
        if (selector) {
            const algorithmId = [...this.registry.algorithms.entries()]
                .find(([id, alg]) => alg === algorithm)?.[0];
            if (algorithmId) {
                selector.value = algorithmId;
            }
        }
    }

    /**
     * Set up base event listeners that don't change between algorithms
     */
    initializeBaseEventListeners() {
        // Algorithm selector
        const algorithmSelector = document.getElementById('algorithm-selector');
        if (algorithmSelector) {
            algorithmSelector.addEventListener('change', (e) => {
                this.switchAlgorithm(e.target.value);
            });
        }

        // Main action buttons
        const makeCutBtn = document.getElementById('make-cut-btn');
        if (makeCutBtn) {
            makeCutBtn.addEventListener('click', () => {
                const algorithm = this.registry.getCurrent();
                if (algorithm && algorithm.execute) {
                    algorithm.execute();
                }
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const algorithm = this.registry.getCurrent();
                if (algorithm && algorithm.reset) {
                    algorithm.reset();
                }
            });
        }
    }

    /**
     * Set up algorithm-specific event listeners
     */
    setupAlgorithmEventListeners(algorithm) {
        const cleanupFunctions = [];

        // Cut slider
        const cutSlider = document.getElementById('cut-slider');
        if (cutSlider && algorithm.handleCutSliderChange) {
            const handler = () => algorithm.handleCutSliderChange();
            cutSlider.addEventListener('input', handler);
            cleanupFunctions.push(() => cutSlider.removeEventListener('input', handler));
        }

        // Player value inputs
        if (algorithm.getRegions && algorithm.handlePlayerValueChange) {
            const regions = algorithm.getRegions();
            const colors = Object.keys(regions);

            colors.forEach(color => {
                ['p1', 'p2'].forEach(player => {
                    const input = document.getElementById(`${player}-${color}`);
                    if (input) {
                        const handler = () => algorithm.handlePlayerValueChange();
                        input.addEventListener('input', handler);
                        cleanupFunctions.push(() => input.removeEventListener('input', handler));
                    }
                });
            });
        }

        // Piece selection
        if (algorithm.handlePieceClick) {
            const leftPiece = document.getElementById('left-piece');
            const rightPiece = document.getElementById('right-piece');

            if (leftPiece) {
                const handler = () => algorithm.handlePieceClick('left');
                leftPiece.addEventListener('click', handler);
                cleanupFunctions.push(() => leftPiece.removeEventListener('click', handler));
            }

            if (rightPiece) {
                const handler = () => algorithm.handlePieceClick('right');
                rightPiece.addEventListener('click', handler);
                cleanupFunctions.push(() => rightPiece.removeEventListener('click', handler));
            }
        }

        // Store cleanup functions
        this.eventCleanupFunctions = cleanupFunctions;
    }

    /**
     * Clean up algorithm-specific event listeners
     */
    cleanupAlgorithmEventListeners() {
        this.eventCleanupFunctions.forEach(cleanup => cleanup());
        this.eventCleanupFunctions = [];
    }

    /**
     * Get the algorithm registry (for external access)
     */
    getRegistry() {
        return this.registry;
    }
}

// ===== GLOBAL SYSTEM INSTANCE =====

let demoSystem = null;

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM loaded, initializing demo system...');

    try {
        demoSystem = new UnifiedDemoSystem();

        // Make system globally accessible for algorithms to register
        window.DemoSystem = demoSystem;
        window.AlgorithmInterface = AlgorithmInterface;
        window.BASE_CONFIG = BASE_CONFIG;

        await demoSystem.initialize();

        // Debug access
        window.debugDemo = {
            system: demoSystem,
            registry: demoSystem.getRegistry(),
            getCurrentAlgorithm: () => demoSystem.getRegistry().getCurrent()
        };

    } catch (error) {
        console.error('Failed to initialize demo system:', error);

        const container = document.querySelector('.demo-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #c53030;">
                    <h3>Failed to Initialize Demo</h3>
                    <p>There was an error loading the demo system.</p>
                    <details style="margin-top: 1rem;">
                        <summary>Error Details</summary>
                        <pre style="text-align: left; background: #f7fafc; padding: 1rem; margin-top: 0.5rem;">${error.message}</pre>
                    </details>
                </div>
            `;
        }
    }
});