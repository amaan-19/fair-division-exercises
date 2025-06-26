/**
 * Divide-and-Choose Algorithm
 */

// ===== ALGORITHM CONFIGURATION =====
const DIVIDE_CHOOSE_CONFIG = {
    // Algorithm metadata
    id: 'divide-and-choose',
    name: 'Divide-and-Choose',
    description: 'Fundamental fair division procedure for two players',
    playerCount: 2,
    type: 'discrete',

    // Fairness properties
    properties: ['proportional', 'envy-free', 'strategy-proof'],

    // Algorithm-specific settings
    settings: {
        enableRealTimeUpdate: true,
        showValueCalculations: true,
        requireEqualPieces: false // Player 1 can make unequal cuts
    }
};

// ===== ALGORITHM LOGIC =====
class DivideAndChooseAlgorithm {
    constructor() {
        this.selectedPiece = null;
        this.cutMade = false;
        this.gameComplete = false;
    }

    // Validation logic
    static validateCut(state, api) {
        const validation = api.validatePlayerTotals(state.playerValues);

        if (!validation.player1.valid || !validation.player2.valid) {
            const errors = [];
            if (!validation.player1.valid) {
                errors.push(`Player 1 total: ${validation.player1.total} (expected: ${validation.player1.expected})`);
            }
            if (!validation.player2.valid) {
                errors.push(`Player 2 total: ${validation.player2.total} (expected: ${validation.player2.expected})`);
            }

            api.emit('validationError', {
                message: 'Player valuations must sum to 100!',
                errors
            });
            return false;
        }

        return true;
    }

    // Calculate and display piece values
    static updatePieceDisplays(state, api) {
        const regionValues = api.calculateRegionValues(state.cutPosition);
        const playerValues = state.playerValues;

        // Calculate values for both players
        const player1Left = api.calculatePlayerValue(regionValues.left, playerValues.player1);
        const player1Right = api.calculatePlayerValue(regionValues.right, playerValues.player1);
        const player2Left = api.calculatePlayerValue(regionValues.left, playerValues.player2);
        const player2Right = api.calculatePlayerValue(regionValues.right, playerValues.player2);

        // Update displays
        DivideAndChooseAlgorithm.updateValueDisplay('player1-left-value', player1Left);
        DivideAndChooseAlgorithm.updateValueDisplay('player1-right-value', player1Right);
        DivideAndChooseAlgorithm.updateValueDisplay('player2-left-value', player2Left);
        DivideAndChooseAlgorithm.updateValueDisplay('player2-right-value', player2Right);

        // Store calculated values for results
        api.setAlgorithmData('pieceValues', {
            player1: { left: player1Left, right: player1Right },
            player2: { left: player2Left, right: player2Right }
        });

        Logger.debug('Piece values updated:', {
            player1: { left: player1Left.toFixed(1), right: player1Right.toFixed(1) },
            player2: { left: player2Left.toFixed(1), right: player2Right.toFixed(1) }
        });
    }

