/**
 * Indivisible Goods Extensions for Fair Division Demo System
 *
 * Extends the existing demo system to support discrete items and linear arrangements
 */

// ===== EXTENDED STATE MANAGER =====
class IndivisibleGoodsStateManager {
    constructor(baseStateManager) {
        this.base = baseStateManager;
        this.extendState();
    }

    extendState() {
        // Add indivisible goods properties to existing state
        const indivisibleState = {
            // General indivisible goods properties
            goodsType: 'divisible', // 'divisible', 'discrete-items', 'linear-arrangement'

            // Item-based state for discrete goods (Knaster)
            items: [],
            itemBids: {},
            itemAllocations: {},
            auctionPhase: 'bidding', // 'bidding', 'allocation', 'redistribution', 'results'

            // Marker-based state for Lucas Method
            linearGoods: null,
            markerPositions: {},
            currentRound: 0,
            eliminatedPlayers: [],
            segmentAllocations: {},

            // Monetary transfers
            playerPayments: {},
            monetaryTransfers: {}
        };

        // Merge with existing state
        Object.entries(indivisibleState).forEach(([key, value]) => {
            this.base.setState(key, value);
        });
    }

    // ===== GOODS TYPE MANAGEMENT =====
    setGoodsType(type) {
        this.base.setState('goodsType', type);
        Logger.debug(`Goods type set to: ${type}`);
    }

    getGoodsType() {
        return this.base.state.goodsType;
    }

    // ===== ITEM MANAGEMENT (for Knaster) =====
    setItems(items) {
        this.base.setState('items', items);
        this.initializeItemState(items);
    }

    initializeItemState(items) {
        const itemBids = {};
        const itemAllocations = {};

        items.forEach(item => {
            itemBids[item.id] = {};
            itemAllocations[item.id] = null;
        });

        this.base.setState('itemBids', itemBids);
        this.base.setState('itemAllocations', itemAllocations);
    }

    submitBid(playerId, itemId, bidAmount) {
        const currentBids = { ...this.base.state.itemBids };
        if (!currentBids[itemId]) currentBids[itemId] = {};
        currentBids[itemId][playerId] = parseFloat(bidAmount) || 0;

        this.base.setState('itemBids', currentBids);
        Logger.debug(`Bid submitted: ${playerId} -> ${itemId}: $${bidAmount}`);
    }

    allocateItem(itemId, winnerId) {
        const allocations = { ...this.base.state.itemAllocations };
        allocations[itemId] = winnerId;
        this.base.setState('itemAllocations', allocations);
    }

    setAuctionPhase(phase) {
        this.base.setState('auctionPhase', phase);
    }

    // ===== MARKER MANAGEMENT (for Lucas Method) =====
    setupLinearGoods(linearGoodsConfig) {
        this.base.setState('linearGoods', linearGoodsConfig);
        this.base.setState('markerPositions', {});
        this.base.setState('eliminatedPlayers', []);
        this.base.setState('currentRound', 0);
    }

    placeMarker(playerId, markerIndex, position) {
        const currentMarkers = { ...this.base.state.markerPositions };
        if (!currentMarkers[playerId]) currentMarkers[playerId] = {};
        currentMarkers[playerId][markerIndex] = parseFloat(position);

        this.base.setState('markerPositions', currentMarkers);
        Logger.debug(`Marker placed: ${playerId} marker ${markerIndex} at ${position}`);
    }

    setSegmentAllocations(allocations) {
        this.base.setState('segmentAllocations', allocations);
    }

