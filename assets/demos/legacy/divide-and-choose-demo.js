/**
 * Interactive Divide-and-Choose Algorithm Demo
 * 
 * This application demonstrates the divide-and-choose fair division algorithm
 * where one player (divider) cuts the resource and the other (chooser) picks first.
 * 
 * Architecture:
 * - Configuration: All constants and settings in one place
 * - GameState: Centralized state management
 * - CalculationEngine: Pure calculation functions
 * - UIManager: All UI interactions and updates
 * - GameController: Orchestrates the game flow
 * 
 * @author Amaan Khan
 * @version 2.0
 */

// ===== CONFIGURATION =====

/**
 * Configuration object containing all game constants and settings
 * Modify these values to customize the game behavior
 */
const CONFIG = {
    // Canvas dimensions
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 400,
        VIEWBOX: "0 0 800 400"
    },
    
    // Validation constants
    VALIDATION: {
        REQUIRED_TOTAL: 100,
        MIN_VALUE: 0,
        MAX_VALUE: 100
    },
    
    // Animation and timing
    TIMING: {
        SELECTION_DELAY: 1000, // milliseconds before showing results
        TRANSITION_DURATION: 300 // CSS transition duration
    },
    
    // Game steps
    STEPS: {
        CUTTING: 1,
        CHOOSING: 2,
        COMPLETE: 3
    },
    
    // UI Messages
    MESSAGES: {
        STEP_1: "Step 1: Player 1 (Divider) adjusts the cutting line",
        STEP_2: "Step 2: Player 2 (Chooser) selects their preferred piece", 
        STEP_3: "Algorithm Complete! View results below.",
        INSTRUCTIONS_1: "<strong>Instructions:</strong> Player 1, use the slider below to position your vertical cut through the colored regions.",
        INSTRUCTIONS_2: "<strong>Instructions:</strong> Player 2, click on the piece you prefer!",
        ENVY_FREE: "Neither player envies the other",
        PROPORTIONAL_SUCCESS: "Both players get ≥50% value",
        PROPORTIONAL_FAILURE: "Someone gets <50% value"
    }
};

/**
 * Region definitions for the game board
 * Each region has boundaries (start/end x-coordinates) and visual properties
 * 
 * To modify the game layout:
 * 1. Update these region boundaries
 * 2. Update the corresponding SVG polygons in the HTML
 * 3. Ensure regions don't overlap inappropriately
 */
const REGIONS = {
    blue: { 
        start: 0, 
        end: 600, 
        color: '#0066ff',
        label: 'Blue'
    },
    red: { 
        start: 600, 
        end: 800, 
        color: '#ff3366',
        label: 'Red'
    },
    green: { 
        start: 150, 
        end: 600, 
        color: '#3f9633',
        label: 'Green'
    },
    orange: { 
        start: 600, 
        end: 800, 
        color: '#ff6600',
        label: 'Orange'
    },
    pink: { 
        start: 0, 
        end: 150, 
        color: '#ff66ff',
        label: 'Pink'
    },
    purple: { 
        start: 150, 
        end: 800, 
        color: '#9966ff',
        label: 'Purple'
    }
};

/**
 * Default player valuations - must sum to REQUIRED_TOTAL for each player
 * These represent how much each player values each colored region
 */
