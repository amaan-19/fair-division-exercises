/**
 * Base Algorithm Interface
 * 
 * This defines the standard interface that all fair division algorithms must implement.
 * It provides common functionality and enforces a consistent API across all algorithms.
 */

class BaseAlgorithm {
    constructor(config) {
        // Validate required configuration
        this.validateConfig(config);

        // Core algorithm metadata
        this.id = config.id;
        this.name = config.name;
        this.description = config.description || '';
        this.playerCount = config.playerCount;
        this.type = config.type; // 'discrete' or 'continuous'
        this.properties = config.properties || [];

        // Algorithm complexity and timing
        this.complexity = config.complexity || 'medium'; // 'low', 'medium', 'high'
        this.estimatedDuration = config.estimatedDuration || 5000; // milliseconds

        // Step definitions
        this.steps = config.steps || ['setup', 'execute', 'complete'];
        this.currentStep = 0;

        // Execution state
        this.isInitialized = false;
        this.isExecuting = false;
        this.executionStartTime = null;

        // Event system for algorithm-specific events
        this.eventListeners = new Map();

        // Cache for expensive calculations
        this.calculationCache = new Map();

        console.log(`BaseAlgorithm: Created ${this.name} (${this.id})`);
    }

    /**
     * Validate algorithm configuration
     */
    validateConfig(config) {
        const required = ['id', 'name', 'playerCount', 'type'];
        const missing = required.filter(field => !config[field]);

        if (missing.length > 0) {
            throw new Error(`Algorithm config missing required fields: ${missing.join(', ')}`);
        }

        if (!['discrete', 'continuous'].includes(config.type)) {
            throw new Error(`Algorithm type must be 'discrete' or 'continuous', got: ${config.type}`);
        }

        if (config.playerCount < 2 || config.playerCount > 4) {
            throw new Error(`Player count must be between 2-4, got: ${config.playerCount}`);
        }
    }

    // ===== ABSTRACT METHODS (Must be implemented by subclasses) =====

    /**
     * Initialize algorithm with game state
     * Called when algorithm is selected or state is reset
     */
    async initialize(gameState) {
        throw new Error(`${this.name}: initialize() method must be implemented`);
    }

    /**
     * Execute the complete algorithm
     * Returns the final allocation result
     */
    async execute(gameState) {
        throw new Error(`${this.name}: execute() method must be implemented`);
    }

    /**
     * Execute a single step of the algorithm
     * Used for step-by-step execution and animation
     */
    async executeStep(stepIndex, gameState) {
        throw new Error(`${this.name}: executeStep() method must be implemented`);
    }

    /**
     * Validate that inputs are suitable for this algorithm
     */
    validateInputs(gameState) {
        throw new Error(`${this.name}: validateInputs() method must be implemented`);
    }

    /**
     * Get UI controls required for this algorithm
     */
    getRequiredControls() {
        throw new Error(`${this.name}: getRequiredControls() method must be implemented`);
    }

    // ===== COMMON IMPLEMENTATION METHODS =====

    /**
     * Standard initialization workflow
     */
    async initializeAlgorithm(gameState) {
        try {
            console.log(`${this.name}: Starting initialization...`);

            // Clear any previous state
            this.resetAlgorithmState();

            // Validate inputs first
            const validation = this.validateInputs(gameState);
            if (!validation.isValid) {
                throw new Error(`Invalid inputs: ${validation.errors.join(', ')}`);
            }

            // Call algorithm-specific initialization
            await this.initialize(gameState);

            // Reset execution state
            this.currentStep = 0;
            this.isInitialized = true;
            this.isExecuting = false;

            this.emit('algorithm:initialized');
            console.log(`${this.name}: Initialization complete`);

        } catch (error) {
            console.error(`${this.name}: Initialization failed:`, error);
            this.isInitialized = false;
            throw error;
        }
    }

    /**
     * Standard execution workflow
     */
    async executeAlgorithm(gameState) {
        try {
            if (!this.isInitialized) {
                await this.initializeAlgorithm(gameState);
            }

            console.log(`${this.name}: Starting execution...`);
            this.isExecuting = true;
            this.executionStartTime = Date.now();
            this.currentStep = 0;

            gameState.startExecution(this.id);
            this.emit('execution:started');

            // Execute the algorithm
            const result = await this.execute(gameState);

            // Validate and enhance result
            const enhancedResult = this.enhanceResult(result, gameState);

            // Complete execution
            const executionTime = Date.now() - this.executionStartTime;
            this.isExecuting = false;

            gameState.completeExecution(enhancedResult);
            this.emit('execution:completed', { result: enhancedResult, executionTime });

            console.log(`${this.name}: Execution completed in ${executionTime}ms`);
            return enhancedResult;

        } catch (error) {
            console.error(`${this.name}: Execution failed:`, error);
            this.isExecuting = false;
            this.emit('execution:failed', { error });
            throw error;
        }
    }

