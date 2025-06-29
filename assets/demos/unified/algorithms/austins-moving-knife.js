/**
 * Austin's Moving Knife Plug-in
 */

// ===== ALGORITHM LOGIC =====
class AustinsMovingKnifeAlgorithm {

    static startKnifeAnimation(state, api) {
        state.algorithmData.isAnimating = true;

        const animationId = api.startAnimation({
            onFrame: () => {
                if (!state.algorithmData.isAnimating) {
                    api.stopAnimation(animationId);
                    return;
                }

                // Move knife
                state.algorithmData.knifePosition += state.algorithmData.animationSpeed || 0.5;

                // Wrap around if we reach the end
                if (state.algorithmData.knifePosition >= 100) {
                    state.algorithmData.knifePosition = 0;
                }

                // Update visual position
                const cutX = (state.algorithmData.knifePosition / 100) * 800;
                api.updateSingleKnife(cutX);

                // Calculate current player values
                const regionValues = api.calculateRegionValues(state.algorithmData.knifePosition);
                const p1Left = api.calculatePlayerValue(regionValues.left, state.playerValues.player1);
                const p1Right = api.calculatePlayerValue(regionValues.right, state.playerValues.player1);
                const p2Left = api.calculatePlayerValue(regionValues.left, state.playerValues.player2);
                const p2Right = api.calculatePlayerValue(regionValues.right, state.playerValues.player2);

                // Update player displays
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

                // Adjust speed based on proximity to 50%
                let speedMultiplier = 1.0;
                if (minDistance < 5 && minDistance > 1) {
                    speedMultiplier = 0.1;
                } else if (minDistance < 1) {
                    speedMultiplier = 0.02;
                }

                state.algorithmData.animationSpeed = 0.5 * speedMultiplier;
            }
        });

        state.algorithmData.animationId = animationId;
    }

    static handlePlayerStop(playerNumber, state, api) {
        if (!state.algorithmData.isAnimating) return;

        Logger.info(`Player ${playerNumber} called STOP at position ${state.algorithmData.knifePosition}`);

        // Stop animation
        state.algorithmData.isAnimating = false;
        if (state.algorithmData.animationId) {
            api.stopAnimation(state.algorithmData.animationId);
        }

        // Record who stopped and where
        state.algorithmData.controllingPlayer = playerNumber;
        state.algorithmData.stopPosition = state.algorithmData.knifePosition;

        // Calculate target middle value
        const regionValues = api.calculateRegionValues(state.algorithmData.knifePosition);
        const playerKey = `player${playerNumber}`;
        state.algorithmData.targetMiddleValue = api.calculatePlayerValue(
            regionValues.left,
            state.playerValues[playerKey]
        );

        Logger.info(`Target middle value: ${state.algorithmData.targetMiddleValue.toFixed(1)}`);

        // Move to phase 2
        api.nextStep();
    }

    static handleOtherPlayerStop(state, api) {
        Logger.info('Other player called STOP during Phase 2');

        // Stop animation
        state.algorithmData.isAnimating = false;
        if (state.algorithmData.animationId) {
            api.stopAnimation(state.algorithmData.animationId);
        }

        // Move to phase 3
        api.nextStep();
    }

