/**
 * Unified Game State Management
 * 
 * This class manages all state for the unified demo system, providing a single
 * source of truth that all algorithms, UI components, and comparison tools can use.
 */

class UnifiedGameState {
    constructor() {
        // Core configuration
        this.config = {
            maxPlayers: 3,
            requiredTotal: 100,
            tolerance: 0.1,
            colors: ['blue', 'red', 'green', 'orange', 'pink', 'purple'],
            canvas: { width: 800, height: 400 }
        };

        // Initialize state
        this.reset();

        // Event system for state change notifications
        this.eventListeners = new Map();
        this.changeHistory = [];
        this.maxHistoryLength = 50;

        console.log('UnifiedGameState: Initialized');
    }

    /**
     * Reset all state to default values
     */
    reset() {
        // Player valuations - the core data that drives everything
        this.playerValues = this.getDefaultPlayerValues();

        // Algorithm-specific state storage
        this.algorithmState = new Map();

        // Current experiment state
        this.currentAlgorithm = null;
        this.currentStep = 0;
        this.isExecuting = false;
        this.executionStartTime = null;

        // Results tracking
        this.currentResult = null;
        this.resultHistory = [];

        // UI state
        this.selectedPlayers = new Set(['player1', 'player2']); // Default to 2-player
        this.viewMode = 'single'; // 'single' or 'comparison'

        // Validation cache
        this.validationCache = new Map();
        this.lastValidationTime = 0;

        this.emit('state:reset');
        console.log('UnifiedGameState: Reset to default values');
    }

    /**
     * Get default player valuations
     */
    getDefaultPlayerValues() {
        return {
            player1: {
                blue: 20, red: 15, green: 25,
                orange: 10, pink: 15, purple: 15
            },
            player2: {
                blue: 15, red: 25, green: 20,
                orange: 20, pink: 10, purple: 10
            },
            player3: {
                blue: 30, red: 10, green: 15,
                orange: 5, pink: 25, purple: 15
            }
        };
    }

    // ===== PLAYER VALUE MANAGEMENT =====

    /**
     * Update a specific player's valuation for a color
     */
    setPlayerValue(playerKey, color, value) {
        // Validate inputs
        if (!this.playerValues[playerKey]) {
            throw new Error(`Invalid player: ${playerKey}`);
        }

        if (!this.config.colors.includes(color)) {
            throw new Error(`Invalid color: ${color}`);
        }

        const numValue = this.clamp(parseInt(value) || 0, 0, 100);
        const oldValue = this.playerValues[playerKey][color];

        if (oldValue !== numValue) {
            this.playerValues[playerKey][color] = numValue;
            this.invalidateValidationCache();
            this.recordChange('player-value', {
                playerKey, color, oldValue, newValue: numValue
            });

            this.emit('player-value:changed', {
                playerKey, color, oldValue, newValue: numValue
            });
        }

        return numValue;
    }

    /**
     * Update multiple values for a player at once
     */
    setPlayerValues(playerKey, colorValues) {
        const changes = [];

        Object.entries(colorValues).forEach(([color, value]) => {
            const oldValue = this.playerValues[playerKey][color];
            const newValue = this.setPlayerValue(playerKey, color, value);

            if (oldValue !== newValue) {
                changes.push({ color, oldValue, newValue });
            }
        });

        if (changes.length > 0) {
            this.emit('player-values:changed', { playerKey, changes });
        }

        return changes;
    }

    /**
     * Get player values with optional filtering
     */
    getPlayerValues(playerKey = null, colors = null) {
        if (playerKey) {
            const values = this.playerValues[playerKey];
            if (colors) {
                return colors.reduce((obj, color) => {
                    obj[color] = values[color];
                    return obj;
                }, {});
            }
            return { ...values };
        }

        // Return all player values (deep copy)
        return JSON.parse(JSON.stringify(this.playerValues));
    }

    /**
     * Reset a player's values to defaults
     */
    resetPlayerValues(playerKey) {
        const defaultValues = this.getDefaultPlayerValues()[playerKey];
        if (defaultValues) {
            this.setPlayerValues(playerKey, defaultValues);
            this.emit('player-values:reset', { playerKey });
        }
    }

    // ===== ALGORITHM STATE MANAGEMENT =====

