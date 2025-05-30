---
layout: default
title: "Divide-and-Choose Algorithm"
permalink: /algorithms/divide-and-choose/
---

<div class="algorithm-page">
    <header class="algorithm-header">
        <h1 class="algorithm-title">{{ page.title }}</h1>
        <div class="algorithm-meta">
            <span class="difficulty-badge difficulty-beginner">Beginner</span>
        </div>
    </header>

    <div class="algorithm-content">
        <p>The <strong>divide-and-choose</strong> algorithm is the most fundamental fair division procedure for two-player scenarios.</p>

        <h2>Interactive Demonstration</h2>

        <p>Let's explore the algorithm with a concrete example:</p>

        <div id="python-loading" style="display: none;">
            Loading Python environment...
        </div>

        <py-script>

import matplotlib.pyplot as plt
import numpy as np

print("=== Divide-and-Choose Simulation ===")

# Define player preferences
player1_values = {"left": 0.45, "right": 0.55}  
player2_values = {"left": 0.75, "right": 0.25}  

print(f"Player 1 valuations: Left = {player1_values['left']:.2f}, Right = {player1_values['right']:.2f}")
print(f"Player 2 valuations: Left = {player2_values['left']:.2f}, Right = {player2_values['right']:.2f}")

cut_point = 0.5
print(f"\nPlayer 1 cuts at position {cut_point}")

if player2_values["left"] >= player2_values["right"]:
    p2_choice = "left"
    p2_final_value = player2_values["left"]
    p1_final_value = player1_values["right"]
else:
    p2_choice = "right" 
    p2_final_value = player2_values["right"]
    p1_final_value = player1_values["left"]

print(f"\nPlayer 2 chooses the {p2_choice} piece")
print(f"\nFinal allocation:")
print(f"  Player 1 receives: {p1_final_value:.1%} of total value")
print(f"  Player 2 receives: {p2_final_value:.1%} of total value")

is_proportional = p1_final_value >= 0.5 and p2_final_value >= 0.5
print(f"\nFairness Properties:")
print(f"  ✓ Proportional (both ≥50%): {is_proportional}")
print(f"  ✓ Envy-free: By construction")
        </py-script>

        <h2>Key Properties</h2>

        <div class="theorem">
            <strong>Proportionality Guarantee:</strong> The divide-and-choose algorithm ensures both players receive at least 50% of their subjective valuation.
            <br><em>Proof sketch:</em> Player 1 cuts to create two equally-valued pieces (≥50% each). Player 2 chooses their preferred piece (≥50% by choice).
        </div>

        <div class="theorem">
            <strong>Envy-Freeness:</strong> Neither player envies the other's allocation.
            <br><em>Proof sketch:</em> Player 1 values both pieces equally, so cannot envy Player 2. Player 2 chose their preferred piece, so cannot envy Player 1.
        </div>

        <h2>Extensions</h2>

        <p>This simple algorithm forms the basis for more complex multi-player fair division procedures like:</p>
        <ul>
            <li>Austin's Moving-Knife Procedure</li>
            <li>Selfridge-Conway Algorithm</li>
            <li>Brams-Taylor Procedures</li>
        </ul>
    </div>

    <footer class="algorithm-footer">
        <nav class="algorithm-nav">
            <a href="{{ '/' | relative_url }}" class="nav-link">← Back to Home</a>
        </nav>
    </footer>
</div>

<!-- Pyodide Integration -->
<script src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"></script>
<script>
let pyodide = null;

async function initPyodide() {
    if (pyodide) return pyodide;
    
    const loadingEl = document.getElementById('python-loading');
    if (loadingEl) loadingEl.style.display = 'block';
    
    try {
        pyodide = await loadPyodide();
        await pyodide.loadPackage(['matplotlib', 'numpy']);
        
        pyodide.runPython(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import io
import base64

def show_plot():
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    print(f'<img src="data:image/png;base64,{img_str}">')
    plt.close()

plt.show = show_plot
        `);
        
        if (loadingEl) loadingEl.style.display = 'none';
        
        const pyScriptBlocks = document.querySelectorAll('py-script');
        for (const block of pyScriptBlocks) {
            await processPythonBlock(block);
        }
        
    } catch (error) {
        console.error('Pyodide error:', error);
        if (loadingEl) {
            loadingEl.innerHTML = '<div style="color: red;">Error loading Python: ' + error.message + '</div>';
        }
    }
}

async function processPythonBlock(block) {
    try {
        const code = block.textContent.trim();
        if (!code) return;
        
        const outputDiv = document.createElement('div');
        outputDiv.className = 'python-output';
        
        let output = '';
        const originalLog = console.log;
        console.log = (...args) => {
            output += args.join(' ') + '\n';
            originalLog(...args);
        };
        
        pyodide.runPython(code);
        console.log = originalLog;
        
        if (output.trim()) {
            outputDiv.innerHTML = '<pre>' + output + '</pre>';
        } else {
            outputDiv.innerHTML = '<pre><em>Code executed successfully</em></pre>';
        }
        
        block.parentNode.replaceChild(outputDiv, block);
        
    } catch (error) {
        console.error('Python error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'python-error';
        errorDiv.innerHTML = '<strong>Python Error:</strong><br>' + error.message;
        block.parentNode.replaceChild(errorDiv, block);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('py-script').length > 0) {
        initPyodide();
    }
});
</script>