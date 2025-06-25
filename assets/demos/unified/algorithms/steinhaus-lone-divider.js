// Algorithm ID
const algorithmIdSteinhaus = "steinhaus-lone-divider";

// Algorithm configuration
const algorithmConfigSteinhaus = {
    // Metadata
    name: "Steinhaus' Lone-Divider",
    description: "Three-player fair division with lone divider approach",
    playerCount: 3,
    type: "discrete",

    // Steps definition
    steps: [
        {
            id: "initial-division",
            title: "Step 1: Create three equal pieces",
            instructions: "Player 1 (Divider), use the sliders to create three pieces you value equally.",
            enabledControls: ['cutSlider', 'cutSlider2', 'makeCutButton'],
            onStepEnter: (state, api) => {
                console.log('Entered initial division step');
                api.showDualCutSliders();
                api.showMakeCutButton();
                updateSteinhausPieceDisplays(state, api);
            },
            onStepExit: (state, api) => {
                console.log('Exiting initial division step');
                api.hideMakeCutButton();
            }
        },
        {
            id: "analysis-phase",
            title: "Step 2: Non-divider analysis",
            instructions: "Analyzing which pieces are acceptable to Players 2 and 3...",
            enabledControls: [],
            onStepEnter: (state, api) => {
                console.log('Entered analysis phase');
                console.log('Hiding start button...')
                api.setStartButtonState('hidden');
                analyzeAcceptablePieces(state, api);
            },
            onStepExit: (state, api) => {
                console.log('Exiting analysis phase');
            }
        },
        {
            id: "player3-selection",
            title: "Step 3: Player 3 selects",
            instructions: "Player 3, click on your preferred piece!",
            enabledControls: ['pieceSelection3'],
            onStepEnter: (state, api) => {
                console.log('Entered Player 3 selection');
                api.enableThreePieceSelection((piece) => {
                    handlePlayer3Selection(piece, state, api);
                });
            },
            onStepExit: (state, api) => {
                console.log('Exiting Player 3 selection');
            }
        },
        {
            id: "player2-selection",
            title: "Step 4: Player 2 selects",
            instructions: "Player 2, click on your preferred piece from the remaining options!",
            enabledControls: ['pieceSelection2'],
            onStepEnter: (state, api) => {
                console.log('Entered Player 2 selection');
                api.enableRemainingPieceSelection((piece) => {
                    handlePlayer2Selection(piece, state, api);
                });
            },
            onStepExit: (state, api) => {
                console.log('Exiting Player 2 selection');
            }
        }
    ],

    // Main algorithm handlers
    onStart: (state, api) => {
        console.log('Start button clicked for Steinhaus algorithm');
    },

    onMakeCut: (state, api) => {
        console.log('Make Cut button clicked for Steinhaus algorithm');
        // Validate that all player values sum to 100
        const validation = validateAllPlayerTotals(state);
        if (!validation.valid) {
            const errors = validation.errors.join('\n');
            alert(`Player valuations must sum to 100!\n\n${errors}`);
            return;
        }

        // Check if divider values are reasonably equal
        const dividerValues = calculateThreePieceValues(state);
        const equalityCheck = checkDividerEquality(dividerValues.player1);

        if (!equalityCheck.isEqual) {
            const proceed = confirm(`Warning: Your pieces are not equally valued!\nPiece 1: ${dividerValues.player1[0].toFixed(1)}\nPiece 2: ${dividerValues.player1[1].toFixed(1)}\nPiece 3: ${dividerValues.player1[2].toFixed(1)}\n\nProceed anyway?`);
            if (!proceed) return;
        }

        // Move to analysis step
        api.requestStepProgression();
    },

    onReset: (state, api) => {
        console.log('Steinhaus algorithm reset');
        // Reset algorithm-specific state
        state.algorithmData = {};
        state.cutPosition2 = 0; // Add second cut position

        // Reset UI elements
        api.hideThreePieceOverlays();
        api.hideDualCutSliders();

        // Reset start button
        api.setStartButtonState('enabled');

        updateSteinhausPieceDisplays(state, api);
    },

    onPlayerValueChange: (state, api) => {
        console.log('Player values changed in Steinhaus algorithm');
        updateSteinhausPieceDisplays(state, api);

        // Validate totals and update start button state
        const validation = validateAllPlayerTotals(state);
        if (api.getCurrentStep() === 0) {
            if (validation.valid) {
                api.setStartButtonState('enabled');
            } else {
                api.setStartButtonState('disabled');
            }
        }
    },

    onCutChange: (state, api) => {
        console.log('Cut positions changed in Steinhaus algorithm');
        updateSteinhausPieceDisplays(state, api);
    },

    // Utility methods
    calculateValues: (state) => {
        return calculateThreePieceValues(state);
    }
};

