---
layout: default
title: Direct Revelation Model
permalink: /direct-revelation-model/
---

<div class="page-header">
  <h1 class="page-title">Direct Revelation Model</h1>
  <p class="page-description">Complete preference revelation for computationally efficient fair division</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>The direct revelation model represents a fundamentally different approach to fair division computation. Instead of iterative queries or continuous monitoring, players reveal their entire valuation function to a central mechanism at once. This complete information enables the mechanism to compute optimal allocations using powerful algorithmic techniques.</p>

  <p>This model makes sense only when valuations can be represented succinctly—for example, when they are piecewise-uniform, piecewise-constant, or piecewise-linear. The key trade-off is between the communication complexity of describing valuations and the computational efficiency gained from having complete information.</p>
</div>

<div class="content-block">
  <h2>Valuation Representations</h2>

  <div class="properties-grid">

    <div class="property-card">
      <h3>Piecewise-Uniform</h3>
      <p class="property-description">
        Value density is constant across the entire cake
      </p>
      <ul>
        <li><strong>Representation:</strong> Single number (density)</li>
        <li><strong>Size:</strong> O(1) bits</li>
        <li><strong>Example:</strong> v([a,b]) = b - a</li>
      </ul>
      <p>Simplest case, equivalent to cutting a homogeneous resource</p>
    </div>

    <div class="property-card">
      <h3>Piecewise-Constant</h3>
      <p class="property-description">
        Cake divided into regions with uniform value density
      </p>
      <ul>
        <li><strong>Representation:</strong> List of (interval, density) pairs</li>
        <li><strong>Size:</strong> O(k log n) bits for k pieces</li>
        <li><strong>Example:</strong> [(0, 0.3, 2), (0.3, 0.7, 1), (0.7, 1, 3)]</li>
      </ul>
      <p>Models preferences with discrete valuable regions</p>
    </div>

    <div class="property-card">
      <h3>Piecewise-Linear</h3>
      <p class="property-description">
        Value density changes linearly within regions
      </p>
      <ul>
        <li><strong>Representation:</strong> Vertices of the density function</li>
        <li><strong>Size:</strong> O(k log n) bits for k vertices</li>
        <li><strong>Example:</strong> Polygon with k corners</li>
      </ul>
      <p>Captures smooth preference transitions</p>
    </div>

  </div>

  <h3>General Additive Valuations</h3>
  <p>For arbitrary valuations, direct revelation may require:</p>
  <ul>
    <li><strong>Infinite precision:</strong> For truly continuous functions</li>
    <li><strong>Exponential size:</strong> For complex non-structured preferences</li>
    <li><strong>Approximation:</strong> ε-nets or sampling approaches</li>
  </ul>
</div>

