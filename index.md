---
layout: default
title: Fair Division Algorithms
---

<div class="page-header">
  <h1 class="page-title">Algorithms</h1>
  <p class="page-description">Explore our (almost!) comprehensive list of fair-division algorithms</p>
</div>

<div class="algorithms-section">
  <!-- Divisible Resources Section -->
  <div class="carousel-section">
    <div class="carousel-section-header">
      <h2>Divisible Resources</h2>
      <p class="carousel-section-description">Algorithms for resources that can be cut and divided continuously, like cake or land</p>
    </div>

    <div class="algorithm-carousel" id="divisible-carousel">
      <!-- Algorithm Track -->
      <div class="algorithm-track" id="divisible-track">
        <!-- Divide-and-Choose Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Divide-and-Choose</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">2 Players</span>
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
            <h3 class="algorithm-title">Austin Moving Knife</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">2 Players</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">Utilizes a referee and a moving-knife mechanism for stronger fairness guarantees.</p>
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
            <h3 class="algorithm-title">Steinhaus Lone-Divider</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
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

        <!-- Selfridge-Conway Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Selfridge-Conway Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">The first envy-free procedure for three players</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Envy-free</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/selfridge-conway/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
          </div>
        </div>

        <!-- Banach-Knaster's Last-Diminisher Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Banach-Knaster Last-Diminisher</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">N Players</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">Employs a diminishing rule to ensure proportionality for any number of players</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Proportional</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/banach-knaster-last-diminisher/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
          </div>
        </div>

        <!-- Brams-Taylor Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Brams-Taylor Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">N Players</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">Description...</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Envy-free</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/brams-taylor/' | relative_url }}" class="algorithm-link">Study Algorithm →</a>
          </div>
        </div>

        <!-- Placeholder for future algorithms -->
        <div class="algorithm-card coming-soon">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Coming Soon!</h3>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
          <button class="carousel-btn" id="divisible-prevBtn">‹</button>
          <div class="carousel-indicators" id="divisible-indicators"></div>
          <button class="carousel-btn" id="divisible-nextBtn">›</button>
      </div>
    </div>
  </div>

  <!-- Indivisible Resources Section -->
  <div class="carousel-section">
    <div class="carousel-section-header">
      <h2>Indivisible Resources</h2>
      <p> Algorithms for discrete items that cannot be divided, like houses or artwork</p>
    </div>

    <div class="algorithm-carousel" id="indivisible-carousel">
      <!-- Algorithm Track -->
      <div class="algorithm-track" id="indivisible-track">
        <!-- Placeholder for future algorithms -->
        <div class="algorithm-card coming-soon">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Coming Soon!</h3>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
          <button class="carousel-btn" id="indivisible-prevBtn">‹</button>
          <div class="carousel-indicators" id="indivisible-indicators"></div>
          <button class="carousel-btn" id="indivisible-nextBtn">›</button>
      </div>
    </div>
  </div>
</div>

<div class="content-block demo-section">
  <div class="demo-header">
    <h2>Algorithm Simulator</h2>
  </div>

  <!-- Demo Interface Container -->
  <div class="unified-demo-container">
    <iframe 
      src="{{ '/assets/demos/unified/index.html' | relative_url }}" 
      width="100%" 
      height="1200" 
      frameborder="0"
      style="display: block; border: none;">
      <p>Your browser does not support iframes. <a href="{{ '/assets/demos/unified/index.html' | relative_url }}">View the demo directly</a>.</p>
    </iframe>
  </div>

</div>

<div class="content-block intro-block">
  <h2>About Fair Division</h2>
  <p>Fair division theory provides mathematical frameworks for allocating resources among multiple parties in ways that satisfy rigorous fairness criteria. From ancient legal disputes to modern computational problems, these algorithms ensure equitable outcomes through elegant mathematical procedures.</p>
  <a href="https://en.wikipedia.org/wiki/Fair_division" target="_blank" class="algorithm-link">Read more →</a>
</div>

<script src="card-carousel.js"></script>