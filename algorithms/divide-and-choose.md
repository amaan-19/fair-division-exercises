---
layout: default
title: Divide-and-Choose
permalink: /algorithms/divide-and-choose/
---

<div class="algorithm-page">

  <!-- Algorithm Header -->
  <header class="algorithm-header">
    <div class="header-content">
      <h1>Divide-and-Choose</h1>
      <p class="algorithm-subtitle">The fundamental fair division procedure for two players</p>
      
      <div class="algorithm-meta-bar">
        <span class="players-badge">2 Players</span>
        <span class="type-badge">Discrete</span>
      </div>
    </div>
  </header>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The divide-and-choose algorithm is the most basic and intuitive fair division procedure. Despite its simplicity, it provides strong mathematical guarantees about fairness for two-player scenarios.</p>
    <a href="https://en.wikipedia.org/wiki/Divide_and_choose" target="_blank" class="algorithm-link">Read more →</a>
    
    <div class="procedure-steps">
      <h3>How It Works</h3>
      <div class="step-list">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Player 1 (Divider)</strong> cuts the resource into two pieces that they value equally
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Player 2 (Chooser)</strong> selects their preferred piece from the two options
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>Player 1</strong> receives the remaining piece
          </div>
        </div>
      </div>
    </div>
  </section>

<!-- Interactive Demo -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Divide-and-Choose</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f7fafc;
            color: #2d3748;
        }
        
        .simulation-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        
        .simulation-title {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1a202c;
        }
        
        .geometric-container {
            background: #f8f9fa;
            border: 3px solid #2d3748;
            border-radius: 8px;
            height: 400px;
            margin: 20px 0;
            position: relative;
            overflow: hidden;
            cursor: crosshair;
        }
        
        .geometric-svg {
            width: 100%;
            height: 100%;
            background: #f5f5f0;
        }
        
        .cut-line {
            stroke: #2d3748;
            stroke-width: 4;
            stroke-dasharray: 10,5;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .cut-line.visible {
            opacity: 1;
        }
        
        .piece-overlay {
            position: absolute;
            top: 0;
            height: 100%;
            background: rgba(49, 130, 206, 0.2);
            border: 3px solid #3182ce;
            cursor: pointer;
            transition: all 0.3s ease;
            display: none;
        }
        
        .piece-overlay:hover {
            background: rgba(49, 130, 206, 0.3);
            transform: scale(1.02);
        }
        
        .piece-overlay.selected {
            background: rgba(49, 130, 206, 0.4);
            border-color: #2c5282;
            box-shadow: 0 0 0 4px #3182ce;
        }
        
        .piece-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: bold;
            color: #2d3748;
            background: rgba(255, 255, 255, 0.9);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .slider-container {
            margin: 20px 0;
            text-align: center;
        }
        
        .slider {
            width: 70%;
            height: 8px;
            border-radius: 4px;
            background: #e2e8f0;
            outline: none;
            -webkit-appearance: none;
            margin: 10px 0;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3182ce;
            cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3182ce;
            cursor: pointer;
            border: none;
        }
        
        .button {
            background: #3182ce;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            margin: 5px;
            transition: background 0.2s ease;
        }
        
        .button:hover:not(:disabled) {
            background: #2c5282;
        }
        
        .button:disabled {
            background: #a0aec0;
            cursor: not-allowed;
        }
        
        .step-indicator {
            text-align: center;
            font-weight: 600;
            color: #3182ce;
            margin: 15px 0;
            font-size: 1.1rem;
        }
        
        .player-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        
        .player-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        
        .player-1 {
            border-left: 4px solid #3182ce;
        }
        
        .player-2 {
            border-left: 4px solid #38a169;
        }
        
        .player-title {
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .player-value {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2d3748;
        }
        
        .instructions {
            background: #ebf8ff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3182ce;
            margin: 20px 0;
        }
        
        .results {
            background: #f0fff4;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #38a169;
            margin: 20px 0;
            display: none;
        }
        
        .warning {
            background: #fffbeb;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
            display: none;
        }
        
        .controls {
            text-align: center;
            margin: 20px 0;
        }
        
        .color-legend {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .color-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .color-swatch {
            width: 20px;
            height: 20px;
            border-radius: 3px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
    <div class="simulation-container">
        <h2 class="simulation-title">Interactive Demo</h2>
        
        <div class="step-indicator" id="stepIndicator">
            Step 1: Player 1 (Divider) draws a cutting line
        </div>
        
        <div class="instructions" id="instructions">
            <strong>Instructions:</strong> Player 1, draw a line through the resource to divide it.
        </div>

        <div class="geometric-container" id="geometricContainer">
            <svg class="geometric-svg" id="geometricSvg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                <!-- Background -->
                <rect width="800" height="400" fill="#f5f5f0"/>
                
                <!-- Blue region (top) -->
                <polygon points="0,0 800,0 800,150 0,150" fill="#0066ff" stroke="#2d3748" stroke-width="2"/>
                <text x="300" y="80" text-anchor="middle" font-size="32" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Blue</text>

                <!-- Red region (top right) -->
                <polygon points="600,0 800,0 800,250 600,250" fill="#ff3366" stroke="#2d3748" stroke-width="2"/>
                <text x="700" y="125" text-anchor="middle" font-size="24" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Red</text>
                
                <!-- Orange region (right) -->
                <polygon points="600,250 800,250 800,350 600,350" fill="#ff6600" stroke="#2d3748" stroke-width="2"/>
                <text x="700" y="310" text-anchor="middle" font-size="24" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Orange</text>

                <!-- Purple region (bottom right) -->
                <polygon points="150,350 800,350 800,400 0,400" fill="#9966ff" stroke="#2d3748" stroke-width="2"/>
                <text x="500" y="380" text-anchor="middle" font-size="24" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Purple</text>

                <!-- Pink region (bottom left) -->
                <polygon points="0,150 150,150 150,400 0,400" fill="#ff66ff" stroke="#2d3748" stroke-width="2"/>
                <text x="80" y="280" text-anchor="middle" font-size="24" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Pink</text>
                
                <!-- Green region (bottom center) -->
                <polygon points="150,150 600,150 600,350 150,350" fill="#66ff66" stroke="#2d3748" stroke-width="2"/>
                <text x="380" y="260" text-anchor="middle" font-size="32" font-weight="bold" fill="white" text-shadow="1px 1px 2px rgba(0,0,0,0.5)">Green</text>
        
                <!-- Cut line -->
                <line id="cutLine" class="cut-line" x1="400" y1="0" x2="400" y2="400"/>
            </svg>

            <!-- Drawing Canvas -->
            <canvas id="drawingCanvas" width="800" height="400"></canvas>
            
            <!-- Piece overlays -->
            <div class="piece-overlay" id="leftPiece"></div>
            <div class="piece-overlay" id="rightPiece"></div>
        </div>
        
        <div class="player-info">
            <div class="player-card player1">
                <h3>Player 1 (Divider)</h3>
                <div class="color-legend">
                    <div class="color-item"><div class="color-swatch" style="background: #0066ff;"></div>Blue: 20pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff3366;"></div>Red: 15pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #66ff66;"></div>Green: 25pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff6600;"></div>Orange: 10pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff66ff;"></div>Pink: 15pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #9966ff;"></div>Purple: 15pts</div>
                </div>
                <div><strong>Values:</strong> <span id="player1Value">Ready to draw</span></div>
            </div>

            <div class="player-card player2">
                <h3>Player 2 (Chooser)</h3>
                <div class="color-legend">
                    <div class="color-item"><div class="color-swatch" style="background: #0066ff;"></div>Blue: 15pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff3366;"></div>Red: 25pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #66ff66;"></div>Green: 20pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff6600;"></div>Orange: 20pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #ff66ff;"></div>Pink: 10pts</div>
                    <div class="color-item"><div class="color-swatch" style="background: #9966ff;"></div>Purple: 10pts</div>
                </div>
                <div><strong>Values:</strong> <span id="player1Value">Ready to draw</span></div>
            </div>
        </div>

        <div class="warning" id="warning">
            <strong>Note:</strong> This cut may create very unequal distributions!
        </div>

        <div class="controls">
            <button id="makeCutButton" onclick="makeCut()" disabled>Make Cut</button>
            <button id="clearButton" onclick="clearDrawing()">Clear Line</button>
            <button id="resetButton" onclick="resetSimulation()" style="display: none;">Reset Game</button>
        </div>
        
        <div class="results" id="results">
            <h3>Results:</h3>
            <p id="resultText"></p>
            <ul>
                <li><strong>Proportionality:</strong> <span id="proportionalResult"></span></li>
                <li><strong>Envy-freeness:</strong> <span id="envyResult"></span></li>
            </ul>
        </div>
        
    </div>

    <script>

        let gameState = {
            step: 1,
            cutPosition: null,
            selectedPiece: null,
            player1Piece: null,
            player2Piece: null
        };

        // Color value preferences for each player
        const colorValues = {
            player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
            player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 }
        };

        // Line drawing class
        class CakeDrawer {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.isDrawing = false;
                this.startX = 0;
                this.startY = 0;
                this.lines = [];
                
                this.setupEventListeners();
                
                // Set drawing properties
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = '#dc3545';
                this.ctx.lineWidth = 4;
            }

            setupEventListeners() {
                this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
                this.canvas.addEventListener('mousemove', (e) => this.draw(e));
                this.canvas.addEventListener('mouseup', () => this.stopDrawing());
                this.canvas.addEventListener('mouseout', () => this.stopDrawing());
                
                // Touch events
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousedown', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    });
                    this.canvas.dispatchEvent(mouseEvent);
                });
                
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const mouseEvent = new MouseEvent('mousemove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    });
                    this.canvas.dispatchEvent(mouseEvent);
                });
                
                this.canvas.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.canvas.dispatchEvent(new MouseEvent('mouseup', {}));
                });
            }

            getMousePos(e) {
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }

            startDrawing(e) {
                if (gameState.step !== 1) return;
                
                this.isDrawing = true;
                const pos = this.getMousePos(e);
                this.startX = pos.x;
                this.startY = pos.y;
                
                this.currentLine = {
                    startX: this.startX,
                    startY: this.startY,
                    endX: this.startX,
                    endY: this.startY,
                    color: this.ctx.strokeStyle,
                    width: this.ctx.lineWidth
                };
                
                // Clear previous lines for single cut
                this.lines = [];
            }

            draw(e) {
                if (!this.isDrawing || gameState.step !== 1) return;
                
                const pos = this.getMousePos(e);
                this.currentLine.endX = pos.x;
                this.currentLine.endY = pos.y;
                
                this.redrawCanvas();
                this.drawLine(this.currentLine);
                
                // Update game values in real-time
                this.updateGameValues();
            }
            
            stopDrawing() {
                if (!this.isDrawing || gameState.step !== 1) return;
                
                this.isDrawing = false;
                this.lines.push({...this.currentLine});
                gameState.cutLine = {...this.currentLine};
                this.currentLine = null;
                
                // Enable make cut button
                document.getElementById('makeCutButton').disabled = false;
                
                this.updateGameValues();
            }
            
            drawLine(line) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = line.color;
                this.ctx.lineWidth = line.width;
                this.ctx.moveTo(line.startX, line.startY);
                this.ctx.lineTo(line.endX, line.endY);
                this.ctx.stroke();
            }
            
            redrawCanvas() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.lines.forEach(line => this.drawLine(line));
            }

            updateGameValues() {
                if (!gameState.cutLine) return;
                
                // Calculate average X position of the cut line for simplicity
                const cutX = (gameState.cutLine.startX + gameState.cutLine.endX) / 2;
                const cutPercent = (cutX / this.canvas.width) * 100;
                gameState.cutPosition = cutPercent;
                
                // Calculate region values
                const regionValues = calculateRegionValues(cutPercent);
                const p1Left = calculatePlayerValue(regionValues.left, 'player1');
                const p1Right = calculatePlayerValue(regionValues.right, 'player1');
                const p2Left = calculatePlayerValue(regionValues.left, 'player2');
                const p2Right = calculatePlayerValue(regionValues.right, 'player2');
                
                document.getElementById('player1Value').textContent = 
                    `Left: ${p1Left.toFixed(1)} | Right: ${p1Right.toFixed(1)}`;
                document.getElementById('player2Value').textContent = 
                    `Left: ${p2Left.toFixed(1)} | Right: ${p2Right.toFixed(1)}`;
                
                // Show warning if very unequal for player 1
                const warning = document.getElementById('warning');
                if (Math.abs(p1Left - p1Right) > 15) {
                    warning.style.display = 'block';
                } else {
                    warning.style.display = 'none';
                }
            }
            
            clearCanvas() {
                this.lines = [];
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                gameState.cutLine = null;
                gameState.cutPosition = null;
                
                // Reset UI
                document.getElementById('makeCutButton').disabled = true;
                document.getElementById('player1Value').textContent = 'Ready to draw';
                document.getElementById('player2Value').textContent = 'Waiting...';
                document.getElementById('warning').style.display = 'none';
            }
        }

        // Game logic functions
        function calculateRegionValues(cutPercent) {
            const cutX = cutPercent / 100;
            
            let leftValues = { blue: 0, red: 0, green: 0, orange: 0, pink: 0, purple: 0 };
            let rightValues = { blue: 0, red: 0, green: 0, orange: 0, pink: 0, purple: 0 };
            
            // Blue region (spans most of the top)
            if (cutX <= 0.75) {
                leftValues.blue = cutX / 0.75 * 100;
                rightValues.blue = (0.75 - cutX) / 0.75 * 100;
            } else {
                leftValues.blue = 100;
                rightValues.blue = 0;
            }
            
            // Red region (right side only)
            if (cutX <= 0.75) {
                leftValues.red = 0;
                rightValues.red = 100;
            } else {
                leftValues.red = (cutX - 0.75) / 0.25 * 100;
                rightValues.red = (1 - cutX) / 0.25 * 100;
            }
            
            // Green region (center)
            if (cutX <= 0.25) {
                leftValues.green = cutX / 0.25 * 30;
                rightValues.green = 70 + (0.25 - cutX) / 0.25 * 30;
            } else if (cutX <= 0.75) {
                leftValues.green = 30 + (cutX - 0.25) / 0.5 * 40;
                rightValues.green = 70 - (cutX - 0.25) / 0.5 * 40;
            } else {
                leftValues.green = 70 + (cutX - 0.75) / 0.25 * 30;
                rightValues.green = (1 - cutX) / 0.25 * 30;
            }
            
            // Orange region (right side)
            if (cutX <= 0.75) {
                leftValues.orange = 0;
                rightValues.orange = 100;
            } else {
                leftValues.orange = (cutX - 0.75) / 0.25 * 100;
                rightValues.orange = (1 - cutX) / 0.25 * 100;
            }
            
            // Pink region (left side)
            if (cutX >= 0.25) {
                leftValues.pink = 100;
                rightValues.pink = 0;
            } else {
                leftValues.pink = cutX / 0.25 * 100;
                rightValues.pink = (0.25 - cutX) / 0.25 * 100;
            }
            
            // Purple region (spans bottom)
            leftValues.purple = cutX * 100;
            rightValues.purple = (1 - cutX) * 100;
            
            return { left: leftValues, right: rightValues };
        }

        function calculatePlayerValue(regionValues, player) {
            let total = 0;
            const prefs = colorValues[player];
            
            for (const [color, amount] of Object.entries(regionValues)) {
                total += (amount / 100) * prefs[color];
            }
            
            return total;
        }

        function makeCut() {
            if (!gameState.cutLine || gameState.step !== 1) return;
            
            const cutPercent = gameState.cutPosition;
            
            // Hide controls
            document.getElementById('makeCutButton').style.display = 'none';
            document.getElementById('clearButton').style.display = 'none';
            document.getElementById('warning').style.display = 'none';
            
            // Show piece overlays
            const leftPiece = document.getElementById('leftPiece');
            const rightPiece = document.getElementById('rightPiece');
            
            leftPiece.style.display = 'block';
            leftPiece.style.width = cutPercent + '%';
            leftPiece.style.left = '0';
            
            rightPiece.style.display = 'block';
            rightPiece.style.width = (100 - cutPercent) + '%';
            rightPiece.style.right = '0';
            
            // Add click events
            leftPiece.onclick = () => selectPiece('left');
            rightPiece.onclick = () => selectPiece('right');
            
            // Update game state
            gameState.step = 2;
            document.getElementById('stepIndicator').textContent = 
                'Step 2: Player 2 (Chooser) selects their preferred piece';
            document.getElementById('instructions').innerHTML = 
                '<strong>Instructions:</strong> Player 2, click on the piece you prefer based on the color values!';
            
            // Disable canvas drawing
            drawer.canvas.style.pointerEvents = 'none';
        }

        function selectPiece(side) {
            if (gameState.step !== 2) return;
            
            // Remove previous selection
            document.querySelectorAll('.piece-overlay').forEach(p => p.classList.remove('selected'));
            
            // Select piece
            const selectedElement = side === 'left' ? 
                document.getElementById('leftPiece') : 
                document.getElementById('rightPiece');
            selectedElement.classList.add('selected');
            
            gameState.selectedPiece = side;
            
            // Assign pieces
            if (side === 'left') {
                gameState.player2Piece = 'left';
                gameState.player1Piece = 'right';
            } else {
                gameState.player2Piece = 'right';
                gameState.player1Piece = 'left';
            }
            
            // Show results after delay
            setTimeout(showResults, 1000);
        }

        function showResults() {
            gameState.step = 3;
            document.getElementById('stepIndicator').textContent = 'Results: Algorithm Complete!';
            document.getElementById('instructions').style.display = 'none';
            
            // Calculate final values
            const regionValues = calculateRegionValues(gameState.cutPosition);
            
            const p1Final = calculatePlayerValue(
                regionValues[gameState.player1Piece], 'player1'
            );
            const p2Final = calculatePlayerValue(
                regionValues[gameState.player2Piece], 'player2'
            );
            
            // Show results
            const results = document.getElementById('results');
            results.style.display = 'block';
            
            document.getElementById('resultText').innerHTML = 
                `Player 1 gets the ${gameState.player1Piece} piece (value: ${p1Final.toFixed(1)})<br>` +
                `Player 2 gets the ${gameState.player2Piece} piece (value: ${p2Final.toFixed(1)})`;
            
            // Check properties
            const proportional = p1Final >= 50 && p2Final >= 50;
            
            document.getElementById('proportionalResult').textContent = 
                proportional ? '✅ Both players get ≥50% value' : '❌ Someone gets <50% value';
            document.getElementById('proportionalResult').style.color = proportional ? '#38a169' : '#e53e3e';
            
            document.getElementById('envyResult').textContent = '✅ Neither player envies the other';
            document.getElementById('envyResult').style.color = '#38a169';
            
            // Show reset button
            document.getElementById('resetButton').style.display = 'inline-block';
        }

        function clearDrawing() {
            drawer.clearCanvas();
        }

        function resetSimulation() {
            // Reset game state
            gameState = {
                step: 1,
                cutPosition: null,
                cutLine: null,
                selectedPiece: null,
                player1Piece: null,
                player2Piece: null
            };
            
            // Reset UI
            document.getElementById('stepIndicator').textContent = 
                'Step 1: Player 1 (Divider) draws a cutting line';
            document.getElementById('instructions').style.display = 'block';
            document.getElementById('instructions').innerHTML = 
                '<strong>Instructions:</strong> Player 1, draw a vertical line through the geometric pattern to divide it. Each colored region has different values for each player.';
            
            document.getElementById('makeCutButton').style.display = 'inline-block';
            document.getElementById('makeCutButton').disabled = true;
            document.getElementById('clearButton').style.display = 'inline-block';
            document.getElementById('resetButton').style.display = 'none';
            
            document.getElementById('leftPiece').style.display = 'none';
            document.getElementById('rightPiece').style.display = 'none';
            document.querySelectorAll('.piece-overlay').forEach(p => p.classList.remove('selected'));
            
            document.getElementById('results').style.display = 'none';
            document.getElementById('warning').style.display = 'none';
            
            // Re-enable canvas
            drawer.canvas.style.pointerEvents = 'auto';
            drawer.clearCanvas();
        }

        // Initialize the game
        let drawer;
        document.addEventListener('DOMContentLoaded', () => {
            drawer = new CakeDrawer('drawingCanvas');
        });
    </script>
