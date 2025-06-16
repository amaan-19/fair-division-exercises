/**
 * Divide-and-Choose Algorithm Implementation
 * 
 * This file implements the divide-and-choose algorithm as a self-contained
 * module that registers itself with the unified demo system.
 */

// ===== ALGORITHM CONFIGURATION =====

const DIVIDE_CHOOSE_CONFIG = {
    STEPS: { CUTTING: 1, CHOOSING: 2, COMPLETE: 3 },
    REGIONS: {
        blue: { start: 0, end: 600 },
        red: { start: 600, end: 800 },
        green: { start: 150, end: 600 },
        orange: { start: 600, end: 800 },
        pink: { start: 0, end: 150 },
        purple: { start: 150, end: 800 }
    }
};

// ===== CALCULATION ENGINE =====

class DivideChooseCalculationEngine {
    static calculateRegionDistribution(cutX) {
        const distribution = { left: {}, right: {} };

        Object.entries(DIVIDE_CHOOSE_CONFIG.REGIONS).forEach(([colorName, region]) => {
            const regionWidth = region.end - region.start;

            if (cutX <= region.start) {
                distribution.left[colorName] = 0;
                distribution.right[colorName] = 100;
            } else if (cutX >= region.end) {
                distribution.left[colorName] = 100;
                distribution.right[colorName] = 0;
            } else {
                const leftWidth = cutX - region.start;
                const leftPercent = (leftWidth / regionWidth) * 100;
                distribution.left[colorName] = leftPercent;
                distribution.right[colorName] = 100 - leftPercent;
            }
        });

        return distribution;
    }

    static calculatePlayerValue(regionDistribution, playerValues) {
        return Object.entries(regionDistribution)
            .reduce((total, [color, percentage]) => {
                return total + (playerValues[color] * percentage / 100);
            }, 0);
    }

    static calculatePieceValues(cutX, playerValues) {
        const distribution = this.calculateRegionDistribution(cutX);

        return {
            player1: {
                left: this.calculatePlayerValue(distribution.left, playerValues.player1),
                right: this.calculatePlayerValue(distribution.right, playerValues.player1)
            },
            player2: {
                left: this.calculatePlayerValue(distribution.left, playerValues.player2),
                right: this.calculatePlayerValue(distribution.right, playerValues.player2)
            }
        };
    }

    static analyzeResults(pieceValues, selectedPiece) {
        const player1Value = selectedPiece === 'left' ?
            pieceValues.player1.right : pieceValues.player1.left;
        const player2Value = selectedPiece === 'left' ?
            pieceValues.player2.left : pieceValues.player2.right;

        return {
            proportional: player1Value >= 50 && player2Value >= 50,
            envyFree: true, // Divide-and-choose is always envy-free
            player1Value: player1Value,
            player2Value: player2Value
        };
    }
}

// ===== GAME STATE =====

class DivideChooseGameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.step = DIVIDE_CHOOSE_CONFIG.STEPS.CUTTING;
        this.cutPosition = 50;
        this.cutX = 400;
        this.selectedPiece = null;
        this.player1Piece = null;
        this.player2Piece = null;

        this.playerValues = {
            player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
            player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
        };
    }

    updatePlayerValues() {
        const colors = Object.keys(DIVIDE_CHOOSE_CONFIG.REGIONS);

        for (let color of colors) {
            const input1 = document.getElementById(`p1-${color}`);
            const input2 = document.getElementById(`p2-${color}`);

            if (input1) {
                this.playerValues.player1[color] = parseInt(input1.value) || 0;
            }
            if (input2) {
                this.playerValues.player2[color] = parseInt(input2.value) || 0;
            }
        }
    }

    validateTotals() {
        const validation = {};

        for (let player of ['player1', 'player2']) {
            const total = Object.values(this.playerValues[player])
                .reduce((sum, value) => sum + value, 0);

            validation[player] = {
                total: total,
                valid: Math.abs(total - BASE_CONFIG.VALIDATION.REQUIRED_TOTAL) < 0.1
            };
        }

        return validation;
    }

    nextStep() {
        if (this.step < DIVIDE_CHOOSE_CONFIG.STEPS.COMPLETE) {
            this.step++;
        }
    }
}

// ===== DIVIDE-AND-CHOOSE ALGORITHM =====

