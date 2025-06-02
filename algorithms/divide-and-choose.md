---
layout: algorithm
title: "Divide-and-Choose Algorithm"
subtitle: "The fundamental fair division procedure for two players"
permalink: /algorithms/divide-and-choose/
math: true

# Algorithm Metadata
difficulty: beginner
players: 2
properties: ["Proportional", "Envy-free", "Strategy-proof"]
algorithm_type: "Discrete"

# Demo Configuration
has_demo: true

# Navigation
next_algorithm:
  title: "Austin's Moving-Knife"
  url: "/algorithms/austins-moving-knife/"
---

<div class="algorithm-metadata">
    <div class="metadata-grid">
        <div class="metadata-item">
            <span class="metadata-label">Players:</span>
            <span class="badge players-badge">2</span>
        </div>
        <div class="metadata-item">
            <span class="metadata-label">Type:</span>
            <span class="badge type-discrete">Discrete</span>
        </div>
        <div class="metadata-item">
            <span class="metadata-label">Complexity:</span>
            <span class="badge complexity-simple">O(1)</span>
        </div>
    </div>
    
    <div class="properties-section">
        <span class="metadata-label">Properties:</span>
        <div class="properties-tags">
            <span class="property-tag proportional">Proportional</span>
            <span class="property-tag envy-free">Envy-free</span>
            <span class="property-tag strategy-proof">Strategy-proof</span>
        </div>
    </div>
</div>

<section class="overview-section">
    <h2>Overview</h2>
    <p class="lead-text">
        The <strong>divide-and-choose</strong> algorithm is the most fundamental fair division procedure for two-player scenarios. Despite its simplicity, it guarantees both proportionality and envy-freeness through an elegant mechanism design.
    </p>
    
    <div class="how-it-works-card">
        <h3>How It Works</h3>
        <div class="steps-container">
            <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                    <strong>Player 1 (Divider)</strong> cuts the resource into two pieces that they value equally
                </div>
            </div>
            <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                    <strong>Player 2 (Chooser)</strong> selects their preferred piece
                </div>
            </div>
            <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                    <strong>Player 1</strong> receives the remaining piece
                </div>
            </div>
        </div>
    </div>
</section>

<section class="mathematical-analysis">
    <h2>Mathematical Analysis</h2>
    
    <div class="definition-card">
        <div class="definition-header">
            <h4>Key Definitions</h4>
        </div>
        <div class="definitions-grid">
            <div class="definition-item">
                <strong>Proportional Allocation:</strong> Each player receives at least \(\frac{1}{n}\) of their subjective valuation of the total resource, where \(n\) is the number of players.
            </div>
            <div class="definition-item">
                <strong>Envy-Free Allocation:</strong> No player prefers another player's allocation to their own.
            </div>
        </div>
    </div>

    <div class="theorem-card">
        <div class="theorem-header">
            <h4>Proportionality Guarantee</h4>
            <span class="theorem-badge">Theorem 1</span>
        </div>
        <div class="theorem-content">
            <p><strong>Statement:</strong> The divide-and-choose algorithm ensures both players receive at least 50% of their subjective valuation.</p>
            
            <div class="proof-section">
                <h5>Proof sketch:</h5>
                <p>Player 1 cuts to create two equally-valued pieces (≥ 50% each). Player 2 chooses their preferred piece (≥ 50% by choice). □</p>
            </div>
        </div>
    </div>

    <div class="theorem-card">
        <div class="theorem-header">
            <h4>Envy-Freeness Guarantee</h4>
            <span class="theorem-badge">Theorem 2</span>
        </div>
        <div class="theorem-content">
            <p><strong>Statement:</strong> Neither player envies the other's allocation.</p>
            
            <div class="proof-section">
                <h5>Proof sketch:</h5>
                <p>Let \(v_1, v_2\) denote the players' valuation functions, and let \(A, B\) be the two pieces after division. Player 1 ensures \(v_1(A) = v_1(B)\), so regardless of Player 2's choice, Player 1 cannot envy. Player 2 chooses \(\max\{v_2(A), v_2(B)\}\), so Player 2 cannot envy Player 1. □</p>
            </div>
        </div>
    </div>
