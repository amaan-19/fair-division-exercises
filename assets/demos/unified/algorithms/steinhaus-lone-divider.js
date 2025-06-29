/**
 * Steinhaus' Lone-Divider Plug-in
 */

// ===== ALGORITHM LOGIC =====
class SteinhausLoneDividerAlgorithm {
    static validatePlayerTotals(state) {
        const colors = ['blue', 'red', 'green', 'orange', 'pink', 'purple'];
        const errors = [];
        let allValid = true;

        ['player1', 'player2', 'player3'].forEach((player, index) => {
            const total = colors.reduce((sum, color) => sum + (state.playerValues[player][color] || 0), 0);
            if (Math.abs(total - 100) > 0.1) {
                errors.push(`Player ${index + 1}: ${total} (needs 100)`);
                allValid = false;
            }
        });

        return { valid: allValid, errors };
    }

    static calculateThreePieceValues(state) {
        // Convert cut positions to sorted array
        const cut1Pos = state.cutPosition || 0;
        const cut2Pos = state.cutPosition2 || 0;
        const cuts = [0, Math.min(cut1Pos, cut2Pos), Math.max(cut1Pos, cut2Pos), 100];

        const pieceValues = { player1: [], player2: [], player3: [] };

        // Calculate values for each of the 3 pieces
        for (let pieceIdx = 0; pieceIdx < 3; pieceIdx++) {
            const pieceStart = cuts[pieceIdx];
            const pieceEnd = cuts[pieceIdx + 1];

            ['player1', 'player2', 'player3'].forEach(player => {
                const regionValues = SteinhausLoneDividerAlgorithm.calculateRegionValuesForPiece(pieceStart, pieceEnd);
                const totalValue = SteinhausLoneDividerAlgorithm.calculatePlayerValueFromRegions(regionValues, state.playerValues[player]);
                pieceValues[player][pieceIdx] = totalValue;
            });
        }

        return pieceValues;
    }

    static calculateRegionValuesForPiece(pieceStart, pieceEnd) {
        const regions = {
            blue: { start: 0, end: 75 },
            red: { start: 75, end: 100 },
            green: { start: 18.75, end: 75 },
            orange: { start: 75, end: 100 },
            pink: { start: 0, end: 18.75 },
            purple: { start: 18.75, end: 100 }
        };

        const regionValues = {};

        for (const [color, bounds] of Object.entries(regions)) {
            const regionWidth = bounds.end - bounds.start;
            let overlapWidth = 0;

            if (pieceEnd > bounds.start && pieceStart < bounds.end) {
                const overlapStart = Math.max(pieceStart, bounds.start);
                const overlapEnd = Math.min(pieceEnd, bounds.end);
                overlapWidth = overlapEnd - overlapStart;
            }

            const overlapPercent = (overlapWidth / regionWidth) * 100;
            regionValues[color] = overlapPercent;
        }

        return regionValues;
    }

    static calculatePlayerValueFromRegions(regionValues, playerValues) {
        return Object.entries(regionValues).reduce((total, [color, percentage]) => {
            return total + (percentage / 100) * (playerValues[color] || 0);
        }, 0);
    }

    static checkDividerEquality(dividerValues) {
        const maxDiff = Math.max(
            Math.abs(dividerValues[0] - dividerValues[1]),
            Math.abs(dividerValues[1] - dividerValues[2]),
            Math.abs(dividerValues[0] - dividerValues[2])
        );
        return { isEqual: maxDiff < 2.0, maxDiff };
    }

    static updatePieceDisplays(state, api) {
        const values = SteinhausLoneDividerAlgorithm.calculateThreePieceValues(state);

        // Update player value displays
        ['player1', 'player2', 'player3'].forEach(player => {
            const display = document.getElementById(`${player}-values`);
            if (display) {
                const vals = values[player];
                display.textContent = `P1: ${vals[0].toFixed(1)} | P2: ${vals[1].toFixed(1)} | P3: ${vals[2].toFixed(1)}`;
            }
        });

        // Store values for later use
        api.setAlgorithmData('pieceValues', values);
    }

