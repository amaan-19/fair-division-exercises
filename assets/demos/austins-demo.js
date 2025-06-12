/**
 * Austin's Moving Knife Algorithm Demo
 * 
 * This demonstrates the Austin moving knife fair division algorithm
 * using a clean, organized code structure.
 */

// ===== CONFIGURATION =====

const CONFIG = {
    CANVAS: { WIDTH: 800, HEIGHT: 400 },
    ANIMATION: { BASE_SPEED: 0.5, MIN_SPEED_MULTIPLIER: 0.1, MAX_SPEED_MULTIPLIER: 2.0, CLOSE_THRESHOLD: 2, FAR_THRESHOLD: 20 },
    VALIDATION: { REQUIRED_TOTAL: 100, TOLERANCE: 0.1 },
    PHASES: { MOVING_KNIFE: 1, DUAL_KNIVES: 2, RANDOM_ASSIGNMENT: 3 },
    TIMING: { SELECTION_DELAY: 1000, PHASE_TRANSITION_DELAY: 1000 }
};

const REGIONS = {
    blue: { x1: 0, y1: 0, x2: 600, y2: 150 },
    red: { x1: 600, y1: 0, x2: 800, y2: 250 },
    orange: { x1: 600, y1: 250, x2: 800, y2: 350 },
    purple: { x1: 150, y1: 350, x2: 800, y2: 400 },
    pink: { x1: 0, y1: 150, x2: 150, y2: 400 },
    green: { x1: 150, y1: 150, x2: 600, y2: 350 }
};

const DEFAULT_VALUATIONS = {
    player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
    player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
};

// ===== UTILITY FUNCTIONS =====

const Utils = {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); },
    formatNumber(num, decimals = 1) { return Number(num).toFixed(decimals); },
    getColorNames() { return Object.keys(REGIONS); },
    setElementDisplay(element, show) { if (element) element.style.display = show ? 'block' : 'none'; }
};

// ===== GAME STATE =====

class GameState {
    constructor() { this.reset(); }

    reset() {
        this.phase = CONFIG.PHASES.MOVING_KNIFE;
        this.isAnimating = false;
        this.isPaused = false;
        this.rightKnifePosition = 0;
        this.leftKnifePosition = 0;
        this.stopPosition = null;
        this.controllingPlayer = null;
        this.targetMiddleValue = null;
        this.animationId = null;
        this.playerValues = JSON.parse(JSON.stringify(DEFAULT_VALUATIONS));
    }

    updatePlayerValues() {
        const colors = Utils.getColorNames();
        for (let player of ['player1', 'player2']) {
            const playerKey = player === 'player1' ? 'p1' : 'p2';
            for (let color of colors) {
                const element = document.getElementById(`${playerKey}-${color}`);
                if (element) {
                    this.playerValues[player][color] = Utils.clamp(parseInt(element.value) || 0, 0, 100);
                }
            }
        }
    }

    validateTotals() {
        const results = {};
        ['player1', 'player2'].forEach(player => {
            const total = Object.values(this.playerValues[player]).reduce((sum, value) => sum + value, 0);
            results[player] = { total, valid: total === CONFIG.VALIDATION.REQUIRED_TOTAL };
        });
        return results;
    }

    isValid() {
        const validation = this.validateTotals();
        return validation.player1.valid && validation.player2.valid;
    }
}

// ===== CALCULATION ENGINE =====

class CalculationEngine {
    static calculatePhase1RegionValues(knifePosition) {
        const leftValues = {}, rightValues = {};
        for (const [color, bounds] of Object.entries(REGIONS)) {
            if (knifePosition <= bounds.x1) {
                leftValues[color] = 0;
                rightValues[color] = 100;
            } else if (knifePosition >= bounds.x2) {
                leftValues[color] = 100;
                rightValues[color] = 0;
            } else {
                const totalArea = (bounds.x2 - bounds.x1) * (bounds.y2 - bounds.y1);
                const leftArea = (knifePosition - bounds.x1) * (bounds.y2 - bounds.y1);
                const leftPercent = (leftArea / totalArea) * 100;
                leftValues[color] = leftPercent;
                rightValues[color] = 100 - leftPercent;
            }
        }
        return { left: leftValues, right: rightValues };
    }