<div class="content-block">
  <h2>Algorithmic Approaches</h2>

  <h3>Linear Programming Formulation</h3>

  <div class="proof-sketch">
    <p><strong>Envy-Free Allocation via LP:</strong></p>
    <pre>
    Variables: x_ij = fraction of piece j allocated to player i

    Maximize: Σ_i satisfaction_i

    Subject to:
      Allocation constraints:
        Σ_i x_ij = 1 for all j     (each piece fully allocated)
        x_ij ≥ 0 for all i,j        (non-negative allocations)

      Envy-freeness constraints:
        v_i(allocation_i) ≥ v_i(allocation_j) for all i,j

      Where v_i is the complete revealed valuation of player i
    </pre>
    <p><strong>Complexity:</strong> Polynomial in the representation size when valuations are piecewise-linear</p>
  </div>

  <h3>Market-Based Algorithms</h3>

  <p>With complete valuations, we can simulate market mechanisms:</p>

  <ol>
    <li><strong>Competitive Equilibrium:</strong> Find prices where supply equals demand</li>
    <li><strong>Fisher Market:</strong> Allocate budgets and compute market-clearing prices</li>
    <li><strong>Consensus Halving:</strong> Use the polynomial-time algorithm for PPA-complete problems</li>
  </ol>

  <h3>Complexity Results</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Problem</th>
        <th>Valuation Type</th>
        <th>Complexity</th>
        <th>Algorithm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Proportional</td>
        <td>Piecewise-constant</td>
        <td>O(n²k)</td>
        <td>Greedy allocation</td>
      </tr>
      <tr>
        <td>Envy-free</td>
        <td>Piecewise-linear</td>
        <td>O(n³k²)</td>
        <td>Linear programming</td>
      </tr>
      <tr>
        <td>Max-min fair</td>
        <td>Piecewise-constant</td>
        <td>O(n²k log k)</td>
        <td>Binary search + LP</td>
      </tr>
      <tr>
        <td>Nash welfare</td>
        <td>Piecewise-linear</td>
        <td>O(n³k³)</td>
        <td>Convex programming</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="content-block">
  <h2>Strategic Considerations</h2>

  <h3>The Revelation Principle</h3>

  <div class="theorem-box">
    <p><strong>Theorem (Revelation Principle):</strong> Any mechanism that can be implemented with arbitrary strategies has an equivalent direct revelation mechanism where truth-telling is a dominant strategy.</p>

    <p><strong>Implication:</strong> We can focus on designing truthful direct mechanisms without loss of generality.</p>
  </div>

  <h3>Incentive Compatibility Challenges</h3>

  <p>However, achieving strategy-proofness with fairness is difficult:</p>

  <ul>
    <li><strong>Impossibility:</strong> No deterministic, envy-free, strategy-proof mechanism for n ≥ 3</li>
    <li><strong>Trade-offs:</strong> Must sacrifice either fairness or truthfulness</li>
    <li><strong>Randomization:</strong> Can help but introduces ex-post unfairness</li>
  </ul>

  <div class="warning-box">
    <p><strong>Key Challenge:</strong> Players may misrepresent their valuations to gain advantage. Example: Claiming higher value for pieces others want less.</p>
  </div>

  <h3>Mechanisms with Good Incentives</h3>

  <div class="properties-grid">
    <div class="property-card">
      <h3>Serial Dictatorship</h3>
      <ul>
        <li>Strategy-proof</li>
        <li>Not envy-free</li>
        <li>Simple to implement</li>
      </ul>
    </div>

    <div class="property-card">
      <h3>Random Priority</h3>
      <ul>
        <li>Strategy-proof in expectation</li>
        <li>Ex-ante fair</li>
        <li>May have ex-post envy</li>
      </ul>
    </div>

    <div class="property-card">
      <h3>Probabilistic Serial</h3>
      <ul>
        <li>Weak strategy-proofness</li>
        <li>Envy-free in expectation</li>
        <li>Efficient computation</li>
      </ul>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Advantages and Limitations</h2>

  <h3>Advantages</h3>
  <ul>
    <li><strong>Computational power:</strong> Can use sophisticated optimization algorithms</li>
    <li><strong>Global optimization:</strong> Find best overall allocation, not just local improvements</li>
    <li><strong>Multiple objectives:</strong> Can optimize for various fairness criteria simultaneously</li>
    <li><strong>Clean analysis:</strong> Well-understood complexity for structured valuations</li>
    <li><strong>Parallelizable:</strong> Central computation can use parallel algorithms</li>
  </ul>

  <h3>Limitations</h3>
  <ul>
    <li><strong>Communication complexity:</strong> May require exponential bits for general valuations</li>
    <li><strong>Privacy concerns:</strong> Players must reveal complete preferences</li>
    <li><strong>Cognitive burden:</strong> Players must articulate entire valuation function</li>
    <li><strong>Strategic manipulation:</strong> Full information enables sophisticated gaming</li>
    <li><strong>Representation limits:</strong> Real preferences may not fit structured forms</li>
  </ul>
</div>

<div class="content-block">
  <h2>Applications and Extensions</h2>

  <h3>Multi-Dimensional Resources</h3>

  <p>Direct revelation naturally extends to complex resources:</p>

  <div class="implementation-grid">
    <div class="implementation-item">
      <h4>Land Division</h4>
      <p>2D plots with geometric constraints</p>
      <p>Representation: Polygonal regions</p>
    </div>

    <div class="implementation-item">
      <h4>Time Scheduling</h4>
      <p>Calendar slots with preferences</p>
      <p>Representation: Utility matrices</p>
    </div>

    <div class="implementation-item">
      <h4>Cloud Resources</h4>
      <p>CPU, memory, storage bundles</p>
      <p>Representation: Linear utilities</p>
    </div>

    <div class="implementation-item">
      <h4>Inheritance Division</h4>
      <p>Discrete items with valuations</p>
      <p>Representation: Item-value lists</p>
    </div>
  </div>

  <h3>Online and Dynamic Settings</h3>

  <ul>
    <li><strong>Online arrival:</strong> Players reveal valuations as they arrive</li>
    <li><strong>Dynamic preferences:</strong> Update allocations as valuations change</li>
    <li><strong>Partial revelation:</strong> Iteratively request more detail where needed</li>
  </ul>
