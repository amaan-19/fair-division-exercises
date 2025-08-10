---
layout: default
title: Models of Computation
permalink: /overview/
---

<div class="page-header">
  <h1 class="page-title">Models of Computation for Cake-Cutting</h1>
  <p class="page-description">Frameworks for analyzing algorithmic complexity in fair division</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>Reasoning about the run-time complexity of fair division algorithms requires a model of computation. Each model captures different aspects of the information revelation process and leads to different complexity measures. Understanding these models is essential for comparing algorithms and establishing theoretical bounds.</p>
</div>

<div class="content-block">
  <h2>Four Fundamental Models</h2>

  <div class="properties-grid">

    <div class="property-card">
      <h3><a href="{{ '/robertson-webb-query-model/' | relative_url }}">Robertson-Webb Query Model</a></h3>
      <p class="property-description">
        The standard model for discrete cake-cutting algorithms using two query types.
      </p>
      <ul>
        <li><strong>Cut Query:</strong> "Mark a piece of cake with a given value"</li>
        <li><strong>Eval Query:</strong> "Evaluate a given piece of cake"</li>
      </ul>
      <p><strong>Complexity Measure:</strong> Number of queries required</p>
      <p><strong>Best For:</strong> Discrete protocols, lower bound proofs</p>
    </div>

    <div class="property-card">
      <h3><a href="{{ '/moving-knife-model/' | relative_url }}">Moving-Knives Model</a></h3>
      <p class="property-description">
        Continuous procedures where knives move until players signal satisfaction.
      </p>
      <ul>
        <li>Continuous knife movement over the cake</li>
        <li>Players shout "stop" at critical moments</li>
      </ul>
      <p><strong>Complexity Measure:</strong> Number of knife movements and stops</p>
      <p><strong>Best For:</strong> Exact fair division, envy-free procedures</p>
    </div>

    <div class="property-card">
      <h3><a href="{{ '/direct-revelation-model/' | relative_url }}">Direct Revelation Model</a></h3>
      <p class="property-description">
        Players reveal their entire valuation function to the mechanism.
      </p>
      <ul>
        <li>Complete preference revelation upfront</li>
        <li>Works for succinctly representable valuations</li>
      </ul>
      <p><strong>Complexity Measure:</strong> Representation size of valuations</p>
      <p><strong>Best For:</strong> Piecewise-uniform, piecewise-constant, or piecewise-linear valuations</p>
    </div>

    <div class="property-card">
      <h3><a href="{{ '/simultaneous-queries-model/' | relative_url }}">Simultaneous Reports Model</a></h3>
      <p class="property-description">
        Players simultaneously submit discretized valuation reports.
      </p>
      <ul>
        <li>Agents report sequences of cut-points</li>
        <li>Values of pieces between cut-points</li>
      </ul>
      <p><strong>Complexity Measure:</strong> Number of cut-points required</p>
      <p><strong>Best For:</strong> Protocol design, approximation algorithms</p>
    </div>

  </div>
</div>