class DivideAndChooseAlgorithm extends AlgorithmInterface {
    constructor() {
        super();

        // Algorithm metadata
        this.name = 'Divide-and-Choose';
        this.description = 'The fundamental fair division procedure for two players';
        this.playerCount = 2;
        this.type = 'discrete';
        this.properties = ['proportional', 'envy-free', 'strategy-proof'];

        // Algorithm state
        this.gameState = new DivideChooseGameState();
    }

    // ===== REQUIRED INTERFACE METHODS =====

    initialize() {
        console.log('Initializing Divide-and-Choose algorithm');
        this.gameState.reset();
        this.updateAll();
    }

    execute() {
        console.log('Making cut in Divide-and-Choose algorithm');
        if (this.gameState.step === DIVIDE_CHOOSE_CONFIG.STEPS.CUTTING) {
            this.gameState.nextStep();
            this.updateAll();
        }
    }

    reset() {
        console.log('Resetting Divide-and-Choose algorithm');
        this.gameState.reset();
        this.updateAll();
        this.hideResults();
    }

    // ===== OPTIONAL INTERFACE METHODS =====

    handleCutSliderChange() {
        const slider = document.getElementById('cut-slider');
        this.gameState.cutX = parseInt(slider.value);
        this.gameState.cutPosition = (this.gameState.cutX / BASE_CONFIG.CANVAS.WIDTH) * 100;
        this.updateAll();
    }

    handlePlayerValueChange() {
        this.updateAll();
    }

    handlePieceClick(piece) {
        if (this.gameState.step !== DIVIDE_CHOOSE_CONFIG.STEPS.CHOOSING) return;

        this.gameState.selectedPiece = piece;
        this.gameState.nextStep();

        setTimeout(() => {
            this.updateAll();
            this.showResults();
        }, BASE_CONFIG.TIMING.SELECTION_DELAY);
    }

    getRegions() {
        return DIVIDE_CHOOSE_CONFIG.REGIONS;
    }

    getUIConfig() {
        return {
            showCutSlider: true,
            showPlayerValues: true,
            enablePieceSelection: this.gameState.step === DIVIDE_CHOOSE_CONFIG.STEPS.CHOOSING
        };
    }

    // ===== ALGORITHM-SPECIFIC UI METHODS =====

    updateAll() {
        this.updateStepIndicator();
        this.updateInstructions();
        this.updateCutLine();
        this.updatePlayerValueDisplays();
        this.updateValidationDisplays();
        this.updatePieceOverlays();
        this.updateWarning();
    }

    updateStepIndicator() {
        let text;
        switch (this.gameState.step) {
            case DIVIDE_CHOOSE_CONFIG.STEPS.CUTTING:
                text = 'Step 1: Player 1 (Divider) adjusts the cutting line';
                break;
            case DIVIDE_CHOOSE_CONFIG.STEPS.CHOOSING:
                text = 'Step 2: Player 2 (Chooser) selects their preferred piece';
                break;
            case DIVIDE_CHOOSE_CONFIG.STEPS.COMPLETE:
                text = 'Algorithm Complete! View results below.';
                break;
        }
        this.updateElement('step-indicator', text);
    }

    updateInstructions() {
        let html;
        switch (this.gameState.step) {
            case DIVIDE_CHOOSE_CONFIG.STEPS.CUTTING:
                html = '<strong>Instructions:</strong> Player 1, use the slider below to position your vertical cut through the colored regions.';
                break;
            case DIVIDE_CHOOSE_CONFIG.STEPS.CHOOSING:
                html = '<strong>Instructions:</strong> Player 2, click on the piece you prefer!';
                break;
            case DIVIDE_CHOOSE_CONFIG.STEPS.COMPLETE:
                html = '<strong>Complete:</strong> The algorithm has finished. Review the results below.';
                break;
        }
        this.updateElementHTML('instructions', html);
    }

    updateCutLine() {
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            cutLine.setAttribute('x1', this.gameState.cutX);
            cutLine.setAttribute('x2', this.gameState.cutX);
        }

        this.updateElement('cut-position', `${this.gameState.cutPosition.toFixed(1)}%`);