    // ===== MONETARY TRANSFER MANAGEMENT =====
    calculateKnasterPayments() {
        const payments = {};
        const redistributions = {};
        let totalPayments = 0;

        // Initialize payments for all players
        Object.keys(this.base.state.playerValues).forEach(playerId => {
            payments[playerId] = 0;
        });

        // Calculate winning bid payments
        Object.entries(this.base.state.itemAllocations).forEach(([itemId, winnerId]) => {
            if (winnerId && this.base.state.itemBids[itemId]?.[winnerId]) {
                const winningBid = this.base.state.itemBids[itemId][winnerId];
                payments[winnerId] += winningBid;
                totalPayments += winningBid;
            }
        });

        // Calculate equal redistribution
        const playerCount = Object.keys(this.base.state.playerValues).length;
        const redistributionAmount = totalPayments / playerCount;

        Object.keys(this.base.state.playerValues).forEach(playerId => {
            redistributions[playerId] = redistributionAmount;
        });

        this.base.setState('playerPayments', payments);
        this.base.setState('monetaryTransfers', redistributions);

        Logger.debug('Knaster payments calculated:', { payments, redistributions, totalPayments });
        return { payments, redistributions, totalPayments };
    }

    // ===== VALIDATION METHODS =====
    areAllBidsComplete() {
        const items = this.base.state.items || [];
        const players = Object.keys(this.base.state.playerValues);
        const bids = this.base.state.itemBids || {};

        return items.every(item =>
            players.every(playerId =>
                bids[item.id]?.[playerId] !== undefined
            )
        );
    }

    areAllMarkersPlaced() {
        const players = Object.keys(this.base.state.playerValues);
        const markersPerPlayer = players.length - 1;
        const markerPositions = this.base.state.markerPositions || {};

        return players.every(playerId => {
            const playerMarkers = markerPositions[playerId] || {};
            return Object.keys(playerMarkers).length >= markersPerPlayer;
        });
    }
}

// ===== EXTENDED UI CONTROLLER =====
class IndivisibleGoodsUIController {
    constructor(baseUIController, stateManager) {
        this.base = baseUIController;
        this.state = stateManager;
        this.indivisibleElements = new Map();
        this.createIndivisibleInterfaces();
    }

    createIndivisibleInterfaces() {
        this.createItemBiddingInterface();
        this.createMarkerPlacementInterface();
        this.createResultsDisplays();
    }

    createItemBiddingInterface() {
        const container = document.createElement('div');
        container.id = 'bidding-interface';
        container.className = 'indivisible-goods-interface';
        container.style.display = 'none';

        container.innerHTML = `
            <div class="bidding-header">
                <h3>Item Bidding Phase</h3>
                <p>Enter your valuation for each item below:</p>
            </div>
            <div id="items-container" class="items-grid">
                <!-- Items will be dynamically added here -->
            </div>
            <div class="bidding-controls">
                <button id="submit-bids-btn" class="primary-btn" disabled>Submit All Bids</button>
            </div>
        `;

        this.insertInterface(container);
        this.setupBiddingEventListeners();
    }

    createMarkerPlacementInterface() {
        const container = document.createElement('div');
        container.id = 'marker-interface';
        container.className = 'indivisible-goods-interface';
        container.style.display = 'none';

        container.innerHTML = `
            <div class="marker-header">
                <h3>Marker Placement Phase</h3>
                <p>Click on the line below to place your markers:</p>
            </div>
            <div id="linear-goods-display" class="linear-arrangement">
                <div id="goods-line" class="goods-line">
                    <!-- Linear arrangement will be displayed here -->
                </div>
                <div id="markers-display" class="markers-container">
                    <!-- Player markers will appear here -->
                </div>
            </div>
            <div class="marker-controls">
                <div id="current-player-info">
                    <span>Current Player: <strong id="current-player-name">Player 1</strong></span>
                    <span>Markers to place: <strong id="markers-remaining">0</strong></span>
                </div>
                <button id="confirm-markers-btn" class="primary-btn" disabled>Confirm Markers</button>
            </div>
        `;

        this.insertInterface(container);
        this.setupMarkerEventListeners();
    }

    createResultsDisplays() {
        const container = document.createElement('div');
        container.id = 'indivisible-results';
        container.className = 'indivisible-goods-interface results-display';
        container.style.display = 'none';

        container.innerHTML = `
            <div class="results-header">
                <h3>Final Allocation Results</h3>
            </div>
            <div id="allocation-summary" class="allocation-grid">
                <!-- Final allocations will be displayed here -->
            </div>
            <div id="payment-summary" class="payment-breakdown" style="display: none;">
                <h4>Payment Summary</h4>
                <div id="payments-table">
                    <!-- Payment details will be populated here -->
                </div>
            </div>
        `;

        this.insertInterface(container);
    }

