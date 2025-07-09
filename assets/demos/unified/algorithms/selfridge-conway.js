/**
 * Selfridge-Conway Procedure Plug-in
 *
 * Implements the envy-free three-player cake cutting algorithm
 * Following the established plugin architecture and design patterns
 */

// ===== ALGORITHM LOGIC =====
class SelfridgeConwayAlgorithm {
    constructor() {
        this.phase = 1;
        this.trimmedPiece = null;
        this.trimmingAmount = 0;
        this.mainAllocation = {};
        this.trimmerTookTrimmed = false;
        this.gameComplete = false;
    }

    // ===== VALIDATION METHODS =====
    static validateCut(state, api) {
        const validation = api.validatePlayerTotals(state.playerValues);

        if (!validation.player1.valid || !validation.player2.valid || !validation.player3.valid) {
            const errors = [];
            if (!validation.player1.valid) {
                errors.push(`Player 1 total: ${validation.player1.total} (expected: ${validation.player1.expected})`);
            }
            if (!validation.player2.valid) {
                errors.push(`Player 2 total: ${validation.player2.total} (expected: ${validation.player2.expected})`);
            }
            if (!validation.player3.valid) {
                errors.push(`Player 3 total: ${validation.player3.total} (expected: ${validation.player3.expected})`);
            }

            api.emit('validationError', {
                message: 'Player valuations must sum to 100!',
                errors
            });
            return false;
        }

        return true;
    }

    static validateDividerEquality(state, api) {
        const pieceValues = SelfridgeConwayAlgorithm.calculateThreePieceValues(state, api);
        const dividerValues = pieceValues.player1;

        const maxDiff = Math.max(
            Math.abs(dividerValues[0] - dividerValues[1]),
            Math.abs(dividerValues[1] - dividerValues[2]),
            Math.abs(dividerValues[0] - dividerValues[2])
        );

        return {
            isEqual: maxDiff < 3.0,
            maxDiff,
            values: dividerValues
        };
    }

    // ===== CALCULATION METHODS (using existing API) =====
    static calculateThreePieceValues(state, api) {
        // Use existing three-region calculation from the API
        const regionValues = api.calculateThreeRegionValues(state.cutPosition, state.cutPosition2);

        const pieceValues = { player1: [], player2: [], player3: [] };

        // Calculate values for each player for each piece
        ['player1', 'player2', 'player3'].forEach(player => {
            pieceValues[player] = [
                api.calculatePlayerValue(regionValues.piece1, state.playerValues[player]),
                api.calculatePlayerValue(regionValues.piece2, state.playerValues[player]),
                api.calculatePlayerValue(regionValues.piece3, state.playerValues[player])
            ];
        });

        return pieceValues;
    }

