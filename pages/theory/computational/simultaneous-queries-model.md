---
layout: default
title: Simultaneous Reports Model
permalink: /simultaneous-queries-model/
---

<div class="page-header">
  <h1 class="page-title">Simultaneous Reports Model</h1>
  <p class="page-description">Batch preference revelation through discretized valuation reports</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>The simultaneous reports model represents a middle ground between the query-based Robertson-Webb model and the complete direct revelation model. In this framework, agents simultaneously send discretizations of their value measures—sequences of cut-points and the values of pieces between these cut-points. This approach balances information revelation with practical communication constraints.</p>

  <p>This model is particularly relevant for online platforms and distributed systems where interaction rounds are costly, but complete preference revelation is either impossible or undesirable. The discretization approach enables finite communication while maintaining reasonable approximation guarantees.</p>
</div>

<div class="content-block">
  <h2>Core Concepts</h2>

  <h3>Discretization Structure</h3>

  <div class="properties-grid">

    <div class="property-card">
      <h3>Cut-Point Sequences</h3>
      <p class="property-description">
        Players report a finite set of positions on the cake
      </p>
      <ul>
        <li><strong>Format:</strong> {x₀ = 0, x₁, x₂, ..., xₖ = 1}</li>
        <li><strong>Purpose:</strong> Define evaluation boundaries</li>
        <li><strong>Complexity:</strong> k cut-points = k+1 pieces</li>
      </ul>
      <p>More cut-points enable finer preference expression</p>
    </div>

    <div class="property-card">
      <h3>Piece Valuations</h3>
      <p class="property-description">
        Values for each interval between consecutive cut-points
      </p>
      <ul>
        <li><strong>Format:</strong> {v[x₀,x₁], v[x₁,x₂], ..., v[xₖ₋₁,xₖ]}</li>
        <li><strong>Constraint:</strong> Sum equals 1 (normalized)</li>
        <li><strong>Precision:</strong> Often rounded to finite bits</li>
      </ul>
      <p>Captures the "worth" of each discrete segment</p>
    </div>

    <div class="property-card">
      <h3>Protocol Specification</h3>
      <p class="property-description">
        Predefined rules for report structure
      </p>
      <ul>
        <li><strong>Fixed k:</strong> All players use same number of cuts</li>
        <li><strong>Adaptive k:</strong> Players choose their precision</li>
        <li><strong>Constraints:</strong> May require specific properties</li>
      </ul>
      <p>Protocol design affects both complexity and fairness</p>
    </div>

  </div>

  <h3>Example: Two-Player Protocol</h3>

  <div class="proof-sketch">
    <p><strong>Simple Discretization Protocol:</strong></p>
    <p>Each player reports three cut-points (creating four pieces):</p>
    <pre>
    Player 1: cuts at {0, 0.3, 0.6, 1}
              values: {0.2, 0.4, 0.3, 0.1}

    Player 2: cuts at {0, 0.25, 0.5, 0.75, 1}
              values: {0.1, 0.3, 0.4, 0.2}
    </pre>
    <p>The mechanism combines these reports to find a fair allocation.</p>
  </div>
</div>

<div class="content-block">
  <h2>Complexity Analysis</h2>

  <h3>Communication Complexity</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Fixed Protocol</th>
        <th>Adaptive Protocol</th>
        <th>Optimal Bounds</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Cut-points per player</strong></td>
        <td>k (predetermined)</td>
        <td>kᵢ (player choice)</td>
        <td>O(1/ε) for ε-fairness</td>
      </tr>
      <tr>
        <td><strong>Total communication</strong></td>
        <td>O(nk log(1/ε))</td>
        <td>O(n Σkᵢ log(1/ε))</td>
        <td>Θ(n²/ε) worst case</td>
      </tr>
      <tr>
        <td><strong>Rounds of interaction</strong></td>
        <td>1</td>
        <td>1</td>
        <td>1 (by definition)</td>
      </tr>
      <tr>
        <td><strong>Precision per value</strong></td>
        <td>O(log(1/ε)) bits</td>
        <td>Variable</td>
        <td>Θ(log(n/ε))</td>
      </tr>
    </tbody>
  </table>

  <h3>Approximation Quality</h3>

  <div class="theorem-box">
    <p><strong>Theorem:</strong> For any ε > 0, there exists a simultaneous protocol with O(n/ε) cut-points per player that achieves ε-approximate envy-freeness.</p>

    <p><strong>Proof idea:</strong> With sufficiently fine discretization, any allocation can be approximated to within ε error in each player's valuation.</p>
  </div>

  <h3>Lower Bounds</h3>

  <p>Fundamental limits on simultaneous protocols:</p>

  <ul>
    <li><strong>Proportionality:</strong> Requires Ω(n) total cut-points</li>
    <li><strong>Envy-freeness:</strong> Requires Ω(n²) total cut-points in worst case</li>
    <li><strong>Exact fairness:</strong> Impossible with finite discretization for general valuations</li>
  </ul>
</div>

<div class="content-block">
  <h2>Protocol Design Strategies</h2>

  <h3>Uniform Discretization</h3>

  <div class="implementation-grid">
    <div class="implementation-item">
      <h4>Equal Spacing</h4>
      <pre>