    static analyzeAcceptablePieces(state, api) {
        const pieceValues = api.getState().algorithmData.pieceValues;
        const threshold = 100 / 3; // 33.33%

        const acceptablePieces = {
            player2: [],
            player3: []
        };

        // Find acceptable pieces for each non-divider
        for (let i = 0; i < 3; i++) {
            if (pieceValues.player2[i] >= threshold) acceptablePieces.player2.push(i);
            if (pieceValues.player3[i] >= threshold) acceptablePieces.player3.push(i);
        }

        api.setAlgorithmData('acceptablePieces', acceptablePieces);

        // Determine algorithm case
        const p2Count = acceptablePieces.player2.length;
        const p3Count = acceptablePieces.player3.length;

        Logger.info(`Player 2 sees ${p2Count} acceptable pieces: ${acceptablePieces.player2}`);
        Logger.info(`Player 3 sees ${p3Count} acceptable pieces: ${acceptablePieces.player3}`);

        if (p2Count >= 2 || p3Count >= 2) {
            // Case A: Sequential selection
            api.setAlgorithmData('algorithmCase', 'A');
            api.updateInstructions(`<strong>Case A:</strong> Player 3 sees ${p3Count} acceptable pieces, Player 2 sees ${p2Count} acceptable pieces. Sequential selection begins.`);

            setTimeout(() => {
                api.nextStep(); // Go to Player 3 selection
            }, 2000);
        } else {
            // Case B: Reconstruction needed
            api.setAlgorithmData('algorithmCase', 'B');
            api.updateInstructions('<strong>Case B:</strong> Both players see at most 1 acceptable piece. Reconstruction required.');

            // Handle Case B immediately
            setTimeout(() => {
                SteinhausLoneDividerAlgorithm.handleCaseB(state, api);
            }, 2000);
        }
    }

