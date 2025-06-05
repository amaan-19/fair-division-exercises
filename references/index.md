---
layout: default
title: References
permalink: /references/
---

<div class="page-header">
  <h1 class="page-title">References</h1>
  <p class="page-description">Academic sources and foundational texts in fair division theory</p>
</div>

<div class="references-grid">
  <div class="reference-card">
    <div class="reference-header">
      <h3 class="reference-title">Fair Division: From Cake-Cutting to Dispute Resolution</h3>
      <div class="reference-meta">
        <span class="type-badge book">Book</span>
        <span class="year-badge">1996</span>
      </div>
    </div>
    <div class="reference-content">
      <p class="reference-authors">Steven J. Brams, Alan D. Taylor</p>
      <p class="reference-publication">Cambridge University Press</p>
      <p class="reference-description">The definitive text on fair division algorithms, covering everything from classical cake-cutting procedures to modern applications in dispute resolution. Provides rigorous mathematical analysis of proportionality, envy-freeness, and efficiency properties across discrete and continuous fair division problems.</p>
      <div class="reference-tags">
        <span class="reference-tag">Cake-Cutting</span>
        <span class="reference-tag">Divide-and-Choose</span>
        <span class="reference-tag">Envy-Free</span>
        <span class="reference-tag">Proportional</span>
        <span class="reference-tag">Foundational</span>
      </div>
    </div>
    <div class="reference-footer">
      <a href="https://www.cambridge.org/core/books/fair-division/0C2A8FD1F92BE8DE0B8DA23C5C5F6A6B" class="reference-link" target="_blank">View Book →</a>
      <span class="citation-note" onclick="copyCitation(this)" data-citation="Brams, S. J., & Taylor, A. D. (1996). Fair Division: From Cake-Cutting to Dispute Resolution. Cambridge University Press.">Click to copy citation</span>
    </div>
  </div>
</div>

<script>
function copyCitation(element) {
    const citation = element.getAttribute('data-citation');
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(citation).then(() => {
            showCopyFeedback(element);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback(element);
        } catch (err) {
            console.error('Failed to copy citation');
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Citation copied!';
    element.style.color = '#38a169';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.color = '#718096';
    }, 2000);
}
</script>
