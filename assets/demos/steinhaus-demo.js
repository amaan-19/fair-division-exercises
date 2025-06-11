// Game state variables
let gameState = {
    step: 1,
    phase: 1,
    cutPositions: [267, 533],
    pieceValues: { p1: [0, 0, 0], p2: [0, 0, 0], p3: [0, 0, 0] },
    acceptablePieces: { p2: [], p3: [] },
    selectedPiece: null,
    finalAllocation: {},
    algorithmCase: null
};

// Color values for each player
const colorValues = {
    player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
    player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 },
    player3: { blue: 30, red: 10, green: 15, orange: 5, pink: 25, purple: 15 }
};

// Region boundaries for vertical cuts (x-coordinates)
const regions = {
    blue: { start: 0, end: 600 },
    pink: { start: 0, end: 150 },
    green: { start: 150, end: 600 },
    red: { start: 600, end: 800 },
    orange: { start: 600, end: 800 },
    purple: { start: 150, end: 800 }
};

function updateColorValues() {
    ['player1', 'player2', 'player3'].forEach((player, idx) => {
        const prefix = `p${idx + 1}`;
        colorValues[player] = {
            blue: parseInt(document.getElementById(`${prefix}-blue`).value) || 0,
            red: parseInt(document.getElementById(`${prefix}-red`).value) || 0,
            green: parseInt(document.getElementById(`${prefix}-green`).value) || 0,
            orange: parseInt(document.getElementById(`${prefix}-orange`).value) || 0,
            pink: parseInt(document.getElementById(`${prefix}-pink`).value) || 0,
            purple: parseInt(document.getElementById(`${prefix}-purple`).value) || 0
        };
    });
}

function validateTotals() {
    let allValid = true;
    ['player1', 'player2', 'player3'].forEach((player, idx) => {
        const prefix = `p${idx + 1}`;
        const total = Object.values(colorValues[player]).reduce((a, b) => a + b, 0);
        const totalEl = document.getElementById(`${prefix}-total`);
        const isValid = total === 100;
        totalEl.innerHTML = `Total: <span class="${isValid ? 'valid' : 'error'}">${total}</span>`;
        if (!isValid) allValid = false;
    });

    document.getElementById('makeCutsButton').disabled = !allValid;
    return allValid;
}

function handleValuationChange() {
    updateColorValues();
    validateTotals();
    if (gameState.step === 1) {
        updateGameValues();
    }
}

function calculatePieceValues(cut1, cut2) {
    const cuts = [0, cut1, cut2, 800].sort((a, b) => a - b);
    const pieceValues = { p1: [], p2: [], p3: [] };

    for (let pieceIdx = 0; pieceIdx < 3; pieceIdx++) {
        const pieceStart = cuts[pieceIdx];
        const pieceEnd = cuts[pieceIdx + 1];

        ['player1', 'player2', 'player3'].forEach((player, playerIdx) => {
            let total = 0;
            const prefs = colorValues[player];

            for (const [color, bounds] of Object.entries(regions)) {
                const regionWidth = bounds.end - bounds.start;
                let overlapWidth = 0;

                if (pieceEnd > bounds.start && pieceStart < bounds.end) {
                    const overlapStart = Math.max(pieceStart, bounds.start);
                    const overlapEnd = Math.min(pieceEnd, bounds.end);
                    overlapWidth = overlapEnd - overlapStart;
                }

                const overlapPercent = (overlapWidth / regionWidth) * 100;
                total += (overlapPercent / 100) * prefs[color];
            }

            pieceValues[`p${playerIdx + 1}`][pieceIdx] = total;
        });
    }

    return pieceValues;
}

