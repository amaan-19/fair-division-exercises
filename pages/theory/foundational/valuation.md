---
layout: default
title: Valuation Functions
permalink: /valuation-functions/
---

<div class="page-header">
  <h1 class="page-title">Valuation Functions</h1>
  <p class="page-description">Mathematical representations of preferences in fair division</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>Valuation functions are the mathematical bridge between subjective human preferences and objective algorithmic procedures. They encode how each player values different portions of the divisible resource, enabling algorithms to compute fair allocations based on these preferences.</p>

  <p>Understanding the structure and properties of valuation functions is crucial for algorithm design, as different assumptions about valuations lead to different computational possibilities and complexity bounds.</p>
</div>

<div class="content-block">
  <h2>Formal Definition</h2>

  <div class="definition-box">
    <p><strong>Definition:</strong> A valuation function for player $i$ is a mapping:</p>
    $$v_i: 2^X \rightarrow \mathbb{R}_+$$
    <p>where $X = [0,1]$ is the cake and $2^X$ denotes the set of all measurable subsets of $X$.</p>
  </div>

  <h3>Essential Properties</h3>

  <div class="properties-grid">
    <div class="property-card">
      <h3>Non-negativity</h3>
      <p>$v_i(S) \geq 0$ for all measurable $S \subseteq X$</p>
      <p><strong>Interpretation:</strong> No part of the resource has negative value</p>
    </div>

    <div class="property-card">
      <h3>Normalization</h3>
      <p>$v_i(X) = 1$ (or sometimes 100)</p>
      <p><strong>Purpose:</strong> Enables comparison across players</p>
    </div>

    <div class="property-card">
      <h3>Additivity</h3>
      <p>$v_i(A \cup B) = v_i(A) + v_i(B)$ for disjoint $A, B$</p>
      <p><strong>Meaning:</strong> No complementarities between pieces</p>
    </div>

    <div class="property-card">
      <h3>Monotonicity</h3>
      <p>$A \subseteq B \Rightarrow v_i(A) \leq v_i(B)$</p>
      <p><strong>Logic:</strong> Larger pieces have at least as much value</p>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Types of Valuation Functions</h2>

  <h3>Uniform Valuations</h3>
  <p>The simplest case where value is proportional to length:</p>
  $$v_i([a,b]) = b - a$$

  <ul>
    <li>All players agree on piece values</li>
    <li>Fair division becomes trivial (equal lengths)</li>
    <li>Useful as a baseline for complexity analysis</li>
  </ul>

  <h3>Piecewise Constant</h3>
  <p>The cake is divided into regions with uniform value density:</p>

  <div class="proof-sketch">
    <p><strong>Example:</strong> A cake with chocolate, vanilla, and strawberry sections</p>
    <pre>
    v_i([a,b]) = Σ_j (density_j × length_in_region_j)
    </pre>
    <p>Common in practical applications where resources have discrete types</p>
  </div>

  <h3>Piecewise Linear</h3>
  <p>Value density changes linearly within regions:</p>
  <ul>
    <li>More expressive than piecewise constant</li>
    <li>Still computationally tractable</li>
    <li>Can approximate smooth functions arbitrarily well</li>
  </ul>

  <h3>General Continuous</h3>
  <p>Arbitrary continuous density functions:</p>
  $$v_i([a,b]) = \int_a^b f_i(x) dx$$

  <div class="warning-box">
    <p><strong>Computational Challenge:</strong> May require infinite precision to represent exactly. Algorithms must work with query access rather than explicit representation.</p>
  </div>
</div>

<div class="content-block">
  <h2>Special Classes of Valuations</h2>

  <h3>Single-Peaked Preferences</h3>
  <p>Value density has a single maximum:</p>
  <ul>
    <li>Models preferences with an "ideal point"</li>
    <li>Enables efficient algorithms for some problems</li>
    <li>Common in spatial resource allocation</li>
  </ul>

  <h3>Responsive Valuations</h3>
  <p>Small changes in allocation lead to small changes in value:</p>

  <div class="theorem-box">
    <p><strong>Definition:</strong> A valuation is $\epsilon$-responsive if for any interval $[a,b]$ and $\delta > 0$:</p>
    $$|v_i([a,b]) - v_i([a,b+\delta])| \leq \epsilon \cdot \delta$$
  </div>

  <h3>Hungry Valuations</h3>
  <p>Every piece has positive value:</p>
  $$v_i(S) > 0 \text{ for all } S \text{ with positive measure}$$

  <ul>
    <li>Ensures players always want more</li>
    <li>Simplifies certain impossibility proofs</li>
    <li>Realistic for many resources</li>
  </ul>
