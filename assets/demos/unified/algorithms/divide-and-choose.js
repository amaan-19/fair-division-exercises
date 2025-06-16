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
            instructions: "Player 1, adjust the cut position using the slider below.",
            enabledControls: ['cutSlider', 'executeButton'],
            onStepEnter: (state, api) => {
                console.log('Entered cutting step');
                // Update player value displays when entering step
                updatePlayerDisplays(state, api);
            },
            onStepExit: (state, api) => {
                console.log('Exiting cutting step');
            }
        },
        {
            id: "choosing",
            title: "Step 2: Choose a piece",
            instructions: "Player 2, click on the piece you prefer!",
            enabledControls: ['pieceSelection'],
            onStepEnter: (state, api) => {
                console.log('Entered choosing step');
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
    onExecute: (state, api) => {
        console.log('Execute button clicked');
        if (api.getCurrentStep() === 0) {
            // Move to choosing step
            api.requestStepProgression();
        }
    },

    onReset: (state, api) => {
        console.log('Algorithm reset');
        // Reset any algorithm-specific state
        state.algorithmData = {};
        updatePlayerDisplays(state, api);
    },

    onPlayerValueChange: (state, api) => {
        console.log('Player values changed');
        updatePlayerDisplays(state, api);
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
                <p><strong>Algorithm Complete!</strong></p>
                <p>Player 2 selected the <strong>${piece}</strong> piece.</p>
                <p>Player 1 gets the <strong>${piece === 'left' ? 'right' : 'left'}</strong> piece.</p>
                <br>
                <p><strong>Final Values:</strong></p>
                <p>Player 1: ${player1Value.toFixed(1)} points</p>
                <p>Player 2: ${player2Value.toFixed(1)} points</p>
                <br>
                <p><strong>Fairness Analysis:</strong></p>
                <p>Proportional: ${(player1Value >= 50 - threshold) && (player2Value >= 50 - threshold) ? '✓ Yes' : '✗ No'}</p>
                <p>Envy-free: ✓ Yes (guaranteed by divide-and-choose)</p>
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
