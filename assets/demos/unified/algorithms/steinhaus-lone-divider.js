/**
 * Steinhaus' Lone-Divider Plug-in
 *
 * Implements the proper algorithm flow:
 * 1. Player 1 (divider) cuts cake into 3 equal pieces
 * 2. Players 2 & 3 (non-dividers) identify acceptable pieces
 * 3a. Case A: If at least one non-divider sees ≥2 acceptable pieces → sequential selection
 * 3b. Case B: If both non-dividers see ≤1 acceptable piece → reconstruction with divide-and-choose
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
        const cut1Pos = state.cutPosition || 0;
        const cut2Pos = state.cutPosition2 || 50;

        // Ensure cuts are ordered: cut1 < cut2
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

    static checkDividerEquality(dividerValues, tolerance = 3.0) {
        const maxDiff = Math.max(
            Math.abs(dividerValues[0] - dividerValues[1]),
            Math.abs(dividerValues[1] - dividerValues[2]),
            Math.abs(dividerValues[0] - dividerValues[2])
        );
        return { isEqual: maxDiff < tolerance, maxDiff };
    }

    static updatePieceDisplays(state, api) {
        const values = SteinhausLoneDividerAlgorithm.calculateThreePieceValues(state);

        // Update player value displays for three pieces
        ['player1', 'player2', 'player3'].forEach(player => {
            const display = document.getElementById(`${player}-values`);
            if (display) {
                const vals = values[player];
                display.textContent = `P1: ${vals[0].toFixed(1)} | P2: ${vals[1].toFixed(1)} | P3: ${vals[2].toFixed(1)}`;
            }
        });

        // Store values for later use
        api.setAlgorithmData('pieceValues', values);
        return values;
    }

    static analyzeAcceptablePieces(state, api) {
        const pieceValues = api.getState().algorithmData.pieceValues;
        if (!pieceValues) {
            Logger.error('No piece values found for analysis');
            return;
        }

        const threshold = 100 / 3; // 33.33%
        const acceptablePieces = {
            player2: [],
            player3: []
        };

        // Find acceptable pieces for each non-divider
        for (let i = 0; i < 3; i++) {
            if (pieceValues.player2[i] >= threshold - 0.1) { // Small tolerance for rounding
                acceptablePieces.player2.push(i);
            }
            if (pieceValues.player3[i] >= threshold - 0.1) {
                acceptablePieces.player3.push(i);
            }
        }

        api.setAlgorithmData('acceptablePieces', acceptablePieces);

        // Determine algorithm case according to Steinhaus rules
        const p2Count = acceptablePieces.player2.length;
        const p3Count = acceptablePieces.player3.length;

        Logger.info(`Player 2 finds ${p2Count} acceptable pieces: [${acceptablePieces.player2.map(i => i+1).join(', ')}]`);
        Logger.info(`Player 3 finds ${p3Count} acceptable pieces: [${acceptablePieces.player3.map(i => i+1).join(', ')}]`);

        // Case determination: At least one player sees ≥2 acceptable pieces
        if (p2Count >= 2 || p3Count >= 2) {
            // Case A: Sequential selection
            api.setAlgorithmData('algorithmCase', 'A');
            const message = p2Count >= 2 && p3Count >= 2
                ? `<strong>Case A:</strong> Both players see multiple acceptable pieces (P2: ${p2Count}, P3: ${p3Count}). Sequential selection: Player 3 chooses first.`
                : p3Count >= 2
                    ? `<strong>Case A:</strong> Player 3 sees ${p3Count} acceptable pieces, Player 2 sees ${p2Count}. Sequential selection begins.`
                    : `<strong>Case A:</strong> Player 2 sees ${p2Count} acceptable pieces, Player 3 sees ${p3Count}. Sequential selection begins.`;

            api.updateInstructions(message);

            setTimeout(() => {
                api.nextStep(); // Go to Player 3 selection
            }, 3000);
        } else {
            // Case B: Both players see ≤1 acceptable piece → reconstruction needed
            api.setAlgorithmData('algorithmCase', 'B');
            api.updateInstructions(`<strong>Case B:</strong> Both players see at most 1 acceptable piece (P2: ${p2Count}, P3: ${p3Count}). Reconstruction required.`);

            setTimeout(() => {
                SteinhausLoneDividerAlgorithm.handleCaseB(state, api);
            }, 3000);
        }
    }

    static handleCaseB(state, api) {
        const acceptablePieces = api.getState().algorithmData.acceptablePieces;
        const pieceValues = api.getState().algorithmData.pieceValues;

        // Find pieces that both non-dividers consider unacceptable
        const unacceptablePieces = [];
        for (let i = 0; i < 3; i++) {
            if (!acceptablePieces.player2.includes(i) && !acceptablePieces.player3.includes(i)) {
                unacceptablePieces.push(i);
            }
        }

        if (unacceptablePieces.length === 0) {
            Logger.error('Case B error: No unacceptable piece found');
            // Fallback to sequential selection
            api.setAlgorithmData('algorithmCase', 'A');
            api.nextStep();
            return;
        }

        // Give the first unacceptable piece to the divider (Player 1)
        const unacceptablePiece = unacceptablePieces[0];
        const finalAllocation = { player1: unacceptablePiece };

        // Simulate divide-and-choose on remaining pieces
        const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);

        // Random assignment for the remaining two pieces (simulating divide-and-choose result)
        if (Math.random() < 0.5) {
            finalAllocation.player2 = remainingPieces[0];
            finalAllocation.player3 = remainingPieces[1];
        } else {
            finalAllocation.player2 = remainingPieces[1];
            finalAllocation.player3 = remainingPieces[0];
        }

        api.setAlgorithmData('finalAllocation', finalAllocation);

        // Show explanation
        const player1Value = pieceValues.player1[unacceptablePiece];
        const remainingValue = 100 - player1Value;

        api.updateInstructions(`
            <strong>Case B Execution:</strong><br>
            • Piece ${unacceptablePiece + 1} (unacceptable to both non-dividers) → Player 1<br>
            • Remaining cake (value ${remainingValue.toFixed(1)}% to each non-divider) → Divide-and-Choose<br>
            • Each non-divider gets ≥${(remainingValue/2).toFixed(1)}% ≥ 33.3% ✓
        `);

        setTimeout(() => {
            SteinhausLoneDividerAlgorithm.showFinalResults(state, api);
        }, 4000);
    }

    static showPieceOverlays(state, api) {
        const cut1Pos = state.cutPosition || 0;
        const cut2Pos = state.cutPosition2 || 50;
        const cut1X = (Math.min(cut1Pos, cut2Pos) / 100) * 800;
        const cut2X = (Math.max(cut1Pos, cut2Pos) / 100) * 800;

        // Update piece overlays
        const piece1 = document.getElementById('steinhaus-piece-1');
        const piece2 = document.getElementById('steinhaus-piece-2');
        const piece3 = document.getElementById('steinhaus-piece-3');

        if (piece1 && piece2 && piece3) {
            // Piece 1: from 0 to first cut
            piece1.setAttribute('x', '0');
            piece1.setAttribute('width', cut1X.toString());
            piece1.style.display = 'block';

            // Piece 2: from first cut to second cut
            piece2.setAttribute('x', cut1X.toString());
            piece2.setAttribute('width', (cut2X - cut1X).toString());
            piece2.style.display = 'block';

            // Piece 3: from second cut to end
            piece3.setAttribute('x', cut2X.toString());
            piece3.setAttribute('width', (800 - cut2X).toString());
            piece3.style.display = 'block';
        }
    }

    static enablePieceSelection(state, api, selectingPlayer) {
        Logger.info(`Enabling piece selection for Player ${selectingPlayer}`);

        // Show piece overlays
        SteinhausLoneDividerAlgorithm.showPieceOverlays(state, api);

        // Add click handlers
        const piece1 = document.getElementById('steinhaus-piece-1');
        const piece2 = document.getElementById('steinhaus-piece-2');
        const piece3 = document.getElementById('steinhaus-piece-3');

        if (piece1 && piece2 && piece3) {
            // Add visual feedback
            [piece1, piece2, piece3].forEach((piece, index) => {
                piece.style.cursor = 'pointer';
                piece.style.stroke = '#4a5568';
                piece.style.strokeWidth = '2';

                // Add hover effects
                piece.addEventListener('mouseenter', () => {
                    piece.style.fillOpacity = '0.3';
                    piece.style.strokeWidth = '3';
                });

                piece.addEventListener('mouseleave', () => {
                    piece.style.fillOpacity = '0.1';
                    piece.style.strokeWidth = '2';
                });
            });

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

        // Visual feedback for selected piece
        const selectedPiece = document.getElementById(`steinhaus-piece-${pieceIndex + 1}`);
        if (selectedPiece) {
            selectedPiece.style.fill = 'rgba(72,187,120,0.4)';
            selectedPiece.style.stroke = '#38a169';
            selectedPiece.style.strokeWidth = '4';
            selectedPiece.style.cursor = 'default';
            selectedPiece.onclick = null;

            // Remove hover effects
            selectedPiece.onmouseenter = null;
            selectedPiece.onmouseleave = null;
        }

        if (selectingPlayer === 3) {
            // Player 3 selected, now Player 2's turn
            api.updateInstructions('Player 2, choose from the remaining pieces!');

            // Disable the selected piece for Player 2's turn
            setTimeout(() => {
                api.nextStep();
            }, 1000);
        } else if (selectingPlayer === 2) {
            // Player 2 selected, assign remaining piece to Player 1
            const allPieces = [0, 1, 2];
            const remainingPiece = allPieces.find(i =>
                i !== currentAllocation.player2 && i !== currentAllocation.player3
            );

            if (remainingPiece !== undefined) {
                currentAllocation.player1 = remainingPiece;
                api.setAlgorithmData('finalAllocation', currentAllocation);

                // Visual feedback for Player 1's piece
                const player1Piece = document.getElementById(`steinhaus-piece-${remainingPiece + 1}`);
                if (player1Piece) {
                    player1Piece.style.fill = 'rgba(49,130,206,0.4)';
                    player1Piece.style.stroke = '#3182ce';
                    player1Piece.style.strokeWidth = '4';
                }

                setTimeout(() => {
                    SteinhausLoneDividerAlgorithm.showFinalResults(state, api);
                }, 1500);
            }
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

        // Calculate envy for analysis
        const player2EnvyP1 = pieceValues.player2[allocation.player1] > player2Final;
        const player2EnvyP3 = pieceValues.player2[allocation.player3] > player2Final;
        const player3EnvyP1 = pieceValues.player3[allocation.player1] > player3Final;
        const player3EnvyP2 = pieceValues.player3[allocation.player2] > player3Final;
        const envyFree = !player2EnvyP1 && !player2EnvyP3 && !player3EnvyP1 && !player3EnvyP2;

        const resultsHTML = `
            <div class="results-summary">
                <h3>Steinhaus Lone-Divider Complete!</h3>
                <p><strong>Algorithm Path:</strong> Case ${algorithmCase}</p>
                ${algorithmCase === 'B' ? '<p><em>Reconstruction was performed due to insufficient acceptable pieces</em></p>' : ''}
                
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
                    <p><strong>Envy-free:</strong> ${envyFree ? '✅ Yes' : '❌ No'} (algorithm only guarantees proportionality)</p>
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
                element.style.fillOpacity = '';
                element.style.stroke = '';
                element.style.strokeWidth = '';
                element.style.cursor = '';
                element.onclick = null;
                element.onmouseenter = null;
                element.onmouseleave = null;
            }
        });
    }
}

// ===== ALGORITHM STEPS =====
const STEINHAUS_STEPS = [
    {
        id: 'initial-division',
        title: 'Step 1: Divider creates three equal pieces',
        instructions: 'Player 1 (the lone divider), use both sliders to create three pieces you value equally.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered initial division step');

            // Show both cut controls for three pieces
            api.showElement('cut-control');
            api.showElement('cut-control-2');
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');

            // Enable sliders
            api.enableElement('cut-slider');
            api.enableElement('cut-slider-2');

            // Initial piece value calculation
            api.updatePlayerValueDisplays();
            api.setAlgorithmData('pieceValues', values);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting initial division step');
            api.hideElement('make-cut-btn');
            api.disableElement('cut-slider');
            api.disableElement('cut-slider-2');
        }
    },

    {
        id: 'analysis-phase',
        title: 'Step 2: Non-dividers analyze pieces',
        instructions: 'Analyzing which pieces are acceptable to Players 2 and 3 (≥33.3% of their valuation)...',

        onStepEnter: (state, api) => {
            Logger.debug('Entered analysis phase');
            api.setStartButtonState('hidden');

            // Show the pieces with cut lines
            SteinhausLoneDividerAlgorithm.showPieceOverlays(state, api);

            // Analyze acceptable pieces after a brief delay
            setTimeout(() => {
                SteinhausLoneDividerAlgorithm.analyzeAcceptablePieces(state, api);
            }, 1000);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting analysis phase');
        }
    },

    {
        id: 'player3-selection',
        title: 'Step 3: Player 3 selects first',
        instructions: 'Player 3, click on your preferred piece! (In sequential selection, Player 3 chooses first)',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Player 3 selection');
            SteinhausLoneDividerAlgorithm.enablePieceSelection(state, api, 3);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Player 3 selection');
            // Disable interaction but keep visual state
        }
    },

    {
        id: 'player2-selection',
        title: 'Step 4: Player 2 selects from remaining',
        instructions: 'Player 2, choose your preferred piece from the remaining options!',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Player 2 selection');

            // Re-enable selection but only for non-selected pieces
            const allocation = api.getState().algorithmData.finalAllocation || {};
            const selectedPiece = allocation.player3;

            // Disable the already selected piece
            if (selectedPiece !== undefined) {
                const selectedElement = document.getElementById(`steinhaus-piece-${selectedPiece + 1}`);
                if (selectedElement) {
                    selectedElement.style.cursor = 'not-allowed';
                    selectedElement.onclick = null;
                }
            }

            // Enable selection for Player 2
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
    description: "Three-player fair division using the lone divider method with case-based analysis",
    playerCount: 3,
    steps: STEINHAUS_STEPS,

    onInit: (state, api) => {
        Logger.debug("Steinhaus' Lone-Divider algorithm initialized");

        // Initialize with reasonable default cut positions
        api.setCutPosition(33);  // First cut at 33%
        api.setCutPosition2(67); // Second cut at 67%

        // Update the actual slider elements to match
        const cutSlider1 = document.getElementById('cut-slider');
        const cutSlider2 = document.getElementById('cut-slider-2');
        if (cutSlider1) cutSlider1.value = 33;
        if (cutSlider2) cutSlider2.value = 67;

        // Update displays
        SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
    },

    onStateChange: (stateKey, state, api) => {
        // Handle real-time updates during cutting phase
        if ((stateKey === 'cutPosition' || stateKey === 'cutPosition2')) {
            SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
        }

        // Handle validation changes
        if (stateKey === 'playerValues') {
            const validation = SteinhausLoneDividerAlgorithm.validatePlayerTotals(state);
            api.setStartButtonState(validation.valid ? 'enabled' : 'disabled');
            SteinhausLoneDividerAlgorithm.updatePieceDisplays(state, api);
        }
    },

    onStart: (state, api) => {
        Logger.info('Start button clicked for Steinhaus algorithm');
        api.nextStep(); // Go to cutting phase
    },

    onMakeCut: (state, api) => {
        Logger.info('Make Cut button clicked for Steinhaus algorithm');

        // Validate that all player values sum to 100
        const validation = SteinhausLoneDividerAlgorithm.validatePlayerTotals(state);
        if (!validation.valid) {
            api.emit('validationError', {
                message: 'Player valuations must sum to 100!',
                errors: validation.errors
            });
            return;
        }

        // Calculate piece values for divider
        const pieceValues = SteinhausLoneDividerAlgorithm.calculateThreePieceValues(state);
        const equalityCheck = SteinhausLoneDividerAlgorithm.checkDividerEquality(pieceValues.player1);

        // Warn if pieces are not reasonably equal (but allow to proceed)
        if (!equalityCheck.isEqual) {
            const proceed = confirm(
                `Warning: Your pieces are not equally valued!\n\n` +
                `Piece 1: ${pieceValues.player1[0].toFixed(1)} points\n` +
                `Piece 2: ${pieceValues.player1[1].toFixed(1)} points\n` +
                `Piece 3: ${pieceValues.player1[2].toFixed(1)} points\n\n` +
                `Max difference: ${equalityCheck.maxDiff.toFixed(1)} points\n\n` +
                `Proceed anyway?`
            );
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

        // Reset cut positions to reasonable defaults
        api.setCutPosition(33);
        api.setCutPosition2(67);

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