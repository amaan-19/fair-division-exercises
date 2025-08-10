/**
 * Lucas' Method of Markers Algorithm Implementation
 * Fair division of linearly arranged goods using marker placement
 */

const lucasMethodConfig = {
    name: "Lucas' Method of Markers",
    description: "Fair division of linearly arranged goods through strategic marker placement and leftmost-marker allocation",
    goodsType: "linear-arrangement",
    players: "N",
    playerCount: 3, // Default for demo

    // Algorithm metadata
    metadata: {
        complexity: {
            timeComplexity: "O(n²)",
            spaceComplexity: "O(n²)",
            queryComplexity: "O(n×m) marker placements",
            explanation: "n players place n-1 markers each, then n allocation rounds"
        },
        fairnessProperties: {
            proportional: { guaranteed: true, explanation: "Each player gets ≥ 1/n by construction" },
            envyFree: { guaranteed: false, explanation: "May prefer others' segments due to different valuations" },
            strategyProof: { guaranteed: true, condition: "for marker placement", explanation: "Optimal to place markers according to true valuations" },
            contiguous: { guaranteed: true, explanation: "All allocations are contiguous segments" }
        },
        educationalContext: {
            significance: "Bridge between continuous and discrete fair division",
            practicalApplications: "Linear land division, sequential resource allocation, ordered collections",
            theoreticalImportance: "Demonstrates adaptation of moving-knife principles to semi-discrete goods"
        }
    },

    // Linear goods configuration
    linearGoods: {
        type: "book_collection",
        name: "Inherited Academic Library",
        description: "A collection of valuable academic books arranged on shelves",
        items: [
            { id: "math", name: "Mathematics", value: 15, color: "#e3f2fd", start: 0, end: 15 },
            { id: "history", name: "History", value: 25, color: "#fff3e0", start: 15, end: 40 },
            { id: "literature", name: "Literature", value: 20, color: "#f3e5f5", start: 40, end: 60 },
            { id: "science", name: "Science", value: 18, color: "#e8f5e8", start: 60, end: 78 },
            { id: "art", name: "Art Books", value: 12, color: "#ffebee", start: 78, end: 90 },
            { id: "philosophy", name: "Philosophy", value: 10, color: "#e0f2f1", start: 90, end: 100 }
        ],
        totalLength: 100
    },

    // Algorithm phases
    phases: [
        {
            id: "setup",
            name: "Linear Arrangement Setup",
            description: "Display books in linear order from left to right",
            instructions: "The academic library has been arranged linearly. Each section represents different subjects with varying values.",
            userInteraction: "display",
            duration: "user-controlled"
        },
        {
            id: "marker-placement",
            name: "Marker Placement Phase",
            description: "Each player places markers to create equal-value segments",
            instructions: "Click on the line to place your markers. Create segments you value equally at 1/n of the total.",
            userInteraction: "marker-placement",
            duration: "user-controlled"
        },
        {
            id: "allocation",
            name: "Sequential Allocation",
            description: "Allocate segments using leftmost marker rule",
            instructions: "Segments are allocated based on the leftmost marker principle. Watch the sequential allocation process.",
            userInteraction: "automated",
            duration: "3000ms"
        },
        {
            id: "results",
            name: "Final Allocation",
            description: "Review final segment allocation",
            instructions: "Review your allocated book segments. Each player received a segment they value as their fair share.",
            userInteraction: "results",
            duration: "permanent"
        }
    ],

    // Current state
    currentPhase: 0,
    currentPlayer: 0,
    algorithmState: {
        markersPlaced: {},
        allocationComplete: false,
        segmentAllocations: {}
    },

    // ===== INITIALIZATION =====
    onInit: (state, api) => {
        Logger.debug("Initializing Lucas Method of Markers");

        // Initialize algorithm state
        api.setAlgorithmData('currentPhase', 0);
        api.setAlgorithmData('currentPlayer', 0);
        api.setAlgorithmData('markersPlaced', {});
        api.setAlgorithmData('allocationComplete', false);

        // Initialize indivisible goods extensions
        const demoSystem = window.FairDivisionCore.getInstance();
        if (!demoSystem.indivisibleExtensions) {
            const stateExtensions = new window.IndivisibleGoodsExtensions.IndivisibleGoodsStateManager(demoSystem.stateManager);
            const uiExtensions = new window.IndivisibleGoodsExtensions.IndivisibleGoodsUIController(demoSystem.uiController, stateExtensions);

            demoSystem.indivisibleExtensions = {
                state: stateExtensions,
                ui: uiExtensions
            };
        }

        const extensions = demoSystem.indivisibleExtensions;

        // Set up linear arrangement mode
        extensions.state.setGoodsType('linear-arrangement');
        extensions.state.setupLinearGoods(lucasMethodConfig.linearGoods);
        extensions.ui.switchInterface('linear-arrangement');

        // Setup linear goods display
        extensions.ui.setupLinearGoodsDisplay(lucasMethodConfig.linearGoods);

        // Initialize marker controls
        const players = Object.keys(state.playerValues);
        extensions.ui.updateMarkerControls();

        // Set initial instructions
        api.updateInstructions(lucasMethodConfig.phases[0].instructions);
        api.updateStepIndicator(`Phase 1/${lucasMethodConfig.phases.length}: ${lucasMethodConfig.phases[0].name}`);

        // Auto-advance to marker placement after showing setup
        setTimeout(() => {
            lucasMethodConfig.startMarkerPlacement(state, api);
        }, 2000);

        Logger.debug("Lucas Method initialized successfully");
    },

    // ===== MARKER PLACEMENT PHASE =====
    startMarkerPlacement: (state, api) => {
        Logger.debug("Starting marker placement phase");

        api.setAlgorithmData('currentPhase', 1);
        api.updateInstructions(lucasMethodConfig.phases[1].instructions);
        api.updateStepIndicator(`Phase 2/${lucasMethodConfig.phases.length}: ${lucasMethodConfig.phases[1].name}`);

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;
        const players = Object.keys(state.playerValues);

        // Start with first player
        lucasMethodConfig.setCurrentPlayer(0, players, extensions);
    },

    setCurrentPlayer: (playerIndex, players, extensions) => {
        const playerId = players[playerIndex];
        const markersPerPlayer = players.length - 1;

        // Update UI to show current player
        const currentPlayerName = document.getElementById('current-player-name');
        const markersRemaining = document.getElementById('markers-remaining');

        if (currentPlayerName) {
            currentPlayerName.textContent = playerId.charAt(0).toUpperCase() + playerId.slice(1);
        }

        if (markersRemaining) {
            markersRemaining.textContent = markersPerPlayer.toString();
        }

        Logger.debug(`Now placing markers for: ${playerId}`);
    },

    // ===== MARKER CONFIRMATION HANDLER =====
    onMarkersConfirmed: (state, api) => {
        Logger.debug("All markers confirmed, proceeding to allocation");

        api.setAlgorithmData('currentPhase', 2);
        api.updateInstructions(lucasMethodConfig.phases[2].instructions);
        api.updateStepIndicator(`Phase 3/${lucasMethodConfig.phases.length}: ${lucasMethodConfig.phases[2].name}`);

        // Start allocation sequence
        setTimeout(() => {
            lucasMethodConfig.performSequentialAllocation(state, api);
        }, 1000);
    },

    // ===== SEQUENTIAL ALLOCATION =====
    performSequentialAllocation: (state, api) => {
        Logger.debug("Performing sequential allocation using leftmost marker rule");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;
        const players = Object.keys(state.playerValues);
        const markerPositions = state.markerPositions || {};

        const allocations = {};
        const remainingPlayers = [...players];
        let currentPosition = 0;

        // Perform n rounds of allocation
        for (let round = 0; round < players.length; round++) {
            Logger.debug(`Allocation round ${round + 1}`);

            if (remainingPlayers.length === 1) {
                // Last player gets remainder
                const lastPlayer = remainingPlayers[0];
                allocations[lastPlayer] = {
                    start: currentPosition,
                    end: 100,
                    round: round + 1,
                    size: 100 - currentPosition
                };
                Logger.debug(`Final segment (${currentPosition}%-100%) allocated to ${lastPlayer}`);
                break;
            }

            // Find leftmost marker among remaining players
            let leftmostPosition = 100;
            let leftmostPlayer = null;

            remainingPlayers.forEach(playerId => {
                const playerMarkers = markerPositions[playerId] || {};
                const relevantMarkerIndex = round; // 0-indexed marker for current round

                if (playerMarkers[relevantMarkerIndex] !== undefined) {
                    const markerPos = playerMarkers[relevantMarkerIndex];
                    if (markerPos < leftmostPosition && markerPos > currentPosition) {
                        leftmostPosition = markerPos;
                        leftmostPlayer = playerId;
                    }
                }
            });

            if (leftmostPlayer) {
                // Allocate segment to leftmost marker owner
                allocations[leftmostPlayer] = {
                    start: currentPosition,
                    end: leftmostPosition,
                    round: round + 1,
                    size: leftmostPosition - currentPosition
                };

                Logger.debug(`Segment (${currentPosition}%-${leftmostPosition}%) allocated to ${leftmostPlayer}`);

                // Remove player and update position
                remainingPlayers.splice(remainingPlayers.indexOf(leftmostPlayer), 1);
                currentPosition = leftmostPosition;

                // Add visual feedback during allocation
                lucasMethodConfig.highlightAllocation(leftmostPlayer, allocations[leftmostPlayer], round);
            } else {
                Logger.warn(`No valid marker found for round ${round + 1}`);
                break;
            }
        }

        // Store allocations
        extensions.state.setSegmentAllocations(allocations);
        api.setAlgorithmData('segmentAllocations', allocations);
        api.setAlgorithmData('allocationComplete', true);

        // Proceed to results after animation delay
        setTimeout(() => {
            lucasMethodConfig.displayResults(state, api);
        }, 3000);
    },

    highlightAllocation: (playerId, segment, round) => {
        // Add visual highlighting during allocation process
        const goodsLine = document.getElementById('goods-line');
        if (!goodsLine) return;

        // Create temporary highlight overlay
        const highlight = document.createElement('div');
        highlight.className = `allocation-highlight ${playerId}-highlight`;
        highlight.style.cssText = `
            position: absolute;
            left: ${segment.start}%;
            width: ${segment.size}%;
            height: 100%;
            background: rgba(49, 130, 206, 0.3);
            border: 2px solid #3182ce;
            top: 0;
            z-index: 5;
            animation: allocationPulse 1.5s ease-in-out;
        `;

        // Add player label
        const label = document.createElement('div');
        label.className = 'allocation-label';
        label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: #3182ce;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            white-space: nowrap;
        `;
        label.textContent = `${playerId.toUpperCase()} - Round ${round + 1}`;

        highlight.appendChild(label);
        goodsLine.appendChild(highlight);

        // Remove highlight after animation
        setTimeout(() => {
            if (highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
        }, 2000);
    },

    // ===== RESULTS DISPLAY =====
    displayResults: (state, api) => {
        Logger.debug("Displaying Lucas Method results");

        api.setAlgorithmData('currentPhase', 3);
        api.updateInstructions(lucasMethodConfig.phases[3].instructions);
        api.updateStepIndicator(`Phase 4/${lucasMethodConfig.phases.length}: ${lucasMethodConfig.phases[3].name}`);

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;
        const algorithmData = state.algorithmData || {};
        const segmentAllocations = algorithmData.segmentAllocations || {};

        // Display segment allocation results
        extensions.ui.displayLucasResults(segmentAllocations);

        // Calculate and display utility analysis
        lucasMethodConfig.calculateSegmentUtilities(segmentAllocations, state, api);

        Logger.debug("Results displayed successfully");
    },

    // ===== UTILITY CALCULATION =====
    calculateSegmentUtilities: (allocations, state, api) => {
        const utilities = {};
        const totalExpectedUtility = 100; // Normalized to 100%

        Object.entries(allocations).forEach(([playerId, segment]) => {
            const segmentUtility = lucasMethodConfig.calculatePlayerSegmentValue(
                segment.start, segment.end, playerId, state
            );

            const expectedFairShare = totalExpectedUtility / Object.keys(state.playerValues).length;

            utilities[playerId] = {
                segmentStart: segment.start,
                segmentEnd: segment.end,
                segmentSize: segment.size,
                utility: segmentUtility,
                expectedUtility: expectedFairShare,
                isProportional: segmentUtility >= expectedFairShare,
                round: segment.round
            };
        });

        api.setAlgorithmData('utilities', utilities);

        // Display utility analysis
        lucasMethodConfig.displayUtilityAnalysis(utilities);

        Logger.debug("Segment utilities calculated:", utilities);
    },

    calculatePlayerSegmentValue: (startPos, endPos, playerId, state) => {
        // Calculate utility based on books that fall within the segment
        // This is a simplified calculation - in practice would be more sophisticated

        const segmentSize = endPos - startPos;
        const playerValues = state.playerValues[playerId] || {};

        let totalUtility = 0;

        lucasMethodConfig.linearGoods.items.forEach(book => {
            // Calculate overlap between book and player's segment
            const bookStart = book.start;
            const bookEnd = book.end;

            const overlapStart = Math.max(startPos, bookStart);
            const overlapEnd = Math.min(endPos, bookEnd);

            if (overlapStart < overlapEnd) {
                const overlapPortion = (overlapEnd - overlapStart) / (bookEnd - bookStart);

                // Use a default book value or try to map to player values
                const bookValue = book.value;
                totalUtility += bookValue * overlapPortion;
            }
        });

        return totalUtility;
    },

    // ===== UTILITY ANALYSIS DISPLAY =====
    displayUtilityAnalysis: (utilities) => {
        const resultsContainer = document.getElementById('indivisible-results');
        if (!resultsContainer) return;

        // Add utility analysis section
        const utilitySection = document.createElement('div');
        utilitySection.className = 'utility-analysis';
        utilitySection.innerHTML = `
            <h4>Segment Utility Analysis</h4>
            <p><small>Analysis based on the estimated value distribution of book categories within each segment.</small></p>
            <div class="utility-grid">
                ${Object.entries(utilities).map(([playerId, data]) => `
                    <div class="utility-card">
                        <h5>${playerId.toUpperCase()} - Round ${data.round}</h5>
                        <div class="utility-breakdown">
                            <div class="utility-item">
                                <span>Segment:</span>
                                <span>${data.segmentStart.toFixed(1)}% - ${data.segmentEnd.toFixed(1)}%</span>
                            </div>
                            <div class="utility-item">
                                <span>Size:</span>
                                <span>${data.segmentSize.toFixed(1)}% of collection</span>
                            </div>
                            <div class="utility-item">
                                <span>Estimated Value:</span>
                                <span>${data.utility.toFixed(1)} points</span>
                            </div>
                            <div class="utility-item">
                                <span>Expected Fair Share:</span>
                                <span>${data.expectedUtility.toFixed(1)} points</span>
                            </div>
                            <div class="proportional-indicator ${data.isProportional ? 'achieved' : 'not-achieved'}">
                                ${data.isProportional ? '✓' : '✗'} Proportional
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="algorithm-insights">
                <h5>Key Insights</h5>
                <ul>
                    <li><strong>Proportionality:</strong> Each player receives a segment they value at least 1/n of the total</li>
                    <li><strong>Contiguity:</strong> All allocations are contiguous segments - no fragmentation</li>
                    <li><strong>Strategy-Proof:</strong> Players should place markers according to their true valuations</li>
                    <li><strong>Sequential Process:</strong> Leftmost marker rule ensures systematic, fair allocation</li>
                </ul>
            </div>
        `;

        resultsContainer.appendChild(utilitySection);
    },

    // ===== RESET HANDLER =====
    onReset: (state, api) => {
        Logger.debug("Resetting Lucas Method algorithm");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;

        // Reset algorithm state
        api.setAlgorithmData('currentPhase', 0);
        api.setAlgorithmData('currentPlayer', 0);
        api.setAlgorithmData('markersPlaced', {});
        api.setAlgorithmData('allocationComplete', false);
        api.setAlgorithmData('segmentAllocations', {});

        // Reset indivisible goods state
        extensions.state.setupLinearGoods(lucasMethodConfig.linearGoods);

        // Reset UI
        extensions.ui.switchInterface('linear-arrangement');
        extensions.ui.setupLinearGoodsDisplay(lucasMethodConfig.linearGoods);
        extensions.ui.hideInterface('indivisible-results');

        // Clear any allocation highlights
        const goodsLine = document.getElementById('goods-line');
        if (goodsLine) {
            const highlights = goodsLine.querySelectorAll('.allocation-highlight');
            highlights.forEach(highlight => highlight.remove());
        }

        // Reset instructions
        api.updateInstructions(lucasMethodConfig.phases[0].instructions);
        api.updateStepIndicator(`Phase 1/${lucasMethodConfig.phases.length}: ${lucasMethodConfig.phases[0].name}`);

        Logger.debug("Lucas Method reset complete");
    },

    // ===== STEP NAVIGATION =====
    onStepChange: (step, state, api) => {
        Logger.debug(`Lucas Method step change: ${step}`);

        const phase = Math.min(step, lucasMethodConfig.phases.length - 1);
        api.setAlgorithmData('currentPhase', phase);

        const currentPhase = lucasMethodConfig.phases[phase];
        if (currentPhase) {
            api.updateInstructions(currentPhase.instructions);
            api.updateStepIndicator(`Phase ${phase + 1}/${lucasMethodConfig.phases.length}: ${currentPhase.name}`);
        }

        // Handle phase-specific logic
        switch (phase) {
            case 0: // Setup
                lucasMethodConfig.onInit(state, api);
                break;
            case 1: // Marker placement
                lucasMethodConfig.startMarkerPlacement(state, api);
                break;
            case 2: // Allocation
                if (state.algorithmData?.markersPlaced) {
                    lucasMethodConfig.performSequentialAllocation(state, api);
                }
                break;
            case 3: // Results
                if (state.algorithmData?.allocationComplete) {
                    lucasMethodConfig.displayResults(state, api);
                }
                break;
        }
    },

    // ===== EDUCATIONAL METHODS =====
    getEducationalInsights: () => {
        return {
            keyInsights: [
                "Linear arrangement enables fair division of semi-divisible goods",
                "Marker placement transforms continuous procedures to discrete settings",
                "Leftmost marker rule ensures systematic allocation without bias",
                "Contiguous allocations preserve spatial/ordering relationships",
                "Each player guaranteed proportional share by construction"
            ],
            commonMisconceptions: [
                "Players might place markers randomly rather than according to valuations",
                "Some may think later rounds are disadvantageous (they're not)",
                "Contiguity constraint might seem limiting but often matches preferences"
            ],
            practicalApplications: [
                "Linear land division along coastlines or roads",
                "Sequential time slot allocation",
                "Ordered resource distribution (books, inventory, seating)",
                "Heritage site or park area division"
            ],
            theoreticalConnections: [
                "Adapts moving knife principles to discrete/semi-divisible goods",
                "Demonstrates proportionality without full divisibility",
                "Bridge between auction mechanisms and spatial division",
                "Shows contiguity constraints compatible with fairness"
            ]
        };
    },

    // ===== COMPLEXITY ANALYSIS =====
    getComplexityAnalysis: () => {
        return {
            timeComplexity: {
                markerPlacement: "O(n²) - n players place n-1 markers each",
                allocationRounds: "O(n²) - n rounds, each examining n markers",
                overall: "O(n²) - quadratic in number of players"
            },
            spaceComplexity: {
                markerStorage: "O(n²) - store n-1 markers per player",
                allocationTracking: "O(n) - track segment per player",
                overall: "O(n²) - dominated by marker storage"
            },
            informationRequirements: {
                input: "Marker positions representing preference boundaries",
                queries: "O(n²) marker placements required",
                communication: "Players reveal complete preference structure",
                comparison: "More information than Robertson-Webb but less than complete valuations"
            },
            practicalConsiderations: {
                scalability: "Scales well to moderate numbers of players (n ≤ 10)",
                implementation: "Simple to implement and understand",
                robustness: "Works with approximate marker placement",
                extensions: "Can handle weighted players and complex linear arrangements"
            }
        };
    },

    // ===== VARIANT METHODS =====
    getAlgorithmVariants: () => {
        return {
            weightedMarkers: {
                description: "Adapt for players with different entitlements",
                modification: "Players with weight w_i place markers for segments worth w_i/(sum of weights)",
                applications: "Inheritance with unequal shares, investment partnerships"
            },
            approximateMarkers: {
                description: "Allow approximate marker placement for large collections",
                modification: "Accept marker positions within tolerance bounds",
                applications: "Very large discrete collections, models efficiency"
            },
            multipleRounds: {
                description: "Multiple rounds of marker placement and allocation",
                modification: "Allow marker adjustment based on previous round outcomes",
                applications: "Complex valuations, multi-stage negotiations"
            },
            hybridContinuous: {
                description: "Combine with continuous division for mixed goods",
                modification: "Some segments divided continuously, others kept whole",
                applications: "Mixed collections with both divisible and indivisible elements"
            }
        };
    }
};

// ===== CSS ANIMATIONS FOR ALLOCATIONS =====
const markerAllocationCSS = `
@keyframes allocationPulse {
    0% { 
        opacity: 0; 
        transform: scaleY(0.8); 
    }
    50% { 
        opacity: 0.8; 
        transform: scaleY(1.1); 
        box-shadow: 0 0 10px rgba(49, 130, 206, 0.5);
    }
    100% { 
        opacity: 0.6; 
        transform: scaleY(1); 
    }
}

.allocation-highlight {
    animation: allocationPulse 1.5s ease-in-out;
}

.utility-analysis {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #3182ce;
}

.utility-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.utility-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 1rem;
}

.utility-card h5 {
    color: #2d3748;
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
}

.utility-breakdown .utility-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.utility-breakdown .utility-item span:first-child {
    color: #718096;
}

.utility-breakdown .utility-item span:last-child {
    color: #2d3748;
    font-weight: 500;
}

.proportional-indicator {
    margin-top: 0.75rem;
    padding: 0.5rem;
    border-radius: 4px;
    text-align: center;
    font-weight: 600;
    font-size: 0.85rem;
}

.proportional-indicator.achieved {
    background: #c6f6d5;
    color: #276749;
}

.proportional-indicator.not-achieved {
    background: #fed7d7;
    color: #c53030;
}

.algorithm-insights {
    margin-top: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    border-left: 3px solid #38a169;
}

.algorithm-insights h5 {
    color: #2d3748;
    margin: 0 0 0.75rem 0;
}

.algorithm-insights ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
}

.algorithm-insights li {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;
    font-size: 0.9rem;
    line-height: 1.4;
}

.algorithm-insights li:before {
    content: "•";
    color: #38a169;
    font-weight: bold;
    position: absolute;
    left: 0;
}
`;

// Inject CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = markerAllocationCSS;
document.head.appendChild(styleSheet);

// ===== REGISTRATION =====
window.FairDivisionCore.register('lucas-method-markers', lucasMethodConfig);
Logger.info(`${lucasMethodConfig.name} algorithm loaded and registered`);