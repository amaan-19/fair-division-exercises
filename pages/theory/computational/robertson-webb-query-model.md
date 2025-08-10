---
layout: default
title: Robertson-Webb Query Model
permalink: /robertson-webb-query-model/
---

<div class="page-header">
  <h1 class="page-title">Robertson-Webb Query Model</h1>
  <p class="page-description">The standard computational framework for analyzing discrete fair division algorithms</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>The Robertson-Webb query model, introduced by Robertson and Webb in 1998, provides the fundamental framework for measuring computational complexity in fair division. Rather than counting traditional operations like arithmetic or comparisons, this model measures complexity through the lens of information revelation—counting queries about players' private preferences.</p>

  <p>This model captures the reality that in fair division problems, the primary computational bottleneck is not calculation but rather the extraction of preference information from participants who may have complex, private valuations.</p>
</div>

<div class="content-block">
  <h2>The Two Query Types</h2>

  <div class="properties-grid">

    <div class="property-card">
      <h3>Cut Query (CUT)</h3>
      <p class="property-description">
        <strong>Format:</strong> CUT<sub>i</sub>(x, α)
      </p>
      <p><strong>Question:</strong> "Where should I cut starting from position x so that the piece from x to the cut has value exactly α to you?"</p>
      <p><strong>Returns:</strong> Position y such that v<sub>i</sub>([x, y]) = α</p>
      <p><strong>Use Cases:</strong></p>
      <ul>
        <li>Making proportional cuts</li>
        <li>Equalizing piece values</li>
        <li>Finding specific value thresholds</li>
      </ul>
    </div>

    <div class="property-card">
      <h3>Evaluation Query (EVAL)</h3>
      <p class="property-description">
        <strong>Format:</strong> EVAL<sub>i</sub>(x, y)
      </p>
      <p><strong>Question:</strong> "What is the value of the piece from position x to position y to you?"</p>
      <p><strong>Returns:</strong> Value v<sub>i</sub>([x, y])</p>
      <p><strong>Use Cases:</strong></p>
      <ul>
        <li>Comparing piece values</li>
        <li>Verifying fairness properties</li>
        <li>Selecting preferred pieces</li>
      </ul>
    </div>
  </div>

  <h3>Query Properties</h3>
  <ul>
    <li><strong>Consistency:</strong> Repeated queries with same parameters must return same results</li>
    <li><strong>Additivity:</strong> For disjoint intervals, values must sum correctly</li>
    <li><strong>Normalization:</strong> v<sub>i</sub>([0, 1]) = 1 for all players</li>
    <li><strong>Monotonicity:</strong> Larger pieces have at least as much value as their subpieces</li>
  </ul>
</div>

<div class="content-block">
  <h2>Complexity Analysis Examples</h2>

  <h3>Algorithm Query Complexities</h3>

  <table class="comparison-table">
    <thead>
      <tr>
        <th>Algorithm</th>
        <th>Players</th>
        <th>Fairness</th>
        <th>Query Complexity</th>
        <th>Query Breakdown</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Divide-and-Choose</strong></td>
        <td>2</td>
        <td>Proportional, Envy-free</td>
        <td>2</td>
        <td>1 CUT + 1 EVAL</td>
      </tr>
      <tr>
        <td><strong>Dubins-Spanier</strong></td>
        <td>n</td>
        <td>Proportional</td>
        <td>O(n²)</td>
        <td>n CUTs + O(n²) EVALs</td>
      </tr>
      <tr>
        <td><strong>Even-Paz</strong></td>
        <td>n</td>
        <td>Proportional</td>
        <td>O(n log n)</td>
        <td>Recursive halving</td>
      </tr>
      <tr>
        <td><strong>Selfridge-Conway</strong></td>
        <td>3</td>
        <td>Envy-free</td>
        <td>14</td>
        <td>5 CUTs + 9 EVALs</td>
      </tr>
      <tr>
        <td><strong>Aziz-Mackenzie</strong></td>
        <td>n</td>
        <td>Envy-free</td>
        <td>O(n<sup>n<sup>n<sup>n<sup>n<sup>n</sup></sup></sup></sup></sup>)</td>
        <td>Finite but impractical</td>
      </tr>
    </tbody>
  </table>

  <h3>Detailed Example: Divide-and-Choose</h3>

  <div class="proof-sketch">
    <p><strong>Step-by-step query analysis:</strong></p>
    <ol>
      <li><strong>Divider makes cut:</strong> CUT<sub>1</sub>(0, 0.5) → returns position p where v<sub>1</sub>([0, p]) = 0.5</li>
      <li><strong>Chooser evaluates left piece:</strong> EVAL<sub>2</sub>(0, p) → returns v<sub>2</sub>([0, p])</li>
      <li><strong>Chooser decides:</strong> If v<sub>2</sub>([0, p]) ≥ 0.5, choose left; otherwise, choose right</li>
    </ol>
    <p><strong>Total:</strong> 2 queries (optimal for 2-player proportional division)</p>
  </div>
</div>

