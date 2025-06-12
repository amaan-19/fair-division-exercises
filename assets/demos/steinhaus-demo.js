// Game state variables
let gameState = {
    step: 1,
    phase: 1,
    cutPositions: [267, 533],
    pieceValues: { p1: [0, 0, 0], p2: [0, 0, 0], p3: [0, 0, 0] },
    acceptablePieces: { p2: [], p3: [] },
    selectedPiece: null,
    finalAllocation: {},
    algorithmCase: null,
    reconstructionState: {
        active: false,
        remainingPieces: [],
        combinedCake: { start: 0, end: 0 },
        cutPosition: 50,
        selectedPiece: null,
        divider: null,
        chooser: null
    }
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
        caseText += `Piece ${unacceptablePiece + 1} is unacceptable to both non-dividers, so it goes to Player 1 (divider).<br><br>`;
        caseText += '<strong>Next:</strong> The remaining pieces will be combined and divided using Divide-and-Choose between the two non-dividers.';

        // Allocate unacceptable piece to divider
        gameState.finalAllocation.p1 = unacceptablePiece;

        // Set up reconstruction
        const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);
        gameState.reconstructionState.remainingPieces = remainingPieces;
        gameState.reconstructionState.active = true;

        // Determine divider and chooser for divide-and-choose (randomly assign)
        if (Math.random() < 0.5) {
            gameState.reconstructionState.divider = 'p2';
            gameState.reconstructionState.chooser = 'p3';
        } else {
            gameState.reconstructionState.divider = 'p3';
            gameState.reconstructionState.chooser = 'p2';
        }

        caseText += `<br><br>Player ${gameState.reconstructionState.divider.slice(1)} will divide, Player ${gameState.reconstructionState.chooser.slice(1)} will choose.`;

        // Highlight the unacceptable piece
        document.getElementById(`piece${unacceptablePiece + 1}`).classList.add('selected');
        document.getElementById(`piece${unacceptablePiece + 1}`).style.opacity = '0.7';

        document.getElementById('instructions').innerHTML =
            '<strong>Next Phase:</strong> Click Continue to proceed to Divide-and-Choose reconstruction.';

        document.getElementById('continueButton').style.display = 'inline-block';
        document.getElementById('continueButton').onclick = startReconstruction;
    } else {
        // Edge case: handle when there's no clearly unacceptable piece
        caseText += 'Complex case detected. For this demo, we\'ll proceed with a simplified allocation.';
        gameState.finalAllocation = { p1: 0, p2: 1, p3: 2 };

        for (let i = 0; i < 3; i++) {
            document.getElementById(`piece${i + 1}`).classList.add('selected');
        }

        document.getElementById('instructions').innerHTML =
            '<strong>Algorithm Complete:</strong> Click Continue to see the final results.';

        document.getElementById('continueButton').style.display = 'inline-block';
        document.getElementById('continueButton').onclick = showResults;
    }

    document.getElementById('caseAnalysis').innerHTML = caseText;
}

