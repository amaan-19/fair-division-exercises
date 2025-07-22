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
          <th style="text-align: center">Players</th>
          <th style="text-align: center">Cut Queries</th>
          <th style="text-align: center">Eval Queries</th>
          <th style="text-align: center">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="/algorithms/divide-and-choose/">Divide-and-Choose</a></td>
          <td style="text-align: center">2</td>
          <td style="text-align: center">1</td>
          <td style="text-align: center">1</td>
          <td style="text-align: center"><strong>2</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/austins-moving-knife/">Austin's Moving Knife*</a></td>
          <td style="text-align: center">2</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center"><strong>∞</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/steinhaus-lone-divider/">Steinhaus Lone-Divider</a></td>
          <td style="text-align: center">3</td>
          <td style="text-align: center">2-3</td>
          <td style="text-align: center">6-7</td>
          <td style="text-align: center"><strong>8-10</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/selfridge-conway/">Selfridge-Conway</a></td>
          <td style="text-align: center">3</td>
          <td style="text-align: center">2-5</td>
          <td style="text-align: center">5-12</td>
          <td style="text-align: center"><strong>7-17</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/stromquist/">Stromquist Moving Knife*</a></td>
          <td style="text-align: center">3</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center"><strong>∞</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/banach-knaster-last-diminisher/">Banach-Knaster Last-Diminisher</a></td>
          <td style="text-align: center">N</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center"><strong>O(N²)</strong></td>
        </tr>
        <tr>
          <td><a href="/algorithms/brams-taylor/">Brams-Taylor</a></td>
          <td style="text-align: center">N</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center">-</td>
          <td style="text-align: center"><strong>$\Omega$(N)</strong></td>
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
  <a href="{{ '/exercises/' | relative_url }}" class="nav-button secondary">← Exercises + Simulator</a>
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