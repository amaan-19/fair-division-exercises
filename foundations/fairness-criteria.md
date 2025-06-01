---
layout: foundation
title: "Fairness Criteria"
subtitle: "Mathematical definitions of what makes a division fair"
permalink: /foundations/fairness-criteria/
math: true

# Page metadata
section: foundations
next_page:
  title: "Divide-and-Choose Algorithm"
  url: "/algorithms/divide-and-choose/"
---

<div class="foundations-page">

    <div class="foundations-content">
        <section class="intro-section fade-in">
            <p class="lead-text">
                Fair division theory provides precise mathematical definitions for what constitutes a "fair" allocation. These criteria serve as benchmarks for evaluating and designing division algorithms.
            </p>
        </section>

        <section class="criteria-section fade-in">
            <h2>Core Fairness Criteria</h2>
            
            <div class="criterion-card">
                <div class="criterion-header">
                    <h3>Proportionality</h3>
                    <span class="criterion-badge basic">Basic</span>
                </div>
                <div class="criterion-content">
                    <div class="definition">
                        <strong>Proportional Allocation:</strong> Each player receives at least $\frac{1}{n}$ of their subjective valuation of the total resource, where n is the number of players.
                    </div>
                    
                    <p><strong>Mathematical formulation:</strong> For player $i$, let $v_i(X)$ denote their valuation of piece $X$. An allocation $(X_1, X_2, \ldots, X_n)$ is proportional if:</p>

                    <div class="formula">
                        $$v_i(X_i) \geq \frac{1}{n} \times v_i(\text{total resource}) \quad \forall i \in \{1,2,\ldots,n\}$$
                    </div>

                    {% include foundations/proportionality_interactive.html %}

                    <div class="criterion-examples">
                        <h4>Examples:</h4>
                        <ul>
                            <li><strong>Two players:</strong> Each must receive ≥50% of their subjective value</li>
                            <li><strong>Three players:</strong> Each must receive ≥33.3% of their subjective value</li>
                            <li><strong>n players:</strong> Each must receive ≥(100/n)% of their subjective value</li>
                        </ul>
                    </div>

                    <div class="criterion-properties">
                        <h4>Key Properties:</h4>
                        <ul>
                            <li> Guarantees minimum acceptable share</li>
                            <li> Achievable for any number of players</li>
                            <li> Relatively easy to implement</li>
                            <li> Does NOT prevent envy between players</li>
                        </ul>
                    </div>
                </div>
            </div>

           <div class="criterion-card">
                <div class="criterion-header">
                    <h3>Envy-Freeness</h3>
                    <span class="criterion-badge strong">Strong</span>
                </div>
                <div class="criterion-content">
                    <div class="definition">
                        <strong>Envy-Free Allocation:</strong> No player prefers another player's allocation to their own.
                    </div>
        
                    <p><strong>Mathematical formulation:</strong> An allocation $(X_1, X_2, \ldots, X_n)$ is envy-free if:</p>
                    
                    <div class="formula">
                        $$v_i(X_i) \geq v_i(X_j) \quad \text{for all } i,j \in \{1,2,\ldots,n\}$$
                    </div>

                    {% include foundations/envy_freeness_interactive.html %}

                    <div class="criterion-examples">
                        <h4>Intuition:</h4>
                        <p>Each player is satisfied with their piece and wouldn't want to trade with anyone else. This is a stronger condition than proportionality.</p>
                    </div>

                    <div class="criterion-properties">
                        <h4>Key Properties:</h4>
                        <ul>
                            <li>✓ Eliminates jealousy between players</li>
                            <li>✓ Automatically implies proportionality</li>
                            <li>⚠ More difficult to achieve than proportionality</li>
                            <li>⚠ May require complex algorithms for n ≥ 3</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="criterion-card">
                <div class="criterion-header">
                    <h3>Pareto Efficiency</h3>
                    <span class="criterion-badge optimal">Optimal</span>
                </div>
                <div class="criterion-content">
                    <div class="definition">
                        <strong>Pareto Efficient Allocation:</strong> No alternative allocation exists where at least one player is better off and no player is worse off.
                    </div>
                    
                    <p><strong>Mathematical formulation:</strong> An allocation $X$ is Pareto efficient if there is no allocation $Y$ such that:</p>
                    
                    <div class="formula">
                        $$v_i(Y_i) \geq v_i(X_i) \text{ for all } i, \text{ and } v_j(Y_j) > v_j(X_j) \text{ for some } j$$
                    </div>

                    <div class="criterion-examples">
                        <h4>Economic Interpretation:</h4>
                        <p>The allocation maximizes total welfare—no "value" is wasted or left on the table.</p>
                    </div>

                    <div class="criterion-properties">
                        <h4>Key Properties:</h4>
                        <ul>
                            <li>✓ Maximizes overall satisfaction</li>
                            <li>✓ Prevents wasteful allocations</li>
                            <li>⚠ May conflict with fairness criteria</li>
                            <li>⚠ Does not address distribution of benefits</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="criterion-card">
                <div class="criterion-header">
                    <h3>Strategy-Proofness</h3>
                    <span class="criterion-badge game">Game-Theoretic</span>
                </div>
                <div class="criterion-content">
                    <div class="definition">
                        <strong>Strategy-Proof Mechanism:</strong> No player can benefit by misrepresenting their true preferences.
                    </div>
                    
                    <p><strong>Game-theoretic formulation:</strong> A mechanism is strategy-proof if truth-telling is a dominant strategy for all players.</p>

                    <div class="criterion-examples">
                        <h4>Practical Importance:</h4>
                        <p>Players have no incentive to lie about their valuations, making the mechanism robust in real-world applications.</p>
                    </div>

                    <div class="criterion-properties">
                        <h4>Key Properties:</h4>
                        <ul>
                            <li>✓ Encourages honest behavior</li>
                            <li>✓ Simplifies decision-making for players</li>
                            <li>✓ Robust against strategic manipulation</li>
                            <li>⚠ Often conflicts with other desirable properties</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="relationships-section fade-in">
            <h2>Relationships Between Criteria</h2>
            
            <div class="relationship-diagram">
                <div class="relationship-item">
                    <h4>Envy-Free $\Rightarrow$ Proportional</h4>
                    <p>Any envy-free allocation is automatically proportional, but not vice versa.</p>
                </div>
                
                <div class="relationship-item">
                    <h4>Fairness $\leftrightarrow$ Efficiency Trade-offs</h4>
                    <p>Pareto efficiency may conflict with envy-freeness or proportionality.</p>
                </div>
                
                <div class="relationship-item">
                    <h4>Strategy-Proofness Constraints</h4>
                    <p>Achieving strategy-proofness often limits the fairness criteria that can be satisfied.</p>
                </div>
            </div>

            <div class="theorem">
                <strong>Theorem (Envy-Free Implies Proportional):</strong> If an allocation is envy-free, then it is also proportional.
                <br><br><em>Proof sketch:</em> Suppose allocation $X$ is envy-free. For any player $i$, we have $v_i(X_i) \geq v_i(X_j)$ for all $j$. In particular, 
                $$v_i(X_i) \geq \frac{1}{n}\sum_{j=1}^n v_i(X_j) = \frac{1}{n}v_i(\text{total resource})$$
                establishing proportionality. $\square$
            </div>
        </section>

        <section class="algorithms-preview fade-in">
            <h2>Criteria in Practice</h2>
            
            <div class="algorithm-fairness-table">
                <table class="fairness-comparison">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Proportional</th>
                            <th>Envy-Free</th>
                            <th>Pareto Efficient</th>
                            <th>Strategy-Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Divide-and-Choose</strong></td>
                            <td><span class="status-yes">✓</span></td>
                            <td><span class="status-yes">✓</span></td>
                            <td><span class="status-maybe">?</span></td>
                            <td><span class="status-partial">Partial</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-notes">
                <p><strong>Legend:</strong></p>
                <ul>
                    <li><span class="status-yes">✓</span> - Always satisfied</li>
                    <li><span class="status-no">✗</span> - Not guaranteed</li>
                    <li><span class="status-maybe">?</span> - Depends on player preferences</li>
                    <li><span class="status-partial">Partial</span> - Satisfied for some players</li>
                </ul>
            </div>
        </section>

        <section class="real-world-section fade-in">
            <h2>Real-World Applications</h2>
            
            <div class="application-grid">
                <div class="application-card">
                    <h4>Legal Settlements</h4>
                    <p>Courts use fairness criteria when dividing assets in divorce proceedings or inheritance disputes.</p>
                    <div class="application-criteria">
                        <span class="criterion-tag">Proportional</span>
                        <span class="criterion-tag">Envy-Free</span>
                    </div>
                </div>
                
                <div class="application-card">
                    <h4>International Negotiations</h4>
                    <p>Territory divisions and resource allocations between nations must satisfy multiple fairness constraints.</p>
                    <div class="application-criteria">
                        <span class="criterion-tag">Proportional</span>
                        <span class="criterion-tag">Strategy-Proof</span>
                    </div>
                </div>
                
                <div class="application-card">
                    <h4>Corporate Restructuring</h4>
                    <p>When companies split or merge, asset division must be fair to all stakeholders.</p>
                    <div class="application-criteria">
                        <span class="criterion-tag">Pareto Efficient</span>
                        <span class="criterion-tag">Proportional</span>
                    </div>
                </div>
                
                <div class="application-card">
                    <h4>Public Resource Allocation</h4>
                    <p>Governments divide budgets and resources among different constituencies and programs.</p>
                    <div class="application-criteria">
                        <span class="criterion-tag">Proportional</span>
                        <span class="criterion-tag">Envy-Free</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