    static handleCaseB(state, api) {
        const acceptablePieces = api.getState().algorithmData.acceptablePieces;

        // Find the piece that both non-dividers find unacceptable
        let unacceptablePiece = null;
        for (let i = 0; i < 3; i++) {
            if (!acceptablePieces.player2.includes(i) && !acceptablePieces.player3.includes(i)) {
                unacceptablePiece = i;
                break;
            }
        }

        if (unacceptablePiece !== null) {
            const finalAllocation = { player1: unacceptablePiece };

            // Simulate divide-and-choose on remaining pieces
            const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);
            const randomAssignment = Math.random() < 0.5;

            if (randomAssignment) {
                finalAllocation.player2 = remainingPieces[0];
                finalAllocation.player3 = remainingPieces[1];
            } else {
                finalAllocation.player2 = remainingPieces[1];
                finalAllocation.player3 = remainingPieces[0];
            }

            api.setAlgorithmData('finalAllocation', finalAllocation);
            SteinhausLoneDividerAlgorithm.showFinalResults(state, api);
        } else {
            Logger.error('Could not find unacceptable piece for Case B');
        }
    }

    static enablePieceSelection(state, api, selectingPlayer) {
        // Show piece overlays for selection
        const cut1Pos = state.cutPosition || 0;
        const cut2Pos = state.cutPosition2 || 0;
        const cut1X = (Math.min(cut1Pos, cut2Pos) / 100) * 800;
        const cut2X = (Math.max(cut1Pos, cut2Pos) / 100) * 800;

        // Update piece overlays
        const piece1 = document.getElementById('steinhaus-piece-1');
        const piece2 = document.getElementById('steinhaus-piece-2');
        const piece3 = document.getElementById('steinhaus-piece-3');

        if (piece1 && piece2 && piece3) {
            piece1.setAttribute('width', cut1X);
            piece1.style.display = 'block';
            piece1.style.cursor = 'pointer';

            piece2.setAttribute('x', cut1X);
            piece2.setAttribute('width', cut2X - cut1X);
            piece2.style.display = 'block';
            piece2.style.cursor = 'pointer';

            piece3.setAttribute('x', cut2X);
            piece3.setAttribute('width', 800 - cut2X);
            piece3.style.display = 'block';
            piece3.style.cursor = 'pointer';

            // Add click handlers
            piece1.onclick = () => SteinhausLoneDividerAlgorithm.handlePieceSelection(0, selectingPlayer, state, api);
            piece2.onclick = () => SteinhausLoneDividerAlgorithm.handlePieceSelection(1, selectingPlayer, state, api);
            piece3.onclick = () => SteinhausLoneDividerAlgorithm.handlePieceSelection(2, selectingPlayer, state, api);
        }
    }

    static handlePieceSelection(pieceIndex, selectingPlayer, state, api) {
        Logger.info(`Player ${selectingPlayer} selected piece ${pieceIndex + 1}`);

        const currentAllocation = api.getState().algorithmData.finalAllocation || {};
        currentAllocation[`player${selectingPlayer}`] = pieceIndex;
        api.setAlgorithmData('finalAllocation', currentAllocation);

        // Disable selected piece
        const selectedPiece = document.getElementById(`steinhaus-piece-${pieceIndex + 1}`);
        if (selectedPiece) {
            selectedPiece.style.fill = 'rgba(128,128,128,0.5)';
            selectedPiece.style.cursor = 'not-allowed';
            selectedPiece.onclick = null;
        }

        if (selectingPlayer === 3) {
            // Player 3 selected, now Player 2's turn
            api.updateInstructions('Player 2, choose from the remaining pieces!');
            api.nextStep();
        } else if (selectingPlayer === 2) {
            // Player 2 selected, assign remaining piece to Player 1
            const allPieces = [0, 1, 2];
            const remainingPiece = allPieces.find(i =>
                i !== currentAllocation.player2 && i !== currentAllocation.player3
            );
            currentAllocation.player1 = remainingPiece;
            api.setAlgorithmData('finalAllocation', currentAllocation);

            SteinhausLoneDividerAlgorithm.showFinalResults(state, api);
        }
    }

    static showFinalResults(state, api) {
        const allocation = api.getState().algorithmData.finalAllocation;
        const pieceValues = api.getState().algorithmData.pieceValues;
        const algorithmCase = api.getState().algorithmData.algorithmCase;

        if (!allocation || !pieceValues) {
            Logger.error('Missing data for final results');
            return;
        }

        const player1Final = pieceValues.player1[allocation.player1];
        const player2Final = pieceValues.player2[allocation.player2];
        const player3Final = pieceValues.player3[allocation.player3];

        const proportional = player1Final >= 33.0 && player2Final >= 33.0 && player3Final >= 33.0;

        const resultsHTML = `
            <div class="results-summary">
                <h3>Steinhaus Lone-Divider Complete!</h3>
                <p><strong>Algorithm Path:</strong> Case ${algorithmCase}</p>
                
                <div class="allocation-grid">
                    <div class="player-result">
                        <h4>Player 1 (Divider)</h4>
                        <p>Receives: <strong>Piece ${allocation.player1 + 1}</strong></p>
                        <p>Value: <strong>${player1Final.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 2</h4>
                        <p>Receives: <strong>Piece ${allocation.player2 + 1}</strong></p>
                        <p>Value: <strong>${player2Final.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 3</h4>
                        <p>Receives: <strong>Piece ${allocation.player3 + 1}</strong></p>
                        <p>Value: <strong>${player3Final.toFixed(1)} points</strong></p>
                    </div>
                </div>

                <div class="fairness-analysis">
                    <h4>Fairness Properties</h4>
                    <p><strong>Proportional:</strong> ${proportional ? '✅ Yes' : '❌ No'} (all players get ≥33.3% value)</p>
                    <p><strong>Note:</strong> Steinhaus' algorithm only guarantees proportionality, not envy-freeness</p>
                </div>
            </div>
        `;

        api.showElement('results');
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            const contentElement = document.getElementById('result-content');
            if (contentElement) {
                contentElement.innerHTML = resultsHTML;
            } else {
                resultsElement.innerHTML = `<h3>Results</h3>${resultsHTML}`;
            }
            resultsElement.style.display = 'block';
        }

        Logger.info('Steinhaus results displayed successfully');
    }

    static clearPieceSelection() {
        ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                element.style.fill = '';
                element.style.cursor = '';
                element.onclick = null;
            }
        });
    }
}