    /**
     * Execute algorithm step by step (for animations/education)
     */
    async executeStepByStep(gameState, stepIndex = null) {
        try {
            if (!this.isInitialized) {
                await this.initializeAlgorithm(gameState);
            }

            const targetStep = stepIndex !== null ? stepIndex : this.currentStep;

            if (targetStep >= this.steps.length) {
                throw new Error(`Step ${targetStep} exceeds available steps (${this.steps.length})`);
            }

            console.log(`${this.name}: Executing step ${targetStep}: ${this.steps[targetStep]}`);

            const stepResult = await this.executeStep(targetStep, gameState);

            this.currentStep = targetStep + 1;
            gameState.setExecutionStep(this.currentStep);

            this.emit('step:completed', {
                stepIndex: targetStep,
                stepName: this.steps[targetStep],
                result: stepResult
            });

            return stepResult;

        } catch (error) {
            console.error(`${this.name}: Step execution failed:`, error);
            this.emit('step:failed', { stepIndex: targetStep, error });
            throw error;
        }
    }

    /**
     * Reset algorithm state
     */
    resetAlgorithmState() {
        this.currentStep = 0;
        this.isInitialized = false;
        this.isExecuting = false;
        this.executionStartTime = null;
        this.calculationCache.clear();

        this.emit('algorithm:reset');
    }

    /**
     * Get current algorithm status
     */
    getStatus() {
        return {
            id: this.id,
            name: this.name,
            isInitialized: this.isInitialized,
            isExecuting: this.isExecuting,
            currentStep: this.currentStep,
            totalSteps: this.steps.length,
            stepName: this.steps[this.currentStep] || null,
            executionTime: this.executionStartTime ?
                Date.now() - this.executionStartTime : 0
        };
    }

    // ===== RESULT ENHANCEMENT =====

    /**
     * Enhance algorithm result with standard metadata and validation
     */
    enhanceResult(result, gameState) {
        const enhancedResult = {
            // Original result data
            ...result,

            // Algorithm metadata
            algorithm: {
                id: this.id,
                name: this.name,
                type: this.type,
                playerCount: this.playerCount,
                properties: this.properties
            },

            // Execution metadata
            execution: {
                timestamp: new Date().toISOString(),
                executionTime: this.executionStartTime ?
                    Date.now() - this.executionStartTime : 0,
                stepCount: this.steps.length,
                gameStateSnapshot: gameState.createSnapshot()
            },

            // Fairness validation
            fairnessProperties: this.validateFairnessProperties(result, gameState),

            // Performance metrics
            metrics: this.calculatePerformanceMetrics(result, gameState)
        };

        return enhancedResult;
    }

    /**
     * Validate fairness properties of the result
     */
    validateFairnessProperties(result, gameState) {
        const validation = {};

        // Check proportionality
        validation.proportional = this.checkProportional(result);

        // Check envy-freeness
        validation.envyFree = this.checkEnvyFree(result);

        // Check equitability (for 2-player algorithms)
        if (this.playerCount === 2) {
            validation.equitable = this.checkEquitable(result);
        }

        // Strategy-proofness (algorithm property, not result-dependent)
        validation.strategyProof = this.properties.includes('strategy-proof');

        // Algorithm claims vs actual validation
        validation.claimedProperties = this.properties;
        validation.validatedProperties = Object.entries(validation)
            .filter(([key, value]) => value === true)
            .map(([key]) => key);

        return validation;
    }

    /**
     * Check if allocation is proportional
     */
    checkProportional(result) {
        const threshold = 100 / this.playerCount - 0.1; // Small tolerance for floating point

        return Object.values(result.playerValues || {})
            .every(value => value >= threshold);
    }

    /**
     * Check if allocation is envy-free
     */
    checkEnvyFree(result) {
        // Basic implementation - can be overridden by specific algorithms
        // This requires knowing how each player values each piece

        if (!result.pieceValues || !result.allocation) {
            return null; // Cannot determine without piece-by-piece valuations
        }

        const players = Object.keys(result.allocation);

        return players.every(player => {
            const ownPiece = result.allocation[player];
            const ownValue = result.pieceValues[player][ownPiece];

            return players.every(otherPlayer => {
                if (player === otherPlayer) return true;

                const otherPiece = result.allocation[otherPlayer];
                const otherValue = result.pieceValues[player][otherPiece];

                return ownValue >= otherValue - 0.1; // Small tolerance
            });
        });
    }

