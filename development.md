---
layout: default
title: Development Lab
permalink: /development/
---

# Development Lab

*This page provides access to experimental features and development tools during the creation of the unified algorithm demo system.*

---

## Unified Demo System

The next-generation interactive tool that allows comparison of multiple fair division algorithms on the same geometric cake.

<div class="content-block">
  <h3>Current Status: In Development</h3>
  <p>The unified demo combines all individual algorithm demonstrations into a single, powerful comparison tool.</p>
  
  <div style="margin: 20px 0;">
    <a href="{{ '/assets/demos/unified/unified-demo.html' | relative_url }}" class="algorithm-link" target="_blank">
      🔗 Open Unified Demo →
    </a>
  </div>
  
  <p><strong>Features being developed:</strong></p>
  <ul>
    <li>Side-by-side algorithm comparison</li>
    <li>Shared geometric cake visualization</li>
    <li>Fairness analysis across algorithms</li>
    <li>Unified player valuation system</li>
  </ul>
</div>

---

## Verification & Testing

Tools for ensuring algorithm accuracy and feature preservation during development.

<div class="content-block">
  <h3>Algorithm Verification System</h3>
  <p>Comprehensive testing suite that verifies mathematical accuracy and UI functionality preservation.</p>
  
  <div style="margin: 20px 0;">
    <a href="{{ '/assets/demos/verification-implementation.js' | relative_url }}" class="algorithm-link" target="_blank">
      📜 View Verification Code →
    </a>
  </div>
  
  <h4>Integration Instructions</h4>
  <p>To add verification to any demo:</p>
  
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; font-family: monospace; font-size: 14px;">
&lt;script src="../../verification-implementation.js"&gt;&lt;/script&gt;
&lt;script&gt;
async function runTest() {
    const verification = new DivideAndChooseVerification();
    await verification.runFullVerification();
}
&lt;/script&gt;
&lt;button onclick="runTest()"&gt;🧪 Test Changes&lt;/button&gt;
  </div>
</div>

---

## Development Files

Direct access to development components:

<div class="content-block">
  <h3>Core System Files</h3>
  <ul>
    <li><a href="{{ '/assets/demos/unified/core/unified-demo-system.js' | relative_url }}" target="_blank">Main System Controller</a></li>
    <li><a href="{{ '/assets/demos/unified/core/unified-game-state.js' | relative_url }}" target="_blank">Game State Management</a></li>
    <li><a href="{{ '/assets/demos/unified/core/base-algorithm.js' | relative_url }}" target="_blank">Algorithm Base Class</a></li>
    <li><a href="{{ '/assets/demos/unified/core/shared-calculation-engine.js' | relative_url }}" target="_blank">Calculation Engine</a></li>
  </ul>
  
  <h3>Algorithm Implementations</h3>
  <ul>
    <li><a href="{{ '/assets/demos/unified/algorithms/divide-and-choose-algorithm.js' | relative_url }}" target="_blank">Divide-and-Choose (Unified)</a></li>
    <li><a href="{{ '/assets/demos/unified/examples/simple-divide-and-choose.js' | relative_url }}" target="_blank">Reference Implementation</a></li>
  </ul>
  
  <h3>UI Components</h3>
  <ul>
    <li><a href="{{ '/assets/demos/unified/ui/unified-ui-manager.js' | relative_url }}" target="_blank">UI Manager</a></li>
    <li><a href="{{ '/assets/demos/unified/unified-demo-main.js' | relative_url }}" target="_blank">Main Demo Script</a></li>
  </ul>
</div>

---

*This page is for development purposes only and will be removed before final deployment.*