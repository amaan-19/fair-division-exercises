/**
 * Knaster's Sealed Bids Algorithm Implementation
 * Fair division of indivisible goods through auction mechanism
 */

const knasterSealedBidsConfig = {
    name: "Knaster's Sealed Bids Procedure",
    description: "Fair division through sealed bid auction with monetary redistribution ensuring proportional outcomes",
    goodsType: "discrete-items",
    players: "N",
    playerCount: 3, // Default for demo

    // Algorithm metadata
    metadata: {
        complexity: {
            timeComplexity: "O(n × m)",
            spaceComplexity: "O(n × m)",
            queryComplexity: "Complete information (n×m bids)",
            explanation: "n players submit bids for m items"
        },
        fairnessProperties: {
            proportional: { guaranteed: true, condition: "with monetary transfers" },
            envyFree: { guaranteed: false, explanation: "May envy item allocation despite compensation" },
            strategyProof: { guaranteed: true, explanation: "Truth-telling is optimal strategy" },
            paretoEfficient: { guaranteed: true, explanation: "Items go to highest bidders" }
        },
        educationalContext: {
            significance: "Fundamental mechanism for indivisible goods division",
            practicalApplications: "Estate division, asset allocation, procurement auctions",
            theoreticalImportance: "Bridge between game theory and fair division"
        }
    },

    // Items for the demo
    items: [
        {
            id: "house",
            name: "Family House",
            description: "3BR/2BA residential property with garden",
            estimatedValue: 300000
        },
        {
            id: "car",
            name: "Family Car",
            description: "Reliable sedan in excellent condition",
            estimatedValue: 25000
        },
        {
            id: "boat",
            name: "Recreational Boat",
            description: "Small fishing boat with trailer",
            estimatedValue: 15000
        },
        {
            id: "savings",
            name: "Savings Account",
            description: "Joint savings account balance",
            estimatedValue: 50000
        }
    ],

    // Algorithm phases
    phases: [
        {
            id: "bidding",
            name: "Sealed Bidding Phase",
            description: "Players submit private bids for each item",
            instructions: "Enter your true valuation for each item. Bidding truthfully is your best strategy.",
            userInteraction: "bidding",
            duration: "user-controlled"
        },
        {
            id: "auction",
            name: "Auction Resolution",
            description: "Items awarded to highest bidders",
            instructions: "Items are automatically awarded to the highest bidders.",
            userInteraction: "automated",
            duration: "2000ms"
        },
        {
            id: "payment",
            name: "Payment Calculation",
            description: "Calculate payments and equal redistribution",
            instructions: "Payments are calculated and equally redistributed among all players.",
            userInteraction: "automated",
            duration: "1500ms"
        },
        {
            id: "results",
            name: "Final Allocation",
            description: "Review final allocation with monetary transfers",
            instructions: "Review your final allocation and net monetary position below.",
            userInteraction: "results",
            duration: "permanent"
        }
    ],

    // Current algorithm state
    currentPhase: 0,
    algorithmState: {
        bidsSubmitted: false,
        auctionResolved: false,
        paymentsCalculated: false
    },

    // ===== INITIALIZATION =====
    onInit: (state, api) => {
        Logger.debug("Initializing Knaster's Sealed Bids");

        // Set up algorithm state
        api.setAlgorithmData('currentPhase', 0);
        api.setAlgorithmData('bidsSubmitted', false);

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

        // Set up discrete items mode
        extensions.state.setGoodsType('discrete-items');
        extensions.state.setItems(knasterSealedBidsConfig.items);
        extensions.ui.switchInterface('discrete-items');

        // Update items display
        extensions.ui.updateItemsDisplay(knasterSealedBidsConfig.items);

        // Set initial instructions
        api.updateInstructions(knasterSealedBidsConfig.phases[0].instructions);
        api.updateStepIndicator(`Phase 1/${knasterSealedBidsConfig.phases.length}: ${knasterSealedBidsConfig.phases[0].name}`);

        Logger.debug("Knaster algorithm initialized successfully");
    },

    // ===== BID SUBMISSION HANDLER =====
    onBidsSubmitted: (state, api) => {
        Logger.debug("Bids submitted, proceeding to auction phase");

        api.setAlgorithmData('bidsSubmitted', true);
        api.setAlgorithmData('currentPhase', 1);

        // Update UI for auction phase
        api.updateInstructions(knasterSealedBidsConfig.phases[1].instructions);
        api.updateStepIndicator(`Phase 2/${knasterSealedBidsConfig.phases.length}: ${knasterSealedBidsConfig.phases[1].name}`);

        // Auto-advance to auction resolution after delay
        setTimeout(() => {
            knasterSealedBidsConfig.resolveAuction(state, api);
        }, 1000);
    },

    // ===== AUCTION RESOLUTION =====
    resolveAuction: (state, api) => {
        Logger.debug("Resolving auction...");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;
        const allocations = {};

        // Award each item to highest bidder
        knasterSealedBidsConfig.items.forEach(item => {
            let highestBidder = null;
            let highestBid = -1;

            Object.keys(state.playerValues).forEach(playerId => {
                const bid = state.itemBids[item.id]?.[playerId] || 0;
                if (bid > highestBid) {
                    highestBid = bid;
                    highestBidder = playerId;
                }
            });

            if (highestBidder) {
                allocations[item.id] = highestBidder;
                extensions.state.allocateItem(item.id, highestBidder);

                Logger.debug(`${item.name} awarded to ${highestBidder} for ${highestBid}`);
            }
        });

        api.setAlgorithmData('auctionResolved', true);
        api.setAlgorithmData('allocations', allocations);

        // Proceed to payment calculation
        setTimeout(() => {
            knasterSealedBidsConfig.calculatePayments(state, api);
        }, knasterSealedBidsConfig.phases[1].duration === "2000ms" ? 2000 : 1500);
    },

    // ===== PAYMENT CALCULATION =====
    calculatePayments: (state, api) => {
        Logger.debug("Calculating payments and redistributions");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;

        // Update phase
        api.setAlgorithmData('currentPhase', 2);
        api.updateInstructions(knasterSealedBidsConfig.phases[2].instructions);
        api.updateStepIndicator(`Phase 3/${knasterSealedBidsConfig.phases.length}: ${knasterSealedBidsConfig.phases[2].name}`);

        // Calculate using extensions
        const { payments, redistributions, totalPayments } = extensions.state.calculateKnasterPayments();

        api.setAlgorithmData('payments', payments);
        api.setAlgorithmData('redistributions', redistributions);
        api.setAlgorithmData('totalPayments', totalPayments);
        api.setAlgorithmData('paymentsCalculated', true);

        Logger.debug("Payments calculated:", { payments, redistributions, totalPayments });

        // Proceed to results
        setTimeout(() => {
            knasterSealedBidsConfig.displayResults(state, api);
        }, 1500);
    },

    // ===== RESULTS DISPLAY =====
    displayResults: (state, api) => {
        Logger.debug("Displaying final results");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;
        const algorithmData = state.algorithmData || {};

        // Update phase
        api.setAlgorithmData('currentPhase', 3);
        api.updateInstructions(knasterSealedBidsConfig.phases[3].instructions);
        api.updateStepIndicator(`Phase 4/${knasterSealedBidsConfig.phases.length}: ${knasterSealedBidsConfig.phases[3].name}`);

        // Display results using UI extensions
        extensions.ui.displayKnasterResults(
            algorithmData.allocations || {},
            algorithmData.payments || {},
            algorithmData.redistributions || {}
        );

        // Calculate and display final utilities
        knasterSealedBidsConfig.calculateFinalUtilities(state, api);

        Logger.debug("Results displayed successfully");
    },

    // ===== UTILITY CALCULATION =====
    calculateFinalUtilities: (state, api) => {
        const algorithmData = state.algorithmData || {};
        const allocations = algorithmData.allocations || {};
        const payments = algorithmData.payments || {};
        const redistributions = algorithmData.redistributions || {};

        const finalUtilities = {};

        Object.keys(state.playerValues).forEach(playerId => {
            let itemUtility = 0;
            let itemsWon = [];

            // Calculate utility from items won (using player's own bids as proxy for valuations)
            Object.entries(allocations).forEach(([itemId, winnerId]) => {
                if (winnerId === playerId) {
                    const playerBid = state.itemBids[itemId]?.[playerId] || 0;
                    itemUtility += playerBid;

                    const item = knasterSealedBidsConfig.items.find(i => i.id === itemId);
                    itemsWon.push(item?.name || itemId);
                }
            });

            const monetaryPosition = (redistributions[playerId] || 0) - (payments[playerId] || 0);
            const totalUtility = itemUtility + monetaryPosition;

            finalUtilities[playerId] = {
                itemUtility,
                monetaryPosition,
                totalUtility,
                itemsWon,
                isProportional: totalUtility >= (algorithmData.totalPayments || 0) / Object.keys(state.playerValues).length
            };
        });

        api.setAlgorithmData('finalUtilities', finalUtilities);

        Logger.debug("Final utilities:", finalUtilities);

        // Display utility analysis
        knasterSealedBidsConfig.displayUtilityAnalysis(finalUtilities);
    },

    // ===== UTILITY ANALYSIS DISPLAY =====
    displayUtilityAnalysis: (utilities) => {
        const analysisContainer = document.getElementById('allocation-summary');
        if (!analysisContainer) return;

        // Add utility analysis section
        const utilitySection = document.createElement('div');
        utilitySection.className = 'utility-analysis';
        utilitySection.innerHTML = `
            <h4>Utility Analysis</h4>
            <p><small>This analysis shows each player's final utility based on their bid values and monetary transfers.</small></p>
            <div class="utility-grid">
                ${Object.entries(utilities).map(([playerId, data]) => `
                    <div class="utility-card">
                        <h5>${playerId.toUpperCase()}</h5>
                        <div class="utility-breakdown">
                            <div class="utility-item">
                                <span>Items Value:</span>
                                <span>${data.itemUtility.toLocaleString()}</span>
                            </div>
                            <div class="utility-item ${data.monetaryPosition >= 0 ? 'positive' : 'negative'}">
                                <span>Net Transfer:</span>
                                <span>${data.monetaryPosition.toLocaleString()}</span>
                            </div>
                            <div class="utility-item total">
                                <span><strong>Total Utility:</strong></span>
                                <span><strong>${data.totalUtility.toLocaleString()}</strong></span>
                            </div>
                            <div class="proportional-indicator ${data.isProportional ? 'achieved' : 'not-achieved'}">
                                ${data.isProportional ? '✓' : '✗'} Proportional Share
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        analysisContainer.appendChild(utilitySection);
    },

    // ===== RESET HANDLER =====
    onReset: (state, api) => {
        Logger.debug("Resetting Knaster algorithm");

        const extensions = window.FairDivisionCore.getInstance().indivisibleExtensions;

        // Reset algorithm state
        api.setAlgorithmData('currentPhase', 0);
        api.setAlgorithmData('bidsSubmitted', false);
        api.setAlgorithmData('auctionResolved', false);
        api.setAlgorithmData('paymentsCalculated', false);

        // Reset indivisible goods state
        extensions.state.setItems(knasterSealedBidsConfig.items);
        extensions.state.setAuctionPhase('bidding');

        // Reset UI
        extensions.ui.switchInterface('discrete-items');
        extensions.ui.updateItemsDisplay(knasterSealedBidsConfig.items);
        extensions.ui.hideInterface('indivisible-results');

        // Reset instructions
        api.updateInstructions(knasterSealedBidsConfig.phases[0].instructions);
        api.updateStepIndicator(`Phase 1/${knasterSealedBidsConfig.phases.length}: ${knasterSealedBidsConfig.phases[0].name}`);

        Logger.debug("Knaster algorithm reset complete");
    },

    // ===== STEP NAVIGATION (if needed) =====
    onStepChange: (step, state, api) => {
        Logger.debug(`Knaster step change: ${step}`);

        // Handle manual step navigation if implemented
        const phase = Math.min(step, knasterSealedBidsConfig.phases.length - 1);
        api.setAlgorithmData('currentPhase', phase);

        const currentPhase = knasterSealedBidsConfig.phases[phase];
        if (currentPhase) {
            api.updateInstructions(currentPhase.instructions);
            api.updateStepIndicator(`Phase ${phase + 1}/${knasterSealedBidsConfig.phases.length}: ${currentPhase.name}`);
        }
    },

    // ===== EDUCATIONAL METHODS =====
    getEducationalInsights: () => {
        return {
            keyInsights: [
                "Sealed bidding eliminates strategic manipulation - truth-telling is optimal",
                "Monetary redistribution ensures everyone gets at least 1/n of total value",
                "Items go to those who value them most, maximizing overall efficiency",
                "The mechanism is budget-balanced - no external money needed"
            ],
            commonMisconceptions: [
                "Players might think they should bid below their true valuation to pay less",
                "Some may worry about 'overpaying' when they should focus on net utility",
                "The equal redistribution might seem unfair but ensures proportionality"
            ],
            practicalApplications: [
                "Estate division among heirs",
                "Asset allocation in business partnerships",
                "Procurement auctions in government",
                "Resource allocation in organizations"
            ]
        };
    },

    // ===== COMPLEXITY ANALYSIS =====
    getComplexityAnalysis: () => {
        return {
            timeComplexity: {
                bidCollection: "O(n × m) - each player bids on each item",
                auctionResolution: "O(m) - find highest bidder for each item",
                paymentCalculation: "O(n + m) - sum payments and distribute",
                overall: "O(n × m) - dominated by bid collection phase"
            },
            spaceComplexity: {
                bidStorage: "O(n × m) - store all bids",
                allocations: "O(m) - track item winners",
                payments: "O(n) - track player payments",
                overall: "O(n × m) - dominated by bid storage"
            },
            informationRequirements: {
                input: "Complete preference information (all valuations)",
                queries: "No Robertson-Webb queries needed",
                communication: "Single sealed bid round",
                comparison: "More information-intensive than query-based algorithms"
            }
        };
    }
};

// ===== REGISTRATION =====
window.FairDivisionCore.register('knaster-sealed-bids', knasterSealedBidsConfig);
Logger.info(`${knasterSealedBidsConfig.name} algorithm loaded and registered`);