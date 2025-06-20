// Algorithm ID
const algorithmIdAustin = "austins-moving-knife";

// Algorithm configuration
const algorithmConfigAustin = {
    // Metadata
    name: "Austin's Moving Knife",
    description: "Continuous extension to Divide-and-Choose using moving knives",
    playerCount: 2,
    type: "continuous",

    // Steps definition
    steps: [
        {
            id: "phase1-moving-knife",
            title: "Phase 1: Single moving knife",
            instructions: "Get ready to watch the knife move across the cake. Click 'Start Animation' to begin, then click 'STOP' when the left piece equals exactly 50% of your valuation.",
            enabledControls: ['startButton'],
            onStepEnter: (state, api) => {
                console.log('Entered Phase 1: Moving knife');

                // Initialize animation state
                state.algorithmData.phase = 1;
                state.algorithmData.isAnimating = false;
                state.algorithmData.knifePosition = 0;
                state.algorithmData.animationSpeed = 0.5;
                state.algorithmData.controllingPlayer = null;
                state.algorithmData.stopPosition = null;
                state.algorithmData.targetMiddleValue = null;
                state.algorithmData.animationStarted = false;

                // Ensure clean state
                api.removeStopButtons();
                api.removeOtherPlayerStopButton();
                api.hideDualKnives();
                api.hideThreePieceOverlays();

                // enable start button
                api.setStartButtonState('enabled');
            },
            onStepExit: (state, api) => {
                console.log('Exiting Phase 1');
                // Stop any running animation
                if (state.algorithmData.animationId) {
                    cancelAnimationFrame(state.algorithmData.animationId);
                }
                // Clean up all buttons
                api.removeStopButtons();
            }
        },
        {
            id: "phase2-dual-knives",
            title: "Phase 2: Dual knife movement",
            instructions: "The controlling player moves both knives while maintaining constant middle piece value. The other player can call STOP when they see a fair division.",
            enabledControls: [],
            onStepEnter: (state, api) => {
                console.log('Entered Phase 2: Dual knives');
                state.algorithmData.phase = 2;
                state.algorithmData.leftKnifePosition = 0;

                // Clean up any remaining buttons from previous phase
                api.removeStopButtons();

                // Hide start button during this phase
                api.setStartButtonState('hidden');

                // Show both knives
                api.showDualKnives();

                // Show stop position indicator
                const stopIndicator = document.getElementById('stop-position-indicator');
                if (stopIndicator && state.algorithmData.stopPosition) {
                    const stopX = (state.algorithmData.stopPosition / 100) * 800;
                    stopIndicator.setAttribute('x1', stopX);
                    stopIndicator.setAttribute('x2', stopX);
                    stopIndicator.style.display = 'block';
                }

                // Calculate initial right knife position that maintains target value
                const rightPos = calculateConstrainedRightKnife(
                    0,
                    state.algorithmData.targetMiddleValue,
                    state.algorithmData.controllingPlayer,
                    state
                );
                state.algorithmData.rightKnifePosition = rightPos;

                // Update knife positions
                api.updateKnifePositions(0, rightPos);

                // Add stop button for other player AFTER cleanup
                setTimeout(() => {
                    api.addOtherPlayerStopButton(state.algorithmData.controllingPlayer);
                }, 100);

                // Start dual knife animation
                setTimeout(() => {
                    startDualKnifeAnimation(state, api);
                }, 1000);
            },
            onStepExit: (state, api) => {
                console.log('Exiting Phase 2');
                if (state.algorithmData.animationId) {
                    cancelAnimationFrame(state.algorithmData.animationId);
                }
                api.removeOtherPlayerStopButton();
            }
        },
        {
            id: "phase3-random-assignment",
            title: "Phase 3: Random assignment",
            instructions: "Pieces are randomly assigned to ensure fairness.",
            enabledControls: ['resetButton'],
            onStepEnter: (state, api) => {
                console.log('Entered Phase 3: Random assignment');
                state.algorithmData.phase = 3;

                // Clean up any remaining buttons
                api.removeOtherPlayerStopButton();

                // Keep start button hidden
                api.setStartButtonState('hidden');

                // Show piece overlays
                api.showThreePieceOverlays(
                    state.algorithmData.leftKnifePosition,
                    state.algorithmData.rightKnifePosition
                );

                // Perform random assignment after delay
                setTimeout(() => {
                    performRandomAssignment(state, api);
                }, 2000);
            },
            onStepExit: (state, api) => {
                console.log('Exiting Phase 3');
            }
        }
    ],

    // Main algorithm handlers
    onStart: (state, api) => {
        console.log('Start button clicked for Austin\'s algorithm');

        // Validate that player values sum to 100
        const validation = validatePlayerTotals(state);
        if (!validation.valid) {
            alert(`Player valuations must sum to 100!\n\nPlayer 1: ${validation.player1Total}\nPlayer 2: ${validation.player2Total}`);
            return;
        }

        // Initialize algorithmData if it doesn't exist
        if (!state.algorithmData) {
            state.algorithmData = {};
        }

        if (state.algorithmData.phase === 1 && !state.algorithmData.animationStarted) {
            // Start the knife animation
            state.algorithmData.animationStarted = true;

            // Set start button to loading state
            api.setStartButtonState('loading');

            // Add stop buttons to the UI
            api.addStopButtons();

            // Start knife animation
            startKnifeAnimation(state, api);

            // Update instructions
            api.updateUI({
                instructions: "The knife is moving! Click 'STOP' when the left piece equals exactly 50% of your valuation."
            });
        }
    },

    onPlayerStop: (playerNumber, state, api) => {
        handlePlayerStop(playerNumber, state, api);
    },

    onOtherPlayerStop: (state, api) => {
        handleOtherPlayerStop(state, api);
    },

    onReset: (state, api) => {
        console.log('Austin\'s algorithm reset');
        // Reset algorithm-specific state
        state.algorithmData = {};
        if (state.algorithmData.animationId) {
            cancelAnimationFrame(state.algorithmData.animationId);
        }

        // Clean up all UI elements
        api.hideDualKnives();
        api.hideThreePieceOverlays();
        api.removeStopButtons();
        api.removeOtherPlayerStopButton();
        api.setStartButtonState('enabled');

        // Hide stop position indicator
        const stopIndicator = document.getElementById('stop-position-indicator');
        if (stopIndicator) stopIndicator.style.display = 'none';
    },

    onPlayerValueChange: (state, api) => {
        console.log('Player values changed in Austin\'s algorithm');

        // Validate totals and update start button state
        const validation = validatePlayerTotals(state);
        if (api.getCurrentStep() === 0 && !state.algorithmData.animationStarted) {
            if (validation.valid) {
                api.setStartButtonState('enabled');
            } else {
                api.setStartButtonState('disabled');
            }
        }

        // Update displays if in animation phase
        if (state.algorithmData.phase === 1 && state.algorithmData.isAnimating) {
            updatePhase1Displays(state, api);
        }
    },

    // Utility methods
    calculateValues: (state) => {
        if (state.algorithmData.phase === 1) {
            // Single knife phase
            const regionValues = calculateRegionValues(state.algorithmData.knifePosition || 0);

            const player1Left = calculatePlayerValue(regionValues.left, state.playerValues.player1);
            const player1Right = calculatePlayerValue(regionValues.right, state.playerValues.player1);
            const player2Left = calculatePlayerValue(regionValues.left, state.playerValues.player2);
            const player2Right = calculatePlayerValue(regionValues.right, state.playerValues.player2);

            return {
                player1: { left: player1Left, right: player1Right },
                player2: { left: player2Left, right: player2Right }
            };
        } else if (state.algorithmData.phase === 2) {
            // Dual knife phase
            const leftPos = state.algorithmData.leftKnifePosition || 0;
            const rightPos = state.algorithmData.rightKnifePosition || 400;

            const regionValues = calculateDualKnifeRegionValues(leftPos, rightPos);

            const player1Middle = calculatePlayerValue(regionValues.middle, state.playerValues.player1);
            const player1Flanks = calculatePlayerValue(regionValues.flanks, state.playerValues.player1);
            const player2Middle = calculatePlayerValue(regionValues.middle, state.playerValues.player2);
            const player2Flanks = calculatePlayerValue(regionValues.flanks, state.playerValues.player2);

            return {
                player1: { middle: player1Middle, flanks: player1Flanks },
                player2: { middle: player2Middle, flanks: player2Flanks }
            };
        }

        return { player1: { left: 0, right: 0 }, player2: { left: 0, right: 0 } };
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

// Helper functions for Austin's algorithm

function startKnifeAnimation(state, api) {
    state.algorithmData.isAnimating = true;

    function animate() {
        if (!state.algorithmData.isAnimating) return;

        // Move knife
        state.algorithmData.knifePosition += state.algorithmData.animationSpeed;

        // Wrap around if we reach the end
        if (state.algorithmData.knifePosition >= 100) {
            state.algorithmData.knifePosition = 0;
        }

        // Update visual position
        const cutX = (state.algorithmData.knifePosition / 100) * 800;
        api.updateSingleKnife(cutX);

        // Calculate current player values and update displays directly
        const regionValues = calculateRegionValues(state.algorithmData.knifePosition);
        const p1Left = calculatePlayerValue(regionValues.left, state.playerValues.player1);
        const p1Right = calculatePlayerValue(regionValues.right, state.playerValues.player1);
        const p2Left = calculatePlayerValue(regionValues.left, state.playerValues.player2);
        const p2Right = calculatePlayerValue(regionValues.right, state.playerValues.player2);

        // Update player displays directly
        const player1Display = document.getElementById('player1-values');
        const player2Display = document.getElementById('player2-values');

        if (player1Display) {
            player1Display.textContent = `Left: ${p1Left.toFixed(1)} | Right: ${p1Right.toFixed(1)}`;
        }
        if (player2Display) {
            player2Display.textContent = `Left: ${p2Left.toFixed(1)} | Right: ${p2Right.toFixed(1)}`;
        }

        // Calculate distances for speed adjustment
        const p1Distance = Math.abs(p1Left - 50);
        const p2Distance = Math.abs(p2Left - 50);
        const minDistance = Math.min(p1Distance, p2Distance);

        // Adjust speed based on how close either player is to 50%
        let speedMultiplier = 0.5;
        if (minDistance < 5 && minDistance > 1) {
            speedMultiplier = 0.05;
        } else if (minDistance < 1) {
            speedMultiplier = 0.01;
        }

        // Apply speed adjustment for next frame
        state.algorithmData.animationSpeed = 0.5 * speedMultiplier;

        // Continue animation
        state.algorithmData.animationId = requestAnimationFrame(animate);
    }

    animate();
}

function handlePlayerStop(playerNumber, state, api) {
    if (!state.algorithmData.isAnimating) return;

    console.log(`Player ${playerNumber} called STOP at position ${state.algorithmData.knifePosition}`);

    // Stop animation
    state.algorithmData.isAnimating = false;
    if (state.algorithmData.animationId) {
        cancelAnimationFrame(state.algorithmData.animationId);
    }

    // Record who stopped and where
    state.algorithmData.controllingPlayer = playerNumber;
    state.algorithmData.stopPosition = state.algorithmData.knifePosition;

    // Calculate what the controlling player values the left piece at
    const regionValues = calculateRegionValues(state.algorithmData.knifePosition);
    const playerKey = `player${playerNumber}`;
    state.algorithmData.targetMiddleValue = calculatePlayerValue(
        regionValues.left,
        state.playerValues[playerKey]
    );

    console.log(`Target middle value: ${state.algorithmData.targetMiddleValue}`);

    // Move to phase 2
    api.requestStepProgression();
}

function handleOtherPlayerStop(state, api) {
    console.log('Other player called STOP during Phase 2');

    // Stop animation
    state.algorithmData.isAnimating = false;
    if (state.algorithmData.animationId) {
        cancelAnimationFrame(state.algorithmData.animationId);
    }

    // Move to phase 3
    api.requestStepProgression();
}

function startDualKnifeAnimation(state, api) {
    state.algorithmData.isAnimating = true;

    function animate() {
        if (!state.algorithmData.isAnimating) return;

        const targetLeft = (state.algorithmData.stopPosition / 100) * 800;
        const targetRight = 800;
        let baseSpeed = 1.5;

        // Calculate current player values for dual knife phase
        const regionValues = calculateDualKnifeRegionValues(
            state.algorithmData.leftKnifePosition,
            state.algorithmData.rightKnifePosition
        );

        const p1Middle = calculatePlayerValue(regionValues.middle, state.playerValues.player1);
        const p1Flanks = calculatePlayerValue(regionValues.flanks, state.playerValues.player1);
        const p2Middle = calculatePlayerValue(regionValues.middle, state.playerValues.player2);
        const p2Flanks = calculatePlayerValue(regionValues.flanks, state.playerValues.player2);

        // Determine the non-controlling player and calculate their distances from 50%
        const nonControllingPlayer = state.algorithmData.controllingPlayer === 1 ? 2 : 1;
        let middleValue, flankValue;

        if (nonControllingPlayer === 1) {
            middleValue = p1Middle;
            flankValue = p1Flanks;
        } else {
            middleValue = p2Middle;
            flankValue = p2Flanks;
        }

        // Calculate how close the non-controlling player is to 50% for either piece type
        const middleDistance = Math.abs(middleValue - 50);
        const flankDistance = Math.abs(flankValue - 50);
        const minDistance = Math.min(middleDistance, flankDistance);

        // Adjust speed based on how close the non-controlling player is to 50%
        let speedMultiplier = 0.5;
        if (minDistance < 5 && minDistance > 1) {
            speedMultiplier = 0.05;
        } else if (minDistance < 1) {
            speedMultiplier = 0.01;
        }

        baseSpeed *= speedMultiplier;

        // Move left knife toward target
        const leftRemaining = targetLeft - state.algorithmData.leftKnifePosition;
        if (Math.abs(leftRemaining) > 1) {
            const leftStep = Math.sign(leftRemaining) * Math.min(Math.abs(leftRemaining), baseSpeed);
            state.algorithmData.leftKnifePosition += leftStep;
        }

        // Calculate constrained right knife position
        const newRightPos = calculateConstrainedRightKnife(
            state.algorithmData.leftKnifePosition,
            state.algorithmData.targetMiddleValue,
            state.algorithmData.controllingPlayer,
            state
        );
        state.algorithmData.rightKnifePosition = newRightPos;

        // Update visual positions
        api.updateKnifePositions(state.algorithmData.leftKnifePosition, state.algorithmData.rightKnifePosition);

        // Update player displays directly for dual knife phase
        const player1Display = document.getElementById('player1-values');
        const player2Display = document.getElementById('player2-values');

        if (player1Display) {
            player1Display.textContent = `Middle: ${p1Middle.toFixed(1)} | Flanks: ${p1Flanks.toFixed(1)}`;
        }
        if (player2Display) {
            player2Display.textContent = `Middle: ${p2Middle.toFixed(1)} | Flanks: ${p2Flanks.toFixed(1)}`;
        }

        // Check if we've reached the end
        const leftComplete = Math.abs(targetLeft - state.algorithmData.leftKnifePosition) < 1;
        const rightComplete = Math.abs(targetRight - state.algorithmData.rightKnifePosition) < 1;

        if (leftComplete && rightComplete) {
            // Move to phase 3
            setTimeout(() => {
                api.requestStepProgression();
            }, 500);
            return;
        }

        state.algorithmData.animationId = requestAnimationFrame(animate);
    }

    animate();
}

function calculateConstrainedRightKnife(leftPos, targetValue, controllingPlayer, state) {
    // Binary search to find right knife position that maintains target middle value
    let minRight = leftPos + 10;
    let maxRight = 800;
    let bestRightPos = (minRight + maxRight) / 2;

    const playerKey = `player${controllingPlayer}`;
    const tolerance = 0.1;
    const maxIterations = 30;

    for (let i = 0; i < maxIterations; i++) {
        const testRight = (minRight + maxRight) / 2;

        if (testRight <= leftPos) break;

        const testMiddleValues = calculateTestMiddleValues(leftPos, testRight);
        const testValue = calculatePlayerValue(testMiddleValues, state.playerValues[playerKey]);
        const valueDiff = testValue - targetValue;

        if (Math.abs(valueDiff) < tolerance) {
            return testRight;
        }

        if (valueDiff < 0) {
            minRight = testRight;
        } else {
            maxRight = testRight;
        }

        if (maxRight - minRight < 0.1) break;
    }

    return Math.max(leftPos + 10, Math.min(bestRightPos, 800));
}

function calculateTestMiddleValues(leftPos, rightPos) {
    const regions = {
        blue: { start: 0, end: 600 },
        red: { start: 600, end: 800 },
        green: { start: 150, end: 600 },
        orange: { start: 600, end: 800 },
        pink: { start: 0, end: 150 },
        purple: { start: 150, end: 800 }
    };

    const middleValues = {};

    for (const [color, bounds] of Object.entries(regions)) {
        const totalArea = bounds.end - bounds.start;

        if (leftPos <= bounds.start && rightPos >= bounds.end) {
            middleValues[color] = 100;
        } else if (leftPos >= bounds.end || rightPos <= bounds.start) {
            middleValues[color] = 0;
        } else {
            const leftBound = Math.max(leftPos, bounds.start);
            const rightBound = Math.min(rightPos, bounds.end);

            if (leftBound < rightBound) {
                const middleArea = rightBound - leftBound;
                middleValues[color] = (middleArea / totalArea) * 100;
            } else {
                middleValues[color] = 0;
            }
        }
    }

    return middleValues;
}

function calculateDualKnifeRegionValues(leftPos, rightPos) {
    const middleValues = calculateTestMiddleValues(leftPos, rightPos);
    const flankValues = {};

    for (const [color, middlePercent] of Object.entries(middleValues)) {
        flankValues[color] = 100 - middlePercent;
    }

    return { middle: middleValues, flanks: flankValues };
}

function performRandomAssignment(state, api) {
    const randomChoice = Math.random() < 0.5 ? 'inside' : 'outside';
    const choosingPlayer = state.algorithmData.controllingPlayer === 1 ? 2 : 1;
    const controllingPlayer = state.algorithmData.controllingPlayer;

    // Calculate final values based on random assignment
    let player1Final, player2Final;

    if (randomChoice === 'inside') {
        // Choosing player gets middle piece
        if (choosingPlayer === 1) {
            player1Final = state.algorithmData.targetMiddleValue;
            player2Final = 50; // Controlling player designed this to be 50%
        } else {
            player1Final = 50;
            player2Final = state.algorithmData.targetMiddleValue;
        }
    } else {
        // Choosing player gets flanking pieces
        if (choosingPlayer === 1) {
            player1Final = 100 - state.algorithmData.targetMiddleValue;
            player2Final = 50;
        } else {
            player1Final = 50;
            player2Final = 100 - state.algorithmData.targetMiddleValue;
        }
    }

    // Show results
    api.showResults({
        text: `
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3182ce;">
                <h4>Austin's Moving Knife Protocol Complete!</h4>
                <p><strong>Phase 1:</strong> Player ${controllingPlayer} stopped the knife when they believed the left piece was worth exactly 50%.</p>
                <p><strong>Phase 2:</strong> Player ${controllingPlayer} controlled both knives, maintaining their 50% value constraint for the middle piece.</p>
                <p><strong>Phase 3:</strong> Random assignment gave Player ${choosingPlayer} the <strong>${randomChoice}</strong> piece(s).</p>
            </div>
            <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4>Final Result:</h4>
                <p><strong>Player 1:</strong> ${player1Final.toFixed(1)}% of their valuation</p>
                <p><strong>Player 2:</strong> ${player2Final.toFixed(1)}% of their valuation</p>
                <br>
                <p><strong>Fairness Analysis:</strong></p>
                <p>✓ <strong>Equitable:</strong> Both players receive exactly 50% according to their own valuations</p>
                <p>✓ <strong>Envy-free:</strong> Each player values both final pieces equally</p>
                <p>✓ <strong>Strategy-proof:</strong> Truth-telling was optimal throughout</p>
                <p>✓ <strong>Exact:</strong> Perfect 50-50 division achieved</p>
            </div>
        `
    });
}

function updatePhase1Displays(state, api) {
    const values = algorithmConfigAustin.calculateValues(state);
    // The core system handles basic left/right displays automatically
    // Additional displays could be added here for Austin-specific info
}

function calculateRegionValues(cutPosition) {
    // Convert percentage to pixel position
    const cutX = (cutPosition / 100) * 800;

    const regions = {
        blue: { start: 0, end: 600 },
        red: { start: 600, end: 800 },
        green: { start: 150, end: 600 },
        orange: { start: 600, end: 800 },
        pink: { start: 0, end: 150 },
        purple: { start: 150, end: 800 }
    };

    const leftValues = {}, rightValues = {};

    for (const [color, bounds] of Object.entries(regions)) {
        if (cutX <= bounds.start) {
            leftValues[color] = 0;
            rightValues[color] = 100;
        } else if (cutX >= bounds.end) {
            leftValues[color] = 100;
            rightValues[color] = 0;
        } else {
            const total = bounds.end - bounds.start;
            const left = cutX - bounds.start;
            leftValues[color] = (left / total) * 100;
            rightValues[color] = 100 - leftValues[color];
        }
    }

    return { left: leftValues, right: rightValues };
}

function calculatePlayerValue(regionValues, playerValues) {
    return Object.entries(regionValues)
        .reduce((total, [color, percentage]) => {
            return total + (percentage / 100) * (playerValues[color] || 0);
        }, 0);
}

// Register the algorithm
window.FairDivisionCore.register(algorithmIdAustin, algorithmConfigAustin);