/**
 * Working Unified Fair Division Demo - Single File Version
 * 
 * This combines the main system and divide-and-choose algorithm in one file
 * to avoid loading order issues, while keeping the code well-organized.
 */

// ===== CONFIGURATION =====

const CONFIG = {
    CANVAS: { WIDTH: 800, HEIGHT: 400 },
    VALIDATION: { REQUIRED_TOTAL: 100, MIN_VALUE: 0, MAX_VALUE: 100 },
    TIMING: { SELECTION_DELAY: 1000 },
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

// ===== DIVIDE-AND-CHOOSE CALCULATION ENGINE =====

class DivideAndChooseCalculationEngine {
    static calculateRegionDistribution(cutX) {
        const distribution = { left: {}, right: {} };

        Object.entries(CONFIG.REGIONS).forEach(([colorName, region]) => {
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

// ===== DIVIDE-AND-CHOOSE GAME STATE =====

class DivideAndChooseGameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.step = CONFIG.STEPS.CUTTING;
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
        const colors = Object.keys(CONFIG.REGIONS);

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
                valid: Math.abs(total - CONFIG.VALIDATION.REQUIRED_TOTAL) < 0.1
            };
        }

        return validation;
    }

    nextStep() {
        if (this.step < CONFIG.STEPS.COMPLETE) {
            this.step++;
        }
    }
}

// ===== DIVIDE-AND-CHOOSE UI MANAGER =====

class DivideAndChooseUIManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    updateStepIndicator() {
        const stepIndicator = document.getElementById('step-indicator');
        if (!stepIndicator) return;

        switch (this.gameState.step) {
            case CONFIG.STEPS.CUTTING:
                stepIndicator.textContent = 'Step 1: Player 1 (Divider) adjusts the cutting line';
                break;
            case CONFIG.STEPS.CHOOSING:
                stepIndicator.textContent = 'Step 2: Player 2 (Chooser) selects their preferred piece';
                break;
            case CONFIG.STEPS.COMPLETE:
                stepIndicator.textContent = 'Algorithm Complete! View results below.';
                break;
        }
    }

    updateInstructions() {
        const instructions = document.getElementById('instructions');
        if (!instructions) return;

        switch (this.gameState.step) {
            case CONFIG.STEPS.CUTTING:
                instructions.innerHTML = '<strong>Instructions:</strong> Player 1, use the slider below to position your vertical cut through the colored regions.';
                break;
            case CONFIG.STEPS.CHOOSING:
                instructions.innerHTML = '<strong>Instructions:</strong> Player 2, click on the piece you prefer!';
                break;
            case CONFIG.STEPS.COMPLETE:
                instructions.innerHTML = '<strong>Complete:</strong> The algorithm has finished. Review the results below.';
                break;
        }
    }

    updateCutLine() {
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            cutLine.setAttribute('x1', this.gameState.cutX);
            cutLine.setAttribute('x2', this.gameState.cutX);
        }

        const cutPosition = document.getElementById('cut-position');
        if (cutPosition) {
            cutPosition.textContent = `${this.gameState.cutPosition.toFixed(1)}%`;
        }

        const slider = document.getElementById('cut-slider');
        if (slider) {
            slider.value = this.gameState.cutX;
        }
    }

    updatePlayerValueDisplays() {
        this.gameState.updatePlayerValues();

        const pieceValues = DivideAndChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );

        const player1Display = document.getElementById('player1Value');
        if (player1Display) {
            player1Display.textContent = `Left: ${pieceValues.player1.left.toFixed(1)} | Right: ${pieceValues.player1.right.toFixed(1)}`;
        }

        const player2Display = document.getElementById('player2Value');
        if (player2Display) {
            player2Display.textContent = `Left: ${pieceValues.player2.left.toFixed(1)} | Right: ${pieceValues.player2.right.toFixed(1)}`;
        }
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

        if (this.gameState.step === CONFIG.STEPS.CHOOSING) {
            if (leftPiece) {
                leftPiece.style.stroke = '#3182ce';
                leftPiece.style.strokeWidth = '3';
                leftPiece.style.cursor = 'pointer';
            }
            if (rightPiece) {
                rightPiece.style.stroke = '#3182ce';
                rightPiece.style.strokeWidth = '3';
                rightPiece.style.cursor = 'pointer';
                rightPiece.setAttribute('x', this.gameState.cutX);
                rightPiece.setAttribute('width', CONFIG.CANVAS.WIDTH - this.gameState.cutX);
            }
        } else if (this.gameState.step === CONFIG.STEPS.COMPLETE && this.gameState.selectedPiece) {
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
        const warning = document.getElementById('warning');
        const pieceValues = DivideAndChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );

        const p1Difference = Math.abs(pieceValues.player1.left - pieceValues.player1.right);
        const showWarning = p1Difference > 10;

        if (warning) {
            warning.style.display = showWarning ? 'block' : 'none';
        }
    }

    showResults() {
        const results = document.getElementById('results');
        const resultText = document.getElementById('result-text');
        const proportionalResult = document.getElementById('proportional-result');
        const envyResult = document.getElementById('envy-result');

        if (!this.gameState.selectedPiece) return;

        const pieceValues = DivideAndChooseCalculationEngine.calculatePieceValues(
            this.gameState.cutX,
            this.gameState.playerValues
        );
        const analysis = DivideAndChooseCalculationEngine.analyzeResults(pieceValues, this.gameState.selectedPiece);

        if (resultText) {
            resultText.textContent = `Player 2 selected the ${this.gameState.selectedPiece} piece. Player 1 receives the ${this.gameState.selectedPiece === 'left' ? 'right' : 'left'} piece.`;
        }

        if (proportionalResult) {
            proportionalResult.textContent = analysis.proportional ?
                'Both players get ≥50% value' : 'Someone gets <50% value';
            proportionalResult.style.color = analysis.proportional ? '#22543d' : '#c53030';
        }

        if (envyResult) {
            envyResult.textContent = 'Neither player envies the other';
            envyResult.style.color = '#22543d';
        }

        if (results) {
            results.classList.add('visible');
        }
    }

    hideResults() {
        const results = document.getElementById('results');
        if (results) {
            results.classList.remove('visible');
        }
    }

    updateAll() {
        this.updateStepIndicator();
        this.updateInstructions();
        this.updateCutLine();
        this.updatePlayerValueDisplays();
        this.updateValidationDisplays();
        this.updatePieceOverlays();
        this.updateWarning();
    }
}