    static calculatePhase2RegionValues(leftKnifePos, rightKnifePos) {
        const middleValues = {}, flankValues = {};
        for (const [color, bounds] of Object.entries(REGIONS)) {
            const totalArea = (bounds.x2 - bounds.x1) * (bounds.y2 - bounds.y1);
            if (leftKnifePos <= bounds.x1 && rightKnifePos >= bounds.x2) {
                middleValues[color] = 100;
                flankValues[color] = 0;
            } else if (leftKnifePos >= bounds.x2 || rightKnifePos <= bounds.x1) {
                middleValues[color] = 0;
                flankValues[color] = 100;
            } else {
                const leftBound = Math.max(leftKnifePos, bounds.x1);
                const rightBound = Math.min(rightKnifePos, bounds.x2);
                if (leftBound < rightBound) {
                    const middleArea = (rightBound - leftBound) * (bounds.y2 - bounds.y1);
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

    /**
 * Calculate phase 2 speed multiplier based on value distance
 */
    static calculatePhase2SpeedMultiplier(valueDistance) {
        if (valueDistance < 1) {
            return 0.1 + (valueDistance / 1) * 0.4;
        } else if (valueDistance < 5) {
            return 0.5 + ((valueDistance - 1) / 4) * 0.5;
        } else if (valueDistance < 10) {
            return 1.0 + ((valueDistance - 5) / 5) * 1.0;
        } else {
            return 2.0;
        }
    }

    /**
     * Find right knife position that maintains target middle value
     */
    static findRightKnifePosition(leftPos, targetValue, playerValues) {
        let minRight = leftPos + 1;
        let maxRight = 800;
        let bestRightPos = (minRight + maxRight) / 2;
        let bestValueDiff = Infinity;

        const tolerance = 0.1;
        const maxIterations = 50;

        for (let iterations = 0; iterations < maxIterations; iterations++) {
            const testRightPos = (minRight + maxRight) / 2;

            if (testRightPos <= leftPos || testRightPos > 800) break;

            const testMiddleValues = this.calculateTestMiddleValues(leftPos, testRightPos);
            const testValue = this.calculatePlayerValue(testMiddleValues, playerValues);
            const valueDiff = testValue - targetValue;

            if (Math.abs(valueDiff) < tolerance) return testRightPos;

            if (valueDiff < 0) {
                minRight = testRightPos;
            } else {
                maxRight = testRightPos;
            }

            if (Math.abs(valueDiff) < Math.abs(bestValueDiff)) {
                bestValueDiff = valueDiff;
                bestRightPos = testRightPos;
            }

            if (maxRight - minRight < 0.1) break;
        }

        return Math.max(leftPos + 1, Math.min(bestRightPos, 800));
    }

    /**
     * Calculate test middle values for binary search
     */
    static calculateTestMiddleValues(leftPos, rightPos) {
        const middleValues = {};

        for (const [color, bounds] of Object.entries(REGIONS)) {
            const totalArea = (bounds.x2 - bounds.x1) * (bounds.y2 - bounds.y1);

            if (leftPos <= bounds.x1 && rightPos >= bounds.x2) {
                middleValues[color] = 100;
            } else if (leftPos >= bounds.x2 || rightPos <= bounds.x1) {
                middleValues[color] = 0;
            } else {
                const leftBound = Math.max(leftPos, bounds.x1);
                const rightBound = Math.min(rightPos, bounds.x2);

                if (leftBound < rightBound) {
                    const middleArea = (rightBound - leftBound) * (bounds.y2 - bounds.y1);
                    const middlePercent = (middleArea / totalArea) * 100;
                    middleValues[color] = middlePercent;
                } else {
                    middleValues[color] = 0;
                }
            }
        }

        return middleValues;
    }

    static calculatePlayerValue(regionValues, playerValues) {
        let total = 0;
        for (const [color, amount] of Object.entries(regionValues)) {
            total += (amount / 100) * playerValues[color];
        }
        return total;
    }

    static calculateSpeedMultiplier(minDistance) {
        const { MIN_SPEED_MULTIPLIER, MAX_SPEED_MULTIPLIER, CLOSE_THRESHOLD, FAR_THRESHOLD } = CONFIG.ANIMATION;
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
}

// ===== UI MANAGER =====

class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.elements = this.cacheElements();
        this.bindEvents();
    }

    cacheElements() {
        const elementIds = [
            'stepIndicator', 'phaseIndicator', 'instructions', 'rightKnife', 'leftKnife',
            'leftPiece', 'middlePiece', 'rightPiece', 'startButton', 'pauseButton',
            'player1StopButton', 'player2StopButton', 'resetButton', 'results',
            'player1LeftValue', 'player1CenterValue', 'player1FlankValue',
            'player2LeftValue', 'player2CenterValue', 'player2FlankValue',
            'p1-utility-fill', 'p1-utility-text', 'p2-utility-fill', 'p2-utility-text',
            'player1Card', 'player2Card', 'resultContent'
        ];

        const elements = {};
        elementIds.forEach(id => elements[id] = document.getElementById(id));
        return elements;
    }

    bindEvents() {
        this.elements.startButton?.addEventListener('click', () => this.handleStart());
        this.elements.pauseButton?.addEventListener('click', () => this.handlePause());
        this.elements.player1StopButton?.addEventListener('click', () => this.handleStop(1));
        this.elements.player2StopButton?.addEventListener('click', () => this.handleStop(2));
        this.elements.resetButton?.addEventListener('click', () => this.handleReset());
        this.bindValuationInputs();
    }

    bindValuationInputs() {
        const colors = Utils.getColorNames();
        ['p1', 'p2'].forEach(player => {
            colors.forEach(color => {
                const element = document.getElementById(`${player}-${color}`);
                if (element) {
                    element.addEventListener('input', () => this.handleValuationChange());
                }
            });
        });
    }

    handleStart() {
        if (!this.gameState.isValid()) {
            const validation = this.gameState.validateTotals();
            alert(`Valuation totals must equal 100 points each!\n\nPlayer 1 total: ${validation.player1.total}\nPlayer 2 total: ${validation.player2.total}`);
            return;
        }

        this.gameState.isAnimating = true;
        this.gameState.phase = CONFIG.PHASES.MOVING_KNIFE;
        this.gameState.rightKnifePosition = 0;

        Utils.setElementDisplay(this.elements.startButton, false);
        Utils.setElementDisplay(this.elements.pauseButton, true);
        Utils.setElementDisplay(this.elements.player1StopButton, true);
        Utils.setElementDisplay(this.elements.player2StopButton, true);

        this.animateKnife();
    }

    handlePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        this.elements.pauseButton.textContent = this.gameState.isPaused ? 'Resume' : 'Pause';
        if (!this.gameState.isPaused) this.animateKnife();
    }

    handleStop(player) {
        this.gameState.isAnimating = false;
        this.gameState.controllingPlayer = player;
        this.gameState.stopPosition = this.gameState.rightKnifePosition;

        const regionValues = CalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
        const playerKey = `player${player}`;
        this.gameState.targetMiddleValue = CalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues[playerKey]);

        this.transitionToPhase2();
    }

    handleReset() {
        this.gameState.reset();
        this.resetUI();
        this.updatePlayerValueDisplays();
        this.updateValidationDisplay();
    }

    handleValuationChange() {
        this.gameState.updatePlayerValues();
        this.updateValidationDisplay();
        if (this.gameState.phase === CONFIG.PHASES.MOVING_KNIFE) {
            this.updatePlayerValueDisplays();
        }
    }

    animateKnife() {
        if (!this.gameState.isAnimating || this.gameState.isPaused) return;

        const regionValues = CalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
        const p1Left = CalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player1);
        const p2Left = CalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player2);

