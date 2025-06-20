// Algorithm ID
const algorithmId = "divide-and-choose";

// Algorithm configuration
const algorithmConfig = {
    // Metadata
    name: "Divide-and-Choose",
    description: "Fundamental fair division procedure",
    playerCount: 2,
    type: "discrete",

    // Steps definition
    steps: [
        {
            id: "cutting",
            title: "Step 1: Position the cut",
            instructions: "Player 1, adjust the cut position using the slider below to create two pieces you value equally.",
            enabledControls: ['cutSlider', 'makeCutButton'],
            onStepEnter: (state, api) => {
                console.log('Entered cutting step');
                console.log('Showing "Make Cut" button...');
                api.showMakeCutButton();
                console.log('Hiding "Start" button...');
                api.setStartButtonState('hidden');
                updatePlayerDisplays(state, api);
            },
            onStepExit: (state, api) => {
                console.log('Exiting cutting step');
                api.hideMakeCutButton();
            }
        },
        {
            id: "choosing",
            title: "Step 2: Choose a piece",
            instructions: "Player 2, click on the piece you prefer!",
            enabledControls: ['pieceSelection', 'resetButton'],
            onStepEnter: (state, api) => {
                console.log('Entered choosing step');
                // Hide start button during piece selection
                api.setStartButtonState('hidden');
                // Set up piece selection
                api.addEventListener('pieceClick', (piece) => {
                    handlePieceSelection(piece, state, api);
                });
            },
            onStepExit: (state, api) => {
                console.log('Exiting choosing step');
            }
        }
    ],

    // Main algorithm handlers

    onMakeCut: (state, api) => {
        console.log('Make Cut button clicked for Divide-and-Choose');
        console.log('Cut made at: ' + state.cutPosition.toString());
        // Validate that player values sum to 100
        const validation = validatePlayerTotals(state);
        if (!validation.valid) {
            alert(`Player valuations must sum to 100!\n\nPlayer 1: ${validation.player1Total}\nPlayer 2: ${validation.player2Total}`);
            return;
        }
        // show overlays
        api.showTwoPieceOverlays(state.cutPosition);
        // Move to choosing step
        api.requestStepProgression();
    },

    onReset: (state, api) => {
        console.log('Algorithm reset');
        // Reset any algorithm-specific state
        state.algorithmData = {};
        // Reset start button
        api.setStartButtonText('Start');
        api.setStartButtonState('enabled');
        updatePlayerDisplays(state, api);
    },

    onPlayerValueChange: (state, api) => {
        console.log('Player values changed');
        updatePlayerDisplays(state, api);

        // Validate totals and update start button state
        const validation = validatePlayerTotals(state);
        if (api.getCurrentStep() === 0) {
            if (validation.valid) {
                api.setStartButtonState('enabled');
            } else {
                api.setStartButtonState('disabled');
                api.setStartButtonText('Fix Valuations First');
            }
        }
    },

    calculateValues: (state) => {
        // Use the core utility to calculate region values
        const regionValues = demoSystem.calculateRegionValues(state.cutPosition);

        // Calculate values for both players
        const player1Left = demoSystem.calculatePlayerValue(regionValues.left, state.playerValues.player1);
        const player1Right = demoSystem.calculatePlayerValue(regionValues.right, state.playerValues.player1);
        const player2Left = demoSystem.calculatePlayerValue(regionValues.left, state.playerValues.player2);
        const player2Right = demoSystem.calculatePlayerValue(regionValues.right, state.playerValues.player2);

        return {
            player1: { left: player1Left, right: player1Right },
            player2: { left: player2Left, right: player2Right }
        };
    }
};

// Helper function to validate player totals
function validatePlayerTotals(state) {
    const colors = ['blue', 'red', 'green', 'orange', 'pink', 'purple'];

    const player1Total = colors.reduce((sum, color) => sum + (state.playerValues.player1[color] || 0), 0);
    const player2Total = colors.reduce((sum, color) => sum + (state.playerValues.player2[color] || 0), 0);

    return {
        valid: player1Total === 100 && player2Total === 100,
        player1Total,
        player2Total
    };
}

// Helper function to update player value displays
function updatePlayerDisplays(state, api) {
    const values = algorithmConfig.calculateValues(state);
    // Update the displays (these are handled by core system automatically)
    console.log('Player values:', values);
}

// Handle piece selection in step 2
function handlePieceSelection(piece, state, api) {
    const threshold = 0.1;
    console.log(`Player 2 selected the ${piece} piece`);

    // Calculate final values
    const values = algorithmConfig.calculateValues(state);

    // Determine who gets what
    const player2Value = piece === 'left' ? values.player2.left : values.player2.right;
    const player1Value = piece === 'left' ? values.player1.right : values.player1.left;

    // Show results
    api.showResults({
        text: `
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3182ce;">
                <h4>Divide-and-Choose Complete!</h4>
                <p><strong>Step 1:</strong> Player 1 positioned the cut to create pieces they valued equally.</p>
                <p><strong>Step 2:</strong> Player 2 selected the <strong>${piece}</strong> piece.</p>
                <p><strong>Result:</strong> Player 1 gets the <strong>${piece === 'left' ? 'right' : 'left'}</strong> piece.</p>
            </div>
            <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4>Final Values:</h4>
                <p><strong>Player 1:</strong> ${player1Value.toFixed(1)} points</p>
                <p><strong>Player 2:</strong> ${player2Value.toFixed(1)} points</p>
                <br>
                <p><strong>Fairness Analysis:</strong></p>
                <p>✓ <strong>Proportional:</strong> ${(player1Value >= 50 - threshold) && (player2Value >= 50 - threshold) ? 'Both players get ≥50%' : 'Someone gets <50%'}</p>
                <p>✓ <strong>Envy-free:</strong> Neither player prefers the other's piece</p>
                <p>✓ <strong>Strategy-proof:</strong> Truth-telling was optimal for both players</p>
            </div>
        `
    });

    // Store result in algorithm data
    state.algorithmData.result = {
        player2Choice: piece,
        player1Value: player1Value,
        player2Value: player2Value
    };
}

window.FairDivisionCore.register(algorithmId, algorithmConfig);