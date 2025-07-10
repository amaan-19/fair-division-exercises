/**
 * Divide-and-Choose Demo
 */

/**
 * Defines the demo plug-in and additional methods
 * @class
 */
class DivideAndChooseAlgorithm {
    /**
     * Represents the Divide-and-Choose Plug-in object
     * @constructor
     */
    constructor() {
        this.currentStep = 1;
        this.selectedPiece = null;
        this.cutMade = false;
    }

    /**
     * Validates the cut operation
     *
     * @param state - StateManager state
     * @param api - FairDivisionDemoSystem api
     * @returns {boolean} - True, if cut is valid; False, if cut is invalid
     */
    static validateCut(state, api) {
        // validate player totals
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

        // Ensure piece values are calculated before showing results
        DivideAndChooseAlgorithm.updatePieceDisplays(state, api);

        const algorithm = api.getState().algorithmData.algorithm;
        if (algorithm) {
            algorithm.selectedPiece = piece;
            algorithm.gameComplete = true;
        }

        // IMPORTANT: Show the results element FIRST
        api.showElement('results');

        // Visual feedback
        DivideAndChooseAlgorithm.highlightSelectedPiece(piece, api);

        // Then populate the results
        DivideAndChooseAlgorithm.showResults(piece, state, api);

        // Update UI
        api.updateInstructions('<strong>Selection Complete!</strong> Player 2 has chosen their piece.');
        api.disableElement('left-piece-overlay');
        api.disableElement('right-piece-overlay');

        api.emit('pieceSelected', { piece, player: 'player2' });
    }

    static highlightSelectedPiece(piece, api) {
        const leftOverlay = document.getElementById('left-piece-overlay');
        const rightOverlay = document.getElementById('right-piece-overlay');

        if (leftOverlay && rightOverlay) {
            if (piece === 'left') {
                leftOverlay.style.fill = 'rgba(49,130,206,0.6)';
                leftOverlay.style.stroke = '#2c5282';
                leftOverlay.style.strokeWidth = '4';
                rightOverlay.style.opacity = '0.3';
            } else {
                rightOverlay.style.fill = 'rgba(72,187,120,0.6)';
                rightOverlay.style.stroke = '#22543d';
                rightOverlay.style.strokeWidth = '4';
                leftOverlay.style.opacity = '0.3';
            }
        }
    }

