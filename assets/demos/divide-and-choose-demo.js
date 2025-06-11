// define game state variables
let gameState = {
    step: 1,
    cutPosition: 50,
    selectedPiece: null,
    player1Piece: null,
    player2Piece: null
};

// define color values for each player
const colorValues = {
    player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
    player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
};

// function that updates color values based on user input
function updateColorValues() {
    colorValues.player1 = {
        blue: parseInt(document.getElementById('p1-blue').value) || 0,
        red: parseInt(document.getElementById('p1-red').value) || 0,
        green: parseInt(document.getElementById('p1-green').value) || 0,
        orange: parseInt(document.getElementById('p1-orange').value) || 0,
        pink: parseInt(document.getElementById('p1-pink').value) || 0,
        purple: parseInt(document.getElementById('p1-purple').value) || 0
    };

    colorValues.player2 = {
        blue: parseInt(document.getElementById('p2-blue').value) || 0,
        red: parseInt(document.getElementById('p2-red').value) || 0,
        green: parseInt(document.getElementById('p2-green').value) || 0,
        orange: parseInt(document.getElementById('p2-orange').value) || 0,
        pink: parseInt(document.getElementById('p2-pink').value) || 0,
        purple: parseInt(document.getElementById('p2-purple').value) || 0
    };
}

// function that validates whether user-inputted values add up to 100
function validateTotals() {
    const p1Total = Object.values(colorValues.player1).reduce((a, b) => a + b, 0);
    const p2Total = Object.values(colorValues.player2).reduce((a, b) => a + b, 0);

    const p1TotalEl = document.getElementById('p1-total');
    const p2TotalEl = document.getElementById('p2-total');

    p1TotalEl.innerHTML = `Total: <span class="${p1Total === 100 ? 'valid' : 'error'}">${p1Total}</span>`;
    p2TotalEl.innerHTML = `Total: <span class="${p2Total === 100 ? 'valid' : 'error'}">${p2Total}</span>`;

    const isValid = p1Total === 100 && p2Total === 100;
    document.getElementById('makeCutButton').disabled = !isValid;

    return isValid;
}

// helper to update values
function handleValuationChange() {
    updateColorValues();
    validateTotals();
    if (gameState.step === 1) {
        updateGameValues();
    }
}

// Region boundaries for vertical cuts (x-coordinates)
const regions = {
    blue: { start: 0, end: 600 },
    pink: { start: 0, end: 150 },
    green: { start: 150, end: 600 },
    red: { start: 600, end: 800 },
    orange: { start: 600, end: 800 },
    purple: { start: 150, end: 800 }
};

// function to calculate region valuations
function calculateRegionValues(cutX) {
    const leftValues = {};
    const rightValues = {};

    for (const [color, bounds] of Object.entries(regions)) {
        const regionWidth = bounds.end - bounds.start;

        if (cutX <= bounds.start) {
            // Cut is to the left of this region - entire region goes to right
            leftValues[color] = 0;
            rightValues[color] = 100;
        } else if (cutX >= bounds.end) {
            // Cut is to the right of this region - entire region goes to left
            leftValues[color] = 100;
            rightValues[color] = 0;
        } else {
            // Cut goes through this region (find what percent of the region is cut and store respective percentages)
            const leftWidth = cutX - bounds.start;
            const leftPercent = (leftWidth / regionWidth) * 100;
            leftValues[color] = leftPercent;
            rightValues[color] = 100 - leftPercent;
        }
    }

    return { left: leftValues, right: rightValues };
}

// use region values to calculate how much a player values that section
function calculatePlayerValue(regionValues, player) {
    let total = 0;
    const prefs = colorValues[player];

    for (const [color, amount] of Object.entries(regionValues)) {
        total += (amount / 100) * prefs[color];
    }

    return total;
}

function updateGameValues() {
    const cutX = parseFloat(document.getElementById('cutSlider').value);
    const cutPercent = (cutX / 800) * 100; // Convert slider value to percentage
    gameState.cutPosition = cutPercent;

    // Update cut line position
    document.getElementById('cutLine').setAttribute('x1', cutX);
    document.getElementById('cutLine').setAttribute('x2', cutX);

    // Update position display
    document.getElementById('cutPosition').textContent = `${cutPercent.toFixed(1)}%`;

    // Calculate values
    const regionValues = calculateRegionValues(cutX);
    const p1Left = calculatePlayerValue(regionValues.left, 'player1');
    const p1Right = calculatePlayerValue(regionValues.right, 'player1');
    const p2Left = calculatePlayerValue(regionValues.left, 'player2');
    const p2Right = calculatePlayerValue(regionValues.right, 'player2');

    document.getElementById('player1Value').textContent =
        `Left: ${p1Left.toFixed(1)} | Right: ${p1Right.toFixed(1)}`;
    document.getElementById('player2Value').textContent =
        `Left: ${p2Left.toFixed(1)} | Right: ${p2Right.toFixed(1)}`;
}