</div>

<div class="content-block">
  <h2>Computational Tools and Techniques</h2>

  <h3>Optimization Methods</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Technique</th>
        <th>Application</th>
        <th>Complexity</th>
        <th>Quality Guarantee</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Linear Programming</td>
        <td>Envy-free allocation</td>
        <td>Polynomial</td>
        <td>Exact (if feasible)</td>
      </tr>
      <tr>
        <td>Convex Optimization</td>
        <td>Nash welfare maximization</td>
        <td>Polynomial</td>
        <td>Global optimum</td>
      </tr>
      <tr>
        <td>Integer Programming</td>
        <td>Discrete items</td>
        <td>NP-hard</td>
        <td>Optimal (exponential time)</td>
      </tr>
      <tr>
        <td>Approximation Algorithms</td>
        <td>Large-scale problems</td>
        <td>Polynomial</td>
        <td>(1+ε)-approximation</td>
      </tr>
    </tbody>
  </table>

  <h3>Implementation Example</h3>

  <div class="proof-sketch">
    <p><strong>Python Implementation for Piecewise-Constant Valuations:</strong></p>
    <pre>
    class PiecewiseConstantValuation:
        def __init__(self, pieces):
            # pieces = [(start, end, density), ...]
            self.pieces = pieces

        def value(self, start, end):
            total = 0
            for p_start, p_end, density in self.pieces:
                overlap_start = max(start, p_start)
                overlap_end = min(end, p_end)
                if overlap_start < overlap_end:
                    total += density * (overlap_end - overlap_start)
            return total

    def find_envy_free_allocation(valuations):
        n = len(valuations)
        # Set up linear program
        # ... (LP formulation)
        return solve_lp(constraints, objective)
    </pre>
  </div>
</div>

<div class="content-block">
  <h2>Relationship to Other Models</h2>

  <h3>Model Comparisons</h3>

  <ul>
    <li><strong>vs Robertson-Webb:</strong> Trades query efficiency for communication complexity</li>
    <li><strong>vs Moving-Knife:</strong> Discrete computation vs continuous procedures</li>
    <li><strong>vs Simultaneous Reports:</strong> Complete vs partial information revelation</li>
  </ul>

  <div class="theorem-box">
    <p><strong>Observation:</strong> Any Robertson-Webb algorithm with q queries can be simulated in the direct revelation model, but may require valuations of size 2^q in worst case.</p>
  </div>

  <h3>Hybrid Approaches</h3>

  <p>Combining direct revelation with other models:</p>

  <ul>
    <li><strong>Elicitation + Direct:</strong> Query to learn structure, then direct revelation</li>
    <li><strong>Partial Direct:</strong> Reveal constraints, compute with queries for details</li>
    <li><strong>Verification:</strong> Direct revelation with spot-checking via queries</li>
  </ul>
</div>

<div class="content-block">
  <h2>Future Directions</h2>

  <h3>Research Frontiers</h3>
  <ul>
    <li><strong>Machine learning:</strong> Learning valuation functions from examples</li>
    <li><strong>Differential privacy:</strong> Protecting individual preferences while computing fair allocations</li>
    <li><strong>Blockchain implementation:</strong> Decentralized direct revelation mechanisms</li>
    <li><strong>Behavioral models:</strong> Incorporating psychological factors in preference representation</li>
  </ul>

  <h3>Open Problems</h3>
  <ul>
    <li>Characterize the communication complexity of fair division for different valuation classes</li>
    <li>Design mechanisms that incentivize approximate truth-telling</li>
    <li>Develop compact representations for complex real-world preferences</li>
  </ul>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/moving-knife-model/' | relative_url }}" class="nav-button secondary">← Moving-Knife Model</a>
  <a href="{{ '/simultaneous-queries-model/' | relative_url }}" class="nav-button primary">Simultaneous Reports →</a>
</footer>