</section>

<section class="formal-analysis">
    <h2>Formal Analysis</h2>
    
    <div class="formal-card">
        <p>For a more rigorous treatment, let \(C\) represent the entire resource (e.g., a cake), and let \(v_i: 2^C \to \mathbb{R}_+\) be player \(i\)'s valuation function, assumed to be:</p>
        
        <div class="assumptions-list">
            <div class="assumption-item">
                <strong>Additive:</strong> \(v_i(X \cup Y) = v_i(X) + v_i(Y)\) for disjoint sets \(X, Y\)
            </div>
            <div class="assumption-item">
                <strong>Normalized:</strong> \(v_i(C) = 1\)
            </div>
        </div>

        <p>The divide-and-choose protocol produces allocation \((X_1, X_2)\) where:</p>

        <div class="formula-box">
            $$v_1(X_1) = \frac{1}{2} \quad \text{and} \quad v_2(X_2) = \max\left\{\frac{v_2(A)}{v_2(C)}, \frac{v_2(B)}{v_2(C)}\right\} \geq \frac{1}{2}$$
        </div>

        <p>where \(A, B\) are the pieces created by Player 1's cut.</p>
    </div>
</section>

<section class="strategic-considerations">
    <h2>Strategic Considerations</h2>
    
    <div class="strategy-card">
        <p>The algorithm is <strong>strategy-proof</strong> for both players:</p>
        
        <div class="strategy-grid">
            <div class="strategy-item">
                <h4>Player 1 Strategy</h4>
                <p>Has no incentive to deviate from cutting equally, as any unequal cut risks losing the more valuable piece</p>
            </div>
            <div class="strategy-item">
                <h4>Player 2 Strategy</h4>
                <p>Should always choose their preferred piece, making truth-telling optimal</p>
            </div>
        </div>

        <div class="formal-note">
            <p><strong>Formal reasoning:</strong> If Player 1 deviates and creates pieces with valuations \(v_1(A) \neq v_1(B)\), then Player 2 might select the piece that Player 1 values more highly, leaving Player 1 worse off than the \(\frac{1}{2}\) guarantee.</p>
        </div>
    </div>
</section>

<section class="complexity-analysis">
    <h2>Complexity Analysis</h2>
    
    <div class="complexity-grid">
        <div class="complexity-item">
            <h4>Time Complexity</h4>
            <div class="complexity-value">O(1)</div>
            <p>Requires exactly one cut and one choice</p>
        </div>
        <div class="complexity-item">
            <h4>Space Complexity</h4>
            <div class="complexity-value">O(1)</div>
            <p>Constant storage requirements</p>
        </div>
        <div class="complexity-item">
            <h4>Query Complexity</h4>
            <div class="complexity-value">O(1)</div>
            <p>Each player makes one decision</p>
        </div>
    </div>
</section>

<section class="extensions-section">
    <h2>Extensions and Generalizations</h2>
    
    <div class="extensions-card">
        <p>This simple two-player algorithm forms the foundation for more complex multi-player procedures:</p>
        
        <div class="extensions-list">
            <div class="extension-item">
                <h4>Austin's Moving-Knife Procedure</h4>
                <p>Extends to three players using continuous cuts</p>
            </div>
            <div class="extension-item">
                <h4>Selfridge-Conway Algorithm</h4>
                <p>Achieves envy-freeness for three players with discrete cuts</p>
            </div>
            <div class="extension-item">
                <h4>Brams-Taylor Procedures</h4>
                <p>Generalize to \(n\) players with complex trimming mechanisms</p>
            </div>
        </div>
    </div>
</section>