cuts = [i/k for i in range(k+1)]
      </pre>
      <p>Simple but may miss important value concentrations</p>
    </div>

    <div class="implementation-item">
      <h4>Value-Based Spacing</h4>
      <pre>
cuts = quantiles(valuation, k)
      </pre>
      <p>Places cuts at equal-value intervals</p>
    </div>

    <div class="implementation-item">
      <h4>Adaptive Refinement</h4>
      <pre>
cuts = concentrate_near_peaks()
      </pre>
      <p>More cuts where value changes rapidly</p>
    </div>

    <div class="implementation-item">
      <h4>Strategic Spacing</h4>
      <pre>
cuts = anticipate_competition()
      </pre>
      <p>Account for expected other players' reports</p>
    </div>
  </div>

  <h3>Multi-Round Protocols</h3>

  <p>While technically not "simultaneous," some protocols use multiple rounds of simultaneous reports:</p>

  <div class="proof-sketch">
    <p><strong>Two-Round Protocol Example:</strong></p>
    <ol>
      <li><strong>Round 1:</strong> Coarse discretization (k=10 cuts)
        <ul>
          <li>Players report rough preferences</li>
          <li>Mechanism identifies contentious regions</li>
        </ul>
      </li>
      <li><strong>Round 2:</strong> Fine discretization in contentious regions
        <ul>
          <li>Additional cuts where competition is high</li>
          <li>Final allocation based on combined reports</li>
        </ul>
      </li>
    </ol>
    <p><strong>Advantage:</strong> Better precision where needed without excessive communication</p>
  </div>
</div>

<div class="content-block">
  <h2>Algorithmic Approaches</h2>

  <h3>Allocation Algorithms</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Algorithm</th>
        <th>Input</th>
        <th>Fairness</th>
        <th>Complexity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Discrete Divide-Choose</strong></td>
        <td>2 players, k cuts each</td>
        <td>ε-proportional</td>
        <td>O(k)</td>
      </tr>
      <tr>
        <td><strong>Discrete Adjusted Winner</strong></td>
        <td>2 players, item valuations</td>
        <td>Envy-free, efficient</td>
        <td>O(k log k)</td>
      </tr>
      <tr>
        <td><strong>Market Equilibrium</strong></td>
        <td>n players, k cuts each</td>
        <td>ε-envy-free</td>
        <td>O(n²k²)</td>
      </tr>
      <tr>
        <td><strong>Discrete Consensus</strong></td>
        <td>n players, k cuts total</td>
        <td>ε-proportional</td>
        <td>O(nk log k)</td>
      </tr>
    </tbody>
  </table>

  <h3>Implementation Example</h3>

  <div class="proof-sketch">
    <p><strong>Discrete Proportional Allocation:</strong></p>
    <pre>
    def simultaneous_proportional_allocation(reports):
        """
        reports[i] = (cuts[i], values[i]) for player i
        """
        n = len(reports)

        # Merge all cut points
        all_cuts = sorted(set().union(*[r[0] for r in reports]))
        m = len(all_cuts) - 1  # number of pieces

        # Build value matrix
        value_matrix = np.zeros((n, m))
        for i, (cuts, values) in enumerate(reports):
            # Interpolate player i's values to merged cuts
            value_matrix[i] = interpolate(cuts, values, all_cuts)

        # Solve allocation problem
        allocation = solve_proportional_lp(value_matrix)
        return allocation, all_cuts
    </pre>
    <p><strong>Complexity:</strong> O(n²k) where k is average cuts per player</p>
  </div>
</div>

<div class="content-block">
  <h2>Strategic Considerations</h2>

  <h3>Manipulation Opportunities</h3>

  <div class="warning-box">
    <p><strong>Key Challenge:</strong> Players can strategically choose both cut-points and reported values to gain advantage.</p>

    <p>Common manipulations:</p>
    <ul>
      <li><strong>Value inflation:</strong> Overreport value in contested regions</li>
      <li><strong>Cut placement:</strong> Hide valuable regions between cuts</li>
      <li><strong>False uniformity:</strong> Report uniform values to seem flexible</li>
    </ul>
  </div>

  <h3>Truthful Mechanisms</h3>

  <p>Designing strategy-proof simultaneous protocols is challenging:</p>

  <div class="properties-grid">
    <div class="property-card">
      <h3>Random Cut Selection</h3>
      <p>Mechanism randomly selects which reported cuts to use</p>
      <ul>
        <li>Reduces benefit of strategic cut placement</li>
        <li>May miss important value concentrations</li>
      </ul>
    </div>

    <div class="property-card">
      <h3>Verification Queries</h3>
      <p>Spot-check reported values with Robertson-Webb queries</p>
      <ul>
        <li>Deters false reporting</li>
        <li>Adds interaction rounds</li>
      </ul>
    </div>

    <div class="property-card">
      <h3>Scoring Rules</h3>
      <p>Incentivize accurate reporting through payment schemes</p>
      <ul>
        <li>Requires monetary transfers</li>
        <li>May not achieve exact truthfulness</li>
      </ul>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Advantages and Limitations</h2>

  <h3>Advantages</h3>
  <ul>
    <li><strong>Single round:</strong> Minimizes interaction overhead</li>
    <li><strong>Parallelizable:</strong> All players report simultaneously</li>
    <li><strong>Flexible precision:</strong> Players can adjust detail level</li>
    <li><strong>Practical implementation:</strong> Natural for web forms and surveys</li>
    <li><strong>Bounded communication:</strong> Finite message size guaranteed</li>
  </ul>

  <h3>Limitations</h3>
  <ul>
    <li><strong>Approximation only:</strong> Cannot achieve exact fairness</li>
    <li><strong>Strategic complexity:</strong> Many dimensions for manipulation</li>
    <li><strong>Discretization loss:</strong> May miss important preference details</li>
    <li><strong>Coordination challenges:</strong> Players must understand protocol</li>
    <li><strong>Interpolation ambiguity:</strong> How to handle values between cuts</li>
  </ul>