// ===== ALGORITHM STEPS =====
const STEINHAUS_STEPS = [
    {
        id: 'initial-division',
        title: 'Step 1: Create three equal pieces',
        instructions: 'Player 1 (Divider), use the sliders to create three pieces you value equally.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered initial division step');

            // Show dual cut controls
            api.showElement('cut-control-2');
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');

            // Initial update
            SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting initial division step');
            api.hideElement('make-cut-btn');
        }
    },

    {
        id: 'analysis-phase',
        title: 'Step 2: Non-divider analysis',
        instructions: 'Analyzing which pieces are acceptable to Players 2 and 3...',

        onStepEnter: (state, api) => {
            Logger.debug('Entered analysis phase');
            api.setStartButtonState('hidden');
            SteinhausLoneDividerAlgorithm.analyzeAcceptablePieces(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting analysis phase');
        }
    },

    {
        id: 'player3-selection',
        title: 'Step 3: Player 3 selects',
        instructions: 'Player 3, click on your preferred piece!',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Player 3 selection');
            SteinhausLoneDividerAlgorithm.enablePieceSelection(state, api, 3);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Player 3 selection');
        }
    },

    {
        id: 'player2-selection',
        title: 'Step 4: Player 2 selects',
        instructions: 'Player 2, click on your preferred piece from the remaining options!',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Player 2 selection');
            SteinhausLoneDividerAlgorithm.enablePieceSelection(state, api, 2);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Player 2 selection');
        }
    }
];

// ===== ALGORITHM CONFIGURATION =====
const steinhausLoneDividerConfig = {
    name: "Steinhaus' Lone-Divider",
    description: "Three-player fair division with lone divider approach",
    playerCount: 3,
    steps: STEINHAUS_STEPS,

    onInit: (state, api) => {
        Logger.debug("Steinhaus' Lone-Divider algorithm initialized");
        // Ensure we have both cut positions
        api.setCutPosition2(50); // Set default second cut
        SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
    },

    onStateChange: (stateKey, state, api) => {
        // Handle real-time updates during cutting phase
        if ((stateKey === 'cutPosition' || stateKey === 'cutPosition2') && api.getCurrentStep() === 0) {
            SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
        }

        // Handle validation changes
        if (stateKey === 'playerValues' && api.getCurrentStep() === 0) {
            const validation = SteinhausLoneDividerAlgorithm.validatePlayerTotals(state);
            api.setStartButtonState(validation.valid ? 'enabled' : 'disabled');
            SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
        }
    },

    onStart: (state, api) => {
        Logger.info('Start button clicked for Steinhaus algorithm');
        // This algorithm starts by going directly to step 1 (cutting)
        api.nextStep();
    },

    onMakeCut: (state, api) => {
        Logger.info('Make Cut button clicked for Steinhaus algorithm');

        // Validate that all player values sum to 100
        const validation = SteinhausLoneDividerAlgorithm.validatePlayerTotals(state);
        if (!validation.valid) {
            const errors = validation.errors.join(', ');
            api.emit('validationError', {
                message: 'Player valuations must sum to 100!',
                errors: validation.errors
            });
            return;
        }

        // Check if divider values are reasonably equal
        const pieceValues = SteinhausLoneDividerAlgorithm.calculateThreePieceValues(state);
        const equalityCheck = SteinhausLoneDividerAlgorithm.checkDividerEquality(pieceValues.player1);

        if (!equalityCheck.isEqual) {
            const proceed = confirm(`Warning: Your pieces are not equally valued!\nPiece 1: ${pieceValues.player1[0].toFixed(1)}\nPiece 2: ${pieceValues.player1[1].toFixed(1)}\nPiece 3: ${pieceValues.player1[2].toFixed(1)}\n\nProceed anyway?`);
            if (!proceed) return;
        }

        // Store piece values and move to analysis
        api.setAlgorithmData('pieceValues', pieceValues);
        api.nextStep();
    },

    onReset: (state, api) => {
        Logger.info('Steinhaus algorithm reset');

        // Reset algorithm state
        api.setAlgorithmData('pieceValues', null);
        api.setAlgorithmData('acceptablePieces', null);
        api.setAlgorithmData('algorithmCase', null);
        api.setAlgorithmData('finalAllocation', null);

        // Reset cut positions
        api.setCutPosition2(50);

        // Clean up UI
        SteinhausLoneDividerAlgorithm.clearPieceSelection();
        api.hideElement('cut-control-2');
        api.hideElement('results');
        api.setStartButtonState('enabled');

        // Update displays
        SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
    }
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('steinhaus-lone-divider', steinhausLoneDividerConfig);
Logger.info(`${steinhausLoneDividerConfig.name} algorithm loaded and registered`);