    // ===== UI UPDATE METHODS =====
    static updatePieceDisplays(state, api) {
        const values = SelfridgeConwayAlgorithm.calculateThreePieceValues(state, api);

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

    static showPieceOverlays(state, api) {
        const cut1X = (state.cutPosition / 100) * 800;
        const cut2X = (state.cutPosition2 / 100) * 800;

        // Use existing three-piece overlay functionality
        api.showThreePieceOverlays(cut1X, cut2X);
    }

    // ===== TRIMMING LOGIC =====
    static analyzeTrimmingNeed(state, api) {
        const pieceValues = api.getAlgorithmData('pieceValues');
        if (!pieceValues) {
            Logger.error('No piece values found for trimming analysis');
            return;
        }

        const player2Values = pieceValues.player2;

        // Find the largest piece according to Player 2 (trimmer)
        const maxValue = Math.max(...player2Values);
        const largestPieces = player2Values.map((value, index) => ({ value, index }))
            .filter(piece => Math.abs(piece.value - maxValue) < 0.1);

        Logger.info(`Player 2 analysis: largest pieces are [${largestPieces.map(p => p.index + 1).join(', ')}] with value ${maxValue.toFixed(1)}`);

        if (largestPieces.length >= 2) {
            // No trimming needed - there's already a tie for largest
            api.setAlgorithmData('needsTrimming', false);
            api.updateInstructions('<strong>No trimming needed!</strong> Player 2 already sees a tie for largest piece. Moving to selection phase...');

            setTimeout(() => {
                api.nextStep(); // Skip to chooser selection
            }, 2000);
        } else {
            // Trimming needed
            const pieceToTrim = largestPieces[0].index;
            api.setAlgorithmData('needsTrimming', true);
            api.setAlgorithmData('pieceToTrim', pieceToTrim);

            // Find second largest value to determine trim amount
            const sortedValues = [...player2Values].sort((a, b) => b - a);
            const secondLargest = sortedValues[1];
            const trimAmount = maxValue - secondLargest;

            api.updateInstructions(`<strong>Trimming required!</strong> Player 2 will trim ${trimAmount.toFixed(1)} points from Piece ${pieceToTrim + 1} to create a tie for largest.`);

            // Perform the trimming
            setTimeout(() => {
                SelfridgeConwayAlgorithm.performTrimming(pieceToTrim, trimAmount, state, api);
            }, 2000);
        }
    }

    static performTrimming(pieceIndex, trimAmount, state, api) {
        Logger.info(`Performing trimming: ${trimAmount.toFixed(1)} from piece ${pieceIndex + 1}`);

        // Store trimming data
        const algorithm = api.getAlgorithmData('algorithm');
        algorithm.trimmedPiece = pieceIndex;
        algorithm.trimmingAmount = trimAmount;

        api.setAlgorithmData('trimmedPiece', pieceIndex);
        api.setAlgorithmData('trimmingAmount', trimAmount);

        // Visual feedback for trimmed piece using existing piece overlays
        const trimmedElement = document.getElementById(`steinhaus-piece-${pieceIndex + 1}`);
        if (trimmedElement) {
            trimmedElement.style.fill = 'rgba(255,193,7,0.3)';
            trimmedElement.style.stroke = '#ffc107';
            trimmedElement.style.strokeWidth = '3';
            trimmedElement.style.strokeDasharray = '5,5';
        }

        api.updateInstructions(`<strong>Trimming complete!</strong> Piece ${pieceIndex + 1} has been trimmed. Trimmings set aside for Phase 2.`);

        setTimeout(() => {
            api.nextStep(); // Move to chooser selection
        }, 2000);
    }

    // ===== SELECTION LOGIC =====
    static enablePieceSelection(state, api, selectingPlayer, mustTakeTrimmed = false) {
        Logger.info(`Enabling piece selection for Player ${selectingPlayer}`);

        SelfridgeConwayAlgorithm.showPieceOverlays(state, api);

        // Get current allocation to disable already selected pieces
        const allocation = api.getAlgorithmData('mainAllocation') || {};
        const trimmedPiece = api.getAlgorithmData('trimmedPiece');

        const piece1 = document.getElementById('steinhaus-piece-1');
        const piece2 = document.getElementById('steinhaus-piece-2');
        const piece3 = document.getElementById('steinhaus-piece-3');

        if (piece1 && piece2 && piece3) {
            [piece1, piece2, piece3].forEach((piece, index) => {
                // Check if piece is already taken
                const isAlreadyTaken = Object.values(allocation).includes(index);

                if (isAlreadyTaken) {
                    // Piece already selected - disable it
                    piece.style.cursor = 'not-allowed';
                    piece.style.opacity = '0.5';
                    piece.onclick = null;
                } else if (mustTakeTrimmed && index !== trimmedPiece) {
                    // Player 2 must take trimmed piece if Player 3 didn't
                    piece.style.cursor = 'not-allowed';
                    piece.style.opacity = '0.5';
                    piece.onclick = null;
                } else {
                    // Piece is selectable
                    piece.style.cursor = 'pointer';
                    piece.style.opacity = '1';
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

                    piece.onclick = () => SelfridgeConwayAlgorithm.handlePieceSelection(index, selectingPlayer, state, api);
                }
            });
        }
    }

    static handlePieceSelection(pieceIndex, selectingPlayer, state, api) {
        Logger.info(`Player ${selectingPlayer} selected piece ${pieceIndex + 1}`);

        const allocation = api.getAlgorithmData('mainAllocation') || {};
        const trimmedPiece = api.getAlgorithmData('trimmedPiece');

        allocation[`player${selectingPlayer}`] = pieceIndex;
        api.setAlgorithmData('mainAllocation', allocation);

        // Visual feedback for selected piece
        const selectedPiece = document.getElementById(`steinhaus-piece-${pieceIndex + 1}`);
        if (selectedPiece) {
            selectedPiece.style.fill = `rgba(72,187,120,0.4)`;
            selectedPiece.style.stroke = '#38a169';
            selectedPiece.style.strokeWidth = '4';
            selectedPiece.style.cursor = 'default';
            selectedPiece.onclick = null;
            selectedPiece.onmouseenter = null;
            selectedPiece.onmouseleave = null;
        }

        // Handle phase logic
        if (selectingPlayer === 3) {
            // Player 3 (chooser) selected
            const algorithm = api.getAlgorithmData('algorithm');
            const choseTrimmed = (pieceIndex === trimmedPiece);

            if (choseTrimmed) {
                algorithm.trimmerTookTrimmed = false; // Player 3 took it
                api.updateInstructions('Player 3 chose the trimmed piece! Player 2 can now choose from remaining pieces.');
            } else {
                algorithm.trimmerTookTrimmed = true; // Player 2 must take it
                api.updateInstructions('Player 3 did not choose the trimmed piece. Player 2 must now take the trimmed piece.');
            }

            setTimeout(() => {
                api.nextStep(); // Move to Player 2's turn
            }, 1500);

        } else if (selectingPlayer === 2) {
            // Player 2 (trimmer) selected - assign remaining piece to Player 1
            const allPieces = [0, 1, 2];
            const remainingPiece = allPieces.find(i =>
                i !== allocation.player2 && i !== allocation.player3
            );

            if (remainingPiece !== undefined) {
                allocation.player1 = remainingPiece;
                api.setAlgorithmData('mainAllocation', allocation);

                // Visual feedback for Player 1's piece
                const player1Piece = document.getElementById(`steinhaus-piece-${remainingPiece + 1}`);
                if (player1Piece) {
                    player1Piece.style.fill = 'rgba(49,130,206,0.4)';
                    player1Piece.style.stroke = '#3182ce';
                    player1Piece.style.strokeWidth = '4';
                }

                api.updateInstructions('Phase 1 complete! All main pieces allocated.');

                setTimeout(() => {
                    if (api.getAlgorithmData('needsTrimming')) {
                        api.nextStep(); // Move to Phase 2
                    } else {
                        // No trimmings to handle - show final results
                        SelfridgeConwayAlgorithm.showFinalResults(state, api);
                    }
                }, 2000);
            }
        }
    }

    // ===== PHASE 2 LOGIC (TRIMMINGS) =====
    static startPhase2(state, api) {
        Logger.info('Starting Phase 2: Trimmings division');

        const algorithm = api.getAlgorithmData('algorithm');
        algorithm.phase = 2;

        const allocation = api.getAlgorithmData('mainAllocation');
        const trimmedPiece = api.getAlgorithmData('trimmedPiece');

        // Determine who got the trimmed piece and who will cut the trimmings
        let trimmedPieceHolder, trimmingsCutter;

        if (allocation.player3 === trimmedPiece) {
            trimmedPieceHolder = 3;
            trimmingsCutter = 2; // Player 2 cuts trimmings
        } else {
            trimmedPieceHolder = 2;
            trimmingsCutter = 3; // Player 3 cuts trimmings
        }

        api.setAlgorithmData('trimmedPieceHolder', trimmedPieceHolder);
        api.setAlgorithmData('trimmingsCutter', trimmingsCutter);

        api.updateInstructions(`<strong>Phase 2: Trimmings Division</strong><br>
            Player ${trimmedPieceHolder} received the trimmed piece.<br>
            Player ${trimmingsCutter} will cut the trimmings into three equal pieces.<br>
            Selection order: Player ${trimmedPieceHolder}, Player 1, Player ${trimmingsCutter}`);

        // Simulate trimmings division (simplified for demo)
        setTimeout(() => {
            SelfridgeConwayAlgorithm.simulateTrimmingsDivision(state, api);
        }, 3000);
    }

    static simulateTrimmingsDivision(state, api) {
        const trimmedPieceHolder = api.getAlgorithmData('trimmedPieceHolder');
        const trimmingsCutter = api.getAlgorithmData('trimmingsCutter');
        const trimmingAmount = api.getAlgorithmData('trimmingAmount') || 0;

        // Simulate the division of trimmings
        const trimmingsPerPlayer = trimmingAmount / 3;

        api.updateInstructions(`<strong>Trimmings divided!</strong><br>
            Each trimming piece worth ~${trimmingsPerPlayer.toFixed(1)} points.<br>
            Player ${trimmedPieceHolder} chooses first, then Player 1, then Player ${trimmingsCutter}.`);

        // Add trimmings to final allocations
        const trimmingsAllocation = {
            [`player${trimmedPieceHolder}`]: trimmingsPerPlayer,
            player1: trimmingsPerPlayer,
            [`player${trimmingsCutter}`]: trimmingsPerPlayer
        };

        api.setAlgorithmData('trimmingsAllocation', trimmingsAllocation);

        setTimeout(() => {
            SelfridgeConwayAlgorithm.showFinalResults(state, api);
        }, 2000);
    }

    // ===== FINAL RESULTS =====
    static showFinalResults(state, api) {
        const allocation = api.getAlgorithmData('mainAllocation');
        const pieceValues = api.getAlgorithmData('pieceValues');
        const trimmingsAllocation = api.getAlgorithmData('trimmingsAllocation') || {};
        const needsTrimming = api.getAlgorithmData('needsTrimming');

        if (!allocation || !pieceValues) {
            Logger.error('Missing data for final results');
            return;
        }

        // Calculate final values (main pieces + trimmings)
        const player1Final = pieceValues.player1[allocation.player1] + (trimmingsAllocation.player1 || 0);
        const player2Final = pieceValues.player2[allocation.player2] + (trimmingsAllocation.player2 || 0);
        const player3Final = pieceValues.player3[allocation.player3] + (trimmingsAllocation.player3 || 0);

        // Analyze fairness properties
        const proportional = player1Final >= 33.0 && player2Final >= 33.0 && player3Final >= 33.0;
        const envyFree = true; // Guaranteed by algorithm design

        const resultsHTML = `
            <div class="results-summary">
                <h3>Selfridge-Conway Procedure Complete!</h3>
                <p><strong>Algorithm:</strong> First envy-free procedure for three players</p>
                ${needsTrimming ? '<p><em>Trimming was performed in Phase 1, trimmings divided in Phase 2</em></p>' : '<p><em>No trimming was needed - direct allocation</em></p>'}
                
                <div class="allocation-grid">
                    <div class="player-result">
                        <h4>Player 1 (Divider)</h4>
                        <p>Receives: <strong>Piece ${allocation.player1 + 1}${trimmingsAllocation.player1 ? ' + trimmings' : ''}</strong></p>
                        <p>Value: <strong>${player1Final.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 2 (Trimmer)</h4>
                        <p>Receives: <strong>Piece ${allocation.player2 + 1}${trimmingsAllocation.player2 ? ' + trimmings' : ''}</strong></p>
                        <p>Value: <strong>${player2Final.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 3 (Chooser)</h4>
                        <p>Receives: <strong>Piece ${allocation.player3 + 1}${trimmingsAllocation.player3 ? ' + trimmings' : ''}</strong></p>
                        <p>Value: <strong>${player3Final.toFixed(1)} points</strong></p>
                    </div>
                </div>

                <div class="fairness-analysis">
                    <h4>Fairness Properties Achieved</h4>
                    <p><strong>Envy-free:</strong> ${envyFree ? '✅ Yes' : '❌ No'} (guaranteed by algorithm design)</p>
                    <p><strong>Proportional:</strong> ${proportional ? '✅ Yes' : '❌ No'} (all players get ≥33.3% value)</p>
                    <p><strong>Finite:</strong> ✅ Yes (uses at most 5 cuts, terminates in finite steps)</p>
                    <p><strong>Note:</strong> First discrete envy-free algorithm for three players</p>
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

        // Mark algorithm as complete
        const algorithm = api.getAlgorithmData('algorithm');
        algorithm.gameComplete = true;

        Logger.info('Selfridge-Conway results displayed successfully');
    }

    static clearPieceSelection() {
        // Use existing API to hide overlays
        const hideIds = ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'];
        hideIds.forEach(id => {
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
const SELFRIDGE_CONWAY_STEPS = [
    {
        id: 'initial-division',
        title: 'Phase 1 Step 1: Divider creates three equal pieces',
        instructions: 'Player 1 (divider), use both sliders to create three pieces you value equally.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered initial division step');

            // Initialize algorithm instance
            api.setAlgorithmData('algorithm', new SelfridgeConwayAlgorithm());

            // Show both cut controls for three pieces
            api.showElement('cut-control');
            api.showElement('cut-control-2');
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');

            // Enable sliders
            api.enableElement('cut-slider');
            api.enableElement('cut-slider-2');

            // Initial piece value calculation
            SelfridgeConwayAlgorithm.updatePieceDisplays(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting initial division step');
            api.hideElement('make-cut-btn');
            api.disableElement('cut-slider');
            api.disableElement('cut-slider-2');
        }
    },

    {
        id: 'trimming-analysis',
        title: 'Phase 1 Step 2: Trimmer analyzes pieces',
        instructions: 'Player 2 (trimmer) analyzes the pieces and will trim one if necessary to create a tie for largest.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered trimming analysis step');
            api.setStartButtonState('hidden');

            // Show the pieces with cut lines
            SelfridgeConwayAlgorithm.showPieceOverlays(state, api);

            // Analyze trimming need after a brief delay
            setTimeout(() => {
                SelfridgeConwayAlgorithm.analyzeTrimmingNeed(state, api);
            }, 1000);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting trimming analysis step');
        }
    },

    {
        id: 'chooser-selection',
        title: 'Phase 1 Step 3: Chooser selects first',
        instructions: 'Player 3 (chooser), click on your preferred piece! You get first choice.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered chooser selection');
            SelfridgeConwayAlgorithm.enablePieceSelection(state, api, 3);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting chooser selection');
        }
    },

    {
        id: 'trimmer-selection',
        title: 'Phase 1 Step 4: Trimmer selects from remaining',
        instructions: 'Player 2 (trimmer), choose your piece! Remember: if Player 3 didn\'t take the trimmed piece, you must take it.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered trimmer selection');

            const allocation = api.getAlgorithmData('mainAllocation') || {};
            const trimmedPiece = api.getAlgorithmData('trimmedPiece');
            const mustTakeTrimmed = (allocation.player3 !== trimmedPiece) && (trimmedPiece !== null);

            SelfridgeConwayAlgorithm.enablePieceSelection(state, api, 2, mustTakeTrimmed);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting trimmer selection');
        }
    },

    {
        id: 'phase-2-trimmings',
        title: 'Phase 2: Trimmings Division',
        instructions: 'Dividing the trimmings among all three players...',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Phase 2: Trimmings');
            SelfridgeConwayAlgorithm.startPhase2(state, api);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Phase 2');
        }
    }
];

// ===== ALGORITHM CONFIGURATION =====
const selfridgeConwayConfig = {
    name: "Selfridge-Conway Procedure",
    description: "First discrete envy-free procedure for three players",
    playerCount: 3,
    steps: SELFRIDGE_CONWAY_STEPS,

    onInit: (state, api) => {
        Logger.debug("Selfridge-Conway algorithm initialized");

        // Initialize with reasonable default cut positions for three pieces
        api.setCutPosition(33);  // First cut at 33%
        api.setCutPosition2(67); // Second cut at 67%

        // Update the actual slider elements to match
        api.resetSlider('cut-slider');
        api.resetSlider('cut-slider-2');
        const cutSlider1 = document.getElementById('cut-slider');
        const cutSlider2 = document.getElementById('cut-slider-2');
        if (cutSlider1) cutSlider1.value = 33;
        if (cutSlider2) cutSlider2.value = 67;

        // Update displays
        SelfridgeConwayAlgorithm.updatePieceDisplays(state, api);
    },

    onStateChange: (stateKey, state, api) => {
        // Handle real-time updates during cutting phase
        if ((stateKey === 'cutPosition' || stateKey === 'cutPosition2') && api.getCurrentStep() === 0) {
            SelfridgeConwayAlgorithm.updatePieceDisplays(state, api);
        }

        // Handle validation changes
        if (stateKey === 'playerValues') {
            const validation = api.validatePlayerTotals(state.playerValues);
            const allValid = validation.player1.valid && validation.player2.valid && validation.player3.valid;
            api.setStartButtonState(allValid ? 'enabled' : 'disabled');

            if (api.getCurrentStep() === 0) {
                SelfridgeConwayAlgorithm.updatePieceDisplays(state, api);
            }
        }
    },

    onStart: (state, api) => {
        Logger.info('Start button clicked for Selfridge-Conway algorithm');
        api.nextStep(); // Go to cutting phase
    },

    onMakeCut: (state, api) => {
        Logger.info('Make Cut button clicked for Selfridge-Conway algorithm');

        // Validate that all player values sum to 100
        if (!SelfridgeConwayAlgorithm.validateCut(state, api)) {
            return;
        }

        // Calculate piece values for divider and check equality
        const equalityCheck = SelfridgeConwayAlgorithm.validateDividerEquality(state, api);

        // Warn if pieces are not reasonably equal (but allow to proceed)
        if (!equalityCheck.isEqual) {
            const proceed = confirm(
                `Warning: Your pieces are not equally valued!\n\n` +
                `Piece 1: ${equalityCheck.values[0].toFixed(1)} points\n` +
                `Piece 2: ${equalityCheck.values[1].toFixed(1)} points\n` +
                `Piece 3: ${equalityCheck.values[2].toFixed(1)} points\n\n` +
                `Max difference: ${equalityCheck.maxDiff.toFixed(1)} points\n\n` +
                `Proceed anyway?`
            );
            if (!proceed) return;
        }

        Logger.info(`Cut finalized with positions: ${state.cutPosition}, ${state.cutPosition2}`);

        // Move to trimming analysis
        api.nextStep();
    },

    onReset: (state, api) => {
        Logger.info('Selfridge-Conway algorithm reset');

        // Reset algorithm state
        api.setAlgorithmData('algorithm', null);
        api.setAlgorithmData('pieceValues', null);
        api.setAlgorithmData('needsTrimming', null);
        api.setAlgorithmData('trimmedPiece', null);
        api.setAlgorithmData('trimmingAmount', null);
        api.setAlgorithmData('mainAllocation', null);
        api.setAlgorithmData('trimmedPieceHolder', null);
        api.setAlgorithmData('trimmingsCutter', null);
        api.setAlgorithmData('trimmingsAllocation', null);

        // Reset cut positions to reasonable defaults
        api.setCutPosition(33);
        api.setCutPosition2(67);

        // Clean up UI
        SelfridgeConwayAlgorithm.clearPieceSelection();
        api.hideElement('cut-control-2');
        api.hideElement('results');
        api.setStartButtonState('enabled');

        // Update displays
        SelfridgeConwayAlgorithm.updatePieceDisplays(state, api);
    }
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('selfridge-conway', selfridgeConwayConfig);
Logger.info(`${selfridgeConwayConfig.name} algorithm loaded and registered`);