    static updateValueDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toFixed(1);
        }
    }

    // Handle piece selection
    static handlePieceSelection(piece, state, api) {
        Logger.info(`Player 2 selected: ${piece} piece`);

        const algorithm = api.getState().algorithmData.algorithm;
        if (algorithm) {
            algorithm.selectedPiece = piece;
            algorithm.gameComplete = true;
        }

        // Visual feedback
        DivideAndChooseAlgorithm.highlightSelectedPiece(piece);
        DivideAndChooseAlgorithm.showResults(piece, state, api);

        // Update UI
        api.updateInstructions('<strong>Selection Complete!</strong> Player 2 has chosen their piece.');
        api.disableElement('left-piece');
        api.disableElement('right-piece');
        api.showElement('results');

        api.emit('pieceSelected', { piece, player: 'player2' });
    }

    static highlightSelectedPiece(piece) {
        const leftPiece = document.getElementById('left-piece');
        const rightPiece = document.getElementById('right-piece');

        if (leftPiece && rightPiece) {
            if (piece === 'left') {
                leftPiece.classList.add('selected');
                rightPiece.style.opacity = '0.3';
            } else {
                rightPiece.classList.add('selected');
                leftPiece.style.opacity = '0.3';
            }
        }
    }

    static showResults(selectedPiece, state, api) {
        const pieceValues = api.getState().algorithmData.pieceValues;
        if (!pieceValues) return;

        const player1Gets = selectedPiece === 'left' ? 'right' : 'left';
        const player2Gets = selectedPiece;

        const player1Value = pieceValues.player1[player1Gets];
        const player2Value = pieceValues.player2[player2Gets];

        const resultsHTML = `
            <div class="results-summary">
                <h3>Final Allocation</h3>
                <div class="allocation-grid">
                    <div class="player-result">
                        <h4>Player 1 (Divider)</h4>
                        <p>Receives: <strong>${player1Gets.charAt(0).toUpperCase() + player1Gets.slice(1)} piece</strong></p>
                        <p>Value: <strong>${player1Value.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 2 (Chooser)</h4>
                        <p>Receives: <strong>${player2Gets.charAt(0).toUpperCase() + player2Gets.slice(1)} piece</strong></p>
                        <p>Value: <strong>${player2Value.toFixed(1)} points</strong></p>
                    </div>
                </div>
                
                <div class="fairness-analysis">
                    <h4>Fairness Properties</h4>
                    <ul>
                        <li><strong>Proportional:</strong> Both players receive at least 50% of their valuation</li>
                        <li><strong>Envy-free:</strong> Each player prefers their piece to the other's</li>
                        <li><strong>Strategy-proof:</strong> Truth-telling is optimal for both players</li>
                    </ul>
                </div>
            </div>
        `;

        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            const contentElement = document.getElementById('result-content');
            contentElement.innerHTML = resultsHTML;
        }

        api.showElement(resultsElement);

        api.setAlgorithmData('finalResults', {
            player1: { piece: player1Gets, value: player1Value },
            player2: { piece: player2Gets, value: player2Value },
            selectedPiece
        });

        Logger.info('Results displayed:', {
            player1: `${player1Gets} piece (${player1Value.toFixed(1)} points)`,
            player2: `${player2Gets} piece (${player2Value.toFixed(1)} points)`
        });
    }
}

// ===== ALGORITHM STEPS DEFINITION =====
const DIVIDE_CHOOSE_STEPS = [
    {
        id: 'cutting',
        title: 'Step 1: Position the cut',
        instructions: 'Player 1, adjust the cut position using the slider below to create two pieces you value equally.',
        enabledControls: ['cutSlider', 'makeCutButton'],

        onStepEnter: (state, api) => {
            Logger.debug('Entered cutting step');

            // Initialize algorithm instance
            api.setAlgorithmData('algorithm', new DivideAndChooseAlgorithm());

            // Setup UI
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');
            api.enableElement('cut-slider');

            // Enable real-time updates if configured
            if (DIVIDE_CHOOSE_CONFIG.settings.enableRealTimeUpdate) {
                DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
            }

            // Listen for cut position changes
            api.on('cutPositionChanged', () => {
                if (DIVIDE_CHOOSE_CONFIG.settings.enableRealTimeUpdate) {
                    DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
                }
            });
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting cutting step');
            api.hideElement('make-cut-btn');
            api.disableElement('cut-slider');
        }
    },

    {
        id: 'choosing',
        title: 'Step 2: Choose a piece',
        instructions: 'Player 2, click on the piece you prefer!',
        enabledControls: ['pieceSelection'],

        onStepEnter: (state, api) => {
            Logger.debug('Entered choosing step');

            // Show piece overlays
            api.showElement('left-piece-overlay');
            api.showElement('right-piece-overlay');

            // Setup piece selection handlers
            const leftPiece = document.getElementById('left-piece');
            const rightPiece = document.getElementById('right-piece');

            if (leftPiece) {
                leftPiece.style.cursor = 'pointer';
                leftPiece.onclick = () => DivideAndChooseAlgorithm.handlePieceSelection('left', state, api);
            }

            if (rightPiece) {
                rightPiece.style.cursor = 'pointer';
                rightPiece.onclick = () => DivideAndChooseAlgorithm.handlePieceSelection('right', state, api);
            }

            // Update displays one final time
            DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting choosing step');

            // Clean up event handlers
            const leftPiece = document.getElementById('left-piece');
            const rightPiece = document.getElementById('right-piece');

            if (leftPiece) {
                leftPiece.style.cursor = '';
                leftPiece.onclick = null;
            }

            if (rightPiece) {
                rightPiece.style.cursor = '';
                rightPiece.onclick = null;
            }
        }
    }
];

