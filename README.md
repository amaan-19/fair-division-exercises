# Fair Division Algorithms: Interactive Research Platform

An academic Jekyll website developing comprehensive interactive educational resources for fair division theory research and pedagogy. This platform provides both theoretical foundations and hands-on algorithmic demonstrations for students and researchers.

## Current Status

**Actively Maintained & Expanding** - This project has grown significantly from its initial conception, now featuring multiple implemented algorithms, interactive demonstrations, and comprehensive educational content.

## Quick Start

🌐 **[View Live Site](https://amaan-19.github.io/fair-division-exercises/)**

## Project Overview

This research platform bridges the gap between theoretical fair division concepts and practical understanding through:

- **Interactive Algorithm Demonstrations** - Hands-on simulations for major fair division algorithms
- **Mathematical Rigor** - Formal proofs, theorem statements, and rigorous analysis
- **Educational Resources** - Comprehensive glossary, references, and step-by-step explanations
- **Responsive Design** - Modern, accessible interface optimized for all devices

## Technology Stack

- **Jekyll 4.x** - Static site generator optimized for academic content
- **GitHub Pages** - Deployment and hosting platform
- **Custom CSS** - Academic typography with Inter + Crimson Text fonts
- **MathJax 3** - LaTeX-style mathematical notation rendering
- **Vanilla JavaScript** - Interactive demonstrations and simulations
- **Responsive Design** - Mobile-first approach with CSS Grid/Flexbox

## Implemented Algorithms

### 1. Divide-and-Choose
- **Players**: 2
- **Type**: Discrete
- **Properties**: Proportional, Envy-free, Strategy-proof
- **Demo Features**: Interactive cutting interface, real-time value calculations, fairness analysis

### 2. Austin's Moving Knife
- **Players**: 2  
- **Type**: Continuous
- **Properties**: Equitable, Exact, Envy-free, Strategy-proof
- **Demo Features**: Animated knife movement, dual-knife phase, random assignment

### 3. Steinhaus' Lone-Divider
- **Players**: 3
- **Type**: Discrete  
- **Properties**: Proportional
- **Demo Features**: Three-piece division, case analysis (A/B), reconstruction procedures

## Features & Capabilities

### Interactive Learning
**Geometric Visualization Engine**
- Real-time manipulation of colored regions representing different goods
- Dynamic value calculations as users adjust preferences
- Visual feedback showing cut positions and piece boundaries

**Algorithm-Specific Interfaces**
- Divide-and-Choose: Slider-based cutting with immediate value feedback
- Austin's Moving Knife: Animated continuous movement with player stop controls
- Steinhaus: Multi-cut interface with three-piece selection mechanics

**Educational Enhancements**
- Step-by-step algorithm walkthroughs
- Real-time fairness property verification
- Comparative analysis between algorithms

### Mathematical Rigor
**Formal Analysis**
- Complete proof sketches for all fairness properties
- Theorem statements with proper mathematical notation
- Complexity analysis and algorithmic trade-offs

**LaTeX Integration**
- Full MathJax 3 support for complex mathematical expressions
- Inline and display math rendering
- Formatted theorem environments and proof structures

### Content Management
**Comprehensive Glossary**
- Searchable definitions for all key terms
- Cross-referenced concepts with automatic linking
- Mathematical formulations for formal definitions

**Academic References**
- One-click citation copying functionality
- DOI links and publication metadata

**Algorithm Catalog**
- Detailed algorithm pages with complete analysis
- Navigation between related algorithms
- Comparison matrices for algorithm properties

## Development Architecture

### Content Creation Workflow
```
Markdown (Front Matter) → Jekyll Processing → Static HTML
├── Algorithm pages with YAML metadata
├── Interactive demos as standalone HTML
├── MathJax processing for equations
└── Custom CSS for academic styling
```

### Interactive Demo System
**Unified Demo Framework**
- Core JavaScript system managing algorithm state
- Modular algorithm definitions with standardized API
- Event-driven architecture for user interactions

**Visual Components**
- SVG-based geometric representations
- Dynamic region highlighting and selection
- Responsive controls adapting to algorithm requirements

## Content Organization

```
📁 Root
├── algorithms/           # Individual algorithm pages
│   ├── divide-and-choose.md
│   ├── austins-moving-knife.md
│   └── steinhaus-lone-divider.md
├── assets/
│   ├── demos/           # Interactive demonstrations
│   │   └── unified/     # New modular demo system
│   └── main.css         # Primary stylesheet
├── glossary/            # Educational content
├── references/          # Academic bibliography
└── _layouts/            # Jekyll templates
```

## Research Context & Impact

**Academic Foundation**
- **Primary Investigator**: Amaan Khan
- **Faculty Advisor**: Dr. Ron Cytron  
- **Institution**: Washington University in St. Louis
- **Funding**: Mozilla Educational Initiatives for responsible computer science education

**Educational Objectives**
- Bridge theoretical computer science and practical applications
- Support undergraduate and graduate coursework in algorithmic game theory
- Enable hands-on exploration of fairness properties

**Research Applications**
- Algorithm comparison and analysis platform
- Educational tool for fair division courses
- Demonstration resource for academic presentations

## Contributing

This is an academic research project with specific educational objectives. For collaboration inquiries, research partnerships, or technical contributions:

**Contact Information**
- Research team via Washington University computer science department
- Technical issues via GitHub Issues
- Educational applications via institutional channels

## License & Attribution

- **License**: Creative Commons Attribution-ShareAlike 4.0 International
- **Code Components**: Open source under CC BY-SA 4.0
- **Academic Content**: Proper attribution required for educational use
- **Research Data**: Available for academic and educational purposes

## Technical Requirements

**Development Environment**
- Ruby 2.7+ with Jekyll 4.x
- Node.js for asset processing (optional)
- Git for version control

**Browser Support**  
- Modern browsers with ES6+ support
- MathJax 3 compatibility required
- Responsive design supports mobile devices

**Performance Optimization**
- Static site generation for fast loading
- Optimized SVG assets for geometric visualizations
- Compressed CSS and minimized JavaScript

---

*Last updated: Current development cycle focuses on expanding the algorithm catalog, enhancing interactive demonstrations, and improving educational accessibility.*

**Development Status**: Active maintenance with regular feature additions and educational content expansion.
