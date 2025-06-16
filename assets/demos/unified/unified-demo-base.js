/**
 * Debug Version - Unified Demo Base System
 * 
 * This version includes extensive logging to help debug initialization issues
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

console.log('🔧 BASE_CONFIG loaded:', BASE_CONFIG);

// ===== ALGORITHM INTERFACE =====

class AlgorithmInterface {
    constructor() {
        console.log('🔧 AlgorithmInterface constructor called');
        this.name = 'Unknown Algorithm';
        this.description = 'No description provided';
        this.playerCount = 2;
        this.type = 'discrete'; // 'discrete' or 'continuous'
        this.properties = []; // e.g., ['proportional', 'envy-free']
    }

    // ===== REQUIRED METHODS =====
    initialize() {
        console.log('⚠️ Algorithm must implement initialize() method');
        throw new Error('Algorithm must implement initialize() method');
    }

    execute() {
        console.log('⚠️ Algorithm must implement execute() method');
        throw new Error('Algorithm must implement execute() method');
    }

    reset() {
        console.log('⚠️ Algorithm must implement reset() method');
        throw new Error('Algorithm must implement reset() method');
    }

    // ===== OPTIONAL METHODS =====
    handleCutSliderChange() {
        console.log('🔧 Default handleCutSliderChange called');
    }

    handlePlayerValueChange() {
        console.log('🔧 Default handlePlayerValueChange called');
    }

    handlePieceClick(pieceId) {
        console.log('🔧 Default handlePieceClick called with:', pieceId);
    }

    getRegions() {
        console.log('🔧 Default getRegions called');
        return {};
    }

    getUIConfig() {
        console.log('🔧 Default getUIConfig called');
        return {
            showCutSlider: true,
            showPlayerValues: true,
            enablePieceSelection: false
        };
    }

    // ===== UTILITY METHODS FOR ALGORITHMS =====
    updateElement(elementId, content) {
        console.log(`🔧 updateElement: ${elementId} = "${content}"`);
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        } else {
            console.warn(`⚠️ Element not found: ${elementId}`);
        }
    }

    updateElementHTML(elementId, html) {
        console.log(`🔧 updateElementHTML: ${elementId}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`⚠️ Element not found: ${elementId}`);
        }
    }

    toggleElement(elementId, show) {
        console.log(`🔧 toggleElement: ${elementId} = ${show}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        } else {
            console.warn(`⚠️ Element not found: ${elementId}`);
        }
    }

    addClass(elementId, className) {
        console.log(`🔧 addClass: ${elementId}.${className}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        } else {
            console.warn(`⚠️ Element not found: ${elementId}`);
        }
    }

    removeClass(elementId, className) {
        console.log(`🔧 removeClass: ${elementId}.${className}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        } else {
            console.warn(`⚠️ Element not found: ${elementId}`);
        }
    }
}

console.log('✅ AlgorithmInterface class defined');

// ===== ALGORITHM REGISTRY =====

class AlgorithmRegistry {
    constructor() {
        console.log('🔧 AlgorithmRegistry constructor called');
        this.algorithms = new Map();
        this.currentAlgorithm = null;
    }

    register(id, algorithm) {
        console.log(`🚀 Registering algorithm: ${id}`, algorithm);

        if (!(algorithm instanceof AlgorithmInterface)) {
            console.warn(`⚠️ Algorithm ${id} does not extend AlgorithmInterface`);
        }

        this.algorithms.set(id, algorithm);
        console.log(`✅ Registered algorithm: ${id}`);
        console.log(`📊 Total algorithms registered: ${this.algorithms.size}`);

        // Update selector dropdown
        this.updateAlgorithmSelector();
    }

    get(id) {
        console.log(`🔍 Getting algorithm: ${id}`);
        return this.algorithms.get(id);
    }

    getAll() {
        console.log(`📋 Getting all algorithms (${this.algorithms.size} total)`);
        return Array.from(this.algorithms.entries());
    }

    switchTo(id) {
        console.log(`🔄 Switching to algorithm: ${id}`);
        const algorithm = this.algorithms.get(id);
        if (!algorithm) {
            console.error(`❌ Algorithm ${id} not found`);
            return false;
        }

        this.currentAlgorithm = algorithm;
        console.log(`✅ Switched to: ${algorithm.name}`);
        return true;
    }

    getCurrent() {
        console.log('🔍 Getting current algorithm:', this.currentAlgorithm?.name || 'none');
        return this.currentAlgorithm;
    }

    updateAlgorithmSelector() {
        console.log('🔧 Updating algorithm selector');
        const selector = document.getElementById('algorithm-selector');
        if (!selector) {
            console.warn('⚠️ Algorithm selector element not found');
            return;
        }

        // Clear existing options
        selector.innerHTML = '';
        console.log('🧹 Cleared existing options');

        // Add options for each registered algorithm
        let optionCount = 0;
        for (const [id, algorithm] of this.algorithms) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = algorithm.name;
            selector.appendChild(option);
            optionCount++;
            console.log(`➕ Added option: ${id} - ${algorithm.name}`);
        }

        console.log(`✅ Added ${optionCount} options to selector`);
    }
}

console.log('✅ AlgorithmRegistry class defined');

// ===== MAIN DEMO SYSTEM =====

class UnifiedDemoSystem {
    constructor() {
        console.log('🚀 UnifiedDemoSystem constructor called');
        this.registry = new AlgorithmRegistry();
        this.isInitialized = false;
        this.eventCleanupFunctions = [];
        this.initStartTime = Date.now();
    }

    async initialize() {
        console.log('🚀 Initializing Unified Demo System...');

        try {
            console.log('🔧 Setting up base event listeners...');
            this.initializeBaseEventListeners();

            console.log('⏳ Waiting for algorithms to register...');
            await this.waitForAlgorithms();

            this.isInitialized = true;
            const initTime = Date.now() - this.initStartTime;
            console.log(`✅ Demo system ready! (took ${initTime}ms)`);

            // Update UI to show ready state
            this.updateSystemStatus('ready');

        } catch (error) {
            console.error('❌ Failed to initialize demo system:', error);
            this.updateSystemStatus('error', error.message);
            throw error;
        }
    }

    updateSystemStatus(status, message = '') {
        console.log(`📊 System status: ${status}`, message);

        const stepIndicator = document.getElementById('step-indicator');
        const instructions = document.getElementById('instructions');

        switch (status) {
            case 'loading':
                if (stepIndicator) stepIndicator.textContent = 'Initializing Demo System...';
                if (instructions) instructions.innerHTML = 'Loading algorithms and setting up interface...';
                break;
            case 'waiting':
                if (stepIndicator) stepIndicator.textContent = 'Waiting for Algorithms...';
                if (instructions) instructions.innerHTML = 'Algorithms are being loaded and registered...';
                break;
            case 'ready':
                if (stepIndicator) stepIndicator.textContent = 'Demo System Ready';
                if (instructions) instructions.innerHTML = 'Select an algorithm from the dropdown above to begin.';
                break;
            case 'error':
                if (stepIndicator) stepIndicator.textContent = 'System Error';
                if (instructions) instructions.innerHTML = `<strong>Error:</strong> ${message}`;
                break;
        }
    }

    async waitForAlgorithms() {
        console.log('⏳ Starting algorithm wait loop...');
        this.updateSystemStatus('waiting');

        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 5 seconds max wait

            const checkAlgorithms = () => {
                attempts++;
                console.log(`🔄 Check ${attempts}: ${this.registry.algorithms.size} algorithms registered`);

                if (this.registry.algorithms.size > 0) {
                    console.log('✅ Found algorithms, proceeding...');

                    // Switch to the first available algorithm
                    const firstAlgorithm = this.registry.algorithms.keys().next().value;
                    console.log(`🎯 Switching to first algorithm: ${firstAlgorithm}`);
                    this.switchAlgorithm(firstAlgorithm);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    const error = new Error(`No algorithms registered after ${maxAttempts} attempts`);
                    console.error('❌ Timeout waiting for algorithms:', error);
                    reject(error);
                } else {
                    setTimeout(checkAlgorithms, 50);
                }
            };

            checkAlgorithms();
        });
    }

    switchAlgorithm(algorithmId) {
        console.log(`🔄 Switching to algorithm: ${algorithmId}`);

        // Cleanup current algorithm
        if (this.registry.getCurrent()) {
            console.log('🧹 Cleaning up current algorithm');
            this.cleanupAlgorithmEventListeners();
        }

        // Switch to new algorithm
        if (!this.registry.switchTo(algorithmId)) {
            console.error(`❌ Failed to switch to algorithm: ${algorithmId}`);
            return;
        }

        const algorithm = this.registry.getCurrent();
        console.log(`✅ Switched to: ${algorithm.name}`);

        // Update UI to reflect new algorithm
        console.log('🔧 Updating algorithm info display...');
        this.updateAlgorithmInfoDisplay(algorithm);

        console.log('🔧 Setting up algorithm event listeners...');
        this.setupAlgorithmEventListeners(algorithm);

        // Initialize the algorithm
        console.log('🚀 Initializing algorithm...');
        try {
            algorithm.initialize();
            console.log('✅ Algorithm initialized successfully');
        } catch (error) {
            console.error('❌ Algorithm initialization failed:', error);
        }
    }

    updateAlgorithmInfoDisplay(algorithm) {
        console.log('🔧 Updating algorithm info display for:', algorithm.name);

        const nameElement = document.getElementById('algorithm-name');
        if (nameElement) {
            nameElement.textContent = algorithm.name;
            console.log('✅ Updated algorithm name');
        } else {
            console.warn('⚠️ Algorithm name element not found');
        }

        const metaElement = document.getElementById('algorithm-meta');
        if (metaElement) {
            metaElement.innerHTML = `
                <span class="meta-badge players-badge">${algorithm.playerCount} Players</span>
                <span class="meta-badge complexity-badge">${algorithm.type}</span>
            `;
            console.log('✅ Updated algorithm meta');
        } else {
            console.warn('⚠️ Algorithm meta element not found');
        }

        // Update algorithm selector
        const selector = document.getElementById('algorithm-selector');
        if (selector) {
            const algorithmId = [...this.registry.algorithms.entries()]
                .find(([id, alg]) => alg === algorithm)?.[0];
            if (algorithmId) {
                selector.value = algorithmId;
                console.log('✅ Updated selector value');
            }
        } else {
            console.warn('⚠️ Algorithm selector element not found');
        }
    }

    initializeBaseEventListeners() {
        console.log('🔧 Setting up base event listeners...');

        // Algorithm selector
        const algorithmSelector = document.getElementById('algorithm-selector');
        if (algorithmSelector) {
            algorithmSelector.addEventListener('change', (e) => {
                console.log('📝 Algorithm selector changed to:', e.target.value);
                this.switchAlgorithm(e.target.value);
            });
            console.log('✅ Algorithm selector listener added');
        } else {
            console.warn('⚠️ Algorithm selector not found');
        }

        // Main action buttons
        const makeCutBtn = document.getElementById('make-cut-btn');
        if (makeCutBtn) {
            makeCutBtn.addEventListener('click', () => {
                console.log('🖱️ Make cut button clicked');
                const algorithm = this.registry.getCurrent();
                if (algorithm && algorithm.execute) {
                    try {
                        algorithm.execute();
                        console.log('✅ Algorithm execute completed');
                    } catch (error) {
                        console.error('❌ Algorithm execute failed:', error);
                    }
                } else {
                    console.warn('⚠️ No current algorithm or execute method');
                }
            });
            console.log('✅ Make cut button listener added');
        } else {
            console.warn('⚠️ Make cut button not found');
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('🖱️ Reset button clicked');
                const algorithm = this.registry.getCurrent();
                if (algorithm && algorithm.reset) {
                    try {
                        algorithm.reset();
                        console.log('✅ Algorithm reset completed');
                    } catch (error) {
                        console.error('❌ Algorithm reset failed:', error);
                    }
                } else {
                    console.warn('⚠️ No current algorithm or reset method');
                }
            });
            console.log('✅ Reset button listener added');
        } else {
            console.warn('⚠️ Reset button not found');
        }

        console.log('✅ Base event listeners setup complete');
    }

    setupAlgorithmEventListeners(algorithm) {
        console.log('🔧 Setting up algorithm-specific event listeners...');
        const cleanupFunctions = [];

        // Cut slider
        const cutSlider = document.getElementById('cut-slider');
        if (cutSlider && algorithm.handleCutSliderChange) {
            const handler = () => {
                console.log('🎚️ Cut slider changed');
                algorithm.handleCutSliderChange();
            };
            cutSlider.addEventListener('input', handler);
            cleanupFunctions.push(() => cutSlider.removeEventListener('input', handler));
            console.log('✅ Cut slider listener added');
        }

        // Player value inputs
        if (algorithm.getRegions && algorithm.handlePlayerValueChange) {
            const regions = algorithm.getRegions();
            const colors = Object.keys(regions);
            console.log('🎨 Setting up player value listeners for colors:', colors);

            colors.forEach(color => {
                ['p1', 'p2'].forEach(player => {
                    const input = document.getElementById(`${player}-${color}`);
                    if (input) {
                        const handler = () => {
                            console.log(`🎨 Player value changed: ${player}-${color}`);
                            algorithm.handlePlayerValueChange();
                        };
                        input.addEventListener('input', handler);
                        cleanupFunctions.push(() => input.removeEventListener('input', handler));
                    }
                });
            });
            console.log('✅ Player value listeners added');
        }

        // Piece selection
        if (algorithm.handlePieceClick) {
            const leftPiece = document.getElementById('left-piece');
            const rightPiece = document.getElementById('right-piece');

            if (leftPiece) {
                const handler = () => {
                    console.log('🖱️ Left piece clicked');
                    algorithm.handlePieceClick('left');
                };
                leftPiece.addEventListener('click', handler);
                cleanupFunctions.push(() => leftPiece.removeEventListener('click', handler));
            }

            if (rightPiece) {
                const handler = () => {
                    console.log('🖱️ Right piece clicked');
                    algorithm.handlePieceClick('right');
                };
                rightPiece.addEventListener('click', handler);
                cleanupFunctions.push(() => rightPiece.removeEventListener('click', handler));
            }
            console.log('✅ Piece click listeners added');
        }

        // Store cleanup functions
        this.eventCleanupFunctions = cleanupFunctions;
        console.log(`✅ Algorithm event listeners setup complete (${cleanupFunctions.length} listeners)`);
    }

    cleanupAlgorithmEventListeners() {
        console.log(`🧹 Cleaning up ${this.eventCleanupFunctions.length} event listeners`);
        this.eventCleanupFunctions.forEach(cleanup => cleanup());
        this.eventCleanupFunctions = [];
        console.log('✅ Event listener cleanup complete');
    }

    getRegistry() {
        return this.registry;
    }
}

console.log('✅ UnifiedDemoSystem class defined');

// ===== GLOBAL SYSTEM INSTANCE =====

let demoSystem = null;

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 DOM loaded, initializing demo system...');

    try {
        demoSystem = new UnifiedDemoSystem();
        demoSystem.updateSystemStatus('loading');

        // Make system globally accessible for algorithms to register
        window.DemoSystem = demoSystem;
        window.AlgorithmInterface = AlgorithmInterface;
        window.BASE_CONFIG = BASE_CONFIG;

        console.log('🌐 Global objects exposed:', {
            DemoSystem: !!window.DemoSystem,
            AlgorithmInterface: !!window.AlgorithmInterface,
            BASE_CONFIG: !!window.BASE_CONFIG
        });

        await demoSystem.initialize();

        // Debug access
        window.debugDemo = {
            system: demoSystem,
            registry: demoSystem.getRegistry(),
            getCurrentAlgorithm: () => demoSystem.getRegistry().getCurrent(),
            forceRegisterTestAlgorithm: () => {
                console.log('🧪 Registering test algorithm...');
                const testAlgorithm = new AlgorithmInterface();
                testAlgorithm.name = 'Test Algorithm';
                testAlgorithm.initialize = () => console.log('Test algorithm initialized');
                testAlgorithm.execute = () => console.log('Test algorithm executed');
                testAlgorithm.reset = () => console.log('Test algorithm reset');
                demoSystem.getRegistry().register('test', testAlgorithm);
            }
        };

        console.log('🔧 Debug tools available at window.debugDemo');

    } catch (error) {
        console.error('❌ Failed to initialize demo system:', error);

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
                    <button onclick="window.debugDemo?.forceRegisterTestAlgorithm()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3182ce; color: white; border: none; border-radius: 4px;">
                        Register Test Algorithm
                    </button>
                </div>
            `;
        }
    }
});

console.log('✅ Demo system setup complete');