function updateGameValues() {
    const cut1 = parseFloat(document.getElementById('cutSlider1').value);
    const cut2 = parseFloat(document.getElementById('cutSlider2').value);

    // Ensure cuts are in order
    if (cut1 >= cut2) {
        if (event && event.target.id === 'cutSlider1') {
            document.getElementById('cutSlider2').value = cut1 + 10;
        } else {
            document.getElementById('cutSlider1').value = cut2 - 10;
        }
        return updateGameValues();
    }

    gameState.cutPositions = [cut1, cut2];

    // Update cut line positions
    document.getElementById('cutLine1').setAttribute('x1', cut1);
    document.getElementById('cutLine1').setAttribute('x2', cut1);
    document.getElementById('cutLine2').setAttribute('x1', cut2);
    document.getElementById('cutLine2').setAttribute('x2', cut2);

    // Update position displays
    document.getElementById('cutPosition1').textContent = `${(cut1 / 800 * 100).toFixed(1)}%`;
    document.getElementById('cutPosition2').textContent = `${(cut2 / 800 * 100).toFixed(1)}%`;

    // Calculate piece values
    gameState.pieceValues = calculatePieceValues(cut1, cut2);

    // Update piece value displays
    for (let i = 0; i < 3; i++) {
        document.getElementById(`piece${i + 1}Value`).textContent =
            `Value: ${gameState.pieceValues.p1[i].toFixed(1)}`;
    }

    // Update non-divider value displays
    document.getElementById('p2-values').textContent =
        `P1: ${gameState.pieceValues.p2[0].toFixed(1)} | P2: ${gameState.pieceValues.p2[1].toFixed(1)} | P3: ${gameState.pieceValues.p2[2].toFixed(1)}`;
    document.getElementById('p3-values').textContent =
        `P1: ${gameState.pieceValues.p3[0].toFixed(1)} | P2: ${gameState.pieceValues.p3[1].toFixed(1)} | P3: ${gameState.pieceValues.p3[2].toFixed(1)}`;

    // Check if divider values are approximately equal
    const dividerValues = gameState.pieceValues.p1;
    const maxDiff = Math.max(
        Math.abs(dividerValues[0] - dividerValues[1]),
        Math.abs(dividerValues[1] - dividerValues[2]),
        Math.abs(dividerValues[0] - dividerValues[2])
    );

    document.getElementById('warning').style.display = maxDiff < 1.0 ? 'none' : 'block';
}

function makeCuts() {
    if (gameState.step !== 1) return;

    gameState.step = 2;

    // Hide controls
    document.getElementById('sliderContainer').style.display = 'none';
    document.getElementById('makeCutsButton').style.display = 'none';
    document.getElementById('warning').style.display = 'none';

    // Update piece overlays
    const [cut1, cut2] = gameState.cutPositions;
    const cuts = [0, cut1, cut2, 800].sort((a, b) => a - b);

    for (let i = 0; i < 3; i++) {
        const piece = document.getElementById(`piece${i + 1}`);
        piece.setAttribute('x', cuts[i]);
        piece.setAttribute('width', cuts[i + 1] - cuts[i]);
        piece.style.display = 'block';
    }

    // Analyze which pieces are acceptable to non-dividers
    analyzeAcceptablePieces();

    // Determine algorithm case and proceed
    determineAlgorithmCase();
}

function analyzeAcceptablePieces() {
    const threshold = 100 / 3; // 33.33% for proportional share

    gameState.acceptablePieces.p2 = [];
    gameState.acceptablePieces.p3 = [];

    for (let i = 0; i < 3; i++) {
        if (gameState.pieceValues.p2[i] >= threshold) {
            gameState.acceptablePieces.p2.push(i);
        }
        if (gameState.pieceValues.p3[i] >= threshold) {
            gameState.acceptablePieces.p3.push(i);
        }
    }

    // Highlight acceptable pieces
    for (let i = 0; i < 3; i++) {
        const piece = document.getElementById(`piece${i + 1}`);
        const isP2Acceptable = gameState.acceptablePieces.p2.includes(i);
        const isP3Acceptable = gameState.acceptablePieces.p3.includes(i);

        if (isP2Acceptable || isP3Acceptable) {
            piece.classList.add('acceptable');
        }
    }
}

function determineAlgorithmCase() {
    const p2Count = gameState.acceptablePieces.p2.length;
    const p3Count = gameState.acceptablePieces.p3.length;

    document.getElementById('phaseIndicator').textContent = 'Phase 2: Non-Divider Analysis';

    if (p2Count >= 2 || p3Count >= 2) {
        // Case A: At least one non-divider sees 2+ acceptable pieces
        gameState.algorithmCase = 'A';
        handleCaseA();
    } else {
        // Case B: Both non-dividers see at most 1 acceptable piece
        gameState.algorithmCase = 'B';
        handleCaseB();
    }
}