// Helper functions for Steinhaus algorithm

function validateAllPlayerTotals(state) {
    const colors = ['blue', 'red', 'green', 'orange', 'pink', 'purple'];
    const errors = [];
    let allValid = true;

    ['player1', 'player2', 'player3'].forEach((player, index) => {
        const total = colors.reduce((sum, color) => sum + (state.playerValues[player][color] || 0), 0);
        if (total !== 100) {
            errors.push(`Player ${index + 1}: ${total} (needs 100)`);
            allValid = false;
        }
    });

    return { valid: allValid, errors };
}

function calculateThreePieceValues(state) {
    const cut1 = (state.cutPosition / 100) * 800;
    const cut2 = (state.cutPosition2 / 100) * 800;

    // Ensure cuts are ordered
    const cuts = [0, Math.min(cut1, cut2), Math.max(cut1, cut2), 800];

    const pieceValues = { player1: [], player2: [], player3: [] };

    // Calculate values for each of the 3 pieces
    for (let pieceIdx = 0; pieceIdx < 3; pieceIdx++) {
        const pieceStart = cuts[pieceIdx];
        const pieceEnd = cuts[pieceIdx + 1];

        ['player1', 'player2', 'player3'].forEach((player, playerIdx) => {
            const playerKey = `player${playerIdx + 1}`;
            const regionValues = calculateRegionValuesForPiece(pieceStart, pieceEnd);
            const totalValue = calculatePlayerValueFromRegions(regionValues, state.playerValues[player]);
            pieceValues[playerKey][pieceIdx] = totalValue;
        });
    }

    return pieceValues;
}

