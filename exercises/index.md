---
layout: default
title: Interactive Exercises
permalink: /exercises/
---

<div class="page-header">
  <h1 class="page-title">Interactive Exercises</h1>
  <p class="page-description">Practice fair division algorithms through guided exercises and comparative analysis</p>
</div>

<div class="content-block">
  <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; justify-content: center;">
    <div>
      <label for="exercise-list" style="font-weight: 500; margin-right: 0.5rem;">Select Exercise:</label>
      <select id="exercise-list" class="algorithm-dropdown">
        <option value="">Choose an Exercise</option>
      </select>
    </div>
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

  <div style="text-align: center;">
    <a href="{{ '/' | relative_url }}" class="nav-button primary">Go to the simulator!</a>
  </div>
</div>

<footer class="algorithm-navigation">
  <a href="{{ '/theory/' | relative_url }}" class="nav-button secondary">← Back to Theory</a>
  <a href="{{ '/glossary/' | relative_url }}" class="nav-button primary">Glossary →</a>
</footer>

<script src="{{ '/assets/exercises/exercises.js' | relative_url }}"></script>