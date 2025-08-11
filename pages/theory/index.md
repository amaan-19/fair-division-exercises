---
layout: default
title: Theory
permalink: /theory/
---

<div class="page-header">
  <h1 class="page-title">Theory</h1>
  <p class="page-description">Explore the mathematical foundations, computational models, and theoretical limits that underpin algorithmic fair division</p>
</div>

<!-- Pathways Grid using existing question-block styling -->
<div class="theory-questions">
  <!-- Foundations Track -->
  <div class="question-block">
    <h3>Foundational Concepts</h3>
    <p>Build your mathematical literacy for fair division theory through core concepts that bridge intuition with rigorous formalism.</p>
    <div class="topics-grid">
      <div class="question-links">
        <a href="{{ '/foundations/' | relative_url }}">Mathematical Foundations</a>
        <a href="{{ '/fairness-properties/' | relative_url }}">Fairness Properties</a>
        <a href="{{ '/impossibility/' | relative_url }}">Impossibility Results</a>
        <a href="{{ '/overview/' | relative_url }}">Models of Computation</a>
      </div>
    </div>
  </div>

  <!-- Computational Track -->
  <div class="question-block">
    <h3>Computational Models</h3>
    <p>Understand how we define fair division problems and analyze the complexity of their solutions.</p>
    <div class="question-links">
      <a href="{{ '/robertson-webb-query-model/' | relative_url }}">Robertson-Webb Model</a>
      <a href="{{ '/moving-knife-model/' | relative_url }}">Moving-Knife Procedures</a>
      <a href="{{ '/direct-revelation-model/' | relative_url }}">Direct Revelation Model</a>
      <a href="{{ '/simultaneous-queries-model/' | relative_url }}">Simultaneous Reports Model</a>
    </div>
  </div>

</div>

<!-- Navigation Footer -->
<footer class="algorithm-navigation">
  <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Algorithms</a>
  <a href="{{ '/exercises/' | relative_url }}" class="nav-button primary">Interactive Exercises →</a>
</footer>