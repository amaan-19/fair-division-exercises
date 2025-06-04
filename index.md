---
layout: default
title: Fair Division Algorithms
---

<div class="algorithms-section">
  <div class="algorithm-grid">

    <!-- Divide-and-Choose Algorithm Card -->
    <div class="algorithm-card">
      <div class="algorithm-header">
        <h3 class="algorithm-title">Divide-and-Choose</h3>
        <div class="algorithm-meta">
          <span class="players-badge">2 Players</span>
          <span class="type-badge">Discrete</span>
        </div>
      </div>
      <div class="algorithm-content">
        <p class="algorithm-description">The fundamental fair division procedure for two players. One player divides the resource into pieces they value equally, while the other player chooses their preferred piece.</p>
        <div class="algorithm-properties">
          <h4>Properties</h4>
          <div class="property-tags">
            <span class="property-tag">Proportional</span>
            <span class="property-tag">Envy-free</span>
            <span class="property-tag">Strategy-proof</span>
          </div>
        </div>
      </div>
      <div class="algorithm-footer">
        <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
      </div>
    </div>
    
    <!-- Austin's Moving Knife Algorithm Card -->
    <div class="algorithm-card">
      <div class="algorithm-header">
        <h3 class="algorithm-title">Austin's Moving Knife</h3>
        <div class="algorithm-meta">
          <span class="players-badge">2 Players</span>
          <span class="type-badge">Continuous</span>
        </div>
      </div>
      <div class="algorithm-content">
        <p class="algorithm-description"> An elegant extension of "Divide-and-Choose" which relies on a moving knife mechanism. </p>
        <div class="algorithm-properties">
          <h4>Properties</h4>
          <div class="property-tags">
            <span class="property-tag">Equitable</span>
            <span class="property-tag">Exact</span>
            <span class="property-tag">Envy-free</span>
          </div>
        </div>
      </div>
      <div class="algorithm-footer">
        <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
      </div>
    </div>

    <!-- Placeholder for future algorithms -->
    <div class="algorithm-card coming-soon">
      <div class="algorithm-header">
        <h3 class="algorithm-title">Coming soon!</h3>
      </div>
    </div>
  </div>
</div>

<div class="content-block intro-block">
  <h2>About Fair Division</h2>
  <p>Fair division theory provides mathematical frameworks for allocating resources among multiple parties in ways that satisfy rigorous fairness criteria. From ancient legal disputes to modern computational problems, these algorithms ensure equitable outcomes through elegant mathematical procedures.</p>
  <a href="https://en.wikipedia.org/wiki/Fair_division" target="_blank" class="algorithm-link">Read more →</a>
</div>