</div>

<div class="content-block">
  <h2>Valuation Elicitation</h2>

  <h3>The Information Problem</h3>
  <p>Algorithms must learn about valuations through queries:</p>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Query Type</th>
        <th>Information Revealed</th>
        <th>Typical Use</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Value Query</strong></td>
        <td>$v_i([a,b])$ for specific interval</td>
        <td>Comparing pieces</td>
      </tr>
      <tr>
        <td><strong>Cut Query</strong></td>
        <td>Position for desired value</td>
        <td>Making proportional cuts</td>
      </tr>
      <tr>
        <td><strong>Comparison Query</strong></td>
        <td>Preference between two pieces</td>
        <td>Ordinal mechanisms</td>
      </tr>
    </tbody>
  </table>

  <h3>Communication Complexity</h3>
  <p>How much information must be exchanged to compute fair allocations?</p>

  <ul>
    <li><strong>Lower bounds:</strong> Minimum queries needed for any algorithm</li>
    <li><strong>Upper bounds:</strong> Queries used by best known algorithms</li>
    <li><strong>Gaps:</strong> Often exponential between upper and lower bounds</li>
  </ul>
</div>

<div class="content-block">
  <h2>Probabilistic Valuations</h2>

  <h3>Measure-Theoretic Foundation</h3>
  <p>Valuations as probability measures on $[0,1]$:</p>

  <div class="definition-box">
    <p>A valuation $v_i$ is a probability measure if:</p>
    <ol>
      <li>$v_i(X) = 1$ (normalization)</li>
      <li>$v_i(A) \geq 0$ for all measurable $A$</li>
      <li>$v_i(\bigcup_j A_j) = \sum_j v_i(A_j)$ for disjoint $\{A_j\}$</li>
    </ol>
  </div>

  <p>This perspective enables:</p>
  <ul>
    <li>Use of probabilistic tools and inequalities</li>
    <li>Connection to random allocation mechanisms</li>
    <li>Analysis of expected fairness properties</li>
  </ul>
</div>

<div class="content-block">
  <h2>Computational Representations</h2>

  <h3>Explicit Representations</h3>

  <div class="implementation-grid">
    <div class="implementation-item">
      <h4>Piecewise Constant</h4>
      <pre>
values = [(0, 0.3, 2.0),
          (0.3, 0.7, 1.0),
          (0.7, 1.0, 3.0)]
      </pre>
    </div>

    <div class="implementation-item">
      <h4>Polynomial</h4>
      <pre>
density(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ
      </pre>
    </div>

    <div class="implementation-item">
      <h4>Sample Points</h4>
      <pre>
samples = {0: 0, 0.1: 0.08,
           0.2: 0.15, ...}
      </pre>
    </div>

    <div class="implementation-item">
      <h4>Functional</h4>
      <pre>
v(a,b) = integrate(density, a, b)
      </pre>
    </div>
  </div>

  <h3>Oracle Access</h3>
  <p>For complex valuations, algorithms access valuations only through queries:</p>

  <ul>
    <li>Treats valuation as a "black box"</li>
    <li>Focuses on information-theoretic complexity</li>
    <li>Enables handling of arbitrary valuations</li>
  </ul>
</div>

<div class="content-block">
  <h2>Applications Beyond Cake-Cutting</h2>

  <h3>Multi-Dimensional Resources</h3>
  <ul>
    <li><strong>Land division:</strong> 2D valuations over geographic regions</li>
    <li><strong>Time allocation:</strong> Valuations over time intervals</li>
    <li><strong>Computational resources:</strong> CPU, memory, bandwidth preferences</li>
  </ul>

  <h3>Discrete Items</h3>
  <p>Valuations over indivisible goods:</p>
  <ul>
    <li>Additive: $v(S) = \sum_{i \in S} v(\{i\})$</li>
    <li>Submodular: Diminishing returns</li>
    <li>Supermodular: Complementarities</li>
  </ul>

  <h3>Hybrid Settings</h3>
  <p>Combining divisible and indivisible resources requires unified valuation frameworks</p>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/fairness-properties/' | relative_url }}" class="nav-button secondary">← Fairness Properties</a>
  <a href="{{ '/existence-theory/' | relative_url }}" class="nav-button primary">Existence Theory →</a>
</footer>