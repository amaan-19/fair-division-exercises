---
layout: default
title: Algorithm Complexity Comparison
permalink: /analysis/
---

<div class="page-header">
  <h1 class="page-title">Query Complexity Analysis</h1>
  <p class="page-description">Comparing fair division algorithms through the Robertson-Webb lens</p>
</div>

<div class="content-block">
  <h2>Complexity Comparison Table</h2>

  <div class="comparison-table">
    <table>
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>Players</th>
          <th>Cut Queries</th>
          <th>Eval Queries</th>
          <th>Total</th>
          <th>Optimality</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="/algorithms/divide-and-choose/">Divide-and-Choose</a></td>
          <td>2</td>
          <td>1</td>
          <td>1</td>
          <td><strong>2</strong></td>
          <td>✅ Optimal</td>
        </tr>
        <tr>
          <td><a href="/algorithms/austins-moving-knife/">Austin's Moving Knife</a></td>
          <td>2</td>
          <td>0</td>
          <td>O(∞)*</td>
          <td><strong>O(∞)</strong></td>
          <td>❌ Continuous</td>
        </tr>
        <tr>
          <td><a href="/algorithms/steinhaus-lone-divider/">Steinhaus Lone-Divider</a></td>
          <td>3</td>
          <td>2-4</td>
          <td>3-6</td>
          <td><strong>5-10</strong></td>
          <td>❓ Unknown</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p><em>*Continuous algorithms require infinitesimal queries</em></p>
</div>

<div class="content-block">
  <h2>Key Insights</h2>

<h3>Discrete vs. Continuous Procedures</h3>
  <p>The Robertson-Webb model reveals a fundamental trade-off between query efficiency and algorithmic properties:</p>

  <ul>
    <li><strong>Discrete algorithms</strong> (like Divide-and-Choose) use finite queries but may sacrifice exactness</li>
    <li><strong>Continuous algorithms</strong> (like Austin's Moving Knife) achieve stronger properties but require infinite query complexity</li>
  </ul>

<h3>Lower Bounds</h3>
  <p>Theoretical results from the Robertson-Webb framework:</p>
  <ul>
    <li>Any proportional 2-player algorithm requires ≥ 2 queries</li>
    <li>Any envy-free n-player algorithm requires ≥ n queries</li>
    <li>Exact division generally requires continuous procedures</li>
  </ul>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/exercises/' | relative_url }}" class="nav-button secondary">← Back to Exercises</a>
  <a href="{{ '/glossary/' | relative_url }}" class="nav-button primary">Glossary →</a>
</footer>

<style>
.comparison-table {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.comparison-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2d3748;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-table tr:hover {
  background: #f8f9fa;
}
</style>