    /**
     * Check if allocation is equitable (equal value for each player)
     */
    checkEquitable(result) {
        const values = Object.values(result.playerValues || {});

        if (values.length < 2) return false;

        const firstValue = values[0];
        return values.every(value => Math.abs(value - firstValue) < 1.0);
    }

    /**
     * Calculate performance metrics
     */
    calculatePerformanceMetrics(result, gameState) {
        const metrics = {};

        // Total utility (sum of all player values)
        const playerValues = Object.values(result.playerValues || {});
        metrics.totalUtility = playerValues.reduce((sum, value) => sum + value, 0);

        // Efficiency (percentage of maximum possible utility)
        metrics.efficiency = (metrics.totalUtility / (this.playerCount * 100)) * 100;

        // Fairness score (how well properties are satisfied)
        const fairnessProps = result.fairnessProperties || this.validateFairnessProperties(result, gameState);
        const satisfiedProps = Object.values(fairnessProps).filter(prop => prop === true).length;
        const totalProps = Object.keys(fairnessProps).length;
        metrics.fairnessScore = totalProps > 0 ? (satisfiedProps / totalProps) * 100 : 0;

        // Player satisfaction (minimum player value as percentage)
        metrics.minPlayerSatisfaction = Math.min(...playerValues);
        metrics.maxPlayerSatisfaction = Math.max(...playerValues);
        metrics.playerSatisfactionRange = metrics.maxPlayerSatisfaction - metrics.minPlayerSatisfaction;

        return metrics;
    }

    // ===== COMMON UTILITY METHODS =====

    /**
     * Get algorithm metadata for UI display
     */
    getMetadata() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            playerCount: this.playerCount,
            type: this.type,
            properties: this.properties,
            complexity: this.complexity,
            estimatedDuration: this.estimatedDuration,
            steps: this.steps
        };
    }

    /**
     * Check if this algorithm supports a given player count
     */
    supportsPlayerCount(count) {
        return count === this.playerCount;
    }

    /**
     * Check if game state is compatible with this algorithm
     */
    isCompatibleWith(gameState) {
        try {
            const validation = this.validateInputs(gameState);
            return validation.isValid;
        } catch (error) {
            return false;
        }
    }

    /**
     * Cache expensive calculations
     */
    getCachedCalculation(key, calculationFn) {
        if (this.calculationCache.has(key)) {
            return this.calculationCache.get(key);
        }

        const result = calculationFn();
        this.calculationCache.set(key, result);
        return result;
    }

    /**
     * Clear calculation cache
     */
    clearCache() {
        this.calculationCache.clear();
    }

    // ===== COMMON VALIDATION METHODS =====

    /**
     * Standard input validation that most algorithms can use
     */
    standardInputValidation(gameState) {
        const errors = [];
        const warnings = [];

        // Check if game state exists
        if (!gameState) {
            errors.push('Game state is required');
            return { isValid: false, errors, warnings };
        }

        // Check player value totals
        const playerValidation = gameState.validatePlayerTotals();
        const requiredPlayers = Array.from({ length: this.playerCount }, (_, i) => `player${i + 1}`);

        requiredPlayers.forEach(playerKey => {
            const validation = playerValidation[playerKey];
            if (!validation || !validation.valid) {
                errors.push(`${playerKey} values must total exactly 100 points`);
            }
        });

        // Check for extreme valuations that might cause issues
        requiredPlayers.forEach(playerKey => {
            const values = gameState.getPlayerValues(playerKey);
            const maxValue = Math.max(...Object.values(values));
            const minValue = Math.min(...Object.values(values));

            if (maxValue >= 90) {
                warnings.push(`${playerKey} has very high valuation (${maxValue}) for one color`);
            }

            if (minValue === 0) {
                warnings.push(`${playerKey} has zero valuation for some colors`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    // ===== EVENT SYSTEM =====

    /**
     * Subscribe to algorithm events
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Unsubscribe from events
     */
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Emit algorithm events
     */
    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Algorithm event listener error for ${event}:`, error);
                }
            });
        }
    }

    // ===== UTILITY FUNCTIONS =====

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Format number to specified decimal places
     */
    formatNumber(num, decimals = 1) {
        return Number(num).toFixed(decimals);
    }

    /**
     * Generate unique ID for tracking
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BaseAlgorithm };
}