    /**
     * Set algorithm-specific state
     */
    setAlgorithmState(algorithmId, key, value) {
        if (!this.algorithmState.has(algorithmId)) {
            this.algorithmState.set(algorithmId, {});
        }

        const oldValue = this.algorithmState.get(algorithmId)[key];
        this.algorithmState.get(algorithmId)[key] = value;

        this.recordChange('algorithm-state', {
            algorithmId, key, oldValue, newValue: value
        });

        this.emit('algorithm-state:changed', {
            algorithmId, key, oldValue, newValue: value
        });
    }

    /**
     * Get algorithm-specific state
     */
    getAlgorithmState(algorithmId, key = null) {
        const algorithmData = this.algorithmState.get(algorithmId) || {};

        if (key !== null) {
            return algorithmData[key];
        }

        return { ...algorithmData };
    }

    /**
     * Clear all state for a specific algorithm
     */
    clearAlgorithmState(algorithmId) {
        const hadState = this.algorithmState.has(algorithmId);
        this.algorithmState.delete(algorithmId);

        if (hadState) {
            this.emit('algorithm-state:cleared', { algorithmId });
        }
    }

    /**
     * Get all algorithm states (for debugging/comparison)
     */
    getAllAlgorithmStates() {
        const states = {};
        this.algorithmState.forEach((state, algorithmId) => {
            states[algorithmId] = { ...state };
        });
        return states;
    }

    // ===== VALIDATION SYSTEM =====

    /**
     * Validate player value totals
     */
    validatePlayerTotals() {
        const cacheKey = 'player-totals';
        const cached = this.getFromValidationCache(cacheKey);
        if (cached) return cached;

        const validation = {};

        Object.keys(this.playerValues).forEach(playerKey => {
            const total = this.config.colors.reduce((sum, color) => {
                return sum + (this.playerValues[playerKey][color] || 0);
            }, 0);

            validation[playerKey] = {
                total,
                valid: Math.abs(total - this.config.requiredTotal) < this.config.tolerance,
                difference: total - this.config.requiredTotal
            };
        });

        this.setValidationCache(cacheKey, validation);
        return validation;
    }

    /**
     * Check if the current state is valid for algorithm execution
     */
    isValid(playerCount = null) {
        const playerValidation = this.validatePlayerTotals();

        // Get players to check based on player count
        const playersToCheck = playerCount ?
            Array.from({ length: playerCount }, (_, i) => `player${i + 1}`) :
            Object.keys(this.playerValues);

        return playersToCheck.every(playerKey =>
            playerValidation[playerKey]?.valid
        );
    }

    /**
     * Get validation details for UI display
     */
    getValidationStatus(playerCount = null) {
        const playerValidation = this.validatePlayerTotals();
        const isValidState = this.isValid(playerCount);

        const playersToCheck = playerCount ?
            Array.from({ length: playerCount }, (_, i) => `player${i + 1}`) :
            Object.keys(this.playerValues);

        const playerStatuses = {};
        playersToCheck.forEach(playerKey => {
            playerStatuses[playerKey] = playerValidation[playerKey];
        });

        return {
            isValid: isValidState,
            players: playerStatuses,
            summary: {
                validPlayers: Object.values(playerStatuses).filter(p => p.valid).length,
                totalPlayers: Object.keys(playerStatuses).length
            }
        };
    }

    // ===== EXECUTION STATE MANAGEMENT =====

    /**
     * Mark algorithm execution as started
     */
    startExecution(algorithmId) {
        this.isExecuting = true;
        this.currentAlgorithm = algorithmId;
        this.executionStartTime = Date.now();
        this.currentStep = 0;

        this.emit('execution:started', { algorithmId });
    }

    /**
     * Update execution step
     */
    setExecutionStep(step) {
        const oldStep = this.currentStep;
        this.currentStep = step;

        this.emit('execution:step-changed', {
            oldStep, newStep: step, algorithmId: this.currentAlgorithm
        });
    }

    /**
     * Mark algorithm execution as completed
     */
    completeExecution(result) {
        const executionTime = this.executionStartTime ?
            Date.now() - this.executionStartTime : 0;

        this.isExecuting = false;
        this.currentResult = {
            ...result,
            executionTime,
            timestamp: new Date().toISOString()
        };

        // Add to history
        this.resultHistory.unshift(this.currentResult);
        if (this.resultHistory.length > 20) {
            this.resultHistory = this.resultHistory.slice(0, 20);
        }

        this.emit('execution:completed', {
            result: this.currentResult,
            executionTime
        });

        return this.currentResult;
    }