    insertInterface(container) {
        const demoContainer = document.getElementById('demo-container') ||
            document.querySelector('.demo-area') ||
            document.querySelector('main');

        if (demoContainer) {
            // Insert after existing demo controls
            const existingControls = demoContainer.querySelector('.demo-controls');
            if (existingControls) {
                existingControls.after(container);
            } else {
                demoContainer.appendChild(container);
            }
        }
    }

    setupBiddingEventListeners() {
        const submitBtn = document.getElementById('submit-bids-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.processBidSubmission();
            });
        }
    }

    setupMarkerEventListeners() {
        const goodsLine = document.getElementById('goods-line');
        const confirmBtn = document.getElementById('confirm-markers-btn');

        if (goodsLine) {
            goodsLine.addEventListener('click', (e) => {
                this.handleMarkerPlacement(e);
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmMarkerPlacement();
            });
        }
    }

    // ===== INTERFACE SWITCHING =====
    switchInterface(goodsType) {
        // Hide all interfaces
        this.hideInterface('bidding-interface');
        this.hideInterface('marker-interface');
        this.hideInterface('indivisible-results');

        // Hide divisible goods elements
        this.base.hideElement('cut-slider');
        this.base.hideElement('cut-slider-2');
        this.base.hideElement('make-cut-btn');

        // Show appropriate interface
        switch (goodsType) {
            case 'discrete-items':
                this.showInterface('bidding-interface');
                break;
            case 'linear-arrangement':
                this.showInterface('marker-interface');
                break;
            case 'divisible':
                // Show original divisible goods controls
                this.base.showElement('cut-slider');
                this.base.showElement('make-cut-btn');
                break;
        }
    }

    showInterface(interfaceId) {
        const element = document.getElementById(interfaceId);
        if (element) {
            element.style.display = 'block';
            element.classList.add('active');
        }
    }

    hideInterface(interfaceId) {
        const element = document.getElementById(interfaceId);
        if (element) {
            element.style.display = 'none';
            element.classList.remove('active');
        }
    }

    // ===== ITEM BIDDING METHODS =====
    updateItemsDisplay(items) {
        const itemsContainer = document.getElementById('items-container');
        if (!itemsContainer) return;

        const players = Object.keys(this.state.base.state.playerValues);
        const currentBids = this.state.base.state.itemBids || {};

        itemsContainer.innerHTML = items.map(item => `
            <div class="item-card" data-item-id="${item.id}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    ${item.estimatedValue ? `<small>Est. Value: $${item.estimatedValue.toLocaleString()}</small>` : ''}
                </div>
                <div class="bid-input-section">
                    ${players.map(playerId => `
                        <div class="player-bid">
                            <label for="bid-${playerId}-${item.id}">
                                ${playerId.charAt(0).toUpperCase() + playerId.slice(1)}:
                            </label>
                            <input 
                                type="number" 
                                id="bid-${playerId}-${item.id}" 
                                class="bid-input"
                                min="0" 
                                step="100" 
                                value="${currentBids[item.id]?.[playerId] || ''}"
                                data-player="${playerId}" 
                                data-item="${item.id}"
                            >
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Attach event listeners to bid inputs
        itemsContainer.querySelectorAll('.bid-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const playerId = e.target.dataset.player;
                const itemId = e.target.dataset.item;
                const bidAmount = parseFloat(e.target.value) || 0;

                this.state.submitBid(playerId, itemId, bidAmount);
                this.updateBidSubmissionButton();
            });
        });

        this.updateBidSubmissionButton();
    }

    updateBidSubmissionButton() {
        const submitBtn = document.getElementById('submit-bids-btn');
        if (submitBtn) {
            const allBidsComplete = this.state.areAllBidsComplete();
            submitBtn.disabled = !allBidsComplete;
            submitBtn.textContent = allBidsComplete ? 'Submit All Bids' : 'Complete All Bids First';
        }
    }

    processBidSubmission() {
        Logger.debug('Processing bid submission');
        this.state.setAuctionPhase('allocation');

        // Trigger algorithm phase change
        const currentSystem = window.FairDivisionCore.getInstance();
        if (currentSystem?.currentAlgorithm?.config.onBidsSubmitted) {
            currentSystem.currentAlgorithm.config.onBidsSubmitted(
                this.state.base.getState(),
                currentSystem.createAlgorithmAPI()
            );
        }
    }

    // ===== MARKER PLACEMENT METHODS =====
    setupLinearGoodsDisplay(linearGoods) {
        const goodsLine = document.getElementById('goods-line');
        if (!goodsLine || !linearGoods) return;

        // Create visual representation of linear goods
        goodsLine.innerHTML = linearGoods.items.map((item, index) => {
            const width = (item.value || 100/linearGoods.items.length);
            const left = linearGoods.items.slice(0, index).reduce((acc, prev) => acc + (prev.value || 100/linearGoods.items.length), 0);

            return `
                <div class="book-segment" 
                     style="left: ${left}%; width: ${width}%; background-color: ${item.color || '#f0f0f0'};">
                    ${item.name}
                </div>
            `;
        }).join('');
    }

    handleMarkerPlacement(e) {
        const goodsLine = e.currentTarget;
        const rect = goodsLine.getBoundingClientRect();
        const position = ((e.clientX - rect.left) / rect.width) * 100;

        // Get current player and marker info
        const currentPlayer = document.getElementById('current-player-name')?.textContent.toLowerCase();
        const markersRemaining = parseInt(document.getElementById('markers-remaining')?.textContent || 0);

        if (!currentPlayer || markersRemaining <= 0) return;

        const playerId = currentPlayer.replace(' ', '');
        const players = Object.keys(this.state.base.state.playerValues);
        const markersPerPlayer = players.length - 1;
        const currentMarkerIndex = markersPerPlayer - markersRemaining;

        // Place the marker
        this.state.placeMarker(playerId, currentMarkerIndex, position);
        this.updateMarkersDisplay();
        this.updateMarkerControls();
    }

    updateMarkersDisplay() {
        const markersContainer = document.getElementById('markers-display');
        if (!markersContainer) return;

        // Clear existing markers
        markersContainer.innerHTML = '';

        // Display all player markers
        Object.entries(this.state.base.state.markerPositions || {}).forEach(([playerId, markers]) => {
            Object.entries(markers).forEach(([markerIndex, position]) => {
                const markerElement = document.createElement('div');
                markerElement.className = `marker ${playerId}-marker`;
                markerElement.style.left = `${position}%`;
                markerElement.innerHTML = `
                    <div class="marker-indicator"></div>
                    <div class="marker-label">${playerId.toUpperCase()} ${parseInt(markerIndex) + 1}</div>
                `;
                markersContainer.appendChild(markerElement);
            });
        });
    }

    updateMarkerControls() {
        const players = Object.keys(this.state.base.state.playerValues);
        const markersPerPlayer = players.length - 1;
        const markerPositions = this.state.base.state.markerPositions || {};

        // Find current player
        const currentPlayerName = document.getElementById('current-player-name');
        const markersRemaining = document.getElementById('markers-remaining');
        const confirmBtn = document.getElementById('confirm-markers-btn');

        let currentPlayer = null;
        let remaining = 0;

        for (const playerId of players) {
            const playerMarkers = markerPositions[playerId] || {};
            const playerMarkersCount = Object.keys(playerMarkers).length;

            if (playerMarkersCount < markersPerPlayer) {
                currentPlayer = playerId;
                remaining = markersPerPlayer - playerMarkersCount;
                break;
            }
        }

        if (currentPlayerName) {
            currentPlayerName.textContent = currentPlayer ?
                currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) :
                'All Complete';
        }

        if (markersRemaining) {
            markersRemaining.textContent = remaining;
        }

        if (confirmBtn) {
            const allComplete = this.state.areAllMarkersPlaced();
            confirmBtn.disabled = !allComplete;
            confirmBtn.textContent = allComplete ? 'Proceed to Allocation' : 'Place All Markers First';
        }
    }

    confirmMarkerPlacement() {
        Logger.debug('Confirming marker placement');

        // Trigger algorithm phase change
        const currentSystem = window.FairDivisionCore.getInstance();
        if (currentSystem?.currentAlgorithm?.config.onMarkersConfirmed) {
            currentSystem.currentAlgorithm.config.onMarkersConfirmed(
                this.state.base.getState(),
                currentSystem.createAlgorithmAPI()
            );
        }
    }

    // ===== RESULTS DISPLAY METHODS =====
    displayKnasterResults(allocations, payments, redistributions) {
        const allocationSummary = document.getElementById('allocation-summary');
        const paymentSummary = document.getElementById('payment-summary');

        if (allocationSummary) {
            allocationSummary.innerHTML = Object.entries(allocations)
                .filter(([itemId, winnerId]) => winnerId)
                .map(([itemId, winnerId]) => {
                    const item = this.state.base.state.items.find(i => i.id === itemId);
                    const winningBid = this.state.base.state.itemBids[itemId][winnerId];
                    return `
                        <div class="allocation-item">
                            <div class="item-name">${item?.name || itemId}</div>
                            <div class="winner">→ ${winnerId.toUpperCase()}</div>
                            <div class="winning-bid">$${winningBid?.toLocaleString() || 0}</div>
                        </div>
                    `;
                }).join('');
        }

        if (paymentSummary) {
            paymentSummary.style.display = 'block';
            const paymentsTable = document.getElementById('payments-table');

            if (paymentsTable) {
                paymentsTable.innerHTML = this.generatePaymentTable(allocations, payments, redistributions);
            }
        }

        this.showInterface('indivisible-results');
    }

    displayLucasResults(segmentAllocations) {
        const allocationSummary = document.getElementById('allocation-summary');

        if (allocationSummary) {
            allocationSummary.innerHTML = Object.entries(segmentAllocations)
                .map(([playerId, segment]) => `
                    <div class="allocation-item">
                        <div class="player-name">${playerId.toUpperCase()}</div>
                        <div class="segment-info">
                            Segment: ${segment.start.toFixed(1)}% - ${segment.end.toFixed(1)}%
                            (${(segment.end - segment.start).toFixed(1)}% of collection)
                        </div>
                    </div>
                `).join('');
        }

        this.showInterface('indivisible-results');
    }

    generatePaymentTable(allocations, payments, redistributions) {
        const players = Object.keys(this.state.base.state.playerValues);

        return `
            <table class="payments-breakdown-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Total Payment</th>
                        <th>Redistribution</th>
                        <th>Net Payment</th>
                        <th>Items Won</th>
                    </tr>
                </thead>
                <tbody>
                    ${players.map(playerId => {
            const payment = payments[playerId] || 0;
            const redistribution = redistributions[playerId] || 0;
            const netPayment = payment - redistribution;
            const itemsWon = Object.entries(allocations)
                .filter(([itemId, winnerId]) => winnerId === playerId)
                .map(([itemId]) => {
                    const item = this.state.base.state.items.find(i => i.id === itemId);
                    return item?.name || itemId;
                });

            return `
                            <tr>
                                <td>${playerId.toUpperCase()}</td>
                                <td>$${payment.toLocaleString()}</td>
                                <td>$${redistribution.toLocaleString()}</td>
                                <td class="${netPayment >= 0 ? 'positive' : 'negative'}">
                                    $${netPayment.toLocaleString()}
                                </td>
                                <td>${itemsWon.join(', ') || 'None'}</td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }
}

// Export for use in other files
window.IndivisibleGoodsExtensions = {
    IndivisibleGoodsStateManager,
    IndivisibleGoodsUIController
};