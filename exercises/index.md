---
layout: default
title: Interactive Exercises
permalink: /exercises/
---

<div class="page-header">
  <h1 class="page-title">Interactive Exercises</h1>
  <p class="page-description">Practice fair division algorithms through guided exercises and comparative analysis</p>
</div>


<div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
  <div>
    <label for="exercise-list" style="font-weight: 500; margin-right: 0.5rem;"></label>
      <select id="exercise-list" class="algorithm-dropdown">
        <option value="">Choose an Exercise</option>
      </select>
  </div>
</div>

<div class="content-block" id="exercise-panel" style="display: none;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <h2 id="exercise-title">Exercise Title</h2>
    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
      <span id="exercise-difficulty" class="meta-badge"></span>
      <span id="exercise-time" class="meta-badge"></span>
    </div>
  </div>

  <div id="exercise-description" style="font-size: 1.1rem; margin-bottom: 2rem; text-align: center;"></div>

  <div id="exercise-objectives" style="margin-bottom: 2rem;"></div>

  <div id="exercise-instructions" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;"></div>

  <h3 style="text-align: center">Try it out below!</h3>
</div>

<div class="content-block demo-section">
  <div class="demo-header">
    <h2>Algorithm Simulator</h2>
  </div>

  <div class="content-block" style="background: #f0fff4; border-left: 4px solid #38a169;">
      <h3>🎯 User Testing Instructions</h3>
      <p><strong>Try this:</strong> Select "Divide-and-Choose" from the dropdown, adjust the colored sliders to see how players value different parts of the "cake," then click "Start" to see the algorithm in action!</p>
      <details>
        <summary><strong>What am I looking at?</strong></summary>
        <ul>
          <li><strong>Colored regions:</strong> Different parts of a resource (imagine cake flavors)</li>
          <li><strong>Player values:</strong> How much each person values each part (adjustable on right)</li>
          <li><strong>Cut line:</strong> Where to divide the resource</li>
          <li><strong>Goal:</strong> Create a division both players think is fair</li>
        </ul>
      </details>
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

<footer class="algorithm-navigation">
  <a href="{{ '/theory/' | relative_url }}" class="nav-button secondary">← Back to Theory</a>
  <a href="{{ '/analysis/' | relative_url }}" class="nav-button primary">Analysis →</a>
</footer>

<script src="{{ '/assets/exercises/exercises.js' | relative_url }}"></script>