    static showResults(selectedPiece, state, api) {
        Logger.info(`Showing results for selected piece: ${selectedPiece}`);

        const pieceValues = api.getState().algorithmData.pieceValues;
        if (!pieceValues) {
            Logger.error('No piece values found when showing results');
            return;
        }

        // Calculate which piece each player gets
        const player1Gets = selectedPiece === 'left' ? 'right' : 'left';
        const player2Gets = selectedPiece;

        // Get the values for each player's piece
        const player1Value = pieceValues.player1[player1Gets];
        const player2Value = pieceValues.player2[player2Gets];

        // Check if values are valid
        if (player1Value === undefined || player2Value === undefined) {
            Logger.error('Invalid piece values:', { player1Value, player2Value, pieceValues });
            return;
        }

        // Calculate fairness metrics
        const proportionalLowerBound = 50 - DEMO_CONFIG["VALIDATION"].TOLERANCE;
        const proportionalUpperBound = 50 + DEMO_CONFIG["VALIDATION"].TOLERANCE;
        const isProportional = player1Value >= proportionalLowerBound && player2Value >= proportionalUpperBound;
        const isEnvyFree = player2Value >= pieceValues.player2[player1Gets];

        // Create the results HTML
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
                <p><strong>Proportional:</strong> ${isProportional ? '✅ Yes' : '❌ No'} (both players get ≥50% value)</p>
                <p><strong>Envy-free:</strong> ${isEnvyFree ? '✅ Yes' : '❌ No'} (no player prefers the other's piece)</p>
                <p><strong>Strategy-proof:</strong> ✅ Yes (optimal strategy is to cut/choose honestly)</p>
            </div>
        </div>
    `;

        // Find the results container and populate it
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            const contentElement = document.getElementById('result-content');
            if (contentElement) {
                contentElement.innerHTML = resultsHTML;
                Logger.debug('Results HTML added to result-content element');
            } else {
                // Fallback: add directly to results if result-content doesn't exist
                Logger.warn('result-content element not found, adding directly to results');
                resultsElement.innerHTML = `<h3>Results</h3>${resultsHTML}`;
            }

            // Make sure the results element is visible
            resultsElement.style.display = 'block';
            Logger.debug('Results element made visible');
        } else {
            Logger.error('results element not found in DOM');
            return;
        }

        // Store the final results in algorithm data
        api.setAlgorithmData('finalResults', {
            player1: { piece: player1Gets, value: player1Value },
            player2: { piece: player2Gets, value: player2Value },
            selectedPiece,
            fairness: {
                proportional: isProportional,
                envyFree: isEnvyFree,
                strategyProof: true
            }
        });

        Logger.info('Results displayed successfully:', {
            player1: `${player1Gets} piece (${player1Value.toFixed(1)} points)`,
            player2: `${player2Gets} piece (${player2Value.toFixed(1)} points)`,
            proportional: isProportional,
            envyFree: isEnvyFree
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
            Logger.debug('Entered Step 1: cutting step...');

            // Initialize algorithm instance
            api.setAlgorithmData('algorithm', new DivideAndChooseAlgorithm());

            // Setup UI
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');
            api.enableElement('cut-slider');

            // Initial update
            DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
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
            const leftOverlay = document.getElementById('left-piece-overlay');
            const rightOverlay = document.getElementById('right-piece-overlay');

            if (leftOverlay) {
                leftOverlay.style.cursor = 'pointer';
                leftOverlay.onclick = () => DivideAndChooseAlgorithm.handlePieceSelection('left', state, api);
            }

            if (rightOverlay) {
                rightOverlay.style.cursor = 'pointer';
                rightOverlay.onclick = () => DivideAndChooseAlgorithm.handlePieceSelection('right', state, api);
            }

            // Update displays one final time
            DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting choosing step');

            // Clean up event handlers
            const leftOverlay = document.getElementById('left-piece-overlay');
            const rightOverlay = document.getElementById('right-piece-overlay');

            if (leftOverlay) {
                leftOverlay.style.cursor = '';
                leftOverlay.onclick = null;
            }

            if (rightOverlay) {
                rightOverlay.style.cursor = '';
                rightOverlay.onclick = null;
            }
        }
    }
];

// ===== ALGORITHM CONFIGURATION OBJECT =====
const divideAndChooseConfig = {
    name: 'Divide-and-Choose',
    description: 'Fundamental fair division procedure for two players',
    playerCount: 2,
    steps: DIVIDE_CHOOSE_STEPS,

    // Lifecycle handlers
    onInit: (state, api) => {
        Logger.debug('Divide-and-Choose algorithm initialized');
        api.setCutPosition(0);
        api.resetSlider('cut-slider');
        DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
    },

    onStateChange: (stateKey, state, api) => {
        // Handle real-time updates during cutting phase
        if (stateKey === 'cutPosition' && api.getCurrentStep() === 0) {
            DivideAndChooseAlgorithm.updatePieceDisplays(state, api);
        }
    },

    onStart: (state, api) => {
        Logger.info('Divide-and-Choose algorithm started');
        api.nextStep();
    },

    onMakeCut: (state, api) => {
        Logger.info('Make Cut button clicked');

        // Validate before proceeding
        if (!DivideAndChooseAlgorithm.validateCut(state, api)) {
            return;
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
        api.resetSlider('cut-slider');
        api.hideElement('cut-line');
        api.showElement('make-cut-btn');
        api.updateCutPositionDisplay(0);
    }
};

// Add helper methods to the algorithm class
DivideAndChooseAlgorithm.showPieceOverlays = function(cutPosition) {
    const leftOverlay = document.getElementById('left-piece-overlay');
    const rightOverlay = document.getElementById('right-piece-overlay');

    if (leftOverlay && rightOverlay) {
        // Calculate piece boundaries based on cut position
        const cutX = (cutPosition / 100) * 800;

        leftOverlay.setAttribute('width', cutX.toString());
        rightOverlay.setAttribute('x', cutX.toString());
        rightOverlay.setAttribute('width', (800 - cutX).toString());

        leftOverlay.style.display = 'block';
        rightOverlay.style.display = 'block';

        Logger.debug(`Piece overlays shown with cut at ${cutPosition}%`);
    }
};

DivideAndChooseAlgorithm.clearPieceOverlays = function() {
    const overlays = ['left-piece-overlay', 'right-piece-overlay'];

    overlays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            element.style.fill = '';
            element.style.stroke = '';
            element.style.strokeWidth = '';
            element.style.opacity = '';
            element.onclick = null;
            element.style.cursor = '';
        }
    });

    Logger.debug('Piece overlays cleared');
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('divide-and-choose', divideAndChooseConfig);
Logger.info(`${divideAndChooseConfig.name} algorithm loaded and registered`);