---
layout: default
title: Fair Division Algorithms
---

<div class="page-header" style="padding: 0"></div>

<div class="content-block" style="background: #f8f9fa; border: 1px solid #dee2e6; text-align: center;">
  <p style="margin: 0; color: #6c757d;">
    This site is actively being developed. Some content may be incomplete and/or incorrect. New algorithms, features, and citations are added regularly.
  </p>
  <p style="margin: 0; color: #6c757d; padding-top: 1rem;">
    <a href="https://github.com/amaan-19/fair-division-exercises" target="_blank" style="color: #3182ce;">View development progress on GitHub →</a>
  </p>
</div>

<div class="content-block" style="background: #e8f4fd; border: 2px solid #3182ce;">
  <h2>New Here?</h2>
  <p>This platform teaches algorithms for fairly dividing resources. Browse the collection of algorithms below, study <a href="{{ '/theory/' | relative_url }}">fair division theory</a>, or engage deeply with guided, interactive exercises in the <a href="{{ '/exercises/' | relative_url }}">algorithm simulator!</a></p>
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
            <h3 class="algorithm-title">Divide-and-Choose Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">2 Players</span>
              <span class="meta-badge type-badge">Discrete</span>
              <span class="meta-badge complexity-badge">2 RW Queries</span>
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
            <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>
    
        <!-- Austin's Moving Knife Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Austin Moving Knife Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">2 Players</span>
              <span class="meta-badge type-badge">Continuous</span>
              <span class="meta-badge complexity-badge">$\infty$ RW Queries</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">An extension of Divide-and-Choose employing a moving-knife mechanism.</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Equitable</span>
                <span class="property-tag">Envy-free</span>
                <span class="property-tag">Strategy-proof</span>
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
            <h3 class="algorithm-title">Steinhaus Lone-Divider Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
              <span class="meta-badge type-badge">Discrete</span>
              <span class="meta-badge complexity-badge">8-10 RW Queries</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">A rudimentary procedure enabling basic fair division among three players.</p>
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
              <span class="meta-badge complexity-badge">7-17 RW Queries</span>
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
            <h3 class="algorithm-title">Stromquist Moving Knife Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">3 Players</span>
              <span class="meta-badge type-badge">Continuous</span>
              <span class="meta-badge complexity-badge">$\infty$ RW Queries</span>
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
            <h3 class="algorithm-title">Banach-Knaster Last-Diminisher Procedure</h3>
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

        <!-- Knaster's Sealed Bids Algorithm Card -->
        <div class="algorithm-card">
          <div class="algorithm-header">
            <h3 class="algorithm-title">Knaster Sealed Bids Procedure</h3>
            <div class="algorithm-meta">
              <span class="meta-badge players-badge">N Players</span>
              <span class="meta-badge type-badge">Discrete Items</span>
              <span class="meta-badge mechanism-badge">Auction</span>
              <span class="meta-badge complexity-badge">O(N) Rounds</span>
            </div>
          </div>
          <div class="algorithm-content">
            <p class="algorithm-description">A truthful auction mechanism using sealed bids and monetary transfers</p>
            <div class="algorithm-properties">
              <h4>Fairness Properties</h4>
              <div class="property-tags">
                <span class="property-tag">Proportional*</span>
                <span class="property-tag">Truthful</span>
                <span class="property-tag">Budget-Balanced</span>
              </div>
              <small class="property-note">*With monetary compensation</small>
            </div>
          </div>
          <div class="algorithm-footer">
            <a href="{{ '/algorithms/knaster-sealed-bids/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
          </div>
        </div>

        <!-- Lucas' Method of Markers Algorithm Card -->
        <div class="algorithm-card">
            <div class="algorithm-header">
                <h3 class="algorithm-title">Lucas' Method of Markers</h3>
                <div class="algorithm-meta">
                    <span class="meta-badge players-badge">N Players</span>
                    <span class="meta-badge type-badge">Linear Arrangement</span>
                    <span class="meta-badge mechanism-badge">Marker Placement</span>
                    <span class="meta-badge complexity-badge">O(N²)</span>
                </div>
            </div>
            <div class="algorithm-content">
                <p class="algorithm-description">A procedure for linearly arranged goods using a 'marking' mechanism.</p>
                <div class="algorithm-properties">
                    <h4>Fairness Properties</h4>
                    <div class="property-tags">
                        <span class="property-tag">Proportional</span>
                        <span class="property-tag">Strategy-proof</span>
                        <span class="property-tag">Remainder-efficient</span>
                    </div>
                    <small class="property-note">Works for both continuous and discrete goods in linear arrangement</small>
                </div>
            </div>
            <div class="algorithm-footer">
                <a href="{{ '/algorithms/lucas-method-of-markers/' | relative_url }}" class="algorithm-link">Study Algorithm</a>
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
          <button class="carousel-btn" id="indivisible-prevBtn">‹</button>
          <div class="carousel-indicators" id="indivisible-indicators"></div>
          <button class="carousel-btn" id="indivisible-nextBtn">›</button>
      </div>
    </div>
  </div>
</div>

<script src="assets/card-carousel.js"></script>