        const slider = document.getElementById('cut-slider');
        if (slider) {
            slider.value = this.gameState.cutX;
        }
    }

    updatePlayerValueDisplays() {
        this.gameState.updatePlayerValues();

        const pieceValues = DivideChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );

        this.updateElement('player1Value',
            `Left: ${pieceValues.player1.left.toFixed(1)} | Right: ${pieceValues.player1.right.toFixed(1)}`);

        this.updateElement('player2Value',
            `Left: ${pieceValues.player2.left.toFixed(1)} | Right: ${pieceValues.player2.right.toFixed(1)}`);
    }

    updateValidationDisplays() {
        const validation = this.gameState.validateTotals();

        ['player1', 'player2'].forEach((player, index) => {
            const playerNum = index + 1;
            const totalElement = document.getElementById(`p${playerNum}-total`);
            if (totalElement) {
                const span = totalElement.querySelector('span');
                if (span) {
                    span.textContent = validation[player].total;
                    span.className = validation[player].valid ? 'valid' : 'invalid';
                }
            }
        });
    }

    updatePieceOverlays() {
        const leftPiece = document.getElementById('left-piece');
        const rightPiece = document.getElementById('right-piece');

        if (this.gameState.step === DIVIDE_CHOOSE_CONFIG.STEPS.CHOOSING) {
            if (leftPiece) {
                leftPiece.style.stroke = '#3182ce';
                leftPiece.style.strokeWidth = '3';
                leftPiece.style.cursor = 'pointer';
                leftPiece.setAttribute('width', this.gameState.cutX);
            }
            if (rightPiece) {
                rightPiece.style.stroke = '#3182ce';
                rightPiece.style.strokeWidth = '3';
                rightPiece.style.cursor = 'pointer';
                rightPiece.setAttribute('x', this.gameState.cutX);
                rightPiece.setAttribute('width', BASE_CONFIG.CANVAS.WIDTH - this.gameState.cutX);
            }
        } else if (this.gameState.step === DIVIDE_CHOOSE_CONFIG.STEPS.COMPLETE && this.gameState.selectedPiece) {
            const selectedOverlay = this.gameState.selectedPiece === 'left' ? leftPiece : rightPiece;
            if (selectedOverlay) {
                selectedOverlay.style.fill = 'rgba(49, 130, 206, 0.3)';
                selectedOverlay.style.stroke = '#3182ce';
                selectedOverlay.style.strokeWidth = '4';
            }
        } else {
            if (leftPiece) {
                leftPiece.style.stroke = 'rgba(0,0,0,0)';
                leftPiece.style.fill = 'rgba(0,0,0,0)';
                leftPiece.style.cursor = 'default';
            }
            if (rightPiece) {
                rightPiece.style.stroke = 'rgba(0,0,0,0)';
                rightPiece.style.fill = 'rgba(0,0,0,0)';
                rightPiece.style.cursor = 'default';
            }
        }
    }

    updateWarning() {
        const pieceValues = DivideChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );

        const p1Difference = Math.abs(pieceValues.player1.left - pieceValues.player1.right);
        const showWarning = p1Difference > 10;

        this.toggleElement('warning', showWarning);
    }

    showResults() {
        if (!this.gameState.selectedPiece) return;

        const pieceValues = DivideChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );
        const analysis = DivideChooseCalculationEngine.analyzeResults(pieceValues, this.gameState.selectedPiece);

        this.updateElement('result-text',
            `Player 2 selected the ${this.gameState.selectedPiece} piece. Player 1 receives the ${this.gameState.selectedPiece === 'left' ? 'right' : 'left'} piece.`);

        const proportionalElement = document.getElementById('proportional-result');
        if (proportionalElement) {
            proportionalElement.textContent = analysis.proportional ?
                'Both players get ≥50% value' : 'Someone gets <50% value';
            proportionalElement.style.color = analysis.proportional ? '#22543d' : '#c53030';
        }

        const envyElement = document.getElementById('envy-result');
        if (envyElement) {
            envyElement.textContent = 'Neither player envies the other';
            envyElement.style.color = '#22543d';
        }

        this.addClass('results', 'visible');
    }

    hideResults() {
        this.removeClass('results', 'visible');
    }
}

// ===== ALGORITHM REGISTRATION =====

// Wait for the demo system to be available, then register this algorithm
function registerDivideAndChoose() {
    if (window.DemoSystem) {
        const algorithm = new DivideAndChooseAlgorithm();
        window.DemoSystem.getRegistry().register('divide-and-choose', algorithm);
        console.log('Divide-and-Choose algorithm registered successfully');
    } else {
        // Demo system not ready yet, try again in a moment
        setTimeout(registerDivideAndChoose, 100);
    }
}

// Start registration process
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerDivideAndChoose);
} else {
    registerDivideAndChoose();
}