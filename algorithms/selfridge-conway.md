---
layout: default
title: Selfridge-Conway Procedure
permalink: /algorithms/selfridge-conway/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Selfridge-Conway Procedure</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">3 Players</span>
        <span class="meta-badge type-badge">Discrete</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Though neither Selfridge or Conway every actually published this fundamental envy-free procedure for three players, they both discovered it independently, laying the way for the publication of more complex envy-free procedures.</p>
    <a href="https://en.wikipedia.org/wiki/Selfridge%E2%80%93Conway_procedure" target="_blank" class="algorithm-link">Read more →</a>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
  <h2>Algorithm Flowchart</h2>
  <div class="iframe-container">
    <iframe 
      src="{{ '/assets/flowcharts/selfridge-conway-procedure.html' | relative_url }}" 
      width="100%" 
      height="1370" 
      frameborder="0"
      style="border: 1px solid #e2e8f0; border-radius: 8px;">
      <p>Your browser does not support iframes. <a href="{{ '/assets/flowcharts/selfridge-conway-procedure.html' | relative_url }}">View the flowchart directly</a>.</p>
    </iframe>
  </div>
</section>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>The Selfridge-Conway procedure satisfies one fairness property:</p>

    <h3>Envy-free</h3>
    <p>None of the players prefers any of the other's allocation to their own.</p>
    <div class="proof-sketch">
      
    </div>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/steinhaus-lone-divider/' | relative_url }}" class="nav-button secondary">← Back to Steinhaus</a>
    <a href="{{ '/algorithms/banach-knaster-last-diminisher/' | relative_url }}" class="nav-button primary">Next: Banach-Knaster →</a>
  </footer>

</div>