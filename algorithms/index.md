---
layout: default
title: "Algorithms"
permalink: /algorithms/
---

<div class="algorithms-page">
    <header class="page-header">
        <h1>Fair Division Algorithms</h1>
        <p class="page-description">
            Explore different algorithmic approaches to fair division, from simple two-player procedures to complex multi-party mechanisms.
        </p>
    </header>

    <div class="algorithms-grid">
        <div class="algorithm-card">
            <div class="algorithm-header">

                <h3><a href="/algorithms/divide-and-choose/">Divide-and-Choose</a></h3>
                <div class="algorithm-badges">
                    <span class="difficulty-badge difficulty-beginner">Beginner</span>
                    <span class="players-badge">2 Players</span>
                </div>

            </div>

            <div class="algorithm-content">
                <p>The most fundamental fair division procedure. One player divides, the other chooses. Guarantees both proportionality and envy-freeness.</p>
                
                <div class="algorithm-properties">
                    <h4>Properties:</h4>
                    <ul>
                        <li>✓ Proportional</li>
                        <li>✓ Envy-free</li>
                        <li>✓ Strategy-proof for divider</li>
                    </ul>
                </div>
                <div class="algorithm-complexity">
                    <h4>Complexity:</h4>
                    <strong>Time:</strong> O(1) cuts • <strong>Space:</strong> O(1)
                </div>
            </div>

            <div class="algorithm-footer">
                <a href="/algorithms/divide-and-choose/" class="try-algorithm-btn">Explore Algorithms →</a>
            </div>
        </div>

        <div class="algorithm-card coming-soon">
            <div class="algorithm-header">
                <h3>Austin's Moving Knife</h3>
                <div class="algorithm-badges">
                    <span class="difficulty-badge difficulty-intermediate">Intermediate</span>
                    <span class="players-badge">n Players</span>
                    <span class="coming-soon-badge">Coming Soon</span>
                </div>
            </div>
            <div class="algorithm-content">
                <p>Extends divide-and-choose with a moving-knife mechanism.</p>
                
                <div class="algorithm-properties">
                    <h4>Properties:</h4>
                    <ul>
                       
                    </ul>
                </div>

                <div class="algorithm-complexity">
                </div>
            </div>
        </div>
    </div>

    <div class="algorithm-comparison">
        <h2>Algorithm Comparison</h2>
        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Algorithm</th>
                        <th>Players</th>
                        <th>Proportional</th>
                        <th>Envy-Free</th>
                        <th>Cuts Required</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Divide-and-Choose</strong></td>
                        <td>2</td>
                        <td><span class="property-yes">✓</span></td>
                        <td><span class="property-yes">✓</span></td>
                        <td>1</td>
                        <td><span class="difficulty-beginner">Beginner</span></td>
                    </tr>
                    <tr class="coming-soon-row">
                        <td><strong>Austin's Moving Knife</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
.algorithms-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-header h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.page-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

.algorithms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.algorithm-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.algorithm-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.algorithm-card.coming-soon {
    opacity: 0.7;
    background: #f8f9fa;
}

.algorithm-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #eee;
}

.algorithm-header h3 {
    margin: 0 0 1rem 0;
    font-size: 1.4rem;
}

.algorithm-header h3 a {
    color: #2c3e50;
    text-decoration: none;
}

.algorithm-header h3 a:hover {
    color: #007acc;
}

.algorithm-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.difficulty-badge, .players-badge, .coming-soon-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.players-badge {
    background: #e3f2fd;
    color: #1565c0;
}

.coming-soon-badge {
    background: #fff3e0;
    color: #ef6c00;
}

.algorithm-content {
    padding: 1.5rem;
}

.algorithm-properties {
    margin: 1rem 0;
}

.algorithm-properties h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #555;
}

.algorithm-properties ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
}

.algorithm-properties li {
    color: #28a745;
    font-size: 0.9rem;
    margin: 0.25rem 0;
}

.algorithm-complexity {
    font-size: 0.9rem;
    color: #666;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
}

.algorithm-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    background: #fafafa;
}

.try-algorithm-btn {
    display: inline-block;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    transition: transform 0.2s ease;
}

.try-algorithm-btn:hover {
    transform: scale(1.05);
    text-decoration: none;
    color: white;
}

.algorithm-comparison {
    margin: 3rem 0;
}

.algorithm-comparison h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.comparison-table-wrapper {
    overflow-x: auto;
}

.comparison-table {
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.comparison-table th {
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
}

.comparison-table td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.coming-soon-row {
    opacity: 0.6;
}

.property-yes {
    color: #28a745;
    font-weight: bold;
}

.property-no {
    color: #dc3545;
    font-weight: bold;
}

.learning-path {
    margin: 3rem 0;
}

.learning-path h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
}

.path-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.path-step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.step-number {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-content h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.step-content p {
    margin: 0;
    color: #666;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .algorithms-page {
        padding: 1rem;
    }
    
    .algorithms-grid {
        grid-template-columns: 1fr;
    }
    
    .path-steps {
        grid-template-columns: 1fr;
    }
}
</style>