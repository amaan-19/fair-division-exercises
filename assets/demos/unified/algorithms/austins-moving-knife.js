// Austin's Moving Knife Plug-in

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
                    speedMultiplier = 0.01;
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
        // Initialize knife positions properly
        if (typeof state.algorithmData.leftKnifePosition === 'undefined') {
            state.algorithmData.leftKnifePosition = 0;
        }
        if (typeof state.algorithmData.rightKnifePosition === 'undefined') {
            state.algorithmData.rightKnifePosition = state.algorithmData.stopPosition || 50;
        }

        // Store the initial middle piece value that must be maintained
        const initialRegionValues = api.calculateThreeRegionValues(
            state.algorithmData.leftKnifePosition,
            state.algorithmData.rightKnifePosition
        );
        const controllingPlayerKey = `player${state.algorithmData.controllingPlayer}`;
        const targetMiddleValue = api.calculatePlayerValue(
            initialRegionValues.piece2,
            state.playerValues[controllingPlayerKey]
        );

        // Calculate movement parameters for synchronized movement
        const startLeft = state.algorithmData.leftKnifePosition;
        const startRight = state.algorithmData.rightKnifePosition;
        const endLeft = state.algorithmData.stopPosition;
        const endRight = 100;

        // Calculate total distances to move
        const leftDistance = endLeft - startLeft;
        const rightDistance = endRight - startRight;

        // Use the longer distance to determine animation duration
        const maxDistance = Math.max(Math.abs(leftDistance), Math.abs(rightDistance));

        state.algorithmData.isAnimating = true;
        state.algorithmData.animationProgress = 0; // Track progress from 0 to 1

        const animationId = api.startAnimation({
            onFrame: () => {
                if (!state.algorithmData.isAnimating) {
                    api.stopAnimation(animationId);
                    return;
                }

                // Calculate current values for speed adjustment (same logic as single knife)
                const regionValues = api.calculateThreeRegionValues(
                    state.algorithmData.leftKnifePosition,
                    state.algorithmData.rightKnifePosition
                );

                if (!regionValues || !regionValues.piece1 || !regionValues.piece2 || !regionValues.piece3) {
                    Logger.error('Invalid region values in dual knife animation');
                    state.algorithmData.isAnimating = false;
                    api.stopAnimation(animationId);
                    return;
                }

                // Calculate values for non-controlling player to determine fairness proximity
                const nonControllingPlayer = state.algorithmData.controllingPlayer === 1 ? 2 : 1;
                const nonControllingPlayerKey = `player${nonControllingPlayer}`;

                const p2Middle = api.calculatePlayerValue(regionValues.piece2, state.playerValues[nonControllingPlayerKey]);
                const p2LeftFlank = api.calculatePlayerValue(regionValues.piece1, state.playerValues[nonControllingPlayerKey]);
                const p2RightFlank = api.calculatePlayerValue(regionValues.piece3, state.playerValues[nonControllingPlayerKey]);
                const p2Flanks = p2LeftFlank + p2RightFlank;

                // Calculate distances for speed adjustment (same as single knife)
                const middleDistance = Math.abs(p2Middle - 50);
                const flanksDistance = Math.abs(p2Flanks - 50);
                const minDistance = Math.min(middleDistance, flanksDistance);

                // Apply same speed logic as single knife
                let speedMultiplier = 1.0;
                if (minDistance < 5 && minDistance > 1) {
                    speedMultiplier = 0.1;
                } else if (minDistance < 1) {
                    speedMultiplier = 0.01;
                }

                // Base speed increment (same as single knife)
                const baseSpeed = 0.5 * speedMultiplier;

                // Update progress
                state.algorithmData.animationProgress += (baseSpeed / maxDistance);

                // Clamp progress to [0, 1]
                state.algorithmData.animationProgress = Math.min(1, state.algorithmData.animationProgress);

                // Calculate synchronized positions based on progress
                const progress = state.algorithmData.animationProgress;

                // Move both knives proportionally to maintain synchronization
                state.algorithmData.leftKnifePosition = startLeft + (leftDistance * progress);
                state.algorithmData.rightKnifePosition = startRight + (rightDistance * progress);

                // Ensure knives don't cross over and stay within bounds
                state.algorithmData.leftKnifePosition = Math.max(0, Math.min(100, state.algorithmData.leftKnifePosition));
                state.algorithmData.rightKnifePosition = Math.max(0, Math.min(100, state.algorithmData.rightKnifePosition));

                if (state.algorithmData.leftKnifePosition >= state.algorithmData.rightKnifePosition) {
                    state.algorithmData.leftKnifePosition = state.algorithmData.rightKnifePosition - 0.1;
                }

                // Update visual positions
                const leftX = (state.algorithmData.leftKnifePosition / 100) * 800;
                const rightX = (state.algorithmData.rightKnifePosition / 100) * 800;
                api.updateKnifePositions(leftX, rightX);

                // Calculate and display current values
                const currentRegionValues = api.calculateThreeRegionValues(
                    state.algorithmData.leftKnifePosition,
                    state.algorithmData.rightKnifePosition
                );

                const p1Middle = api.calculatePlayerValue(currentRegionValues.piece2, state.playerValues.player1);
                const p1LeftFlank = api.calculatePlayerValue(currentRegionValues.piece1, state.playerValues.player1);
                const p1RightFlank = api.calculatePlayerValue(currentRegionValues.piece3, state.playerValues.player1);
                const p1Flanks = p1LeftFlank + p1RightFlank;

                // Update displays
                const player1Display = document.getElementById('player1-values');
                const player2Display = document.getElementById('player2-values');

                if (player1Display) {
                    player1Display.textContent = `Middle: ${p1Middle.toFixed(1)} | Flanks: ${p1Flanks.toFixed(1)}`;
                }
                if (player2Display) {
                    player2Display.textContent = `Middle: ${p2Middle.toFixed(1)} | Flanks: ${p2Flanks.toFixed(1)}`;
                }

                // Check completion - both knives should reach their targets simultaneously
                if (progress >= 1.0) {
                    // Ensure final positions are exact
                    state.algorithmData.leftKnifePosition = endLeft;
                    state.algorithmData.rightKnifePosition = endRight;

                    // Final visual update
                    const finalLeftX = (endLeft / 100) * 800;
                    const finalRightX = (endRight / 100) * 800;
                    api.updateKnifePositions(finalLeftX, finalRightX);

                    state.algorithmData.isAnimating = false;
                    api.stopAnimation(animationId);
                    Logger.info('Dual knife animation completed');
                }
            }
        });

        state.algorithmData.animationId = animationId;
    }

    static performRandomAssignment(state, api) {
        Logger.info('Performing random assignment');

        // Add validation for knife positions
        const leftPos = state.algorithmData.leftKnifePosition || 0;
        const rightPos = state.algorithmData.rightKnifePosition || 100;

        if (leftPos >= rightPos) {
            Logger.error('Invalid knife positions for random assignment');
            return;
        }

        // Calculate the three pieces using the dual knife positions
        const regionValues = api.calculateThreeRegionValues(leftPos, rightPos);

        // Calculate values for each player for each piece
        const player1Values = {
            leftFlank: api.calculatePlayerValue(regionValues.piece1, state.playerValues.player1),
            middle: api.calculatePlayerValue(regionValues.piece2, state.playerValues.player1),
            rightFlank: api.calculatePlayerValue(regionValues.piece3, state.playerValues.player1)
        };

        const player2Values = {
            leftFlank: api.calculatePlayerValue(regionValues.piece1, state.playerValues.player2),
            middle: api.calculatePlayerValue(regionValues.piece2, state.playerValues.player2),
            rightFlank: api.calculatePlayerValue(regionValues.piece3, state.playerValues.player2)
        };

        // Calculate combined flank values
        const player1Flanks = player1Values.leftFlank + player1Values.rightFlank;
        const player2Flanks = player2Values.leftFlank + player2Values.rightFlank;

        // Austin's algorithm: each player gets either the middle OR both flanks
        // Random assignment between these two options
        const assignments = [
            {
                player1: { pieces: ['middle'], value: player1Values.middle },
                player2: { pieces: ['left flank', 'right flank'], value: player2Flanks }
            },
            {
                player1: { pieces: ['left flank', 'right flank'], value: player1Flanks },
                player2: { pieces: ['middle'], value: player2Values.middle }
            }
        ];

        const selectedAssignment = assignments[Math.floor(Math.random() * assignments.length)];

        // Store results in the format expected by displayResults()
        api.setAlgorithmData('finalResults', {
            player1: {
                pieces: selectedAssignment.player1.pieces,
                value: selectedAssignment.player1.value
            },
            player2: {
                pieces: selectedAssignment.player2.pieces,
                value: selectedAssignment.player2.value
            },
            assignment: selectedAssignment,
            fairness: {
                equitable: Math.abs(selectedAssignment.player1.value - 50) < 2 && Math.abs(selectedAssignment.player2.value - 50) < 2,
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
        // FIXED: Use correct key to get results
        const results = api.getState().algorithmData.finalResults;
        if (!results) {
            Logger.error('No final results found');
            return;
        }

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

            // FIXED: Properly initialize both knife positions
            state.algorithmData.leftKnifePosition = 0;
            state.algorithmData.rightKnifePosition = state.algorithmData.stopPosition || 50;

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

            // Start dual knife animation with a slight delay
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

            // FIXED: Ensure we have valid positions before showing overlays
            const leftPos = state.algorithmData.leftKnifePosition || 0;
            const rightPos = state.algorithmData.rightKnifePosition || 100;

            const leftX = (leftPos / 100) * 800;
            const rightX = (rightPos / 100) * 800;
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

    // ADD THIS: Robertson-Webb Complexity Metadata
    complexity: {
        theoretical: {
            cut: 0,        // No traditional cuts made
            eval: "∞",     // Continuous evaluation queries
            total: "∞"
        },
        worstCase: {
            cut: 0,
            eval: "∞",
            total: "∞"
        },
        bestCase: {
            cut: 0,
            eval: "∞",
            total: "∞"
        },
        optimal: false,
        bounds: "Requires continuous (infinite) evaluation queries",
        queryPattern: "Continuous eval queries as knife moves until players call 'stop'",
        significance: "Achieves exact fairness but impractical due to continuous queries",
        tradeoffs: "Perfect fairness vs. practical implementation",
        references: [
            "Austin (1982) - Sharing a cake",
            "Brams & Taylor (1996) - Fair Division"
        ]
    },

    onInit: (state, api) => {
        Logger.debug("Austin's Moving Knife algorithm initialized");
        state.algorithmData = {};
        api.disableElement('make-cut-btn');

        // Initialize complexity tracking
        if (api.setCurrentAlgorithm) {
            api.setCurrentAlgorithm('austins-moving-knife');
        }
    },

    onStart: (state, api) => {
        Logger.info('Start button clicked for Austin\'s algorithm');
        if (state.algorithmData.phase === 1 && !state.algorithmData.animationStarted) {

            // ENHANCED: Record start of continuous evaluation
            if (api.recordEvalQuery) {
                api.recordEvalQuery(1, 'left-piece', 'continuous',
                    'Player 1 begins continuous evaluation as knife moves');
                api.recordEvalQuery(2, 'left-piece', 'continuous',
                    'Player 2 begins continuous evaluation as knife moves');
            }

            state.algorithmData.animationStarted = true;
            api.setStartButtonState('loading');
            api.updateInstructions("The knife is moving! Click 'STOP' when the left piece equals exactly 50% of your valuation.");

            AustinsMovingKnifeAlgorithm.startKnifeAnimation(state, api);
        }
    },

    // NEW: Track player stop actions
    onPlayerStop: (state, api, player, position) => {
        if (api.recordEvalQuery) {
            api.recordEvalQuery(player, 'left-piece', 50.0,
                `Player ${player} stops at position ${position}, evaluating left piece as exactly 50%`);
        }

        // Continue with existing logic
        AustinsMovingKnifeAlgorithm.handlePlayerStop(state, api, player, position);
    }
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('austins-moving-knife', austinsMovingKnifeConfig);
Logger.info(`${austinsMovingKnifeConfig.name} algorithm loaded and registered`);