function handleCaseA() {
    document.getElementById('stepIndicator').textContent =
        'Step 2: Case A - Non-dividers pick in order';

    const algorithmInfo = document.getElementById('algorithmInfo');
    algorithmInfo.style.display = 'block';

    const p2Count = gameState.acceptablePieces.p2.length;
    const p3Count = gameState.acceptablePieces.p3.length;

    let caseText = '<strong>Case A:</strong> ';
    if (p2Count >= 2) {
        caseText += `Player 2 sees ${p2Count} acceptable pieces. `;
    }
    if (p3Count >= 2) {
        caseText += `Player 3 sees ${p3Count} acceptable pieces. `;
    }
    caseText += '<br><br>Player 3 picks first, then Player 2, then Player 1 gets the remaining piece.';

    document.getElementById('caseAnalysis').innerHTML = caseText;

    document.getElementById('instructions').innerHTML =
        '<strong>Instructions:</strong> Player 3, click on your preferred piece!';

    // Make pieces clickable for Player 3
    for (let i = 0; i < 3; i++) {
        document.getElementById(`piece${i + 1}`).onclick = () => selectPiecePlayer3(i);
    }
}

function selectPiecePlayer3(pieceIndex) {
    if (gameState.step !== 2) return;

    // Clear previous selections
    for (let i = 0; i < 3; i++) {
        document.getElementById(`piece${i + 1}`).classList.remove('selected');
    }

    // Select piece
    document.getElementById(`piece${pieceIndex + 1}`).classList.add('selected');
    gameState.finalAllocation.p3 = pieceIndex;

    // Remove selected piece from available options
    const availablePieces = [0, 1, 2].filter(i => i !== pieceIndex);

    gameState.step = 3;
    document.getElementById('stepIndicator').textContent =
        'Step 3: Player 2 selects from remaining pieces';
    document.getElementById('instructions').innerHTML =
        '<strong>Instructions:</strong> Player 2, click on your preferred piece from the remaining options!';

    // Make only remaining pieces clickable
    for (let i = 0; i < 3; i++) {
        const piece = document.getElementById(`piece${i + 1}`);
        if (availablePieces.includes(i)) {
            piece.onclick = () => selectPiecePlayer2(i);
            piece.style.cursor = 'pointer';
        } else {
            piece.onclick = null;
            piece.style.cursor = 'not-allowed';
            piece.style.opacity = '0.5';
        }
    }
}

function selectPiecePlayer2(pieceIndex) {
    if (gameState.step !== 3) return;

    // Select piece
    document.getElementById(`piece${pieceIndex + 1}`).classList.add('selected');
    gameState.finalAllocation.p2 = pieceIndex;

    // Player 1 gets the remaining piece
    const remainingPiece = [0, 1, 2].find(i =>
        i !== gameState.finalAllocation.p2 && i !== gameState.finalAllocation.p3
    );
    gameState.finalAllocation.p1 = remainingPiece;

    setTimeout(showResults, 1000);
}

function handleCaseB() {
    document.getElementById('stepIndicator').textContent =
        'Step 2: Case B - Removing unacceptable piece';

    const algorithmInfo = document.getElementById('algorithmInfo');
    algorithmInfo.style.display = 'block';

    // Find the piece that neither non-divider considers acceptable
    const unacceptablePieces = [];
    for (let i = 0; i < 3; i++) {
        if (!gameState.acceptablePieces.p2.includes(i) && !gameState.acceptablePieces.p3.includes(i)) {
            unacceptablePieces.push(i);
        }
    }

    let caseText = '<strong>Case B:</strong> Both non-dividers see at most 1 acceptable piece each.<br><br>';

    if (unacceptablePieces.length > 0) {
        const unacceptablePiece = unacceptablePieces[0];
        caseText += `Piece ${unacceptablePiece + 1} is unacceptable to both non-dividers, so it goes to Player 1 (divider).<br>`;
        caseText += 'The remaining cake would be reassembled and divided using standard Divide-and-Choose.';

        // Allocate unacceptable piece to divider
        gameState.finalAllocation.p1 = unacceptablePiece;

        // For demo purposes, randomly allocate remaining pieces
        const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);
        gameState.finalAllocation.p2 = remainingPieces[0];
        gameState.finalAllocation.p3 = remainingPieces[1];

        // Highlight the allocations
        document.getElementById(`piece${unacceptablePiece + 1}`).classList.add('selected');
        document.getElementById(`piece${remainingPieces[0] + 1}`).classList.add('selected');
        document.getElementById(`piece${remainingPieces[1] + 1}`).classList.add('selected');
    } else {
        // Edge case: handle when there's no clearly unacceptable piece
        caseText += 'Complex case detected. For this demo, we\'ll proceed with a simplified allocation.';
        gameState.finalAllocation = { p1: 0, p2: 1, p3: 2 };

        for (let i = 0; i < 3; i++) {
            document.getElementById(`piece${i + 1}`).classList.add('selected');
        }
    }

    document.getElementById('caseAnalysis').innerHTML = caseText;
    document.getElementById('instructions').innerHTML =
        '<strong>Algorithm Complete:</strong> Click Continue to see the final results.';

    document.getElementById('continueButton').style.display = 'inline-block';
    document.getElementById('continueButton').onclick = showResults;
}