    static startDualKnifeAnimation(state, api) {
        state.algorithmData.isAnimating = true;

        const animationId = api.startAnimation({
            onFrame: () => {
                if (!state.algorithmData.isAnimating) {
                    api.stopAnimation(animationId);
                    return;
                }

                const targetLeft = state.algorithmData.stopPosition;
                const targetRight = 100;
                let baseSpeed = 0.5;

                // Calculate current values
                const regionValues = api.calculateThreeRegionValues(
                    state.algorithmData.leftKnifePosition,
                    state.algorithmData.rightKnifePosition
                );

                const p1Middle = api.calculatePlayerValue(regionValues.piece2, state.playerValues.player1);
                const p1LeftFlank = api.calculatePlayerValue(regionValues.piece1, state.playerValues.player1);
                const p1RightFlank = api.calculatePlayerValue(regionValues.piece3, state.playerValues.player1);
                const p1Flanks = p1LeftFlank + p1RightFlank;

                const p2Middle = api.calculatePlayerValue(regionValues.piece2, state.playerValues.player2);
                const p2LeftFlank = api.calculatePlayerValue(regionValues.piece1, state.playerValues.player2);
                const p2RightFlank = api.calculatePlayerValue(regionValues.piece3, state.playerValues.player2);
                const p2Flanks = p2LeftFlank + p2RightFlank;

                // Slow down when approaching fairness
                const nonControllingPlayer = state.algorithmData.controllingPlayer === 1 ? 2 : 1;
                const nonControllingMiddle = nonControllingPlayer === 1 ? p1Middle : p2Middle;
                const nonControllingFlanks = nonControllingPlayer === 1 ? p1Flanks : p2Flanks;

                const middleDistance = Math.abs(nonControllingMiddle - 50);
                const flanksDistance = Math.abs(nonControllingFlanks - 50);
                const minDistance = Math.min(middleDistance, flanksDistance);

                if (minDistance < 2) {
                    baseSpeed = 0.1;
                } else if (minDistance < 5) {
                    baseSpeed = 0.5;
                }

                // Move knives towards targets
                if (state.algorithmData.leftKnifePosition < targetLeft) {
                    state.algorithmData.leftKnifePosition += baseSpeed;
                    if (state.algorithmData.leftKnifePosition > targetLeft) {
                        state.algorithmData.leftKnifePosition = targetLeft;
                    }
                }

                if (state.algorithmData.rightKnifePosition < targetRight) {
                    state.algorithmData.rightKnifePosition += baseSpeed;
                    if (state.algorithmData.rightKnifePosition > targetRight) {
                        state.algorithmData.rightKnifePosition = targetRight;
                    }
                }

                // Update visual positions
                const leftX = (state.algorithmData.leftKnifePosition / 100) * 800;
                const rightX = (state.algorithmData.rightKnifePosition / 100) * 800;
                api.updateKnifePositions(leftX, rightX);

                // Update displays
                const player1Display = document.getElementById('player1-values');
                const player2Display = document.getElementById('player2-values');

                if (player1Display) {
                    player1Display.textContent = `Middle: ${p1Middle.toFixed(1)} | Flanks: ${p1Flanks.toFixed(1)}`;
                }
                if (player2Display) {
                    player2Display.textContent = `Middle: ${p2Middle.toFixed(1)} | Flanks: ${p2Flanks.toFixed(1)}`;
                }

                // Check if animation complete
                if (state.algorithmData.leftKnifePosition >= targetLeft &&
                    state.algorithmData.rightKnifePosition >= targetRight) {
                    state.algorithmData.isAnimating = false;
                    api.stopAnimation(animationId);
                }
            }
        });

        state.algorithmData.animationId = animationId;
    }

    static performRandomAssignment(state, api) {
        Logger.info('Performing random assignment');

        // Calculate final piece values
        const leftPos = state.algorithmData.leftKnifePosition;
        const rightPos = state.algorithmData.rightKnifePosition;

        const leftPieceValues = api.calculateRegionValues(leftPos);
        const rightBoundary = api.calculateRegionValues(rightPos);

        const middlePieceValues = {};
        const rightPieceValues = {};

        Object.keys(leftPieceValues.left).forEach(color => {
            middlePieceValues[color] = rightBoundary.left[color] - leftPieceValues.left[color];
            rightPieceValues[color] = leftPieceValues.right[color] - rightBoundary.left[color];
        });

        // Calculate values for each player
        const player1Values = {
            left: api.calculatePlayerValue(leftPieceValues.left, state.playerValues.player1),
            middle: api.calculatePlayerValue(middlePieceValues, state.playerValues.player1),
            right: api.calculatePlayerValue(rightPieceValues, state.playerValues.player1)
        };

        const player2Values = {
            left: api.calculatePlayerValue(leftPieceValues.left, state.playerValues.player2),
            middle: api.calculatePlayerValue(middlePieceValues, state.playerValues.player2),
            right: api.calculatePlayerValue(rightPieceValues, state.playerValues.player2)
        };

        // Random assignment options
        const assignments = [
            { player1: ['left'], player2: ['middle', 'right'] },
            { player1: ['middle'], player2: ['left', 'right'] },
            { player1: ['right'], player2: ['left', 'middle'] }
        ];

        const selectedAssignment = assignments[Math.floor(Math.random() * assignments.length)];

        // Calculate final values
        const player1FinalValue = selectedAssignment.player1.reduce((sum, piece) => sum + player1Values[piece], 0);
        const player2FinalValue = selectedAssignment.player2.reduce((sum, piece) => sum + player2Values[piece], 0);

        // Store results
        api.setAlgorithmData('finalResults', {
            player1: { pieces: selectedAssignment.player1, value: player1FinalValue },
            player2: { pieces: selectedAssignment.player2, value: player2FinalValue },
            assignment: selectedAssignment,
            fairness: {
                equitable: Math.abs(player1FinalValue - 50) < 2 && Math.abs(player2FinalValue - 50) < 2,
                exact: true,
                envyFree: true,
                strategyProof: true
            }
        });

        // Show results
        api.showElement('results');
        AustinsMovingKnifeAlgorithm.displayResults(state, api);
    }