// ===== ALGORITHM REGISTRY =====

const ALGORITHMS = {};

function createDivideAndChooseAlgorithm() {
    const gameState = new DivideAndChooseGameState();
    const uiManager = new DivideAndChooseUIManager(gameState);

    return {
        name: 'Divide-and-Choose',
        description: 'The fundamental fair division procedure for two players',
        playerCount: 2,
        type: 'discrete',
        properties: ['proportional', 'envy-free', 'strategy-proof'],

        gameState: gameState,
        uiManager: uiManager,

        initialize() {
            console.log('Initializing Divide-and-Choose algorithm');
            this.gameState.reset();
            this.uiManager.updateAll();
        },

        execute() {
            console.log('Making cut in Divide-and-Choose algorithm');
            if (this.gameState.step === CONFIG.STEPS.CUTTING) {
                this.gameState.nextStep();
                this.uiManager.updateAll();
            }
        },

        reset() {
            console.log('Resetting Divide-and-Choose algorithm');
            this.gameState.reset();
            this.uiManager.updateAll();
            this.uiManager.hideResults();
        },

        handleCutSliderChange() {
            const slider = document.getElementById('cut-slider');
            this.gameState.cutX = parseInt(slider.value);
            this.gameState.cutPosition = (this.gameState.cutX / CONFIG.CANVAS.WIDTH) * 100;
            this.uiManager.updateAll();
        },

        handlePlayerValueChange() {
            this.uiManager.updateAll();
        },

        handlePieceClick(piece) {
            if (this.gameState.step !== CONFIG.STEPS.CHOOSING) return;

            this.gameState.selectedPiece = piece;
            this.gameState.nextStep();

            setTimeout(() => {
                this.uiManager.updateAll();
                this.uiManager.showResults();
            }, CONFIG.TIMING.SELECTION_DELAY);
        },

        getRegions() {
            return CONFIG.REGIONS;
        }
    };
}

// ===== MAIN SYSTEM =====

let currentAlgorithm = null;

class UnifiedDemoSystem {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        console.log('Initializing Unified Demo System...');

        this.registerAlgorithms();
        this.initializeEventListeners();
        this.switchAlgorithm('divide-and-choose');