function showResults() {
    gameState.step = 6;
    document.getElementById('stepIndicator').textContent = 'Algorithm Complete!';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('reconstructionInterface').style.display = 'none';

    const results = document.getElementById('results');
    results.style.display = 'block';

    let resultText = '';
    let p1Final, p2Final, p3Final;
    let proportional; // Declare once outside the blocks

    if (gameState.reconstructionState.active) {
        // Case B with reconstruction
        const unacceptablePiece = gameState.finalAllocation.p1;
        p1Final = gameState.pieceValues.p1[unacceptablePiece];

        // Use the stored reconstruction values directly (no scaling)
        if (gameState.reconstructionState.divider === 'p2') {
            p2Final = gameState.reconstructionState.dividerValue;
            p3Final = gameState.reconstructionState.chooserValue;
        } else {
            p3Final = gameState.reconstructionState.dividerValue;
            p2Final = gameState.reconstructionState.chooserValue;
        }

        // Calculate proportionality for Case B
        const gapStart = parseFloat(document.getElementById('reconstructionSlider').dataset.gapStart);
        const gapEnd = parseFloat(document.getElementById('reconstructionSlider').dataset.gapEnd);
        const minX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMin);
        const maxX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMax);

        const totalRemainingValues = {
            p2: calculateReconstructionPieceValue(minX, gapStart).p2 + calculateReconstructionPieceValue(gapEnd, maxX).p2,
            p3: calculateReconstructionPieceValue(minX, gapStart).p3 + calculateReconstructionPieceValue(gapEnd, maxX).p3
        };

        const p1Threshold = 33.3;
        const p2Threshold = (totalRemainingValues.p2 * 33.3) / 100;
        const p3Threshold = (totalRemainingValues.p3 * 33.3) / 100;

        proportional = p1Final >= p1Threshold && p2Final >= p2Threshold && p3Final >= p3Threshold;

        resultText =
            `Player 1 gets Piece ${unacceptablePiece + 1} (value: ${p1Final.toFixed(1)}, ${p1Final.toFixed(1)}%)<br>` +
            `Player 2 gets reconstructed portion (value: ${p2Final.toFixed(1)}, ${p2Final.toFixed(1)}%)<br>` +
            `Player 3 gets reconstructed portion (value: ${p3Final.toFixed(1)}, ${p3Final.toFixed(1)}%)`;
    } else {
        // Case A
        p1Final = gameState.pieceValues.p1[gameState.finalAllocation.p1];
        p2Final = gameState.pieceValues.p2[gameState.finalAllocation.p2];
        p3Final = gameState.pieceValues.p3[gameState.finalAllocation.p3];

        const threshold = 100 / 3;
        proportional = p1Final >= threshold && p2Final >= threshold && p3Final >= threshold;

        resultText =
            `Player 1 gets Piece ${gameState.finalAllocation.p1 + 1} (value: ${p1Final.toFixed(1)}, ${p1Final.toFixed(1)}%)<br>` +
            `Player 2 gets Piece ${gameState.finalAllocation.p2 + 1} (value: ${p2Final.toFixed(1)}, ${p2Final.toFixed(1)}%)<br>` +
            `Player 3 gets Piece ${gameState.finalAllocation.p3 + 1} (value: ${p3Final.toFixed(1)}, ${p3Final.toFixed(1)}%)`;
    }

    document.getElementById('resultText').innerHTML = resultText;

    document.getElementById('proportionalResult').textContent =
        proportional ? 'All players get ≥33.3% value' : 'Some players get <33.3% value';
    document.getElementById('proportionalResult').style.color = proportional ? '#38a169' : '#e53e3e';

    const algorithmPath = gameState.algorithmCase === 'A' ?
        'Case A: Sequential selection' :
        'Case B: Unacceptable piece removal + Divide-and-Choose';
    document.getElementById('algorithmPath').textContent = algorithmPath;

    document.getElementById('resetButton').style.display = 'inline-block';
}

function generateReconstructionRegions(minX, maxX) {
    let svgContent = '';

    // Only include regions that overlap with the remaining cake area
    const regionConfigs = [
        { name: 'Blue', color: '#0066ff', points: '0,0 600,0 600,150 0,150', textX: 300, textY: 80 },
        { name: 'Red', color: '#ff3366', points: '600,0 800,0 800,250 600,250', textX: 700, textY: 125 },
        { name: 'Orange', color: '#ff6600', points: '600,250 800,250 800,350 600,350', textX: 700, textY: 310 },
        { name: 'Purple', color: '#9966ff', points: '150,350 800,350 800,400 150,400', textX: 500, textY: 380 },
        { name: 'Pink', color: '#ff66ff', points: '0,150 150,150 150,400 0,400', textX: 80, textY: 280 },
        { name: 'Green', color: '#3f9633', points: '150,150 600,150 600,350 150,350', textX: 380, textY: 260 }
    ];

    regionConfigs.forEach(region => {
        // Parse points to check if region overlaps with remaining area
        const points = region.points.split(' ').map(p => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        });

        const regionMinX = Math.min(...points.map(p => p.x));
        const regionMaxX = Math.max(...points.map(p => p.x));

        // Only include if region overlaps with remaining cake area
        if (regionMaxX > minX && regionMinX < maxX) {
            svgContent += `
                <polygon points="${region.points}" fill="${region.color}" stroke="#2d3748" stroke-width="2" />
            `;

            // Only add text if the text position is within the remaining area
            if (region.textX >= minX && region.textX <= maxX) {
                svgContent += `
                    <text x="${region.textX}" y="${region.textY}" text-anchor="middle" 
                          font-size="${region.name === 'Blue' || region.name === 'Green' ? 32 : 24}" 
                          font-weight="bold" fill="white">${region.name}</text>
                `;
            }
        }
    });

    return svgContent;
}

