---
layout: default
title: Theory
permalink: /theory/
---

<div class="page-header">
  <h1 class="page-title">Fair Division Theory</h1>
  <p class="page-description">Mathematical foundations, computational complexity, and theoretical limits in algorithmic fair division</p>
</div>

<!-- Learning Pathways Introduction -->
<div class="theory-intro">
  <h2>📚 Learning Pathways</h2>
  <p>Choose your path through fair division theory based on your background and interests. Each pathway provides a structured progression through related concepts, building from fundamentals to advanced topics.</p>
</div>

<!-- Pathways Grid using existing question-block styling -->
<div class="theory-questions">

  <!-- Foundations Track -->
  <div class="question-block">
    <h3>🎯 Foundations Track</h3>
    <p>Build mathematical literacy for fair division theory</p>
    <div class="question-links">
      <a href="{{ '/foundations/' | relative_url }}">1. Mathematical Foundations</a>
      <a href="{{ '/fairness-properties/' | relative_url }}">2. Fairness Properties</a>
      <a href="{{ '/existence-theory/' | relative_url }}" class="coming-soon">3. Existence Theory</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #718096;">
      <strong>Prerequisites:</strong> Basic calculus and set theory<br>
      <strong>Key Concepts:</strong> Measure theory, valuation functions, proportionality, envy-freeness
    </p>
  </div>

  <!-- Computational Track -->
  <div class="question-block">
    <h3>⚡ Computational Track</h3>
    <p>Understand algorithmic complexity and implementation</p>
    <div class="question-links">
      <a href="{{ '/robertson-webb-query-model/' | relative_url }}">1. Robertson-Webb Model</a>
      <a href="{{ '/moving-knife-model/' | relative_url }}">2. Moving-Knife Procedures</a>
      <a href="{{ '/complexity-analysis/' | relative_url }}" class="coming-soon">3. Complexity Analysis</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #718096;">
      <strong>Prerequisites:</strong> Foundations Track recommended<br>
      <strong>Key Concepts:</strong> Query complexity, cut/eval queries, upper/lower bounds
    </p>
  </div>

  <!-- Limits & Impossibility Track -->
  <div class="question-block">
    <h3>🚫 Limits & Trade-offs Track</h3>
    <p>Master fundamental limitations and impossibility results</p>
    <div class="question-links">
      <a href="{{ '/impossibility/' | relative_url }}">1. Impossibility Results</a>
      <a href="{{ '/tradeoffs/' | relative_url }}">2. Property Trade-offs</a>
      <a href="{{ '/approximation-theory/' | relative_url }}" class="coming-soon">3. Approximation Theory</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #718096;">
      <strong>Prerequisites:</strong> Computational Track recommended<br>
      <strong>Key Concepts:</strong> Stromquist's theorem, strategy-proofness vs efficiency, ε-fairness
    </p>
  </div>

  <!-- Strategic & Applied Track -->
  <div class="question-block">
    <h3>🎮 Strategic & Applied Track</h3>
    <p>Apply theory to real-world scenarios with strategic agents</p>
    <div class="question-links coming-soon">
      <a href="{{ '/mechanism-design/' | relative_url }}" class="coming-soon">1. Mechanism Design</a>
      <a href="{{ '/extensions/' | relative_url }}" class="coming-soon">2. Extensions & Applications</a>
      <a href="{{ '/research-frontiers/' | relative_url }}" class="coming-soon">3. Research Frontiers</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #718096;">
      <strong>Prerequisites:</strong> Foundations Track + one advanced track<br>
      <strong>Key Concepts:</strong> Incentive compatibility, indivisible goods, online algorithms
    </p>
  </div>

</div>

<!-- Theory-Practice Connection -->
<div class="theory-intro">
  <h2>🔗 Theory Meets Practice</h2>
  <p>See how theoretical concepts power the algorithms in our interactive demonstrations. Each concept below links directly to working implementations you can explore and experiment with.</p>
</div>

<div class="theory-questions">

  <div class="question-block">
    <h3>Query Complexity in Action</h3>
    <p>Watch real-time query counting as algorithms interact with player preferences</p>
    <div class="question-links">
      <a href="{{ '/exercises/' | relative_url }}">Interactive Demos</a>
      <a href="{{ '/analysis/' | relative_url }}">Complexity Comparison</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Mathematical Foundations Applied</h3>
    <p>See how the Intermediate Value Theorem enables exact cut-finding in continuous algorithms</p>
    <div class="question-links">
      <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}">Austin's Moving Knife</a>
      <a href="{{ '/algorithms/stromquist/' | relative_url }}">Stromquist Protocol</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Fairness Properties Comparison</h3>
    <p>Compare how different algorithms achieve proportionality vs envy-freeness</p>
    <div class="question-links">
      <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}">Divide-and-Choose</a>
      <a href="{{ '/algorithms/selfridge-conway/' | relative_url }}">Selfridge-Conway</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Impossibility Results</h3>
    <p>Understand why some combinations of fairness properties can never be achieved together</p>
    <div class="question-links">
      <a href="{{ '/impossibility/' | relative_url }}">Stromquist's Impossibility</a>
      <a href="{{ '/tradeoffs/' | relative_url }}">Strategy-Proofness vs Efficiency</a>
    </div>
  </div>

</div>

<!-- Quick Reference Section -->
<div class="theory-intro">
  <h2>📖 Quick Reference</h2>
  <p>Essential results and concepts for quick lookup during your exploration of the algorithms and exercises.</p>
</div>

<div class="theory-questions">

  <div class="question-block">
    <h3>Key Theorems & Results</h3>
    <p>Fundamental theoretical results that shape fair division theory</p>
    <div class="question-links">
      <a href="{{ '/impossibility/' | relative_url }}">Stromquist's Impossibility (2008)</a>
      <a href="{{ '/existence-theory/' | relative_url }}" class="coming-soon">Proportional Division Existence</a>
      <a href="{{ '/tradeoffs/' | relative_url }}">Strategy-Proofness vs Efficiency</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Complexity Bounds</h3>
    <p>Query complexity results for different fairness properties</p>
    <div class="question-links">
      <a href="{{ '/complexity-analysis/' | relative_url }}" class="coming-soon">2-player: Θ(2) queries</a>
      <a href="{{ '/complexity-analysis/' | relative_url }}" class="coming-soon">n-player proportional: Θ(n)</a>
      <a href="{{ '/impossibility/' | relative_url }}">n-player envy-free: No finite bound</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Essential Concepts</h3>
    <p>Core definitions and mathematical tools you'll encounter throughout</p>
    <div class="question-links">
      <a href="{{ '/foundations/' | relative_url }}">Valuation Functions</a>
      <a href="{{ '/robertson-webb-query-model/' | relative_url }}">Robertson-Webb Queries</a>
      <a href="{{ '/fairness-properties/' | relative_url }}">Fairness Properties</a>
    </div>
  </div>

  <div class="question-block">
    <h3>Mathematical Tools</h3>
    <p>Key mathematical techniques used in proofs and algorithm design</p>
    <div class="question-links">
      <a href="{{ '/foundations/' | relative_url }}">Intermediate Value Theorem</a>
      <a href="{{ '/existence-theory/' | relative_url }}" class="coming-soon">Fixed-Point Theorems</a>
      <a href="{{ '/impossibility/' | relative_url }}">Adversarial Arguments</a>
    </div>
  </div>

</div>

<!-- Navigation Footer -->
<footer class="algorithm-navigation">
  <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Algorithms</a>
  <a href="{{ '/exercises/' | relative_url }}" class="nav-button primary">Interactive Exercises →</a>
</footer>