---
layout: default
title: Theory
permalink: /theory/
---

<div class="page-header">
  <h1 class="page-title">Fair Division Theory</h1>
  <p class="page-description">Mathematical foundations, computational complexity, and theoretical limits in algorithmic fair division</p>
</div>

<!-- Pathways Grid using existing question-block styling -->
<div class="theory-questions">

  <!-- Foundations Track -->
  <div class="question-block">
    <h3>Foundations Track</h3>
    <p>Build mathematical literacy for fair division theory</p>
    <div class="question-links">
      <a href="{{ '/foundations/' | relative_url }}">1. Mathematical Foundations</a>
      <a href="{{ '/fairness-properties/' | relative_url }}">2. Fairness Properties</a>
      <a href="{{ '/existence-theory/' | relative_url }}" class="coming-soon">3. Existence Theory</a>
      <a href="{{ '/impossibility/' | relative_url }}">4. Impossibility Results</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.85rem; color: #718096;">
      <strong>Prerequisites:</strong> Basic calculus and set theory<br>
      <strong>Key Concepts:</strong> Measure theory, valuation functions, proportionality, envy-freeness
    </p>
  </div>

  <!-- Computational Track -->
  <div class="question-block">
    <h3>Computational Track</h3>
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

</div>

<!-- Navigation Footer -->
<footer class="algorithm-navigation">
  <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Algorithms</a>
  <a href="{{ '/exercises/' | relative_url }}" class="nav-button primary">Interactive Exercises →</a>
</footer>