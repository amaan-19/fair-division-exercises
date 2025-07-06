---
layout: default
title: Fair Division Algorithms
---

<div class="page-header">
  <h1 class="page-title">Fair Division Algorithms</h1>
  <p class="page-description">Explore the (almost) comprehensive collection</p>
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
              <span class="meta-badge type-badge">Discrete</span>
              <span class="meta-badge complexity-badge">$\Omega(2)$ RW</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">The fundamental fair division procedure for two players.</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Envy-free</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>
    
        <!-- Austin's Moving Knife Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Austin Moving Knife</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">2 Players</span>
              <span class="meta-badge type-badge">Continuous</span>
              <span class="meta-badge complexity-badge">$O(\infty)$ RW</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">An extension of Divide-and-Choose employing a moving-knife mechanism for stronger fairness guarantees.</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Equitable</span>
                <span class="property-tag">Exact</span>
                <span class="property-tag">Envy-free</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Steinhaus' Lone-Divider Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Steinhaus Lone-Divider</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
              <span class="meta-badge type-badge">Discrete</span>
              <span class="meta-badge complexity-badge">$O(10)$ RW</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">A relativley rudimentary procedure enabling basic fair division among three players.</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Proportional</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/steinhaus-lone-divider/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Selfridge-Conway Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Selfridge-Conway Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
              <span class="meta-badge type-badge">Discrete</span>
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
            <a href="{{ '/algorithms/selfridge-conway/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Stromquist Moving Knife Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Stromquist Moving Knife</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
              <span class="meta-badge type-badge">Continuous</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">A continuous procedure for envy-free division between three parties</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Envy-free</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/stromquist/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Banach-Knaster's Last-Diminisher Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Banach-Knaster Last-Diminisher</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">N Players</span>
              <span class="meta-badge type-badge">Discrete</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">An elegant procedure ensuring proportionality for any number of players</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Proportional</span>
              </div>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/banach-knaster-last-diminisher/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Brams-Taylor Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Brams-Taylor Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">N Players</span>
              <span class="meta-badge type-badge">Discrete</span>
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
            <a href="{{ '/algorithms/brams-taylor/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
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

<script src="card-carousel.js"></script>