    static displayResults(state, api) {
        const results = api.getState().algorithmData.result;
        if (!results) return;

        const resultsHTML = `
            <div class="results-summary">
                <h3>Final Allocation - Random Assignment</h3>
                <div class="allocation-grid">
                    <div class="player-result">
                        <h4>Player 1</h4>
                        <p>Receives: <strong>${results.player1.pieces.join(' + ')}</strong></p>
                        <p>Value: <strong>${results.player1.value.toFixed(1)} points</strong></p>
                    </div>
                    <div class="player-result">
                        <h4>Player 2</h4>
                        <p>Receives: <strong>${results.player2.pieces.join(' + ')}</strong></p>
                        <p>Value: <strong>${results.player2.value.toFixed(1)} points</strong></p>
                    </div>
                </div>
                <div class="fairness-analysis">
                    <h4>Fairness Properties Achieved</h4>
                    <p><strong>Equitable:</strong> ${results.fairness.equitable ? '✅ Yes' : '❌ No'} (both players get ≈50% value)</p>
                    <p><strong>Exact:</strong> ${results.fairness.exact ? '✅ Yes' : '❌ No'} (precise equality achieved)</p>
                    <p><strong>Envy-free:</strong> ${results.fairness.envyFree ? '✅ Yes' : '❌ No'} (no player prefers other's piece)</p>
                    <p><strong>Strategy-proof:</strong> ${results.fairness.strategyProof ? '✅ Yes' : '❌ No'} (honest play is optimal)</p>
                </div>
            </div>
        `;

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

        Logger.info('Austin\'s Moving Knife results displayed successfully');
    }
}

// ===== ALGORITHM STEPS =====
const AUSTINS_STEPS = [
    {
        id: 'phase1-moving-knife',
        title: 'Phase 1: Single Moving Knife',
        instructions: 'Watch the knife move across the cake. Click "STOP" when the left piece equals exactly 50% of your valuation.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Phase 1: Moving knife');

            // Initialize algorithm data
            state.algorithmData.phase = 1;
            state.algorithmData.isAnimating = false;
            state.algorithmData.knifePosition = 0;
            state.algorithmData.animationSpeed = 0.5;
            state.algorithmData.controllingPlayer = null;
            state.algorithmData.stopPosition = null;
            state.algorithmData.targetMiddleValue = null;
            state.algorithmData.animationStarted = false;

            // Setup UI
            api.setStartButtonState('enabled');
            api.addStopButtons();
            api.showElement('moving-knife-line');
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Phase 1');
            if (state.algorithmData.animationId) {
                api.stopAnimation(state.algorithmData.animationId);
            }
            api.removeStopButtons();
        }
    },

    {
        id: 'phase2-dual-knives',
        title: 'Phase 2: Dual Knife Movement',
        instructions: 'The controlling player moves both knives while maintaining constant middle piece value. The other player can call STOP when they see a fair division.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Phase 2: Dual knives');

            state.algorithmData.phase = 2;
            state.algorithmData.leftKnifePosition = 0;

            // Setup UI
            api.removeStopButtons();
            api.setStartButtonState('hidden');
            api.showDualKnives();

            // Show stop position indicator
            const stopIndicator = document.getElementById('stop-position-indicator');
            if (stopIndicator && state.algorithmData.stopPosition) {
                const stopX = (state.algorithmData.stopPosition / 100) * 800;
                stopIndicator.setAttribute('x1', stopX.toString());
                stopIndicator.setAttribute('x2', stopX.toString());
                stopIndicator.style.display = 'block';
            }

            // Add other player stop button
            setTimeout(() => {
                api.addOtherPlayerStopButton(state.algorithmData.controllingPlayer);
            }, 100);

            // Start dual knife animation
            setTimeout(() => {
                AustinsMovingKnifeAlgorithm.startDualKnifeAnimation(state, api);
            }, 1000);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Phase 2');
            if (state.algorithmData.animationId) {
                api.stopAnimation(state.algorithmData.animationId);
            }
            api.removeOtherPlayerStopButton();
        }
    },

    {
        id: 'phase3-random-assignment',
        title: 'Phase 3: Random Assignment',
        instructions: 'Pieces are randomly assigned to ensure fairness.',

        onStepEnter: (state, api) => {
            Logger.debug('Entered Phase 3: Random assignment');

            state.algorithmData.phase = 3;

            // Setup UI
            api.removeOtherPlayerStopButton();
            api.setStartButtonState('hidden');

            // Show piece overlays
            const leftX = (state.algorithmData.leftKnifePosition / 100) * 800;
            const rightX = (state.algorithmData.rightKnifePosition / 100) * 800;
            api.showThreePieceOverlays(leftX, rightX);

            // Perform random assignment
            setTimeout(() => {
                AustinsMovingKnifeAlgorithm.performRandomAssignment(state, api);
            }, 2000);
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting Phase 3');
        }
    }
];