    /**
     * Get current execution status
     */
    getExecutionStatus() {
        return {
            isExecuting: this.isExecuting,
            currentAlgorithm: this.currentAlgorithm,
            currentStep: this.currentStep,
            executionTime: this.executionStartTime ?
                Date.now() - this.executionStartTime : 0,
            hasResult: !!this.currentResult
        };
    }

    // ===== RESULT MANAGEMENT =====

    /**
     * Get current result
     */
    getCurrentResult() {
        return this.currentResult ? { ...this.currentResult } : null;
    }

    /**
     * Get result history
     */
    getResultHistory(limit = 10) {
        return this.resultHistory.slice(0, limit);
    }

    /**
     * Clear result history
     */
    clearResultHistory() {
        this.resultHistory = [];
        this.emit('results:history-cleared');
    }

    // ===== UTILITY METHODS =====

    /**
     * Deep clone the current state for comparison purposes
     */
    createSnapshot() {
        return {
            playerValues: JSON.parse(JSON.stringify(this.playerValues)),
            algorithmStates: this.getAllAlgorithmStates(),
            currentResult: this.getCurrentResult(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Restore state from a snapshot
     */
    restoreSnapshot(snapshot) {
        this.playerValues = JSON.parse(JSON.stringify(snapshot.playerValues));

        // Restore algorithm states
        this.algorithmState.clear();
        Object.entries(snapshot.algorithmStates || {}).forEach(([algorithmId, state]) => {
            this.algorithmState.set(algorithmId, { ...state });
        });

        this.currentResult = snapshot.currentResult ?
            { ...snapshot.currentResult } : null;

        this.invalidateValidationCache();
        this.emit('state:restored', { snapshot });
    }

    /**
     * Export state as JSON for saving/sharing
     */
    exportState() {
        return JSON.stringify({
            version: '1.0',
            playerValues: this.playerValues,
            algorithmStates: this.getAllAlgorithmStates(),
            metadata: {
                exportTime: new Date().toISOString(),
                config: this.config
            }
        }, null, 2);
    }

    /**
     * Import state from JSON
     */
    importState(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (data.playerValues) {
                this.playerValues = { ...data.playerValues };
            }

            if (data.algorithmStates) {
                this.algorithmState.clear();
                Object.entries(data.algorithmStates).forEach(([algorithmId, state]) => {
                    this.algorithmState.set(algorithmId, { ...state });
                });
            }

            this.invalidateValidationCache();
            this.emit('state:imported', { data });

            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }

    // ===== VALIDATION CACHE MANAGEMENT =====

    /**
     * Get cached validation result if still valid
     */
    getFromValidationCache(key) {
        const cached = this.validationCache.get(key);
        if (cached && (Date.now() - this.lastValidationTime < 1000)) {
            return cached;
        }
        return null;
    }

    /**
     * Store validation result in cache
     */
    setValidationCache(key, value) {
        this.validationCache.set(key, value);
        this.lastValidationTime = Date.now();
    }

    /**
     * Invalidate validation cache when state changes
     */
    invalidateValidationCache() {
        this.validationCache.clear();
        this.lastValidationTime = 0;
    }

    // ===== CHANGE TRACKING =====

    /**
     * Record a state change for history/undo functionality
     */
    recordChange(type, data) {
        const change = {
            type,
            data,
            timestamp: Date.now()
        };

        this.changeHistory.unshift(change);

        if (this.changeHistory.length > this.maxHistoryLength) {
            this.changeHistory = this.changeHistory.slice(0, this.maxHistoryLength);
        }
    }

    /**
     * Get change history
     */
    getChangeHistory(limit = 10) {
        return this.changeHistory.slice(0, limit);
    }

    // ===== EVENT SYSTEM =====

    /**
     * Subscribe to state change events
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
     * Emit state change events
     */
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
    }

    // ===== UTILITY FUNCTIONS =====

    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Get debug information about current state
     */
    getDebugInfo() {
        return {
            playerValueTotals: Object.keys(this.playerValues).reduce((obj, playerKey) => {
                obj[playerKey] = this.config.colors.reduce((sum, color) => {
                    return sum + this.playerValues[playerKey][color];
                }, 0);
                return obj;
            }, {}),
            algorithmStateCount: this.algorithmState.size,
            validationStatus: this.getValidationStatus(),
            executionStatus: this.getExecutionStatus(),
            changeHistoryLength: this.changeHistory.length,
            resultHistoryLength: this.resultHistory.length
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedGameState };
}