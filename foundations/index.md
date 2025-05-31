---
layout: default
title: "Foundations"
permalink: /foundations/
---

<div class="foundations-index-page">
    <header class="page-header">
        <h1 class="serif">Foundations of Fair Division</h1>
        <p class="page-description">
            Before diving into specific algorithms, it's essential to understand the mathematical criteria used to evaluate fairness. These foundational concepts will help you analyze any division procedure and understand the trade-offs between different approaches.
        </p>
    </header>

        <div class="topic-grid">
            <article class="topic-card fade-in">
                <div class="topic-header">
                    <h3><a href="{{ '/foundations/fairness-criteria/' | relative_url }}">Fairness Criteria</a></h3>
                    <div class="topic-badges">
                        <span class="difficulty-badge difficulty-fundamental">Fundamental</span>
                    </div>
                </div>
                <div class="topic-content">
                    <p>Learn the mathematical definitions of proportionality, envy-freeness, stability, equitability, and more. Understand how these criteria relate to each other and why they matter in practice.</p>
                    
                    <div class="topic-highlights">
                        <h4>Key Concepts:</h4>
                        <ul>
                            <li>Proportional allocations</li>
                            <li>Envy-free divisions</li>
                            <li>Pareto efficiency</li>
                            <li>Strategy-proof mechanisms</li>
                            <li>Trade-offs between criteria</li>
                        </ul>
                    </div>
                </div>
                <div class="topic-footer">
                    <a href="{{ '/foundations/fairness-criteria/' | relative_url }}" class="study-topic-btn">Study Fairness Criteria</a>
                </div>
            </article>

            <article class="topic-card fade-in coming-soon" style="animation-delay: 0.1s;">
                <div class="topic-header">
                    <h3>Rationality</h3>
                    <div class="topic-badges">
                        <span class="difficulty-badge difficulty-fundamental">Fundamental</span>
                        <span class="status-badge status-coming">Coming Soon</span>
                    </div>
                </div>
                <div class="topic-content">
                    <p>What does it mean to act rationally in fair-division contexts? Why does it matter?</p>
                </div>
            </article>
    </div>
</div>

<style>
.foundations-index-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-header h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.page-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
}

.overview-section {
    margin-bottom: 3rem;
}

.overview-section h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 2rem;
}

.section-intro {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    max-width: 800px;
}

.topic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.topic-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.topic-card:hover:not(.coming-soon) {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.topic-card.coming-soon {
    opacity: 0.7;
    background: #f8f9fa;
}

.topic-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #eee;
}

.topic-header h3 {
    margin: 0 0 1rem 0;
    font-size: 1.4rem;
}

.topic-header h3 a {
    color: #2c3e50;
    text-decoration: none;
}

.topic-header h3 a:hover {
    color: #4f46e5;
}

.topic-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.difficulty-badge, .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.difficulty-fundamental {
    background: #e3f2fd;
    color: #1565c0;
}

.difficulty-intermediate {
    background: #fff3e0;
    color: #ef6c00;
}

.difficulty-advanced {
    background: #fce4ec;
    color: #c2185b;
}

.status-complete {
    background: #e8f5e8;
    color: #2e7d32;
}

.status-coming {
    background: #fff8e1;
    color: #f57c00;
}

.topic-content {
    padding: 1.5rem;
}

.topic-highlights {
    margin: 1rem 0;
}

.topic-highlights h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #555;
}

.topic-highlights ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
}

.topic-highlights li {
    color: #666;
    font-size: 0.9rem;
    margin: 0.25rem 0;
    position: relative;
}

.topic-highlights li:before {
    content: "•";
    color: #4f46e5;
    font-weight: bold;
    position: absolute;
    left: -1rem;
}

.topic-applications {
    font-size: 0.9rem;
    color: #666;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
}

.topic-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #eee;
    background: #fafafa;
}

.study-topic-btn {
    display: inline-block;
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    transition: transform 0.2s ease;
}

.study-topic-btn:hover {
    transform: scale(1.05);
    text-decoration: none;
    color: white;
}

.learning-path-section {
    margin: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #e1e4e8;
}

.learning-path-section h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.path-visualization {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
}

.path-step {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin: 0.5rem 0;
    transition: transform 0.2s ease;
}

.path-step:not(.disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.path-step.disabled {
    opacity: 0.6;
    background: #f8f9fa;
}

.step-number {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.path-step.disabled .step-number {
    background: #9ca3af;
}

.step-content {
    flex-grow: 1;
}

.step-content h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
}

.step-content p {
    margin: 0 0 0.75rem 0;
    color: #666;
    line-height: 1.5;
}

.step-link {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
}

.step-link:hover:not(.disabled) {
    color: #6366f1;
    text-decoration: none;
}

.step-link.disabled {
    color: #9ca3af;
    cursor: not-allowed;
}

.path-arrow {
    color: #4f46e5;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
}

.quick-start-section {
    margin: 4rem 0;
}

.quick-start-section h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.quick-start-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.quick-start-item {
    text-align: center;
    padding: 2rem 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
}

.quick-start-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.quick-start-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.quick-start-item h4 {
    color: #2c3e50;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
}

.quick-start-item p {
    color: #666;
    line-height: 1.5;
    margin: 0;
}

.quick-start-item a {
    color: #4f46e5;
    text-decoration: none;
}

.quick-start-item a:hover {
    color: #6366f1;
    text-decoration: underline;
}

.why-foundations-section {
    margin: 4rem 0;
}

.why-foundations-section h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
}

.why-foundations-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.reason-item {
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    border-radius: 8px;
    border-left: 4px solid #10b981;
}

.reason-item h4 {
    color: #065f46;
    margin-bottom: 0.75rem;
    font-size: 1rem;
}

.reason-item p {
    color: #374151;
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
}

@media (max-width: 768px) {
    .foundations-index-page {
        padding: 1rem;
    }
    
    .topic-grid {
        grid-template-columns: 1fr;
    }
    
    .path-visualization {
        max-width: 100%;
    }
    
    .path-step {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .quick-start-grid, .why-foundations-content {
        grid-template-columns: 1fr;
    }
}
</style>