// ===== ALGORITHM CONFIGURATION OBJECT =====
const divideAndChooseConfig = {
    ...DIVIDE_CHOOSE_CONFIG,
    steps: DIVIDE_CHOOSE_STEPS,

    // Lifecycle handlers
    onInit: (state, api) => {
        Logger.info('Divide-and-Choose algorithm initialized');
        DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
    },

    onStart: (state, api) => {
        Logger.info('Divide-and-Choose algorithm started');
        api.nextStep();
    },

    onMakeCut: (state, api) => {
        Logger.info('Make Cut button clicked');

        // Validate before proceeding
        if (!DivideAndChooseAlgorithm.validateCut(state, api)) {
            return; // Stay on current step if validation fails
        }

        // Mark cut as made
        const algorithm = api.getState().algorithmData.algorithm;
        if (algorithm) {
            algorithm.cutMade = true;
        }

        Logger.info(`Cut finalized at position: ${state.cutPosition}`);

        // Show piece overlays and advance to choosing
        DivideAndChooseAlgorithm.showPieceOverlays(state.cutPosition);
        api.nextStep();
    },

    onPlayerValueChange: (state, api) => {
        // Update displays in real-time if enabled and we're in cutting step
        if (DIVIDE_CHOOSE_CONFIG.settings.enableRealTimeUpdate && api.getCurrentStep() === 0) {
            DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
        }
    },

    onReset: (state, api) => {
        Logger.info('Divide-and-Choose algorithm reset');

        // Clear visual elements
        DivideAndChooseAlgorithm.clearPieceOverlays();

        // Reset algorithm state
        api.setAlgorithmData('algorithm', null);
        api.setAlgorithmData('pieceValues', null);
        api.setAlgorithmData('finalResults', null);

        // Reset UI
        api.hideElement('results');
        api.enableElement('cut-slider');
    }
};

// Add helper methods to the algorithm class
DivideAndChooseAlgorithm.showPieceOverlays = function(cutPosition) {
    const leftOverlay = document.getElementById('left-piece-overlay');
    const rightOverlay = document.getElementById('right-piece-overlay');

    if (leftOverlay && rightOverlay) {
        // Calculate piece boundaries based on cut position
        const cutX = (cutPosition / 100) * 800; // Assuming 800px canvas width

        leftOverlay.setAttribute('width', cutX.toString(1));
        rightOverlay.setAttribute('x', cutX.toString(1));
        rightOverlay.setAttribute('width', (800 - cutX).toString(1));

        leftOverlay.style.display = 'block';
        rightOverlay.style.display = 'block';

        Logger.debug(`Piece overlays shown with cut at ${cutPosition}%`);
    }
};

DivideAndChooseAlgorithm.clearPieceOverlays = function() {
    const overlays = ['left-piece-overlay', 'right-piece-overlay', 'left-piece', 'right-piece'];

    overlays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            element.classList.remove('selected');
            element.style.opacity = '';
        }
    });

    Logger.debug('Piece overlays cleared');
};

// ===== REGISTRATION =====
// Register the algorithm with the demo system
window.FairDivisionCore.register(DIVIDE_CHOOSE_CONFIG.id, divideAndChooseConfig);

Logger.info(`${DIVIDE_CHOOSE_CONFIG.name} algorithm loaded and registered`);