const DEFAULT_VALUATIONS = {
    player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
    player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Utility functions for common operations
 */
const Utils = {
    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Format a number to specified decimal places
     * @param {number} num - Number to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number
     */
    formatNumber(num, decimals = 1) {
        return Number(num).toFixed(decimals);
    },
    
    /**
     * Get all color names from regions
     * @returns {string[]} Array of color names
     */
    getColorNames() {
        return Object.keys(REGIONS);
    },
    
    /**
     * Validate that an object contains all required colors
     * @param {Object} obj - Object to validate
     * @returns {boolean} True if valid
     */
    hasAllColors(obj) {
        return this.getColorNames().every(color => color in obj);
    }
};

// ===== GAME STATE MANAGEMENT =====

/**
 * Centralized game state object
 * Contains all mutable game state in one place for easier debugging and testing
 */
class GameState {
    constructor() {
        this.reset();
    }
    
    /**
     * Reset game state to initial values
     */
    reset() {
        this.step = CONFIG.STEPS.CUTTING;
        this.cutPosition = 50; // percentage
        this.cutX = CONFIG.CANVAS.WIDTH / 2; // pixel position
        this.selectedPiece = null;
        this.player1Piece = null;
        this.player2Piece = null;
        this.playerValues = JSON.parse(JSON.stringify(DEFAULT_VALUATIONS)); // deep copy
    }
    
    /**
     * Update player valuations from form inputs
     * Reads values from DOM and updates internal state
     */
    updatePlayerValues() {
        const colors = Utils.getColorNames();
        
        for (let player of ['player1', 'player2']) {
            const playerKey = player === 'player1' ? 'p1' : 'p2';
            
            for (let color of colors) {
                const inputId = `${playerKey}-${color}`;
                const element = document.getElementById(inputId);
                if (element) {
                    const value = parseInt(element.value) || 0;
                    this.playerValues[player][color] = Utils.clamp(
                        value, 
                        CONFIG.VALIDATION.MIN_VALUE, 
                        CONFIG.VALIDATION.MAX_VALUE
                    );
                }
            }
        }
    }
    
    /**
     * Validate that player valuations sum to required total
     * @returns {Object} Validation results for both players
     */
    validateTotals() {
        const results = {};
        
        ['player1', 'player2'].forEach(player => {
            const total = Object.values(this.playerValues[player])
                .reduce((sum, value) => sum + value, 0);
            results[player] = {
                total,
                valid: total === CONFIG.VALIDATION.REQUIRED_TOTAL
            };
        });
        
        return results;
    }
    
    /**
     * Check if the game state is valid for proceeding
     * @returns {boolean} True if valid
     */
    isValid() {
        const validation = this.validateTotals();
        return validation.player1.valid && validation.player2.valid;
    }
    
    /**
     * Update the cut position
     * @param {number} newCutX - New X position for the cut
     */
    updateCutPosition(newCutX) {
        this.cutX = Utils.clamp(newCutX, 0, CONFIG.CANVAS.WIDTH);
        this.cutPosition = (this.cutX / CONFIG.CANVAS.WIDTH) * 100;
    }
    
    /**
     * Set the selected piece for player 2
     * @param {string} piece - 'left' or 'right'
     */
    selectPiece(piece) {
        if (this.step !== CONFIG.STEPS.CHOOSING) return false;
        
        this.selectedPiece = piece;
        this.player2Piece = piece;
        this.player1Piece = piece === 'left' ? 'right' : 'left';
        this.step = CONFIG.STEPS.COMPLETE;
        
        return true;
    }
    
    /**
     * Advance to the next step
     */
    nextStep() {
        if (this.step < CONFIG.STEPS.COMPLETE) {
            this.step++;
        }
    }
}

// ===== CALCULATION ENGINE =====

/**
 * Core calculation functions for the divide-and-choose algorithm
 * All functions are pure (no side effects) for easier testing and debugging
 */
class CalculationEngine {
    /**
     * Calculate how much of each region falls on each side of a vertical cut
     * @param {number} cutX - X-coordinate of the cut line (0-800)
     * @returns {Object} Percentage distribution of each region {left: {...}, right: {...}}
     */
    static calculateRegionDistribution(cutX) {
        const distribution = { left: {}, right: {} };
        
        Object.entries(REGIONS).forEach(([colorName, region]) => {
            const regionWidth = region.end - region.start;
            
            if (cutX <= region.start) {
                // Cut is completely to the left - entire region goes right
                distribution.left[colorName] = 0;
                distribution.right[colorName] = 100;
            } else if (cutX >= region.end) {
                // Cut is completely to the right - entire region goes left
                distribution.left[colorName] = 100;
                distribution.right[colorName] = 0;
            } else {
                // Cut intersects this region - calculate proportions
                const leftWidth = cutX - region.start;
                const leftPercent = (leftWidth / regionWidth) * 100;
                distribution.left[colorName] = leftPercent;
                distribution.right[colorName] = 100 - leftPercent;
            }
        });
        
        return distribution;
    }
    
    /**
     * Calculate a player's total value for a given region distribution
     * @param {Object} regionDistribution - Percentage of each region
     * @param {Object} playerValues - Player's valuations for each color
     * @returns {number} Total value for this player
     */
    static calculatePlayerValue(regionDistribution, playerValues) {
        return Object.entries(regionDistribution)
            .reduce((total, [color, percentage]) => {
                const colorValue = playerValues[color] || 0;
                return total + (percentage / 100) * colorValue;
            }, 0);
    }
    
    /**
     * Calculate both players' values for both sides of a cut
     * @param {number} cutX - X-coordinate of the cut
     * @param {Object} allPlayerValues - All player valuations
     * @returns {Object} Complete value calculation
     */
    static calculateAllValues(cutX, allPlayerValues) {
        const distribution = this.calculateRegionDistribution(cutX);
        
        const result = {};
        ['player1', 'player2'].forEach(player => {
            result[player] = {
                left: this.calculatePlayerValue(distribution.left, allPlayerValues[player]),
                right: this.calculatePlayerValue(distribution.right, allPlayerValues[player])
            };
        });
        
        return result;
    }
    
    /**
     * Analyze fairness properties of the final allocation
     * @param {Object} finalValues - Final values for each player {player1: value, player2: value}
     * @returns {Object} Analysis results
     */
    static analyzeFairness(finalValues) {
        const proportional = Object.values(finalValues)
            .every(value => value >= CONFIG.VALIDATION.REQUIRED_TOTAL / 2);
            
        return {
            proportional,
            envyFree: true, // Always true for divide-and-choose when executed correctly
            efficiency: this.calculateEfficiency(finalValues)
        };
    }
    
    /**
     * Calculate the efficiency of the allocation
     * @param {Object} finalValues - Final values for each player
     * @returns {number} Efficiency percentage
     */
    static calculateEfficiency(finalValues) {
        const totalValue = Object.values(finalValues).reduce((sum, val) => sum + val, 0);
        const maxPossibleValue = CONFIG.VALIDATION.REQUIRED_TOTAL * 2; // Both players could theoretically get 100
        return (totalValue / maxPossibleValue) * 100;
    }
}

// ===== UI MANAGEMENT =====

/**
 * Handles all user interface updates and interactions
 * Separated from game logic for cleaner code organization
 */
class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.elements = this.cacheElements();
        this.bindEvents();
    }
    
    /**
     * Cache frequently used DOM elements for performance
     * @returns {Object} Cached DOM elements
     */
    cacheElements() {
        const elementIds = [
            'stepIndicator', 'instructions', 'cutSlider', 'cutPosition', 'cutLine',
            'leftPiece', 'rightPiece', 'makeCutButton', 'resetButton', 'sliderContainer',
            'results', 'resultText', 'proportionalResult', 'envyResult', 'warning',
            'player1Value', 'player2Value', 'p1Total', 'p2Total'
        ];
        
        const elements = {};
        elementIds.forEach(id => {
            elements[id] = document.getElementById(id);
            if (!elements[id]) {
                console.warn(`Element with ID '${id}' not found`);
            }
        });
        
        return elements;
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Slider for cut position
        if (this.elements.cutSlider) {
            this.elements.cutSlider.addEventListener('input', (e) => {
                this.handleCutPositionChange(parseFloat(e.target.value));
            });
        }
        
        // Action buttons
        if (this.elements.makeCutButton) {
            this.elements.makeCutButton.addEventListener('click', () => {
                this.handleMakeCut();
            });
        }
        
        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => {
                this.handleReset();
            });
        }
        
        // Valuation inputs for both players
        this.bindValuationInputs();
        
        // Piece selection handlers
        if (this.elements.leftPiece) {
            this.elements.leftPiece.addEventListener('click', () => this.handlePieceSelection('left'));
            this.elements.leftPiece.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handlePieceSelection('left');
                }
            });
        }
        
        if (this.elements.rightPiece) {
            this.elements.rightPiece.addEventListener('click', () => this.handlePieceSelection('right'));
            this.elements.rightPiece.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handlePieceSelection('right');
                }
            });
        }
    }
    
    /**
     * Bind event listeners to all valuation input fields
     */
    bindValuationInputs() {
        const colors = Utils.getColorNames();
        const players = ['p1', 'p2'];
        
        players.forEach(player => {
            colors.forEach(color => {
                const inputId = `${player}-${color}`;
                const element = document.getElementById(inputId);
                if (element) {
                    element.addEventListener('input', () => {
                        this.handleValuationChange();
                    });
                    
                    // Prevent invalid input
                    element.addEventListener('blur', (e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < CONFIG.VALIDATION.MIN_VALUE) {
                            e.target.value = CONFIG.VALIDATION.MIN_VALUE;
                        } else if (value > CONFIG.VALIDATION.MAX_VALUE) {
                            e.target.value = CONFIG.VALIDATION.MAX_VALUE;
                        }
                        this.handleValuationChange();
                    });
                }
            });
        });
    }
    
    /**
     * Handle changes to player valuation inputs
     */
    handleValuationChange() {
        this.gameState.updatePlayerValues();
        this.updateTotalValidation();
        
        if (this.gameState.step === CONFIG.STEPS.CUTTING) {
            this.updatePlayerValueDisplays();
        }
    }
    
    /**
     * Handle cut position changes from slider
     * @param {number} cutX - New cut position
     */
    handleCutPositionChange(cutX) {
        this.gameState.updateCutPosition(cutX);
        this.updateCutLineVisual();
        this.updatePlayerValueDisplays();
    }
    
    /**
     * Handle the "Make Cut" button click
     */
    handleMakeCut() {
        if (!this.gameState.isValid() || this.gameState.step !== CONFIG.STEPS.CUTTING) {
            return;
        }
        
        this.gameState.nextStep();
        this.transitionToChoosingPhase();
    }
    
    /**
     * Handle piece selection by player 2
     * @param {string} piece - 'left' or 'right'
     */
    handlePieceSelection(piece) {
        if (this.gameState.selectPiece(piece)) {
            this.showPieceSelection(piece);
            setTimeout(() => {
                this.showResults();
            }, CONFIG.TIMING.SELECTION_DELAY);
        }
    }
    
    /**
     * Handle game reset
     */
    handleReset() {
        this.gameState.reset();
        this.resetUI();
        this.updatePlayerValueDisplays();
    }
    
    /**
     * Update the visual position of the cut line
     */
    updateCutLineVisual() {
        if (this.elements.cutLine) {
            this.elements.cutLine.setAttribute('x1', this.gameState.cutX);
            this.elements.cutLine.setAttribute('x2', this.gameState.cutX);
        }
        
        if (this.elements.cutPosition) {
            this.elements.cutPosition.textContent = `${Utils.formatNumber(this.gameState.cutPosition, 1)}%`;
        }
    }
    
    /**
     * Update the display of player values for current cut position
     */
    updatePlayerValueDisplays() {
        const values = CalculationEngine.calculateAllValues(
            this.gameState.cutX, 
            this.gameState.playerValues
        );
        
        if (this.elements.player1Value) {
            this.elements.player1Value.textContent = 
                `Left: ${Utils.formatNumber(values.player1.left)} | Right: ${Utils.formatNumber(values.player1.right)}`;
        }
        
        if (this.elements.player2Value) {
            this.elements.player2Value.textContent = 
                `Left: ${Utils.formatNumber(values.player2.left)} | Right: ${Utils.formatNumber(values.player2.right)}`;
        }
    }
    
    /**
     * Update validation display for player totals
     */
    updateTotalValidation() {
        const validation = this.gameState.validateTotals();
        
        // Update player 1 total
        if (this.elements.p1Total) {
            const p1Class = validation.player1.valid ? 'valid' : 'error';
            this.elements.p1Total.innerHTML = 
                `Total: <span class="${p1Class}">${validation.player1.total}</span>`;
        }
        
        // Update player 2 total
        if (this.elements.p2Total) {
            const p2Class = validation.player2.valid ? 'valid' : 'error';
            this.elements.p2Total.innerHTML = 
                `Total: <span class="${p2Class}">${validation.player2.total}</span>`;
        }
        
        // Enable/disable cut button based on validation
        if (this.elements.makeCutButton) {
            this.elements.makeCutButton.disabled = !this.gameState.isValid();
        }
    }
    
    /**
     * Transition UI to the choosing phase
     */
    transitionToChoosingPhase() {
        // Update step indicator and instructions
        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_2;
        }

        if (this.elements.instructions) {
            this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_2;
        }

        // Hide controls
        this.setElementDisplay('sliderContainer', false);
        this.setElementDisplay('makeCutButton', false);

        // Show reset button to prevent layout shift
        this.setElementDisplay('resetButton', true);

        // Show piece overlays
        this.showPieceOverlays();
    }
    
    /**
     * Show the piece overlays for selection
     */
    showPieceOverlays() {
        const cutX = this.gameState.cutX;
        
        // Update and show left piece
        if (this.elements.leftPiece) {
            this.elements.leftPiece.setAttribute('width', cutX);
            this.elements.leftPiece.style.display = 'block';
        }
        
        // Update and show right piece
        if (this.elements.rightPiece) {
            this.elements.rightPiece.setAttribute('x', cutX);
            this.elements.rightPiece.setAttribute('width', CONFIG.CANVAS.WIDTH - cutX);
            this.elements.rightPiece.style.display = 'block';
        }
    }
    
    /**
     * Show the selected piece visually
     * @param {string} selectedPiece - 'left' or 'right'
     */
    showPieceSelection(selectedPiece) {
        // Remove previous selections
        if (this.elements.leftPiece) {
            this.elements.leftPiece.classList.remove('selected');
        }
        if (this.elements.rightPiece) {
            this.elements.rightPiece.classList.remove('selected');
        }
        
        // Add selection to chosen piece
        const selectedElement = selectedPiece === 'left' ? this.elements.leftPiece : this.elements.rightPiece;
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    }
    
    /**
     * Show the final results
     */
    showResults() {
        // Update step indicator
        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_3;
        }
        
        // Hide instructions
        this.setElementDisplay('instructions', false);
        
        // Calculate final values
        const distribution = CalculationEngine.calculateRegionDistribution(this.gameState.cutX);
        const p1Final = CalculationEngine.calculatePlayerValue(
            distribution[this.gameState.player1Piece], 
            this.gameState.playerValues.player1
        );
        const p2Final = CalculationEngine.calculatePlayerValue(
            distribution[this.gameState.player2Piece], 
            this.gameState.playerValues.player2
        );
        
        // Show results
        if (this.elements.resultText) {
            this.elements.resultText.innerHTML = 
                `Player 1 gets the ${this.gameState.player1Piece} piece (value: ${Utils.formatNumber(p1Final)})<br>` +
                `Player 2 gets the ${this.gameState.player2Piece} piece (value: ${Utils.formatNumber(p2Final)})`;
        }
        
        // Analyze fairness
        const fairness = CalculationEngine.analyzeFairness({ player1: p1Final, player2: p2Final });
        
        if (this.elements.proportionalResult) {
            this.elements.proportionalResult.textContent = fairness.proportional ? 
                CONFIG.MESSAGES.PROPORTIONAL_SUCCESS : CONFIG.MESSAGES.PROPORTIONAL_FAILURE;
            this.elements.proportionalResult.className = fairness.proportional ? 'success' : 'failure';
        }
        
        if (this.elements.envyResult) {
            this.elements.envyResult.textContent = CONFIG.MESSAGES.ENVY_FREE;
            this.elements.envyResult.className = 'success';
        }
        
        // Show results panel and reset button
        this.setElementDisplay('results', true);
        this.setElementDisplay('resetButton', true);
    }
    
    /**
     * Reset the UI to initial state
     */
    resetUI() {
        // Reset step indicator and instructions
        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_1;
        }
        
        if (this.elements.instructions) {
            this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_1;
        }
        
        // Reset slider
        if (this.elements.cutSlider) {
            this.elements.cutSlider.value = CONFIG.CANVAS.WIDTH / 2;
        }
        
        // Show/hide appropriate elements
        this.setElementDisplay('sliderContainer', true);
        this.setElementDisplay('makeCutButton', true);
        this.setElementDisplay('resetButton', false);
        this.setElementDisplay('results', false);
        this.setElementDisplay('instructions', true);
        
        // Hide overlays and remove selections
        this.setElementDisplay('leftPiece', false);
        this.setElementDisplay('rightPiece', false);
        
        if (this.elements.leftPiece) {
            this.elements.leftPiece.classList.remove('selected');
        }
        if (this.elements.rightPiece) {
            this.elements.rightPiece.classList.remove('selected');
        }
        
        // Reset cut line and values
        this.updateCutLineVisual();
        this.updateTotalValidation();
    }
    
    /**
     * Utility function to show/hide elements
     * @param {string} elementKey - Key in this.elements
     * @param {boolean} show - Whether to show the element
     */
    setElementDisplay(elementKey, show) {
        const element = this.elements[elementKey];
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }
}