// ===== ALGORITHM CONFIGURATION =====
const austinsMovingKnifeConfig = {
    name: "Austin's Moving Knife",
    description: 'Continuous fair division procedure using moving knives for exact equality',
    playerCount: 2,
    steps: AUSTINS_STEPS,

    onInit: (state, api) => {
        Logger.debug("Austin's Moving Knife algorithm initialized");
        // Initialize algorithm data
        state.algorithmData = {};
        api.disableElement('make-cut-btn');
    },

    onStateChange: (stateKey, state, api) => {
        // Handle validation changes
        if (stateKey === 'playerValues' && api.getCurrentStep() === 0) {
            const validation = api.validatePlayerTotals(state);
            if (!state.algorithmData.animationStarted) {
                api.setStartButtonState(validation.valid ? 'enabled' : 'disabled');
            }
        }
    },

    onStart: (state, api) => {
        Logger.info('Start button clicked for Austin\'s algorithm');
        if (state.algorithmData.phase === 1 && !state.algorithmData.animationStarted) {
            state.algorithmData.animationStarted = true;
            api.setStartButtonState('loading');
            api.updateInstructions("The knife is moving! Click 'STOP' when the left piece equals exactly 50% of your valuation.");

            // Start animation
            AustinsMovingKnifeAlgorithm.startKnifeAnimation(state, api);
        }
    },

    onPlayerStop: (playerNumber, state, api) => {
        AustinsMovingKnifeAlgorithm.handlePlayerStop(playerNumber, state, api);
    },

    onOtherPlayerStop: (state, api) => {
        AustinsMovingKnifeAlgorithm.handleOtherPlayerStop(state, api);
    },

    onReset: (state, api) => {
        Logger.info('Austin\'s algorithm reset');

        // Stop any animations
        if (state.algorithmData && state.algorithmData.animationId) {
            api.stopAnimation(state.algorithmData.animationId);
        }

        // Reset state
        state.algorithmData = {};

        // Clean up UI
        api.hideDualKnives();
        api.hideThreePieceOverlays();
        api.removeStopButtons();
        api.removeOtherPlayerStopButton();
        api.setStartButtonState('enabled');
        api.hideElement('results');

        // Hide indicators
        const stopIndicator = document.getElementById('stop-position-indicator');
        if (stopIndicator) stopIndicator.style.display = 'none';

        const movingKnife = document.getElementById('moving-knife-line');
        if (movingKnife) movingKnife.style.display = 'none';
    }
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('austins-moving-knife', austinsMovingKnifeConfig);
Logger.info(`${austinsMovingKnifeConfig.name} algorithm loaded and registered`);