function startReconstruction() {
    gameState.step = 4;
    document.getElementById('continueButton').style.display = 'none';

    document.getElementById('stepIndicator').textContent = 'Step 3: Divide-and-Choose Reconstruction';
    document.getElementById('phaseIndicator').textContent = 'Phase 3: Reconstructing Remaining Pieces';

    const [cut1, cut2] = gameState.cutPositions;
    const cuts = [0, cut1, cut2, 800].sort((a, b) => a - b);
    const remainingPieces = gameState.reconstructionState.remainingPieces;
    const removedPiece = gameState.finalAllocation.p1;

    let minX = 800, maxX = 0;
    for (const pieceIdx of remainingPieces) {
        minX = Math.min(minX, cuts[pieceIdx]);
        maxX = Math.max(maxX, cuts[pieceIdx + 1]);
    }

    gameState.reconstructionState.combinedCake = { start: minX, end: maxX };

    // Show visual gap by hiding the removed piece and marking remaining pieces
    for (let i = 0; i < 3; i++) {
        const piece = document.getElementById(`piece${i + 1}`);
        if (i === removedPiece) {
            // Create visual gap - make it look like a hole
            piece.style.fill = 'rgba(128,128,128,0.8)';
            piece.style.stroke = '#ff0000';
            piece.style.strokeWidth = '4';
            piece.style.strokeDasharray = '10,10';
            // Add text overlay showing "REMOVED"
            piece.setAttribute('title', 'REMOVED - No cake here');
        } else {
            piece.style.border = '3px solid #ffa500';
            piece.style.strokeWidth = '4';
            piece.style.stroke = '#ffa500';
        }
    }

    document.getElementById('reconstructionInterface').style.display = 'block';

    // Keep original slider setup but store gap info
    const reconstructionSlider = document.getElementById('reconstructionSlider');
    reconstructionSlider.min = 0;
    reconstructionSlider.max = 800;
    reconstructionSlider.value = 400;

    // Store gap information for the slider logic
    reconstructionSlider.dataset.gapStart = cuts[removedPiece];
    reconstructionSlider.dataset.gapEnd = cuts[removedPiece + 1];
    reconstructionSlider.dataset.actualMin = minX;
    reconstructionSlider.dataset.actualMax = maxX;

    const reconstructionCutLine = document.getElementById('reconstructionCutLine');
    reconstructionCutLine.setAttribute('x1', 400);
    reconstructionCutLine.setAttribute('x2', 400);
    reconstructionCutLine.style.display = 'block';

    const dividerNum = gameState.reconstructionState.divider.slice(1);
    document.getElementById('instructions').innerHTML =
        `<strong>Reconstruction Phase:</strong> Player ${dividerNum}, the gray area shows the removed piece. The remaining cake is now treated as your "whole" (100%) for divide-and-choose.`;
    
    updateReconstructionValues();
}

function calculateTotalRemainingCakeValue() {
    const { start, end } = gameState.reconstructionState.combinedCake;
    return calculateReconstructionPieceValue(start, end);
}

