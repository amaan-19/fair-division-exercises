---
layout: default
title: Fair Division Algorithms
---

<div class="algorithms-section">
  <div class="algorithm-carousel" id="algorithm-carousel">
    <!-- Algorithm Track -->
    <div class="algorithm-track" id="algorithm-track">
      <!-- Divide-and-Choose Algorithm Card -->
      <div class="algorithm-card">
        <div class="algorithm-header">
          <h3 class="algorithm-title">Divide-and-Choose</h3>
          <div class="algorithm-meta">
            <span class="meta-badge players-badge">2 Players</span>
            <span class="meta-badge complexity-badge">Discrete</span>
          </div>
        </div>
        <div class="algorithm-content">
          <p class="algorithm-description">The fundamental fair division procedure for two players.</p>
          <div class="algorithm-properties">
            <h4>Fairness Properties</h4>
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
            <span class="meta-badge players-badge">2 Players</span>
            <span class="meta-badge complexity-badge">Continuous</span>
          </div>
        </div>
        <div class="algorithm-content">
          <p class="algorithm-description">Introduces a referee and a continuous, moving-knife mechanism for stronger fairness guarantees.</p>
          <div class="algorithm-properties">
            <h4>Fairness Properties</h4>
            <div class="property-tags">
              <span class="property-tag">Equitable</span>
              <span class="property-tag">Exact</span>
              <span class="property-tag">Envy-free</span>
              <span class="property-tag">Strategy-proof</span>
            </div>
          </div>
        </div>
        <div class="algorithm-footer">
          <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
        </div>
      </div>

      <!-- Steinhaus' Lone-Divider Algorithm Card -->
      <div class="algorithm-card">
        <div class="algorithm-header">
          <h3 class="algorithm-title">Steinhaus' Lone-Divider</h3>
          <div class="algorithm-meta">
            <span class="meta-badge players-badge">3 Players</span>
            <span class="meta-badge complexity-badge">Discrete</span>
          </div>
        </div>
        <div class="algorithm-content">
          <p class="algorithm-description">Rudimentary procedure enabling basic fair division among three players.</p>
          <div class="algorithm-properties">
            <h4>Fairness Properties</h4>
            <div class="property-tags">
              <span class="property-tag">Proportional</span>
            </div>
          </div>
        </div>
        <div class="algorithm-footer">
          <a href="{{ '/algorithms/steinhaus-lone-divider/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
        </div>
      </div>

      <!-- Placeholder for future algorithms -->
      <div class="algorithm-card coming-soon">
        <div class="algorithm-header">
          <h3 class="algorithm-title">Coming soon!</h3>
        </div>
      </div>
    </div>

    <div class="carousel-controls">
        <button class="carousel-btn" id="prevBtn">‹</button>
        <div class="carousel-indicators" id="indicators"></div>
        <button class="carousel-btn" id="nextBtn">›</button>
    </div>

  </div>
</div>



  


<div class="content-block demo-section">
  <div class="demo-header">
    <h2>Interactive Algorithm Simulator</h2>
    <p class="demo-subtitle">Experience multiple fair division algorithms side-by-side with live visualizations and customizable scenarios.</p>
  </div>
  

  <!-- Demo Interface Container -->
  <div class="unified-demo-container" id="unified-demo-root">
    <!-- Demo will be populated here by JavaScript -->
    <div class="demo-loading">
      <p>Loading interactive demo...</p>
    </div>
  </div>

</div>

<div class="content-block intro-block">
  <h2>About Fair Division</h2>
  <p>Fair division theory provides mathematical frameworks for allocating resources among multiple parties in ways that satisfy rigorous fairness criteria. From ancient legal disputes to modern computational problems, these algorithms ensure equitable outcomes through elegant mathematical procedures.</p>
  <a href="https://en.wikipedia.org/wiki/Fair_division" target="_blank" class="algorithm-link">Read more →</a>
</div>

<script src="card-carousel.js"></script>