function makeCut() {
    if (gameState.step !== 1) return;

    const cutX = parseFloat(document.getElementById('cutSlider').value);

    // Hide controls
    document.getElementById('sliderContainer').style.display = 'none';
    document.getElementById('makeCutButton').style.display = 'none';
    document.getElementById('warning').style.display = 'none';

    // Update piece overlays
    const leftPiece = document.getElementById('leftPiece');
    const rightPiece = document.getElementById('rightPiece');

    leftPiece.setAttribute('width', cutX);
    rightPiece.setAttribute('x', cutX);
    rightPiece.setAttribute('width', 800 - cutX);

    leftPiece.style.display = 'block';
    rightPiece.style.display = 'block';

    leftPiece.onclick = () => selectPiece('left');
    rightPiece.onclick = () => selectPiece('right');

    gameState.step = 2;
    document.getElementById('stepIndicator').textContent =
        'Step 2: Player 2 (Chooser) selects their preferred piece';
    document.getElementById('instructions').innerHTML =
        '<strong>Instructions:</strong> Player 2, click on the piece you prefer!';
}

function selectPiece(side) {
    if (gameState.step !== 2) return;

    const leftPiece = document.getElementById('leftPiece');
    const rightPiece = document.getElementById('rightPiece');

    // Reset selections
    leftPiece.classList.remove('selected');
    rightPiece.classList.remove('selected');

    if (side === 'left') {
        leftPiece.classList.add('selected');
        gameState.player2Piece = 'left';
        gameState.player1Piece = 'right';
    } else {
        rightPiece.classList.add('selected');
        gameState.player2Piece = 'right';
        gameState.player1Piece = 'left';
    }

    setTimeout(showResults, 1000);
}

function showResults() {
    gameState.step = 3;
    document.getElementById('stepIndicator').textContent = 'Algorithm Complete!';
    document.getElementById('instructions').style.display = 'none';

    const cutX = parseFloat(document.getElementById('cutSlider').value);
    const regionValues = calculateRegionValues(cutX);

    const p1Final = calculatePlayerValue(
        regionValues[gameState.player1Piece], 'player1'
    );
    const p2Final = calculatePlayerValue(
        regionValues[gameState.player2Piece], 'player2'
    );

    const results = document.getElementById('results');
    results.style.display = 'block';

    document.getElementById('resultText').innerHTML =
        `Player 1 gets the ${gameState.player1Piece} piece (value: ${p1Final.toFixed(1)})<br>` +
        `Player 2 gets the ${gameState.player2Piece} piece (value: ${p2Final.toFixed(1)})`;

    const proportional = p1Final >= 50 && p2Final >= 50;

    document.getElementById('proportionalResult').textContent =
        proportional ? 'Both players get ≥50% value' : 'Someone gets <50% value';
    document.getElementById('proportionalResult').style.color = proportional ? '#38a169' : '#e53e3e';

    document.getElementById('envyResult').textContent = 'Neither player envies the other';
    document.getElementById('envyResult').style.color = '#38a169';

    document.getElementById('resetButton').style.display = 'inline-block';
}

function resetSimulation() {
    gameState = {
        step: 1,
        cutPosition: 50,
        selectedPiece: null,
        player1Piece: null,
        player2Piece: null
    };

    // Reset slider
    document.getElementById('cutSlider').value = 400;

    // Show/hide elements
    document.getElementById('sliderContainer').style.display = 'block';
    document.getElementById('makeCutButton').style.display = 'inline-block';
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';

    // Reset UI
    document.getElementById('stepIndicator').textContent =
        'Step 1: Player 1 (Divider) adjusts the cutting line';
    document.getElementById('instructions').innerHTML =
        '<strong>Instructions:</strong> Player 1, use the slider below to position your vertical cut through the colored regions.';

    // Hide overlays
    document.getElementById('leftPiece').style.display = 'none';
    document.getElementById('rightPiece').style.display = 'none';
    document.getElementById('leftPiece').classList.remove('selected');
    document.getElementById('rightPiece').classList.remove('selected');

    updateGameValues();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cutSlider').addEventListener('input', updateGameValues);
    document.getElementById('makeCutButton').addEventListener('click', makeCut);
    document.getElementById('resetButton').addEventListener('click', resetSimulation);

    // Add event listeners for all valuation inputs
    ['p1-blue', 'p1-red', 'p1-green', 'p1-orange', 'p1-pink', 'p1-purple',
        'p2-blue', 'p2-red', 'p2-green', 'p2-orange', 'p2-pink', 'p2-purple'].forEach(id => {
            document.getElementById(id).addEventListener('input', handleValuationChange);
        });

    // Initialize
    updateColorValues();
    validateTotals();
    updateGameValues();
});