<div class="content-block">
  <h2>Lower Bounds</h2>

  <h3>Fundamental Results</h3>

  <div class="theorem-box">
    <p><strong>Theorem (Edmonds-Pruhs, 2006):</strong> Any deterministic algorithm that computes a proportional division for n players requires Ω(n log n) queries in the Robertson-Webb model.</p>
  </div>

  <div class="proof-sketch">
    <p><strong>Proof Sketch:</strong> The proof uses an adversarial argument with a reduction from comparison-based sorting:</p>
    <ol>
      <li>Given n numbers to sort, construct n valuation functions where player i values interval [a<sub>i</sub>, a<sub>i</sub> + ε] highly</li>
      <li>Any proportional division must identify these valuable regions</li>
      <li>Finding these regions is equivalent to sorting the numbers</li>
      <li>Since sorting requires Ω(n log n) comparisons, proportional division requires Ω(n log n) queries</li>
    </ol>
  </div>

  <h3>Open Problems</h3>
  <ul>
    <li><strong>Envy-free for n ≥ 4:</strong> Is there a finite upper bound in the Robertson-Webb model?</li>
    <li><strong>Connected pieces:</strong> What is the query complexity of proportional division with connected pieces?</li>
    <li><strong>Randomized algorithms:</strong> Can randomization significantly reduce query complexity?</li>
  </ul>
</div>

<div class="content-block">
  <h2>Advantages and Limitations</h2>

  <h3>Advantages</h3>
  <ul>
    <li><strong>Minimal information revelation:</strong> Players only reveal necessary preference information</li>
    <li><strong>Natural interaction model:</strong> Queries correspond to natural questions in negotiation</li>
    <li><strong>Clean complexity measure:</strong> Query count provides implementation-independent analysis</li>
    <li><strong>Strategy-proof potential:</strong> Limited information revelation can support truthfulness</li>
  </ul>

  <h3>Limitations</h3>
  <ul>
    <li><strong>Discrete only:</strong> Cannot model continuous procedures (moving-knife)</li>
    <li><strong>Perfect precision assumed:</strong> Real implementations require approximation</li>
    <li><strong>Sequential model:</strong> Doesn't capture potential for parallelization</li>
    <li><strong>No valuation structure:</strong> Treats all valuations equally, missing opportunities for structured preferences</li>
  </ul>
</div>

<div class="content-block">
  <h2>Extensions and Variants</h2>

  <h3>Approximate Queries</h3>
  <p>In practice, players cannot answer queries with perfect precision. The ε-approximate Robertson-Webb model allows:</p>
  <ul>
    <li><strong>ε-CUT:</strong> Returns y where |v<sub>i</sub>([x, y]) - α| ≤ ε</li>
    <li><strong>ε-EVAL:</strong> Returns value within ε of true value</li>
  </ul>
  <p>This enables algorithms with complexity O(n log(1/ε)) for ε-approximate fairness.</p>

  <h3>Parallel Query Model</h3>
  <p>Allows multiple queries to be asked simultaneously:</p>
  <ul>
    <li>Reduces number of rounds of interaction</li>
    <li>Total query count may remain the same</li>
    <li>Better models online platforms where users answer batches of questions</li>
  </ul>

  <h3>Comparison Queries</h3>
  <p>Some variants add a third query type:</p>
  <ul>
    <li><strong>COMPARE<sub>i</sub>(x, y, z, w):</strong> Is piece [x, y] worth more than piece [z, w]?</li>
    <li>Returns binary answer rather than numerical values</li>
    <li>Can be more realistic for human decision-making</li>
  </ul>
</div>

<div class="content-block">
  <h2>Implementation Considerations</h2>

  <h3>From Theory to Practice</h3>

  <div class="implementation-grid">
    <div class="implementation-item">
      <h4>User Interface Design</h4>
      <p>CUT queries → Interactive sliders</p>
      <p>EVAL queries → Visual value displays</p>
    </div>

    <div class="implementation-item">
      <h4>Numerical Precision</h4>
      <p>Floating-point arithmetic limits</p>
      <p>Need for rational approximations</p>
    </div>

    <div class="implementation-item">
      <h4>Query Caching</h4>
      <p>Store previous responses</p>
      <p>Ensure consistency across queries</p>
    </div>

    <div class="implementation-item">
      <h4>Preference Elicitation</h4>
      <p>Guide users through complex queries</p>
      <p>Provide visual feedback</p>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Research Directions</h2>

  <h3>Current Focus Areas</h3>
  <ul>
    <li><strong>Machine learning integration:</strong> Learning valuation functions from partial queries</li>
    <li><strong>Robust algorithms:</strong> Handling inconsistent or noisy query responses</li>
    <li><strong>Multi-dimensional resources:</strong> Extending beyond one-dimensional cake</li>
    <li><strong>Dynamic settings:</strong> Fair division with changing valuations over time</li>
  </ul>

  <h3>Key References</h3>
  <ul>
    <li>Robertson, J., & Webb, W. (1998). <em>Cake-Cutting Algorithms: Be Fair if You Can</em></li>
    <li>Edmonds, J., & Pruhs, K. (2006). "Cake cutting really is not a piece of cake"</li>
    <li>Aziz, H., & Mackenzie, S. (2016). "A discrete and bounded envy-free cake cutting protocol"</li>
    <li>Procaccia, A. D. (2016). "Cake cutting: Not just child's play"</li>
  </ul>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/overview/' | relative_url }}" class="nav-button secondary">← Models Overview</a>
  <a href="{{ '/moving-knife-model/' | relative_url }}" class="nav-button primary">Moving-Knife Model →</a>
</footer>