</div>

<div class="content-block">
  <h2>Applications and Variants</h2>

  <h3>Real-World Applications</h3>

  <div class="implementation-grid">
    <div class="implementation-item">
      <h4>Course Allocation</h4>
      <p>Students submit preference rankings</p>
      <p>Discrete choices, natural for simultaneous reports</p>
    </div>

    <div class="implementation-item">
      <h4>Shift Scheduling</h4>
      <p>Workers indicate availability and preferences</p>
      <p>Time slots as natural discretization</p>
    </div>

    <div class="implementation-item">
      <h4>Cloud Resource Allocation</h4>
      <p>Users specify resource needs over time</p>
      <p>Discrete time windows and resource units</p>
    </div>

    <div class="implementation-item">
      <h4>Participatory Budgeting</h4>
      <p>Citizens allocate points across projects</p>
      <p>Natural discrete choice setting</p>
    </div>
  </div>

  <h3>Protocol Variants</h3>

  <ul>
    <li><strong>Hierarchical reports:</strong> Coarse preferences refined recursively</li>
    <li><strong>Constraint-based:</strong> Report acceptable ranges rather than exact values</li>
    <li><strong>Ordinal reports:</strong> Rankings instead of cardinal values</li>
    <li><strong>Probabilistic reports:</strong> Distributions over valuations</li>
  </ul>
</div>

<div class="content-block">
  <h2>Relationship to Other Models</h2>

  <h3>Model Comparison</h3>

  <div class="theorem-box">
    <p><strong>Observation:</strong> The simultaneous reports model can be viewed as:</p>
    <ul>
      <li>A restricted form of direct revelation (finite precision)</li>
      <li>A batch version of Robertson-Webb queries (all at once)</li>
      <li>A discretized moving-knife procedure (fixed evaluation points)</li>
    </ul>
  </div>

  <h3>Conversion Between Models</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>From Model</th>
        <th>To Model</th>
        <th>Conversion Method</th>
        <th>Information Loss</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Direct Revelation</td>
        <td>Simultaneous</td>
        <td>Sample at k points</td>
        <td>O(1/k) approximation</td>
      </tr>
      <tr>
        <td>Simultaneous</td>
        <td>Robertson-Webb</td>
        <td>Interpolate between cuts</td>
        <td>Interpolation error</td>
      </tr>
      <tr>
        <td>Moving-Knife</td>
        <td>Simultaneous</td>
        <td>Discretize time steps</td>
        <td>Timing precision</td>
      </tr>
      <tr>
        <td>Robertson-Webb</td>
        <td>Simultaneous</td>
        <td>Query at fixed points</td>
        <td>Adaptive advantage</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="content-block">
  <h2>Research Directions</h2>

  <h3>Open Problems</h3>
  <ul>
    <li>Characterize the optimal number of cut-points for different fairness notions</li>
    <li>Design simultaneous protocols that are robust to strategic manipulation</li>
    <li>Determine the communication complexity of approximate fair division</li>
    <li>Develop adaptive protocols that adjust to valuation complexity</li>
  </ul>

  <h3>Recent Advances</h3>
  <ul>
    <li><strong>Machine learning:</strong> Predicting full valuations from partial reports</li>
    <li><strong>Differential privacy:</strong> Protecting individual reports while computing allocations</li>
    <li><strong>Online protocols:</strong> Handling arriving players with simultaneous reports</li>
    <li><strong>Behavioral studies:</strong> Understanding how people actually discretize preferences</li>
  </ul>

  <h3>Future Directions</h3>
  <p>The simultaneous reports model is particularly relevant for modern applications:</p>
  <ul>
    <li>Integration with recommender systems</li>
    <li>Blockchain-based simultaneous revelation</li>
    <li>Federated learning for preference aggregation</li>
    <li>Quantum protocols for simultaneous reports</li>
  </ul>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/direct-revelation-model/' | relative_url }}" class="nav-button secondary">← Direct Revelation</a>
  <a href="{{ '/complexity-analysis/' | relative_url }}" class="nav-button primary">Complexity Analysis →</a>
</footer>