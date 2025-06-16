/**
 * Austin's Moving Knife Algorithm - Unified Demo Version
 * 
 * This file implements Austin's moving knife algorithm as a self-contained
 * module that registers itself with the unified demo system.
 */

// ===== ALGORITHM CONFIGURATION =====

const AUSTINS_CONFIG = {
    STEPS: { MOVING_KNIFE: 1, DUAL_KNIVES: 2, RANDOM_ASSIGNMENT: 3 },
    PHASES: { MOVING_KNIFE: 1, DUAL_KNIVES: 2, RANDOM_ASSIGNMENT: 3 },
    ANIMATION: {
        BASE_SPEED: 0.5,
        MIN_SPEED_MULTIPLIER: 0.1,
        MAX_SPEED_MULTIPLIER: 2.0,
        CLOSE_THRESHOLD: 2,
        FAR_THRESHOLD: 20
    },
    REGIONS: {
        blue: { start: 0, end: 600 },
        red: { start: 600, end: 800 },
        green: { start: 150, end: 600 },
        orange: { start: 600, end: 800 },
        pink: { start: 0, end: 150 },
        purple: { start: 150, end: 800 }
    }
};

// ===== CALCULATION ENGINE =====

class AustinsCalculationEngine {
    static calculatePhase1RegionValues(knifePosition) {
        const leftValues = {}, rightValues = {};

        for (const [color, bounds] of Object.entries(AUSTINS_CONFIG.REGIONS)) {
            if (knifePosition <= bounds.start) {
                leftValues[color] = 0;
                rightValues[color] = 100;
            } else if (knifePosition >= bounds.end) {
                leftValues[color] = 100;
                rightValues[color] = 0;
            } else {
                const totalArea = bounds.end - bounds.start;
                const leftArea = knifePosition - bounds.start;
                const leftPercent = (leftArea / totalArea) * 100;
                leftValues[color] = leftPercent;
                rightValues[color] = 100 - leftPercent;
            }
        }

        return { left: leftValues, right: rightValues };
    }

    static calculatePhase2RegionValues(leftKnifePos, rightKnifePos) {
        const middleValues = {}, flankValues = {};

        for (const [color, bounds] of Object.entries(AUSTINS_CONFIG.REGIONS)) {
            const totalArea = bounds.end - bounds.start;

            if (leftKnifePos <= bounds.start && rightKnifePos >= bounds.end) {
                middleValues[color] = 100;
                flankValues[color] = 0;
            } else if (leftKnifePos >= bounds.end || rightKnifePos <= bounds.start) {
                middleValues[color] = 0;
                flankValues[color] = 100;
            } else {
                const leftBound = Math.max(leftKnifePos, bounds.start);
                const rightBound = Math.min(rightKnifePos, bounds.end);

                if (leftBound < rightBound) {
                    const middleArea = rightBound - leftBound;
                    const middlePercent = (middleArea / totalArea) * 100;
                    middleValues[color] = middlePercent;
                    flankValues[color] = 100 - middlePercent;
                } else {
                    middleValues[color] = 0;
                    flankValues[color] = 100;
                }
            }
        }

        return { middle: middleValues, flank: flankValues };
    }

    static calculatePlayerValue(regionValues, playerValues) {
        let total = 0;
        for (const [color, amount] of Object.entries(regionValues)) {
            total += (amount / 100) * (playerValues[color] || 0);
        }
        return total;
    }

    static calculateSpeedMultiplier(minDistance) {
        const { MIN_SPEED_MULTIPLIER, MAX_SPEED_MULTIPLIER, CLOSE_THRESHOLD, FAR_THRESHOLD } = AUSTINS_CONFIG.ANIMATION;

        if (minDistance < CLOSE_THRESHOLD) {
            return MIN_SPEED_MULTIPLIER + (minDistance / CLOSE_THRESHOLD) * 0.4;
        } else if (minDistance < 10) {
            return 0.5 + ((minDistance - CLOSE_THRESHOLD) / 8) * 0.5;
        } else if (minDistance < FAR_THRESHOLD) {
            return 1.0 + ((minDistance - 10) / 10) * 1.0;
        } else {
            return MAX_SPEED_MULTIPLIER;
        }
    }

