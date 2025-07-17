---
layout: default
title: Robertson-Webb Query Model
permalink: /robertson-webb-query-model/
---

<div class="page-header">
  <h1 class="page-title">Robertson-Webb Query Model</h1>
  <p class="page-description">A computational framework for analyzing fair division algorithm complexity</p>
</div>

<div class="content-block">
  <h2>Overview</h2>
  <p>The Robertson-Webb query model provides a theoretical framework for measuring the computational complexity of fair division algorithms. Rather than counting traditional operations, this model measures complexity in terms of queries to players about their preferences.</p>
</div>

<div class="content-block">
  <h2>Query Types</h2>

  <div class="properties-grid">

    <div class="property-card">
      <h3>Cut Queries</h3>
      <p class="property-description">
        <strong>Format:</strong> "Cut the cake at position $x$ such that the left piece has value $v$ to you."
      </p>
      <p>Used when algorithms need players to make specific cuts based on their valuations.</p>
    </div>

    <div class="property-card">
      <h3>Eval Queries</h3>
      <p class="property-description">
        <strong>Format:</strong> "What is the value of this piece to you?"
      </p>
      <p>Used when algorithms need to determine how players value given pieces.</p>
    </div>
  </div>
</div>

<div class="content-block">
  <h2>Applications to Fair Division</h2>

  <h3>Query Complexity Analysis</h3>
  <p>Different algorithms require different numbers of queries:</p>

  <ul>
    <li><strong>Divide-and-Choose:</strong> 1 cut query + 1 eval query = 2 total queries</li>
    <li><strong>Austin's Moving Knife:</strong> Continuous eval queries until stopping condition</li>
    <li><strong>Steinhaus Lone-Divider:</strong> 2 cut queries + multiple eval queries</li>
  </ul>

  <h3>Lower Bounds</h3>
  <p>The model helps establish theoretical limits on algorithm efficiency. For example, any proportional division algorithm for $n$ players requires at least $n-1$ queries.</p>

  <div class="proof-sketch">
    <p>We use an adversarial argument with a communication complexity reduction. Consider the following problem: given $n-1$ bits, $b_1, b_2, ..., b_{n-1}$, compute their OR. We can reduce this to a proportional division problem as follows:</p>
    <li></li>
  </div>
</div>


<div class="content-block">
  <h2>Significance</h2>
  <p>This framework is crucial because:</p>
  <ul>
    <li>It provides a realistic model where players' preferences are private</li>
    <li>It enables fair comparison between different algorithmic approaches</li>
    <li>It bridges theoretical computer science and practical mechanism design</li>
  </ul>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/fairness-properties/' | relative_url }}" class="nav-button secondary">← Back to Fairness Properties</a>
  <a href="{{ '/impossibility/' | relative_url }}" class="nav-button primary">Impossibility →</a>
</footer>