.foundations-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: #666;
    max-width: 700px;
    margin: 1rem auto 0;
    line-height: 1.6;
    text-align: center;
}

.lead-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 3rem;
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.criteria-section {
    margin: 3rem 0;
}

.criterion-card {
    background: white;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    margin: 2rem 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.criterion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.criterion-header {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e1e4e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.criterion-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.4rem;
}

.criterion-badge {
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.criterion-badge.basic {
    background: #d1fae5;
    color: #065f46;
}

.criterion-badge.strong {
    background: #dbeafe;
    color: #1e40af;
}

.criterion-badge.optimal {
    background: #fef3c7;
    color: #92400e;
}

.criterion-badge.game {
    background: #f3e8ff;
    color: #6b21a8;
}

.criterion-content {
    padding: 2rem;
}

.formula {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    text-align: center;
}

.criterion-examples, .criterion-properties {
    margin: 1.5rem 0;
}

.criterion-examples h4, .criterion-properties h4 {
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 1rem;
}

.criterion-examples ul, .criterion-properties ul {
    padding-left: 1.5rem;
}

.criterion-examples li, .criterion-properties li {
    margin: 0.5rem 0;
    line-height: 1.6;
}

.relationships-section {
    margin: 4rem 0;
}

.relationship-diagram {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.relationship-item {
    background: linear-gradient(135deg, #eef2ff, #ffffff);
    border: 1px solid #c7d2fe;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
}

.relationship-item h4 {
    color: #4338ca;
    margin-bottom: 1rem;
}

.algorithms-preview {
    margin: 4rem 0;
}

.fairness-comparison {
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin: 2rem 0;
}

.fairness-comparison th {
    background: #f8fafc;
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
}

.fairness-comparison td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

.fairness-comparison tr.coming-soon {
    opacity: 0.6;
}

.status-yes {
    color: #059669;
    font-weight: bold;
    font-size: 1.2rem;
}

.status-no {
    color: #dc2626;
    font-weight: bold;
    font-size: 1.2rem;
}

.status-maybe {
    color: #d97706;
    font-weight: bold;
    font-size: 1.2rem;
}

.status-partial {
    color: #7c3aed;
    font-weight: bold;
    font-size: 0.8rem;
}

.table-notes {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
}

.table-notes p {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    color: #374151;
}

.table-notes ul {
    margin: 0;
    padding-left: 1.5rem;
}

.table-notes li {
    margin: 0.25rem 0;
    font-size: 0.9rem;
}

.real-world-section {
    margin: 4rem 0;
}

.application-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.application-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s ease;
}

.application-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.application-card h4 {
    color: #1f2937;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
}

.application-card p {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.application-criteria {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.criterion-tag {
    background: #eff6ff;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.next-steps {
    margin: 4rem 0;
}

.next-steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.next-step-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 2rem;
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    position: relative;
}

.next-step-card:hover {
    border-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
    text-decoration: none;
}

.next-step-card h4 {
    color: #1f2937;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
}

.next-step-card p {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 0;
    flex-grow: 1;
}

.next-step-arrow {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: #4f46e5;
    font-size: 1.2rem;
    font-weight: bold;
    transition: transform 0.2s ease;
}

.next-step-card:hover .next-step-arrow {
    transform: translateX(4px);
}

@media (max-width: 768px) {
    .foundations-page {
        padding: 1rem;
    }
    
    .criterion-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .criterion-content {
        padding: 1.5rem;
    }
    
    .relationship-diagram {
        grid-template-columns: 1fr;
    }
    
    .application-grid, .next-steps-grid {
        grid-template-columns: 1fr;
    }
    
    .fairness-comparison {
        font-size: 0.85rem;
    }
    
    .fairness-comparison th, .fairness-comparison td {
        padding: 0.5rem;
    }
}
</style>