function showResults() {
    gameState.step = 4;
    document.getElementById('stepIndicator').textContent = 'Algorithm Complete!';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('continueButton').style.display = 'none';

    const results = document.getElementById('results');
    results.style.display = 'block';

    // Calculate final values
    const p1Final = gameState.pieceValues.p1[gameState.finalAllocation.p1];
    const p2Final = gameState.pieceValues.p2[gameState.finalAllocation.p2];
    const p3Final = gameState.pieceValues.p3[gameState.finalAllocation.p3];

    document.getElementById('resultText').innerHTML =
        `Player 1 gets Piece ${gameState.finalAllocation.p1 + 1} (value: ${p1Final.toFixed(1)})<br>` +
        `Player 2 gets Piece ${gameState.finalAllocation.p2 + 1} (value: ${p2Final.toFixed(1)})<br>` +
        `Player 3 gets Piece ${gameState.finalAllocation.p3 + 1} (value: ${p3Final.toFixed(1)})`;

    const threshold = 100 / 3;
    const proportional = p1Final >= threshold && p2Final >= threshold && p3Final >= threshold;

    document.getElementById('proportionalResult').textContent =
        proportional ? 'All players get ≥33.3% value' : 'Some players get <33.3% value';
    document.getElementById('proportionalResult').style.color = proportional ? '#38a169' : '#e53e3e';

    document.getElementById('algorithmPath').textContent =
        gameState.algorithmCase === 'A' ? 'Case A: Sequential selection' : 'Case B: Unacceptable piece removal';

    document.getElementById('resetButton').style.display = 'inline-block';
}

function resetSimulation() {
    gameState = {
        step: 1,
        phase: 1,
        cutPositions: [267, 533],
        pieceValues: { p1: [0, 0, 0], p2: [0, 0, 0], p3: [0, 0, 0] },
        acceptablePieces: { p2: [], p3: [] },
        selectedPiece: null,
        finalAllocation: {},
        algorithmCase: null
    };

    // Reset sliders
    document.getElementById('cutSlider1').value = 267;
    document.getElementById('cutSlider2').value = 533;

    // Show/hide elements
    document.getElementById('sliderContainer').style.display = 'block';
    document.getElementById('makeCutsButton').style.display = 'inline-block';
    document.getElementById('continueButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('algorithmInfo').style.display = 'none';

    // Reset UI
    document.getElementById('stepIndicator').textContent =
        'Step 1: Player 1 (Divider) creates three equal-value pieces';
    document.getElementById('phaseIndicator').textContent = 'Phase 1: Initial Division';
    document.getElementById('instructions').innerHTML =
        '<strong>Instructions:</strong> Player 1, use the sliders below to position two vertical cuts to create three pieces that you value equally.';

    // Reset overlays
    for (let i = 1; i <= 3; i++) {
        const piece = document.getElementById(`piece${i}`);
        piece.style.display = 'none';
        piece.classList.remove('selected', 'acceptable');
        piece.style.opacity = '1';
        piece.style.cursor = 'pointer';
        piece.onclick = null;
    }

    updateGameValues();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cutSlider1').addEventListener('input', updateGameValues);
    document.getElementById('cutSlider2').addEventListener('input', updateGameValues);
    document.getElementById('makeCutsButton').addEventListener('click', makeCuts);
    document.getElementById('resetButton').addEventListener('click', resetSimulation);

    // Add event listeners for all valuation inputs
    ['p1-blue', 'p1-red', 'p1-green', 'p1-orange', 'p1-pink', 'p1-purple',
        'p2-blue', 'p2-red', 'p2-green', 'p2-orange', 'p2-pink', 'p2-purple',
        'p3-blue', 'p3-red', 'p3-green', 'p3-orange', 'p3-pink', 'p3-purple'].forEach(id => {
            document.getElementById(id).addEventListener('input', handleValuationChange);
        });

    // Initialize
    updateColorValues();
    validateTotals();
    updateGameValues();
});