function updateReconstructionValues() {
    const slider = document.getElementById('reconstructionSlider');
    const cutX = parseFloat(slider.value);

    const gapStart = parseFloat(slider.dataset.gapStart);
    const gapEnd = parseFloat(slider.dataset.gapEnd);
    const minX = parseFloat(slider.dataset.actualMin);
    const maxX = parseFloat(slider.dataset.actualMax);

    // Update cut line position (visual only)
    document.getElementById('reconstructionCutLine').setAttribute('x1', cutX);
    document.getElementById('reconstructionCutLine').setAttribute('x2', cutX);

    // Calculate position percentage and values based on "joined" remaining cake logic
    let cutPercent;
    let leftValues, rightValues;

    if (cutX >= gapStart && cutX <= gapEnd) {
        // In the gap - treat as cutting the "joined" remaining cake at the join point
        cutPercent = 50; // Always 50% when cutting at the join

        // Left piece gets everything before the gap, right piece gets everything after the gap
        leftValues = calculateReconstructionPieceValue(minX, gapStart);
        rightValues = calculateReconstructionPieceValue(gapEnd, maxX);

    } else if (cutX < gapStart) {
        // Cutting in the left piece - map to joined cake percentage
        const leftPieceLength = gapStart - minX;
        const rightPieceLength = maxX - gapEnd;
        const totalRemainingLength = leftPieceLength + rightPieceLength;
        const positionInLeft = cutX - minX;
        cutPercent = (positionInLeft / totalRemainingLength) * 100;

        // Calculate values for the cut position
        leftValues = calculateReconstructionPieceValue(minX, cutX);

        // Right side gets: rest of left piece + entire right piece  
        const restOfLeftPiece = calculateReconstructionPieceValue(cutX, gapStart);
        const entireRightPiece = calculateReconstructionPieceValue(gapEnd, maxX);

        rightValues = {
            p1: restOfLeftPiece.p1 + entireRightPiece.p1,
            p2: restOfLeftPiece.p2 + entireRightPiece.p2,
            p3: restOfLeftPiece.p3 + entireRightPiece.p3
        };

    } else {
        // Cutting in the right piece - map to joined cake percentage
        const leftPieceLength = gapStart - minX;
        const rightPieceLength = maxX - gapEnd;
        const totalRemainingLength = leftPieceLength + rightPieceLength;
        const positionInRight = cutX - gapEnd;
        cutPercent = ((leftPieceLength + positionInRight) / totalRemainingLength) * 100;

        // Left side gets: entire left piece + part of right piece
        const entireLeftPiece = calculateReconstructionPieceValue(minX, gapStart);
        const partOfRightPiece = calculateReconstructionPieceValue(gapEnd, cutX);

        leftValues = {
            p1: entireLeftPiece.p1 + partOfRightPiece.p1,
            p2: entireLeftPiece.p2 + partOfRightPiece.p2,
            p3: entireLeftPiece.p3 + partOfRightPiece.p3
        };

        // Right side gets: rest of right piece only
        rightValues = calculateReconstructionPieceValue(cutX, maxX);
    }

    document.getElementById('reconstructionCutPosition').textContent = `${cutPercent.toFixed(1)}%`;
    displayReconstructionValues(leftValues, rightValues);
}