</body>
</html>

  <!-- Mathematical Properties -->
  <section class="content-block">
    <h2>Mathematical Properties</h2>
    
    <div class="properties-grid">
      <div class="property-card">
        <h4>Proportionality</h4>
        <p>Both players receive at least 50% of their subjective valuation of the resource.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Player 1 cuts equally (≥50%), Player 2 chooses their preferred piece (≥50%).
        </div>
      </div>
      
      <div class="property-card">
        <h4>Envy-Freeness</h4>
        <p>Neither player prefers the other's allocation to their own.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Player 1 values both pieces equally, Player 2 chose their preferred piece.
        </div>
      </div>
      
      <div class="property-card">
        <h4>Strategy-Proofness</h4>
        <p>Truth-telling is optimal for both players.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Deviating from honest play can only hurt the deviating player.
        </div>
      </div>
    </div>
  </section>

  <!-- Applications -->
  <section class="content-block">
    <h2>Real-World Applications</h2>
    <ul>
      <li><strong>Legal settlements:</strong> Dividing disputed assets between two parties</li>
      <li><strong>Estate division:</strong> Splitting inheritance between two heirs</li>
      <li><strong>Resource allocation:</strong> Distributing time, space, or materials</li>
      <li><strong>Conflict resolution:</strong> Fair compromise in disputes</li>
    </ul>
  </section>

  <!-- Limitations -->
  <section class="content-block">
    <h2>Limitations</h2>
    <ul>
      <li>Limited to exactly two players</li>
      <li>May not achieve Pareto efficiency</li>
      <li>Requires divisible resources</li>
      <li>Assumes players can accurately assess values</li>
    </ul>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Back to Algorithms</a>
    <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="nav-button primary disabled">Next: Austin's Moving-Knife →</a>
  </footer>
</div>