function calculateRegionValuesForPiece(pieceStart, pieceEnd) {
    const regions = {
        blue: { start: 0, end: 600 },
        red: { start: 600, end: 800 },
        green: { start: 150, end: 600 },
        orange: { start: 600, end: 800 },
        pink: { start: 0, end: 150 },
        purple: { start: 150, end: 800 }
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

function calculatePlayerValueFromRegions(regionValues, playerValues) {
    return Object.entries(regionValues)
        .reduce((total, [color, percentage]) => {
            return total + (percentage / 100) * (playerValues[color] || 0);
        }, 0);
}

function checkDividerEquality(dividerValues) {
    const maxDiff = Math.max(
        Math.abs(dividerValues[0] - dividerValues[1]),
        Math.abs(dividerValues[1] - dividerValues[2]),
        Math.abs(dividerValues[0] - dividerValues[2])
    );
    return { isEqual: maxDiff < 2.0, maxDiff };
}

function updateSteinhausPieceDisplays(state, api) {
    const values = calculateThreePieceValues(state);

    // Update piece value displays (need to add these to the UI)
    ['player1', 'player2', 'player3'].forEach((player, index) => {
        const display = document.getElementById(`${player}-values`);
        if (display) {
            const vals = values[player];
            display.textContent = `Left: ${vals[0].toFixed(1)} | Center: ${vals[1].toFixed(1)} | Right: ${vals[2].toFixed(1)}`;
        }
    });
}

function analyzeAcceptablePieces(state, api) {
    const pieceValues = calculateThreePieceValues(state);
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

    state.algorithmData.acceptablePieces = acceptablePieces;

    // Determine algorithm case
    const p2Count = acceptablePieces.player2.length;
    const p3Count = acceptablePieces.player3.length;

    if (p2Count >= 2 || p3Count >= 2) {
        // Case A: Sequential selection
        state.algorithmData.algorithmCase = 'A';
        api.updateUI({
            instructions: `Case A detected: Player 3 sees ${p3Count} acceptable pieces, Player 2 sees ${p2Count} acceptable pieces. Player 3 picks first.`
        });

        setTimeout(() => {
            api.requestStepProgression(); // Go to Player 3 selection
        }, 2000);
    } else {
        // Case B: Reconstruction needed
        state.algorithmData.algorithmCase = 'B';
        api.updateUI({
            instructions: "Case B detected: Both players see at most 1 acceptable piece. Reconstruction required."
        });

        // Find unacceptable piece and handle reconstruction
        handleCaseB(state, api);
    }
}

function handleCaseB(state, api) {
    // Find the piece that both non-dividers find unacceptable
    let unacceptablePiece = null;
    for (let i = 0; i < 3; i++) {
        if (!state.algorithmData.acceptablePieces.player2.includes(i) &&
            !state.algorithmData.acceptablePieces.player3.includes(i)) {
            unacceptablePiece = i;
            break;
        }
    }

    if (unacceptablePiece !== null) {
        state.algorithmData.finalAllocation = { player1: unacceptablePiece };

        // For this demo, we'll simulate the divide-and-choose reconstruction
        // In a full implementation, you'd switch to a divide-and-choose mode

        const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);
        const randomAssignment = Math.random() < 0.5;

        if (randomAssignment) {
            state.algorithmData.finalAllocation.player2 = remainingPieces[0];
            state.algorithmData.finalAllocation.player3 = remainingPieces[1];
        } else {
            state.algorithmData.finalAllocation.player2 = remainingPieces[1];
            state.algorithmData.finalAllocation.player3 = remainingPieces[0];
        }

        showFinalResults(state, api);
    }
}

function handlePlayer3Selection(pieceIndex, state, api) {
    console.log(`Player 3 selected piece ${pieceIndex}`);
    state.algorithmData.finalAllocation = { player3: pieceIndex };

    // Update UI to show remaining pieces for Player 2
    api.updateUI({
        instructions: "Player 2, choose from the remaining pieces!"
    });

    api.requestStepProgression();
}

function handlePlayer2Selection(pieceIndex, state, api) {
    console.log(`Player 2 selected piece ${pieceIndex}`);
    state.algorithmData.finalAllocation.player2 = pieceIndex;

    // Player 1 gets the remaining piece
    const allPieces = [0, 1, 2];
    const remainingPiece = allPieces.find(i =>
        i !== state.algorithmData.finalAllocation.player2 &&
        i !== state.algorithmData.finalAllocation.player3
    );
    state.algorithmData.finalAllocation.player1 = remainingPiece;

    showFinalResults(state, api);
}

function showFinalResults(state, api) {
    const allocation = state.algorithmData.finalAllocation;
    const pieceValues = state.algorithmData.pieceValues;

    const player1Final = pieceValues.player1[allocation.player1];
    const player2Final = pieceValues.player2[allocation.player2];
    const player3Final = pieceValues.player3[allocation.player3];

    const proportional = player1Final >= 33.0 && player2Final >= 33.0 && player3Final >= 33.0;

    api.showResults({
        text: `
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3182ce;">
                <h4>Steinhaus Lone-Divider Complete!</h4>
                <p><strong>Algorithm Path:</strong> Case ${state.algorithmData.algorithmCase}</p>
                <p><strong>Final Allocation:</strong></p>
                <p>• Player 1 (Divider): Piece ${allocation.player1 + 1}</p>
                <p>• Player 2: Piece ${allocation.player2 + 1}</p>
                <p>• Player 3: Piece ${allocation.player3 + 1}</p>
            </div>
            <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4>Final Values:</h4>
                <p><strong>Player 1:</strong> ${player1Final.toFixed(1)} points</p>
                <p><strong>Player 2:</strong> ${player2Final.toFixed(1)} points</p>
                <p><strong>Player 3:</strong> ${player3Final.toFixed(1)} points</p>
                <br>
                <p><strong>Fairness Analysis:</strong></p>
                <p>${proportional ? '✓' : '✗'} <strong>Proportional:</strong> ${proportional ? 'All players get ≥33.3%' : 'Some players get <33.3%'}</p>
                <p>ℹ️ <strong>Note:</strong> Steinhaus' algorithm only guarantees proportionality, not envy-freeness</p>
            </div>
        `
    });
}

// Register the algorithm
window.FairDivisionCore.register(algorithmIdSteinhaus, algorithmConfigSteinhaus);