function displayReconstructionValues(leftValues, rightValues) {
    const gapStart = parseFloat(document.getElementById('reconstructionSlider').dataset.gapStart);
    const gapEnd = parseFloat(document.getElementById('reconstructionSlider').dataset.gapEnd);
    const minX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMin);
    const maxX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMax);

    // Calculate total remaining cake for each player (this is what they consider "100%")
    const totalRemainingValues = {
        p1: calculateReconstructionPieceValue(minX, gapStart).p1 + calculateReconstructionPieceValue(gapEnd, maxX).p1,
        p2: calculateReconstructionPieceValue(minX, gapStart).p2 + calculateReconstructionPieceValue(gapEnd, maxX).p2,
        p3: calculateReconstructionPieceValue(minX, gapStart).p3 + calculateReconstructionPieceValue(gapEnd, maxX).p3
    };

    const divider = gameState.reconstructionState.divider;
    const chooser = gameState.reconstructionState.chooser;

    // Scale to make remaining cake = 100 for each player (for display during reconstruction)
    const dividerScale = 100 / totalRemainingValues[divider];
    const chooserScale = 100 / totalRemainingValues[chooser];

    const scaledLeftDivider = leftValues[divider] * dividerScale;
    const scaledRightDivider = rightValues[divider] * dividerScale;
    const scaledLeftChooser = leftValues[chooser] * chooserScale;
    const scaledRightChooser = rightValues[chooser] * chooserScale;

    // Display scaled values (so they add to 100)
    document.getElementById('dividerValues').textContent =
        `Left: ${scaledLeftDivider.toFixed(1)} | Right: ${scaledRightDivider.toFixed(1)}`;
    document.getElementById('chooserValues').textContent =
        `Left: ${scaledLeftChooser.toFixed(1)} | Right: ${scaledRightChooser.toFixed(1)}`;
}

function calculateReconstructionPieceValue(pieceStart, pieceEnd) {
    const values = { p1: 0, p2: 0, p3: 0 };

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

        values[`p${playerIdx + 1}`] = total;
    });

    return values;
}

function makeReconstructionCut() {
    const slider = document.getElementById('reconstructionSlider');
    const cutX = parseFloat(slider.value);

    const gapStart = parseFloat(slider.dataset.gapStart);
    const gapEnd = parseFloat(slider.dataset.gapEnd);
    const minX = parseFloat(slider.dataset.actualMin);
    const maxX = parseFloat(slider.dataset.actualMax);

    // Hide reconstruction controls
    document.getElementById('reconstructionSlider').style.display = 'none';
    document.getElementById('makeReconstructionCutButton').style.display = 'none';

    // Show reconstruction pieces based on the gap logic
    const leftPiece = document.getElementById('reconstructionLeftPiece');
    const rightPiece = document.getElementById('reconstructionRightPiece');

    if (cutX >= gapStart && cutX <= gapEnd) {
        // Cutting in gap - left piece is everything before gap, right piece is everything after gap
        leftPiece.setAttribute('x', minX);
        leftPiece.setAttribute('width', gapStart - minX);
        rightPiece.setAttribute('x', gapEnd);
        rightPiece.setAttribute('width', maxX - gapEnd);
    } else if (cutX < gapStart) {
        // Cutting in left piece
        leftPiece.setAttribute('x', minX);
        leftPiece.setAttribute('width', cutX - minX);
        rightPiece.setAttribute('x', cutX);
        rightPiece.setAttribute('width', gapStart - cutX + (maxX - gapEnd));
    } else {
        // Cutting in right piece
        leftPiece.setAttribute('x', minX);
        leftPiece.setAttribute('width', (gapStart - minX) + (cutX - gapEnd));
        rightPiece.setAttribute('x', cutX);
        rightPiece.setAttribute('width', maxX - cutX);
    }

    leftPiece.style.display = 'block';
    rightPiece.style.display = 'block';

    leftPiece.onclick = () => selectReconstructionPiece('left', cutX);
    rightPiece.onclick = () => selectReconstructionPiece('right', cutX);

    const chooserNum = gameState.reconstructionState.chooser.slice(1);
    document.getElementById('instructions').innerHTML =
        `<strong>Choose Phase:</strong> Player ${chooserNum} (chooser), click on the piece you prefer!`;

    gameState.step = 5;
}