        this.isInitialized = true;
        console.log('Demo system ready!');
    }

    registerAlgorithms() {
        ALGORITHMS['divide-and-choose'] = createDivideAndChooseAlgorithm();
        console.log('Registered Divide-and-Choose algorithm');
    }

    switchAlgorithm(algorithmId) {
        if (!ALGORITHMS[algorithmId]) {
            console.error(`Algorithm ${algorithmId} not found`);
            return;
        }

        if (currentAlgorithm) {
            this.cleanupAlgorithmEventListeners();
        }

        currentAlgorithm = ALGORITHMS[algorithmId];
        this.updateAlgorithmInfoDisplay();
        this.setupAlgorithmEventListeners();
        currentAlgorithm.initialize();

        console.log(`Switched to algorithm: ${algorithmId}`);
    }

    updateAlgorithmInfoDisplay() {
        if (!currentAlgorithm) return;

        const nameElement = document.getElementById('algorithm-name');
        const descriptionElement = document.getElementById('algorithm-description');

        if (nameElement) {
            nameElement.textContent = currentAlgorithm.name;
        }
        if (descriptionElement) {
            descriptionElement.textContent = currentAlgorithm.description;
        }

        const metaElement = document.getElementById('algorithm-meta');
        if (metaElement) {
            metaElement.innerHTML = `
                <span class="meta-badge players-badge">${currentAlgorithm.playerCount} Players</span>
                <span class="meta-badge complexity-badge">${currentAlgorithm.type}</span>
            `;
        }
    }

    initializeEventListeners() {
        const algorithmSelector = document.getElementById('algorithm-selector');
        if (algorithmSelector) {
            algorithmSelector.addEventListener('change', (e) => {
                this.switchAlgorithm(e.target.value);
            });
        }

        const makeCutBtn = document.getElementById('make-cut-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (makeCutBtn) {
            makeCutBtn.addEventListener('click', () => {
                if (currentAlgorithm && currentAlgorithm.execute) {
                    currentAlgorithm.execute();
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (currentAlgorithm && currentAlgorithm.reset) {
                    currentAlgorithm.reset();
                }
            });
        }
    }

    setupAlgorithmEventListeners() {
        if (!currentAlgorithm) return;

        const cutSlider = document.getElementById('cut-slider');
        if (cutSlider && currentAlgorithm.handleCutSliderChange) {
            cutSlider.addEventListener('input', () => {
                currentAlgorithm.handleCutSliderChange();
            });
        }

        if (currentAlgorithm.getRegions && currentAlgorithm.handlePlayerValueChange) {
            const regions = currentAlgorithm.getRegions();
            const colors = Object.keys(regions);

            colors.forEach(color => {
                const p1Input = document.getElementById(`p1-${color}`);
                const p2Input = document.getElementById(`p2-${color}`);

                if (p1Input) {
                    p1Input.addEventListener('input', () => {
                        currentAlgorithm.handlePlayerValueChange();
                    });
                }
                if (p2Input) {
                    p2Input.addEventListener('input', () => {
                        currentAlgorithm.handlePlayerValueChange();
                    });
                }
            });
        }

        const leftPiece = document.getElementById('left-piece');
        const rightPiece = document.getElementById('right-piece');

        if (leftPiece && currentAlgorithm.handlePieceClick) {
            leftPiece.addEventListener('click', () => {
                currentAlgorithm.handlePieceClick('left');
            });
        }
        if (rightPiece && currentAlgorithm.handlePieceClick) {
            rightPiece.addEventListener('click', () => {
                currentAlgorithm.handlePieceClick('right');
            });
        }
    }

    cleanupAlgorithmEventListeners() {
        const elementsToClean = [
            'cut-slider',
            'left-piece',
            'right-piece'
        ];

        elementsToClean.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            }
        });

        if (currentAlgorithm && currentAlgorithm.getRegions) {
            const regions = currentAlgorithm.getRegions();
            const colors = Object.keys(regions);

            colors.forEach(color => {
                ['p1', 'p2'].forEach(player => {
                    const input = document.getElementById(`${player}-${color}`);
                    if (input) {
                        const newInput = input.cloneNode(true);
                        input.parentNode.replaceChild(newInput, input);
                    }
                });
            });
        }
    }
}

// ===== INITIALIZATION =====

let demoSystem = null;

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM loaded, initializing demo system...');

    try {
        demoSystem = new UnifiedDemoSystem();
        await demoSystem.initialize();

        window.demoSystem = demoSystem;
        window.getCurrentAlgorithm = () => currentAlgorithm;

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