<div class="content-block">
  <h2>Model Comparison</h2>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Model</th>
        <th>Information Revelation</th>
        <th>Complexity Metric</th>
        <th>Typical Bounds</th>
        <th>Key Algorithms</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Robertson-Webb</strong></td>
        <td>Incremental queries</td>
        <td>Query count</td>
        <td>O(n log n) for proportional</td>
        <td>Divide-and-Choose, Even-Paz</td>
      </tr>
      <tr>
        <td><strong>Moving-Knives</strong></td>
        <td>Continuous monitoring</td>
        <td>Knife movements</td>
        <td>Often unbounded</td>
        <td>Austin, Stromquist</td>
      </tr>
      <tr>
        <td><strong>Direct Revelation</strong></td>
        <td>Complete upfront</td>
        <td>Representation size</td>
        <td>O(n) for piecewise-linear</td>
        <td>Linear programming methods</td>
      </tr>
      <tr>
        <td><strong>Simultaneous Reports</strong></td>
        <td>Discretized batch</td>
        <td>Discretization points</td>
        <td>O(n²) for ε-approximation</td>
        <td>Approximation protocols</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="content-block">
  <h2>Choosing the Right Model</h2>

  <h3>Key Considerations</h3>

  <div class="consideration-grid">
    <div class="consideration-item">
      <h4>1. Valuation Function Complexity</h4>
      <p>Simple valuations (piecewise-constant) may benefit from direct revelation, while complex valuations require query-based approaches.</p>
    </div>

    <div class="consideration-item">
      <h4>2. Exactness Requirements</h4>
      <p>Moving-knife procedures achieve exact fairness but at the cost of continuous computation. Query models often trade exactness for finite complexity.</p>
    </div>

    <div class="consideration-item">
      <h4>3. Strategic Considerations</h4>
      <p>Robertson-Webb queries reveal minimal information, supporting strategy-proof mechanisms. Direct revelation requires careful incentive design.</p>
    </div>

    <div class="consideration-item">
      <h4>4. Implementation Feasibility</h4>
      <p>Query models translate naturally to interactive protocols. Moving-knife procedures are often theoretical, requiring discretization for implementation.</p>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Theoretical Implications</h2>

  <h3>Lower Bounds Across Models</h3>
  <p>Different models yield different lower bounds for the same problem:</p>

  <ul>
    <li><strong>Proportional division for n players:</strong>
      <ul>
        <li>Robertson-Webb: Ω(n log n) queries</li>
        <li>Direct Revelation: Ω(n) communication complexity</li>
        <li>Moving-Knives: Can be achieved with bounded movements</li>
      </ul>
    </li>
    <li><strong>Envy-free division for n players:</strong>
      <ul>
        <li>Robertson-Webb: No finite bound known for n ≥ 4</li>
        <li>Moving-Knives: Finite procedures exist (Stromquist, Barbanel-Brams)</li>
        <li>Simultaneous Reports: Approximation possible with O(n³/ε) cut-points</li>
      </ul>
    </li>
  </ul>

  <h3>Model Relationships</h3>
  <p>These models are not independent but form a hierarchy of expressiveness:</p>

  <div class="proof-sketch">
    <p><strong>Theorem:</strong> Any algorithm in the Robertson-Webb model can be simulated in the direct revelation model with at most exponential blow-up in complexity.</p>

    <p><strong>Intuition:</strong> The direct revelation model can simulate query responses by computing them from the full valuation function. However, this may require exponentially many bits to represent arbitrary valuations that could be queried efficiently.</p>
  </div>
</div>

<div class="content-block">
  <h2>Practical Applications</h2>

  <h3>Interactive Implementations</h3>
  <p>For educational demonstrations and practical systems:</p>

  <ul>
    <li><strong>Robertson-Webb queries</strong> map directly to user interface elements (sliders, evaluation displays)</li>
    <li><strong>Moving-knife simulations</strong> require discretization into time steps</li>
    <li><strong>Direct revelation</strong> works well when preferences can be specified via simple parameters</li>
    <li><strong>Simultaneous reports</strong> enable batch processing and parallel computation</li>
  </ul>

  <h3>Real-World Constraints</h3>
  <p>Each model makes different assumptions about practical feasibility:</p>

  <div class="warning-box">
    <p><strong>Important:</strong> While moving-knife procedures provide elegant theoretical solutions, they often cannot be directly implemented due to:</p>
    <ul>
      <li>Requirement for truly continuous time</li>
      <li>Perfect synchronization between players</li>
      <li>Infinite precision in measurements</li>
    </ul>
    <p>Practical implementations typically discretize these procedures, introducing approximation errors that must be carefully analyzed.</p>
  </div>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/theory/' | relative_url }}" class="nav-button secondary">← Theory Overview</a>
  <a href="{{ '/robertson-webb-query-model/' | relative_url }}" class="nav-button primary">Robertson-Webb Model →</a>
</footer>