function selectReconstructionPiece(side, cutX) {
    if (gameState.step !== 5) return;

    const leftPiece = document.getElementById('reconstructionLeftPiece');
    const rightPiece = document.getElementById('reconstructionRightPiece');

    const gapStart = parseFloat(document.getElementById('reconstructionSlider').dataset.gapStart);
    const gapEnd = parseFloat(document.getElementById('reconstructionSlider').dataset.gapEnd);
    const minX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMin);
    const maxX = parseFloat(document.getElementById('reconstructionSlider').dataset.actualMax);

    // Reset selections
    leftPiece.classList.remove('selected');
    rightPiece.classList.remove('selected');

    // Calculate the actual values based on the gap logic used in updateReconstructionValues
    let leftValues, rightValues;

    if (cutX >= gapStart && cutX <= gapEnd) {
        leftValues = calculateReconstructionPieceValue(minX, gapStart);
        rightValues = calculateReconstructionPieceValue(gapEnd, maxX);
    } else if (cutX < gapStart) {
        leftValues = calculateReconstructionPieceValue(minX, cutX);
        const restOfLeftPiece = calculateReconstructionPieceValue(cutX, gapStart);
        const entireRightPiece = calculateReconstructionPieceValue(gapEnd, maxX);
        rightValues = {
            p1: restOfLeftPiece.p1 + entireRightPiece.p1,
            p2: restOfLeftPiece.p2 + entireRightPiece.p2,
            p3: restOfLeftPiece.p3 + entireRightPiece.p3
        };
    } else {
        const entireLeftPiece = calculateReconstructionPieceValue(minX, gapStart);
        const partOfRightPiece = calculateReconstructionPieceValue(gapEnd, cutX);
        leftValues = {
            p1: entireLeftPiece.p1 + partOfRightPiece.p1,
            p2: entireLeftPiece.p2 + partOfRightPiece.p2,
            p3: entireLeftPiece.p3 + partOfRightPiece.p3
        };
        rightValues = calculateReconstructionPieceValue(cutX, maxX);
    }

    if (side === 'left') {
        leftPiece.classList.add('selected');
        gameState.reconstructionState.chooserValue = leftValues[gameState.reconstructionState.chooser];
        gameState.reconstructionState.dividerValue = rightValues[gameState.reconstructionState.divider];
    } else {
        rightPiece.classList.add('selected');
        gameState.reconstructionState.chooserValue = rightValues[gameState.reconstructionState.chooser];
        gameState.reconstructionState.dividerValue = leftValues[gameState.reconstructionState.divider];
    }

    console.log('Stored values:', {
        chooser: gameState.reconstructionState.chooser,
        chooserValue: gameState.reconstructionState.chooserValue,
        divider: gameState.reconstructionState.divider,
        dividerValue: gameState.reconstructionState.dividerValue
    });

    setTimeout(showResults, 1000);
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
        algorithmCase: null,
        reconstructionState: {
            active: false,
            remainingPieces: [],
            combinedCake: { start: 0, end: 0 },
            cutPosition: 50,
            selectedPiece: null,
            divider: null,
            chooser: null
        }
    };

    // Clear any stored datasets
    const reconstructionSlider = document.getElementById('reconstructionSlider');
    if (reconstructionSlider) {
        delete reconstructionSlider.dataset.gapStart;
        delete reconstructionSlider.dataset.gapEnd;
        delete reconstructionSlider.dataset.actualMin;
        delete reconstructionSlider.dataset.actualMax;
    }

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
    // Reset reconstruction elements
    document.getElementById('reconstructionInterface').style.display = 'none';
    document.getElementById('reconstructionCutLine').style.display = 'none';
    document.getElementById('reconstructionLeftPiece').style.display = 'none';
    document.getElementById('reconstructionRightPiece').style.display = 'none';

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
        piece.style.filter = 'none';
        piece.style.border = '';
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

    // Reconstruction event listeners - add them directly since elements exist in HTML
    document.getElementById('reconstructionSlider').addEventListener('input', updateReconstructionValues);
    document.getElementById('makeReconstructionCutButton').addEventListener('click', makeReconstructionCut);

    // Initialize
    updateColorValues();
    validateTotals();
    updateGameValues();
});