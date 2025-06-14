/**
 * Unified Fair Division Algorithm Demo - Core System
 * 
 * This is the main system orchestrator that manages the entire unified demo.
 * It coordinates between algorithms, state management, UI, and comparison features.
 */

class UnifiedDemoSystem {
    constructor() {
        // Core components
        this.gameState = null;
        this.uiManager = null;
        this.comparisonEngine = null;

        // Algorithm registry
        this.algorithms = new Map();
        this.currentAlgorithm = null;

        // System state
        this.isInitialized = false;
        this.currentMode = 'single'; // 'single' or 'comparison'

        // Configuration
        this.config = {
            maxHistoryEntries: 10,
            defaultAnimationSpeed: 1.0,
            autoSaveResults: true,
            debugMode: false
        };

        // Event system for loose coupling
        this.eventListeners = new Map();

        console.log('UnifiedDemoSystem: Constructor called');
    }

    /**
     * Initialize the entire system
     * This is the main entry point called when the page loads
     */
    async initialize() {
        try {
            console.log('UnifiedDemoSystem: Starting initialization...');

            // Initialize in specific order to handle dependencies
            await this.initializeGameState();
            await this.initializeAlgorithms();
            await this.initializeUIManager();

            // Set up event listeners
            this.setupEventListeners();

            this.isInitialized = true;
            this.emit('system:initialized');

            console.log('UnifiedDemoSystem: Initialization complete');

        } catch (error) {
            console.error('UnifiedDemoSystem: Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize the unified game state
     */
    async initializeGameState() {
        console.log('UnifiedDemoSystem: Initializing game state...');
        this.gameState = new UnifiedGameState();
        this.emit('gamestate:initialized');
    }

    /**
     * Initialize and register all available algorithms
     */
    async initializeAlgorithms() {
        console.log('UnifiedDemoSystem: Initializing algorithms...');

        this.registerAlgorithm(createDivideAndChooseAlgorithm());

        console.log(`UnifiedDemoSystem: Registered ${this.algorithms.size} algorithms`);
        this.emit('algorithms:initialized', { count: this.algorithms.size });
    }

    /**
 * Initialize the UI Manager
 */
    async initializeUIManager() {
        console.log('UnifiedDemoSystem: Initializing UI Manager...');

        // Create the real UI manager instead of placeholder
        this.uiManager = new UnifiedUIManager(this);
        await this.uiManager.initialize();

        this.emit('ui:initialized');
    }

    /**
     * Initialize the Comparison Engine
     */
    async initializeComparisonEngine() {
        console.log('UnifiedDemoSystem: Skipping initializing of Comparison Engine...');
    }

    /**
     * Register an algorithm with the system
     */
    registerAlgorithm(algorithm) {
        if (!algorithm.id || !algorithm.name) {
            throw new Error('Algorithm must have id and name properties');
        }

        this.algorithms.set(algorithm.id, algorithm);
        console.log(`UnifiedDemoSystem: Registered algorithm: ${algorithm.name}`);

        this.emit('algorithm:registered', { algorithm });
    }

    /**
     * Switch to a specific algorithm
     */
    async switchAlgorithm(algorithmId) {
        if (!this.algorithms.has(algorithmId)) {
            throw new Error(`Algorithm not found: ${algorithmId}`);
        }

        const previousAlgorithm = this.currentAlgorithm;
        this.currentAlgorithm = this.algorithms.get(algorithmId);

        console.log(`UnifiedDemoSystem: Switched to algorithm: ${this.currentAlgorithm.name}`);

        // Initialize the new algorithm
        await this.currentAlgorithm.initialize(this.gameState);

        this.emit('algorithm:switched', {
            previous: previousAlgorithm,
            current: this.currentAlgorithm
        });
    }

    /**
     * Execute the current algorithm
     */
    async executeCurrentAlgorithm() {
        if (!this.currentAlgorithm) {
            throw new Error('No algorithm selected');
        }

        if (!this.gameState.isValid()) {
            throw new Error('Game state is not valid for execution');
        }

        console.log(`UnifiedDemoSystem: Executing ${this.currentAlgorithm.name}`);

        const result = await this.currentAlgorithm.execute(this.gameState);
        this.gameState.currentResult = result;

        this.emit('algorithm:executed', { result });

        return result;
    }

    /**
     * Switch between single and comparison modes
     */
    setMode(mode) {
        if (!['single', 'comparison'].includes(mode)) {
            throw new Error(`Invalid mode: ${mode}`);
        }

        const previousMode = this.currentMode;
        this.currentMode = mode;

        if (this.uiManager) {
            this.uiManager.setMode(mode);
        }

        this.emit('mode:changed', { previous: previousMode, current: mode });
    }

    /**
     * Get system status and statistics
     */
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            currentMode: this.currentMode,
            currentAlgorithm: this.currentAlgorithm?.name || null,
            algorithmCount: this.algorithms.size,
            availableAlgorithms: Array.from(this.algorithms.values()).map(a => ({
                id: a.id,
                name: a.name,
                playerCount: a.playerCount,
                type: a.type
            }))
        };
    }

    /**
     * Event system implementation for loose coupling
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event listener error for ${event}:`, error);
                }
            });
        }

        if (this.config.debugMode) {
            console.log(`Event emitted: ${event}`, data);
        }
    }

    /**
     * Set up system-wide event listeners
     */
    setupEventListeners() {
        // Listen to our own events for logging and debugging
        this.on('system:initialized', () => {
            console.log('System ready for user interaction');
        });

        this.on('algorithm:switched', (data) => {
            if (this.uiManager) {
                this.uiManager.handleAlgorithmSwitch(data.current);
            }
        });
    }

    /**
     * Handle initialization errors gracefully
     */
    handleInitializationError(error) {
        console.error('System initialization failed:', error);

        // Try to show user-friendly error message
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <h3>Failed to Initialize Demo</h3>
                    <p>There was an error loading the fair division demo. Please refresh the page and try again.</p>
                    <details>
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    /**
     * Cleanup method for when the system needs to be destroyed
     */
    destroy() {
        console.log('UnifiedDemoSystem: Destroying system...');

        // Clear event listeners
        this.eventListeners.clear();

        // Reset state
        this.algorithms.clear();
        this.currentAlgorithm = null;
        this.gameState = null;
        this.isInitialized = false;

        console.log('UnifiedDemoSystem: System destroyed');
    }
}

// Global system instance
let unifiedDemo = null;

/**
 * Initialize the system when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async function () {
    try {
        console.log('DOM loaded, initializing demo system...');
        unifiedDemo = new UnifiedDemoSystem();
        await unifiedDemo.initialize();

        // Make system available globally for debugging
        window.unifiedDemo = unifiedDemo;

    } catch (error) {
        console.error('Failed to initialize unified demo:', error);
    }
});