        if (this.gameState.rightKnifePosition >= CONFIG.CANVAS.WIDTH) {
            this.gameState.rightKnifePosition = 0;
        }

        const p1Distance = Math.abs(p1Left - 50);
        const p2Distance = Math.abs(p2Left - 50);
        const minDistance = Math.min(p1Distance, p2Distance);
        const speedMultiplier = CalculationEngine.calculateSpeedMultiplier(minDistance);

        this.gameState.rightKnifePosition += CONFIG.ANIMATION.BASE_SPEED * speedMultiplier;
        this.updateKnifePosition();

        this.gameState.animationId = requestAnimationFrame(() => this.animateKnife());
    }

    updateKnifePosition() {
        if (this.elements.rightKnife) {
            this.elements.rightKnife.setAttribute('x1', this.gameState.rightKnifePosition);
            this.elements.rightKnife.setAttribute('x2', this.gameState.rightKnifePosition);
        }
        this.updatePlayerValueDisplays();
    }

    updatePlayerValueDisplays() {
        const regionValues = CalculationEngine.calculatePhase1RegionValues(this.gameState.rightKnifePosition);
        const p1Left = CalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player1);
        const p2Left = CalculationEngine.calculatePlayerValue(regionValues.left, this.gameState.playerValues.player2);

        if (this.elements.player1LeftValue) {
            this.elements.player1LeftValue.textContent = `Left: ${Utils.formatNumber(p1Left)}`;
        }
        if (this.elements.player2LeftValue) {
            this.elements.player2LeftValue.textContent = `Left: ${Utils.formatNumber(p2Left)}`;
        }

        this.updateUtilityBars(p1Left, p2Left);
    }

    updateUtilityBars(p1Value, p2Value) {
        if (this.elements['p1-utility-fill']) {
            this.elements['p1-utility-fill'].style.width = `${p1Value}%`;
        }
        if (this.elements['p1-utility-text']) {
            this.elements['p1-utility-text'].textContent = `${Math.round(p1Value)}%`;
        }
        if (this.elements['p2-utility-fill']) {
            this.elements['p2-utility-fill'].style.width = `${p2Value}%`;
        }
        if (this.elements['p2-utility-text']) {
            this.elements['p2-utility-text'].textContent = `${Math.round(p2Value)}%`;
        }
    }

    updateValidationDisplay() {
        const validation = this.gameState.validateTotals();

        ['player1', 'player2'].forEach((player, index) => {
            const playerNum = index + 1;
            const card = this.elements[`player${playerNum}Card`];

            if (card) {
                // Remove existing validation indicator
                const existingIndicator = card.querySelector('.validation-indicator');
                if (existingIndicator) existingIndicator.remove();

                // Create new validation indicator
                const indicator = document.createElement('div');
                indicator.className = 'validation-indicator';

                if (validation[player].valid) {
                    indicator.textContent = `Total: ${validation[player].total} points`;
                    indicator.style.background = '#f0fff4';
                    indicator.style.color = '#38a169';
                    indicator.style.border = '1px solid #68d391';
                    card.classList.remove('invalid');
                } else {
                    indicator.textContent = `Total: ${validation[player].total} points (needs 100)`;
                    indicator.style.background = '#fff5f5';
                    indicator.style.color = '#e53e3e';
                    indicator.style.border = '1px solid #fc8181';
                    card.classList.add('invalid');
                }

                const colorLegend = card.querySelector('.color-legend');
                if (colorLegend) colorLegend.insertAdjacentElement('afterend', indicator);
            }
        });

        if (this.elements.startButton) {
            this.elements.startButton.disabled = !this.gameState.isValid();
        }
    }

    transitionToPhase2() {
        if (this.gameState.animationId) {
            cancelAnimationFrame(this.gameState.animationId);
        }

        this.gameState.phase = CONFIG.PHASES.DUAL_KNIVES;

        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = 'Phase 2: Dual knife movement with value constraint';
        }

        if (this.elements.phaseIndicator) {
            this.elements.phaseIndicator.textContent =
                `Player ${this.gameState.controllingPlayer} controls both knives. Left knife moves toward position ${Math.round(this.gameState.stopPosition)}, maintaining exactly ${Math.round(this.gameState.targetMiddleValue)} value in middle piece`;
        }

        if (this.elements.instructions) {
            this.elements.instructions.innerHTML =
                '<strong>Phase 2:</strong> The controlling player\'s knives move automatically. The left knife (green) must reach the orange dashed line by the time the right knife (red) reaches the end, while maintaining the exact middle piece value.';
        }

        Utils.setElementDisplay(this.elements.pauseButton, false);
        Utils.setElementDisplay(this.elements.player1StopButton, false);
        Utils.setElementDisplay(this.elements.player2StopButton, false);

        setTimeout(() => this.startPhase2(), CONFIG.TIMING.PHASE_TRANSITION_DELAY);
    }

    startPhase2() {
        Utils.setElementDisplay(this.elements.leftKnife, true);
        this.showStopPosition();

        if (this.elements.instructions) {
            this.elements.instructions.innerHTML =
                '<strong>Phase 2:</strong> The controlling player\'s knives move automatically. The left knife (green) must reach the orange dashed line by the time the right knife (red) reaches the end, while maintaining the exact middle piece value.';
        }

        // Initialize positions
        this.gameState.leftKnifePosition = 0;
        this.gameState.rightKnifePosition = CalculationEngine.findRightKnifePosition(
            0,
            this.gameState.targetMiddleValue,
            this.gameState.playerValues[`player${this.gameState.controllingPlayer}`]
        );

        // Show center and flank value displays
        Utils.setElementDisplay(this.elements.player1CenterValue, true);
        Utils.setElementDisplay(this.elements.player1FlankValue, true);
        Utils.setElementDisplay(this.elements.player2CenterValue, true);
        Utils.setElementDisplay(this.elements.player2FlankValue, true);
        Utils.setElementDisplay(this.elements.player1LeftValue, false);
        Utils.setElementDisplay(this.elements.player2LeftValue, false);

        // Update knife positions
        this.updateKnifePositions(this.gameState.leftKnifePosition, this.gameState.rightKnifePosition);

        // Add stop button for the other player
        const otherPlayer = this.gameState.controllingPlayer === 1 ? 2 : 1;
        const stopButton = document.createElement('button');
        stopButton.textContent = `Player ${otherPlayer}: STOP!`;
        stopButton.className = 'button danger';
        stopButton.onclick = () => this.transitionToPhase3();

        document.querySelector('.animation-controls').appendChild(stopButton);

        // Start dual knife animation
        setTimeout(() => {
            this.gameState.isAnimating = true;
            this.animateDualKnives();
        }, 1000);
    }

    /**
 * Animate dual knives in phase 2
 */
    animateDualKnives() {
        if (!this.gameState.isAnimating || this.gameState.isPaused) return;

        const leftTarget = this.gameState.stopPosition;
        const rightTarget = 800;
        const controllingPlayerKey = `player${this.gameState.controllingPlayer}`;

        const leftRemaining = leftTarget - this.gameState.leftKnifePosition;
        const baseSpeed = 1.5;

        // Calculate current middle value and distance from target
        const currentRegionValues = CalculationEngine.calculatePhase2RegionValues(
            this.gameState.leftKnifePosition,
            this.gameState.rightKnifePosition
        );
        const currentMiddleValue = CalculationEngine.calculatePlayerValue(
            currentRegionValues.middle,
            this.gameState.playerValues[controllingPlayerKey]
        );
        const valueDistance = Math.abs(currentMiddleValue - this.gameState.targetMiddleValue);

        const percentageDistance = (valueDistance / this.gameState.targetMiddleValue) * 50;
        const speedMultiplier = CalculationEngine.calculatePhase2SpeedMultiplier(percentageDistance);
        const adjustedSpeed = baseSpeed * speedMultiplier;

        // Move left knife toward target
        let newLeftPosition = this.gameState.leftKnifePosition;
        if (Math.abs(leftRemaining) > 1) {
            const leftStep = Math.sign(leftRemaining) * Math.min(Math.abs(leftRemaining), adjustedSpeed);
            newLeftPosition = this.gameState.leftKnifePosition + leftStep;
        } else {
            newLeftPosition = leftTarget;
        }

        // Calculate right knife position that maintains target value
        let newRightPosition;
        if (Math.abs(leftTarget - newLeftPosition) < 1) {
            // Left knife reached target, right knife can move freely
            const rightRemaining = rightTarget - this.gameState.rightKnifePosition;
            if (Math.abs(rightRemaining) > 1) {
                newRightPosition = this.gameState.rightKnifePosition + Math.sign(rightRemaining) * Math.min(Math.abs(rightRemaining), adjustedSpeed);
            } else {
                newRightPosition = rightTarget;
            }
        } else {
            // Left knife still moving, maintain value constraint
            newRightPosition = CalculationEngine.findRightKnifePosition(
                newLeftPosition,
                this.gameState.targetMiddleValue,
                this.gameState.playerValues[controllingPlayerKey]
            );
        }

        // Ensure right knife doesn't go beyond bounds
        newRightPosition = Math.max(newLeftPosition + 10, Math.min(newRightPosition, rightTarget));

        // Update positions
        this.updateKnifePositions(newLeftPosition, newRightPosition);

        // Check completion
        const leftKnifeComplete = Math.abs(leftTarget - newLeftPosition) < 1;
        const rightKnifeComplete = Math.abs(rightTarget - newRightPosition) < 1;

        if (leftKnifeComplete && rightKnifeComplete) {
            setTimeout(() => this.transitionToPhase3(), 500);
            return;
        }

        this.gameState.animationId = requestAnimationFrame(() => this.animateDualKnives());
    }

    /**
     * Update both knife positions in phase 2
     */
    updateKnifePositions(newLeftPosition, newRightPosition) {
        this.gameState.leftKnifePosition = newLeftPosition;
        this.gameState.rightKnifePosition = newRightPosition;

        if (this.elements.leftKnife) {
            this.elements.leftKnife.setAttribute('x1', newLeftPosition);
            this.elements.leftKnife.setAttribute('x2', newLeftPosition);
        }

        if (this.elements.rightKnife) {
            this.elements.rightKnife.setAttribute('x1', newRightPosition);
            this.elements.rightKnife.setAttribute('x2', newRightPosition);
        }

        // Calculate and update values
        const regionValues = CalculationEngine.calculatePhase2RegionValues(newLeftPosition, newRightPosition);
        const p1Middle = CalculationEngine.calculatePlayerValue(regionValues.middle, this.gameState.playerValues.player1);
        const p1Flank = CalculationEngine.calculatePlayerValue(regionValues.flank, this.gameState.playerValues.player1);
        const p2Middle = CalculationEngine.calculatePlayerValue(regionValues.middle, this.gameState.playerValues.player2);
        const p2Flank = CalculationEngine.calculatePlayerValue(regionValues.flank, this.gameState.playerValues.player2);

        if (this.elements.player1CenterValue) {
            this.elements.player1CenterValue.textContent = `Center: ${Math.round(p1Middle)}`;
        }
        if (this.elements.player1FlankValue) {
            this.elements.player1FlankValue.textContent = `Flank: ${Math.round(p1Flank)}`;
        }
        if (this.elements.player2CenterValue) {
            this.elements.player2CenterValue.textContent = `Center: ${Math.round(p2Middle)}`;
        }
        if (this.elements.player2FlankValue) {
            this.elements.player2FlankValue.textContent = `Flank: ${Math.round(p2Flank)}`;
        }

        this.updateUtilityBars(p1Middle, p2Middle);
    }

    /**
     * Show stop position indicator
     */
    showStopPosition() {
        const svg = document.querySelector('.background-svg');

        // Remove existing indicator
        const existingIndicator = document.getElementById('stopPositionIndicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Add new indicator
        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        indicator.setAttribute('id', 'stopPositionIndicator');
        indicator.setAttribute('x1', this.gameState.stopPosition);
        indicator.setAttribute('y1', 0);
        indicator.setAttribute('x2', this.gameState.stopPosition);
        indicator.setAttribute('y2', 400);
        indicator.setAttribute('stroke', '#ffa500');
        indicator.setAttribute('stroke-width', '3');
        indicator.setAttribute('stroke-dasharray', '5,5');
        indicator.setAttribute('opacity', '0.7');

        svg.appendChild(indicator);
    }

    transitionToPhase3() {
        this.gameState.isAnimating = false;
        this.gameState.phase = CONFIG.PHASES.RANDOM_ASSIGNMENT;

        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = 'Phase 3: Random Assignment';
        }

        if (this.elements.phaseIndicator) {
            this.elements.phaseIndicator.textContent = 'Randomly assigning pieces...';
        }

        if (this.elements.instructions) {
            this.elements.instructions.innerHTML = '<strong>Random Assignment:</strong> The pieces will be randomly assigned to ensure fairness.';
        }

        this.showPieceOverlays();

        setTimeout(() => this.performRandomAssignment(), 2000);
    }

    showPieceOverlays() {
        const leftWidth = this.gameState.leftKnifePosition || 200;
        const rightStart = this.gameState.rightKnifePosition || 600;

        if (this.elements.leftPiece) {
            this.elements.leftPiece.setAttribute('width', leftWidth);
            Utils.setElementDisplay(this.elements.leftPiece, true);
        }

        if (this.elements.middlePiece) {
            this.elements.middlePiece.setAttribute('x', leftWidth);
            this.elements.middlePiece.setAttribute('width', rightStart - leftWidth);
            Utils.setElementDisplay(this.elements.middlePiece, true);
        }

        if (this.elements.rightPiece) {
            this.elements.rightPiece.setAttribute('x', rightStart);
            this.elements.rightPiece.setAttribute('width', CONFIG.CANVAS.WIDTH - rightStart);
            Utils.setElementDisplay(this.elements.rightPiece, true);
        }
    }

    performRandomAssignment() {
        const randomChoice = Math.random() < 0.5 ? 'inside' : 'outside';
        const choosingPlayer = this.gameState.controllingPlayer === 1 ? 2 : 1;

        if (this.elements.phaseIndicator) {
            this.elements.phaseIndicator.textContent =
                `Random assignment complete! Player ${choosingPlayer} received the ${randomChoice} piece.`;
        }

        setTimeout(() => this.showResults(randomChoice, choosingPlayer), 1500);
    }

    showResults(selectedPiece, choosingPlayer) {
        const controllingPlayer = this.gameState.controllingPlayer;

        if (this.elements.resultContent) {
            this.elements.resultContent.innerHTML = `
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3182ce;">
                    <h4>Protocol Summary:</h4>
                    <p><strong>Phase 1:</strong> Player ${controllingPlayer} stopped the knife when they believed the left portion was worth exactly 50% to them.</p>
                    <p><strong>Phase 2:</strong> Player ${controllingPlayer} controlled both knives, maintaining their 50% value constraint.</p>
                    <p><strong>Phase 3:</strong> The pieces were randomly assigned. Player ${choosingPlayer} received the <strong>${selectedPiece} piece</strong>.</p>
                </div>
                <div style="background: #ebf8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h4>Final Result:</h4>
                    <p><strong>Player ${choosingPlayer}</strong> was randomly assigned the <strong>${selectedPiece}</strong> piece</p>
                    <p><strong>Player ${controllingPlayer}</strong> gets the remaining piece</p>
                    <p>Fair division achieved through the Austin moving knife algorithm!</p>
                </div>
            `;
        }

        Utils.setElementDisplay(this.elements.results, true);
        Utils.setElementDisplay(this.elements.instructions, false);

        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = 'Demo Complete - Results';
        }
    }

    resetUI() {
        if (this.elements.stepIndicator) {
            this.elements.stepIndicator.textContent = 'Phase 1: Single knife moving across the cake';
        }

        if (this.elements.phaseIndicator) {
            this.elements.phaseIndicator.textContent = 'Waiting for either player to call "STOP!" when they believe the left piece equals exactly 50%';
        }

        if (this.elements.instructions) {
            this.elements.instructions.innerHTML = '<strong>Instructions:</strong> Watch the knife move across the cake. Either player can call "STOP!" when they think the left piece has exactly 50% value according to their preferences.';
        }

        Utils.setElementDisplay(this.elements.startButton, true);
        Utils.setElementDisplay(this.elements.pauseButton, false);
        Utils.setElementDisplay(this.elements.player1StopButton, false);
        Utils.setElementDisplay(this.elements.player2StopButton, false);
        Utils.setElementDisplay(this.elements.results, false);
        Utils.setElementDisplay(this.elements.instructions, true);
        Utils.setElementDisplay(this.elements.leftKnife, false);
        Utils.setElementDisplay(this.elements.leftPiece, false);
        Utils.setElementDisplay(this.elements.middlePiece, false);
        Utils.setElementDisplay(this.elements.rightPiece, false);
        Utils.setElementDisplay(this.elements.player1LeftValue, true);
        Utils.setElementDisplay(this.elements.player2LeftValue, true);
        Utils.setElementDisplay(this.elements.player1CenterValue, false);
        Utils.setElementDisplay(this.elements.player1FlankValue, false);
        Utils.setElementDisplay(this.elements.player2CenterValue, false);
        Utils.setElementDisplay(this.elements.player2FlankValue, false);

        if (this.elements.rightKnife) {
            this.elements.rightKnife.setAttribute('x1', 0);
            this.elements.rightKnife.setAttribute('x2', 0);
        }

        if (this.elements.pauseButton) {
            this.elements.pauseButton.textContent = 'Pause';
        }
    }
}

// ===== GAME CONTROLLER =====

class GameController {
    constructor() {
        this.gameState = new GameState();
        this.uiManager = new UIManager(this.gameState);
        this.initialize();
    }

    initialize() {
        this.setInitialValues();
        this.uiManager.updateValidationDisplay();
        this.uiManager.updatePlayerValueDisplays();
        console.log('Austin Moving Knife demo initialized successfully');
    }

    setInitialValues() {
        const colors = Utils.getColorNames();
        ['player1', 'player2'].forEach(player => {
            const playerKey = player === 'player1' ? 'p1' : 'p2';
            colors.forEach(color => {
                const element = document.getElementById(`${playerKey}-${color}`);
                if (element && this.gameState.playerValues[player][color] !== undefined) {
                    element.value = this.gameState.playerValues[player][color];
                }
            });
        });
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function () {
    try {
        window.gameController = new GameController();
    } catch (error) {
        console.error('Failed to initialize Austin Moving Knife demo:', error);
    }
});