<section class="limitations-section">
    <h2>Limitations</h2>
    
    <div class="limitations-card">
        <p>While elegant, divide-and-choose has several limitations:</p>
        
        <div class="limitations-grid">
            <div class="limitation-item">
                <div class="limitation-content">
                    <h4>Two players only</h4>
                    <p>Does not extend naturally to \(n > 2\)</p>
                </div>
            </div>
            <div class="limitation-item">
                <div class="limitation-content">
                    <h4>May not be Pareto efficient</h4>
                    <p>Total welfare might not be maximized</p>
                </div>
            </div>
            <div class="limitation-item">
                <div class="limitation-content">
                    <h4>Requires divisible goods</h4>
                    <p>Cannot handle discrete items directly</p>
                </div>
            </div>
            <div class="limitation-item">
                <div class="limitation-content">
                    <h4>Assumes honest preferences</h4>
                    <p>Players must accurately assess values</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="demo-section">
    <h2>Interactive Demonstration</h2>
    
    <div class="demo-placeholder">
        <h3>Coming Soon</h3>
        <p>Interactive demonstration is currently in development. This will allow you to experiment with different player valuations and see how the algorithm performs in practice.</p>
    </div>
</section>

<style>
/* Ensure compatibility with algorithm layout while preserving our styling */
.algorithm-page .algorithm-content {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
}

/* Removed fade-in animation to prevent rendering issues */

.algorithm-metadata {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0 3rem 0;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.metadata-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.metadata-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.metadata-label {
    font-weight: 600;
    color: #4a5568;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
}

.players-badge {
    background: #dbeafe;
    color: #1e40af;
}

.type-discrete {
    background: #f3e8ff;
    color: #6b21a8;
}

.complexity-simple {
    background: #d1fae5;
    color: #065f46;
}

.properties-section {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
}

.properties-tags {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
}

.property-tag {
    padding: 0.4rem 1rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 600;
}

.property-tag.proportional {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #10b981;
}

.property-tag.envy-free {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #3b82f6;
}

.property-tag.strategy-proof {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
}

.algorithm-content h2 {
    font-size: 1.8rem;
    color: #1a202c;
    margin: 3rem 0 1.5rem 0;
    font-weight: 600;
}

.lead-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
}

.how-it-works-card {
    background: white;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.how-it-works-card h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
}

.steps-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.step-number {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
    line-height: 1.6;
    padding-top: 0.25rem;
}

.definition-card, .theorem-card, .formal-card, .strategy-card, .extensions-card, .limitations-card {
    background: white;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.definition-header, .theorem-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.definition-header h4, .theorem-header h4 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.2rem;
}

.theorem-badge {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.definitions-grid {
    display: grid;
    gap: 1.5rem;
}

.definition-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #4f46e5;
}

.theorem-content {
    line-height: 1.7;
}

.proof-section {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1.5rem;
    border-left: 4px solid #10b981;
}

.proof-section h5 {
    margin: 0 0 0.75rem 0;
    color: #047857;
    font-size: 1rem;
}

.assumptions-list {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0;
}

.assumption-item {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 6px;
    border-left: 3px solid #6366f1;
}

.formula-box {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem 0;
    text-align: center;
    font-size: 1.1rem;
}

.strategy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
}

.strategy-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #7c3aed;
}

.strategy-item h4 {
    color: #6b21a8;
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
}

.formal-note {
    background: #fffbeb;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 2rem;
}

.complexity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.complexity-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e5e7eb;
}

.complexity-item h4 {
    color: #374151;
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
}

.complexity-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4f46e5;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace;
}

.extensions-list {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.extension-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #059669;
}

.extension-item h4 {
    color: #047857;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
}

.limitations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.limitation-item {
    display: flex;
    gap: 1rem;
    background: #fef2f2;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #ef4444;
}

.limitation-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.limitation-content h4 {
    color: #dc2626;
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
}

.limitation-content p {
    margin: 0;
    color: #7f1d1d;
    line-height: 1.5;
}

.demo-placeholder {
    background: linear-gradient(135deg, #f3f4f6, #ffffff);
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    margin: 2rem 0;
}

.demo-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.demo-placeholder h3 {
    color: #374151;
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
}

.demo-placeholder p {
    color: #6b7280;
    margin: 0;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .metadata-grid {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .properties-tags {
        justify-content: center;
    }
    
    .steps-container {
        gap: 1rem;
    }
    
    .step-item {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }
    
    .strategy-grid, .complexity-grid, .limitations-grid {
        grid-template-columns: 1fr;
    }
    
    .definition-card, .theorem-card, .formal-card, .strategy-card, .extensions-card, .limitations-card {
        padding: 1.5rem;
    }
}
</style>