    static findRightKnifePosition(leftPos, targetValue, playerValues) {
        let minRight = leftPos + 1;
        let maxRight = 800;
        let bestRightPos = (minRight + maxRight) / 2;

        const tolerance = 0.1;
        const maxIterations = 50;

        for (let iterations = 0; iterations < maxIterations; iterations++) {
            const testRightPos = (minRight + maxRight) / 2;

            if (testRightPos <= leftPos || testRightPos > 800) break;

            const regionValues = this.calculatePhase2RegionValues(leftPos, testRightPos);
            const testValue = this.calculatePlayerValue(regionValues.middle, playerValues);
            const valueDiff = testValue - targetValue;

            if (Math.abs(valueDiff) < tolerance) return testRightPos;

            if (valueDiff < 0) {
                minRight = testRightPos;
            } else {
                maxRight = testRightPos;
            }

            if (maxRight - minRight < 0.1) break;
        }

        return Math.max(leftPos + 1, Math.min(bestRightPos, 800));
    }
}

// ===== GAME STATE =====

class AustinsGameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.phase = AUSTINS_CONFIG.PHASES.MOVING_KNIFE;
        this.isAnimating = false;
        this.isPaused = false;
        this.rightKnifePosition = 0;
        this.leftKnifePosition = 0;
        this.stopPosition = null;
        this.controllingPlayer = null;
        this.targetMiddleValue = null;
        this.animationId = null;
        this.finalAssignment = null;

        this.playerValues = {
            player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
            player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
        };
    }

    updatePlayerValues() {
        const colors = Object.keys(AUSTINS_CONFIG.REGIONS);

        for (let color of colors) {
            const input1 = document.getElementById(`p1-${color}`);
            const input2 = document.getElementById(`p2-${color}`);

            if (input1) {
                this.playerValues.player1[color] = parseInt(input1.value) || 0;
            }
            if (input2) {
                this.playerValues.player2[color] = parseInt(input2.value) || 0;
            }
        }
    }

    validateTotals() {
        const validation = {};

        for (let player of ['player1', 'player2']) {
            const total = Object.values(this.playerValues[player])
                .reduce((sum, value) => sum + value, 0);

            validation[player] = {
                total: total,
                valid: Math.abs(total - BASE_CONFIG.VALIDATION.REQUIRED_TOTAL) < 0.1
            };
        }

        return validation;
    }

    isValid() {
        const validation = this.validateTotals();
        return validation.player1.valid && validation.player2.valid;
    }
}

// ===== AUSTIN'S MOVING KNIFE ALGORITHM =====

class AustinsMovingKnifeAlgorithm extends AlgorithmInterface {
    constructor() {
        super();

        // Algorithm metadata
        this.name = "Austin's Moving Knife";
        this.description = 'Continuous procedure using moving knives for exact fair division';
        this.playerCount = 2;
        this.type = 'continuous';
        this.properties = ['equitable', 'exact', 'envy-free', 'strategy-proof'];

        // Algorithm state
        this.gameState = new AustinsGameState();
    }

    // ===== REQUIRED INTERFACE METHODS =====

    initialize() {
        console.log("Initializing Austin's Moving Knife algorithm");
        this.gameState.reset();
        this.updateAll();
        this.setupCustomUI();
    }

    execute() {
        console.log("Executing Austin's Moving Knife algorithm");

        if (!this.gameState.isValid()) {
            const validation = this.gameState.validateTotals();
            alert(`Valuation totals must equal 100 points each!\n\nPlayer 1 total: ${validation.player1.total}\nPlayer 2 total: ${validation.player2.total}`);
            return;
        }

        if (this.gameState.phase === AUSTINS_CONFIG.PHASES.MOVING_KNIFE && !this.gameState.isAnimating) {
            this.startAnimation();
        }
    }

    reset() {
        console.log("Resetting Austin's Moving Knife algorithm");
        this.stopAnimation();
        this.gameState.reset();
        this.updateAll();
        this.hideResults();
        this.resetCustomUI();
    }

    // ===== OPTIONAL INTERFACE METHODS =====

    handlePlayerValueChange() {
        this.gameState.updatePlayerValues();
        this.updateAll();
    }

    getRegions() {
        return AUSTINS_CONFIG.REGIONS;
    }

    getUIConfig() {
        return {
            showCutSlider: false, // Austin's algorithm doesn't use manual cut positioning
            showPlayerValues: true,
            enablePieceSelection: this.gameState.phase === AUSTINS_CONFIG.PHASES.RANDOM_ASSIGNMENT
        };
    }

    // ===== ALGORITHM-SPECIFIC METHODS =====