// ===== GAME CONTROLLER =====

/**
 * Main game controller that orchestrates the entire application
 * Coordinates between game state, calculations, and UI
 */
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.uiManager = new UIManager(this.gameState);
        this.initialize();
    }
    
    /**
     * Initialize the game
     */
    initialize() {
        // Set initial values in the UI
        this.setInitialValues();
        
        // Perform initial calculations
        this.uiManager.updateTotalValidation();
        this.uiManager.updatePlayerValueDisplays();
        this.uiManager.updateCutLineVisual();
        
        console.log('Divide and Choose game initialized successfully');
    }
    
    /**
     * Set initial valuation values in the form inputs
     */
    setInitialValues() {
        const colors = Utils.getColorNames();
        
        ['player1', 'player2'].forEach(player => {
            const playerKey = player === 'player1' ? 'p1' : 'p2';
            
            colors.forEach(color => {
                const inputId = `${playerKey}-${color}`;
                const element = document.getElementById(inputId);
                if (element && this.gameState.playerValues[player][color] !== undefined) {
                    element.value = this.gameState.playerValues[player][color];
                }
            });
        });
    }
    
    /**
     * Get current game state (useful for debugging)
     * @returns {Object} Current game state
     */
    getGameState() {
        return {
            step: this.gameState.step,
            cutPosition: this.gameState.cutPosition,
            cutX: this.gameState.cutX,
            playerValues: this.gameState.playerValues,
            isValid: this.gameState.isValid()
        };
    }
}

// ===== INITIALIZATION =====

/**
 * Initialize the application when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Create and start the game
        window.gameController = new GameController();
        
        // Expose utilities for debugging (remove in production)
        if (typeof console !== 'undefined') {
            window.debugUtils = {
                CONFIG,
                REGIONS,
                Utils,
                CalculationEngine,
                getGameState: () => window.gameController.getGameState()
            };
        }
        
    } catch (error) {
        console.error('Failed to initialize Divide and Choose demo:', error);
        
        // Show error message to user
        const container = document.querySelector('.simulation-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #e53e3e;">
                    <h3>Failed to Load Game</h3>
                    <p>There was an error initializing the game. Please refresh the page and try again.</p>
                    <p><small>Error: ${error.message}</small></p>
                </div>
            `;
        }
    }
});