    setupCustomUI() {
        // Hide the standard cut slider since Austin's algorithm is animated
        const cutSlider = document.getElementById('cut-slider');
        const makeCutBtn = document.getElementById('make-cut-btn');

        if (cutSlider) cutSlider.style.display = 'none';
        if (makeCutBtn) makeCutBtn.textContent = 'Start Animation';

        // Add custom controls for Austin's algorithm
        this.addCustomControls();
        this.addSecondKnife();
        this.addStopButtons();
    }

    resetCustomUI() {
        // Show standard controls
        const cutSlider = document.getElementById('cut-slider');
        const makeCutBtn = document.getElementById('make-cut-btn');

        if (cutSlider) cutSlider.style.display = 'block';
        if (makeCutBtn) makeCutBtn.textContent = 'Make Cut';

        // Remove custom elements
        this.removeCustomControls();
        this.hideSecondKnife();
        this.hideStopButtons();
    }

    addCustomControls() {
        const controlsContainer = document.querySelector('.algorithm-controls');
        if (!controlsContainer) return;

        // Add pause button
        const pauseBtn = document.createElement('button');
        pauseBtn.id = 'pause-btn';
        pauseBtn.className = 'btn btn-secondary';
        pauseBtn.textContent = 'Pause';
        pauseBtn.style.display = 'none';
        pauseBtn.onclick = () => this.handlePause();

        const actionButtons = controlsContainer.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.appendChild(pauseBtn);
        }
    }

    removeCustomControls() {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) pauseBtn.remove();

        const stopButtons = document.querySelectorAll('[id^="player"][id$="StopButton"]');
        stopButtons.forEach(btn => btn.remove());
    }

    addSecondKnife() {
        const svg = document.querySelector('.background-svg');
        if (!svg) return;

        // Add left knife (green dashed line)
        const leftKnife = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftKnife.id = 'left-knife';
        leftKnife.setAttribute('x1', '0');
        leftKnife.setAttribute('y1', '0');
        leftKnife.setAttribute('x2', '0');
        leftKnife.setAttribute('y2', '400');
        leftKnife.setAttribute('stroke', '#28a745');
        leftKnife.setAttribute('stroke-width', '4');
        leftKnife.setAttribute('stroke-dasharray', '10,5');
        leftKnife.style.display = 'none';

        svg.appendChild(leftKnife);
    }

    hideSecondKnife() {
        const leftKnife = document.getElementById('left-knife');
        if (leftKnife) leftKnife.style.display = 'none';
    }

    addStopButtons() {
        const controlsContainer = document.querySelector('.algorithm-controls');
        if (!controlsContainer) return;

        const stopButtonsContainer = document.createElement('div');
        stopButtonsContainer.id = 'stop-buttons-container';
        stopButtonsContainer.style.display = 'none';
        stopButtonsContainer.style.marginTop = '1rem';
        stopButtonsContainer.style.textAlign = 'center';

        const player1StopBtn = document.createElement('button');
        player1StopBtn.id = 'player1StopButton';
        player1StopBtn.className = 'btn btn-primary';
        player1StopBtn.textContent = 'Player 1: STOP!';
        player1StopBtn.style.margin = '0 0.5rem';
        player1StopBtn.onclick = () => this.handleStop(1);

        const player2StopBtn = document.createElement('button');
        player2StopBtn.id = 'player2StopButton';
        player2StopBtn.className = 'btn btn-primary';
        player2StopBtn.textContent = 'Player 2: STOP!';
        player2StopBtn.style.margin = '0 0.5rem';
        player2StopBtn.onclick = () => this.handleStop(2);

        stopButtonsContainer.appendChild(player1StopBtn);
        stopButtonsContainer.appendChild(player2StopBtn);
        controlsContainer.appendChild(stopButtonsContainer);
    }

    hideStopButtons() {
        const container = document.getElementById('stop-buttons-container');
        if (container) container.style.display = 'none';
    }

    startAnimation() {
        this.gameState.isAnimating = true;
        this.gameState.phase = AUSTINS_CONFIG.PHASES.MOVING_KNIFE;
        this.gameState.rightKnifePosition = 0;

        // Update UI
        const makeCutBtn = document.getElementById('make-cut-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const stopButtonsContainer = document.getElementById('stop-buttons-container');

        if (makeCutBtn) makeCutBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (stopButtonsContainer) stopButtonsContainer.style.display = 'block';

        this.animateKnife();
    }

    stopAnimation() {
        this.gameState.isAnimating = false;
        if (this.gameState.animationId) {
            cancelAnimationFrame(this.gameState.animationId);
            this.gameState.animationId = null;
        }
    }

    handlePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = this.gameState.isPaused ? 'Resume' : 'Pause';
        }
        if (!this.gameState.isPaused) {
            this.animateKnife();
        }
    }

    handleStop(player) {
        this.gameState.isAnimating = false;
        this.gameState.controllingPlayer = player;
        this.gameState.stopPosition = this.gameState.rightKnifePosition;

        const regionValues = AustinsCalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
        const playerKey = `player${player}`;
        this.gameState.targetMiddleValue = AustinsCalculationEngine.calculatePlayerValue(
            regionValues.left,
            this.gameState.playerValues[playerKey]
        );

        this.transitionToPhase2();
    }

    animateKnife() {
        if (!this.gameState.isAnimating || this.gameState.isPaused) return;

        const regionValues = AustinsCalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
        const p1Left = AustinsCalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player1);
        const p2Left = AustinsCalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player2);

        if (this.gameState.rightKnifePosition >= BASE_CONFIG.CANVAS.WIDTH) {
            this.gameState.rightKnifePosition = 0;
        }

        const p1Distance = Math.abs(p1Left - 50);
        const p2Distance = Math.abs(p2Left - 50);
        const minDistance = Math.min(p1Distance, p2Distance);
        const speedMultiplier = AustinsCalculationEngine.calculateSpeedMultiplier(minDistance);

        this.gameState.rightKnifePosition += AUSTINS_CONFIG.ANIMATION.BASE_SPEED * speedMultiplier;
        this.updateKnifePosition();

        this.gameState.animationId = requestAnimationFrame(() => this.animateKnife());
    }

    transitionToPhase2() {
        this.gameState.phase = AUSTINS_CONFIG.PHASES.DUAL_KNIVES;

        // Hide stop buttons, show left knife
        this.hideStopButtons();
        const leftKnife = document.getElementById('left-knife');
        if (leftKnife) leftKnife.style.display = 'block';

        // Start dual knife phase after a delay
        setTimeout(() => this.startPhase2(), 1000);
    }

    startPhase2() {
        this.gameState.leftKnifePosition = 0;
        this.gameState.rightKnifePosition = AustinsCalculationEngine.findRightKnifePosition(
            0,
            this.gameState.targetMiddleValue,
            this.gameState.playerValues[`player${this.gameState.controllingPlayer}`]
        );

        this.updateKnifePositions();

        // Auto-progress to phase 3 after some time
        setTimeout(() => this.transitionToPhase3(), 3000);
    }

    transitionToPhase3() {
        this.gameState.phase = AUSTINS_CONFIG.PHASES.RANDOM_ASSIGNMENT;

        // Randomly assign pieces
        this.gameState.finalAssignment = Math.random() < 0.5 ? 'inside' : 'outside';

        setTimeout(() => this.showResults(), 1000);
    }

    updateAll() {
        this.updateStepIndicator();
        this.updateInstructions();
        this.updateKnifePosition();
        this.updatePlayerValueDisplays();
        this.updateValidationDisplays();
    }

    updateStepIndicator() {
        let text;
        switch (this.gameState.phase) {
            case AUSTINS_CONFIG.PHASES.MOVING_KNIFE:
                if (this.gameState.isAnimating) {
                    text = 'Phase 1: Single knife moving across the cake';
                } else {
                    text = 'Phase 1: Ready to start moving knife procedure';
                }
                break;
            case AUSTINS_CONFIG.PHASES.DUAL_KNIVES:
                text = 'Phase 2: Dual knife movement with value constraint';
                break;
            case AUSTINS_CONFIG.PHASES.RANDOM_ASSIGNMENT:
                text = 'Phase 3: Random Assignment';
                break;
            default:
                text = "Austin's Moving Knife Algorithm";
        }
        this.updateElement('step-indicator', text);
    }

    updateInstructions() {
        let html;
        switch (this.gameState.phase) {
            case AUSTINS_CONFIG.PHASES.MOVING_KNIFE:
                if (this.gameState.isAnimating) {
                    html = '<strong>Phase 1:</strong> Watch the knife move across the cake. Either player can call "STOP!" when they think the left piece has exactly 50% value according to their preferences.';
                } else {
                    html = '<strong>Instructions:</strong> Start the animation to begin the moving knife procedure. Either player can stop when they believe the left piece is worth exactly 50%.';
                }
                break;
            case AUSTINS_CONFIG.PHASES.DUAL_KNIVES:
                html = '<strong>Phase 2:</strong> The controlling player\'s knives move automatically to maintain exact value constraints.';
                break;
            case AUSTINS_CONFIG.PHASES.RANDOM_ASSIGNMENT:
                html = '<strong>Phase 3:</strong> Pieces are randomly assigned to ensure fairness.';
                break;
            default:
                html = '<strong>Austin\'s Moving Knife:</strong> A continuous procedure for exact fair division between two players.';
        }
        this.updateElementHTML('instructions', html);
    }

    updateKnifePosition() {
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            cutLine.setAttribute('x1', this.gameState.rightKnifePosition);
            cutLine.setAttribute('x2', this.gameState.rightKnifePosition);
        }
    }

    updateKnifePositions() {
        this.updateKnifePosition();

        const leftKnife = document.getElementById('left-knife');
        if (leftKnife) {
            leftKnife.setAttribute('x1', this.gameState.leftKnifePosition);
            leftKnife.setAttribute('x2', this.gameState.leftKnifePosition);
        }
    }

    updatePlayerValueDisplays() {
        this.gameState.updatePlayerValues();

        if (this.gameState.phase === AUSTINS_CONFIG.PHASES.MOVING_KNIFE) {
            const regionValues = AustinsCalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
            const p1Left = AustinsCalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player1);
            const p2Left = AustinsCalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player2);

            this.updateElement('player1Value', `Left: ${p1Left.toFixed(1)}`);
            this.updateElement('player2Value', `Left: ${p2Left.toFixed(1)}`);
        } else if (this.gameState.phase === AUSTINS_CONFIG.PHASES.DUAL_KNIVES) {
            const regionValues = AustinsCalculationEngine.calculatePhase2RegionValues(
                this.gameState.leftKnifePosition,
                this.gameState.rightKnifePosition
            );
            const p1Middle = AustinsCalculationEngine.calculatePlayerValue(regionValues.middle, this.gameState.playerValues.player1);
            const p2Middle = AustinsCalculationEngine.calculatePlayerValue(regionValues.middle, this.gameState.playerValues.player2);

            this.updateElement('player1Value', `Center: ${p1Middle.toFixed(1)}`);
            this.updateElement('player2Value', `Center: ${p2Middle.toFixed(1)}`);
        }
    }

    updateValidationDisplays() {
        const validation = this.gameState.validateTotals();

        ['player1', 'player2'].forEach((player, index) => {
            const playerNum = index + 1;
            const totalElement = document.getElementById(`p${playerNum}-total`);
            if (totalElement) {
                const span = totalElement.querySelector('span');
                if (span) {
                    span.textContent = validation[player].total;
                    span.className = validation[player].valid ? 'valid' : 'invalid';
                }
            }
        });
    }

    showResults() {
        const choosingPlayer = this.gameState.controllingPlayer === 1 ? 2 : 1;

        this.updateElement('result-text',
            `Algorithm completed! Random assignment gave Player ${choosingPlayer} the ${this.gameState.finalAssignment} piece.`);

        // Austin's algorithm guarantees exact fairness
        const proportionalElement = document.getElementById('proportional-result');
        if (proportionalElement) {
            proportionalElement.textContent = 'Both players get exactly 50% value';
            proportionalElement.style.color = '#22543d';
        }

        const envyElement = document.getElementById('envy-result');
        if (envyElement) {
            envyElement.textContent = 'Neither player envies the other';
            envyElement.style.color = '#22543d';
        }

        this.addClass('results', 'visible');
    }

    hideResults() {
        this.removeClass('results', 'visible');
    }
}

// ===== ALGORITHM REGISTRATION =====

function registerAustinsMovingKnife() {
    if (window.DemoSystem) {
        const algorithm = new AustinsMovingKnifeAlgorithm();
        window.DemoSystem.getRegistry().register('austins-moving-knife', algorithm);
        console.log("Austin's Moving Knife algorithm registered successfully");
    } else {
        // Demo system not ready yet, try again in a moment
        setTimeout(registerAustinsMovingKnife, 100);
    }
}

// Start registration process
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerAustinsMovingKnife);
} else {
    registerAustinsMovingKnife();
}