# Fair Division Algorithms: Interactive Research Platform

An academic Jekyll website developing comprehensive interactive educational resources for fair division theory research and pedagogy. This platform provides both theoretical foundations and hands-on algorithmic demonstrations for students and researchers.

## Current Status

**Actively Maintained & Expanding** - This project has grown significantly from its initial conception, now featuring multiple fully-implemented algorithms, sophisticated interactive demonstrations, comprehensive educational content, and real-time computational complexity analysis.

## Quick Start

🌐 **[View Live Site](https://amaan-19.github.io/fair-division-exercises/)**

## Project Overview

This research platform bridges the gap between theoretical fair division concepts and practical understanding through:

- **Interactive Algorithm Demonstrations** - Hands-on simulations for major fair division algorithms with real-time query complexity analysis and step-by-step execution
- **Mathematical Rigor** - Formal proofs, theorem statements, and rigorous analysis including Robertson-Webb computational complexity
- **Educational Resources** - Comprehensive glossary, references, guided exercises, and step-by-step explanations
- **Theoretical Foundations** - Query complexity analysis, algorithmic trade-offs, and mathematical foundations
- **Responsive Design** - Modern, accessible interface optimized for all devices with mobile-first approach

## Technology Stack

- **Jekyll 4.x** - Static site generator optimized for academic content
- **GitHub Pages** - Deployment and hosting platform
- **Custom CSS** - Modern responsive design with assistance from Claude Sonnet 4
- **MathJax 3** - LaTeX-style mathematical notation rendering
- **Vanilla JavaScript** - Interactive demonstrations and simulations with query counting
- **SVG Graphics** - Dynamic geometric visualizations for cake-cutting algorithms
- **Responsive Design** - Mobile-first approach with CSS Grid/Flexbox

## Features & Capabilities

### Interactive Learning System
**Advanced Geometric Visualization Engine**
- Real-time manipulation of colored regions representing heterogeneous goods
- Dynamic value calculations as users adjust player preferences
- Visual feedback showing cut positions, piece boundaries, and overlays
- SVG-based graphics with smooth animations and transitions

**Algorithm-Specific Interactive Interfaces**
- **Divide-and-Choose**: Slider-based cutting with immediate value feedback and clickable piece selection
- **Austin's Moving Knife**: Multi-phase animated procedure with player stop controls and knife synchronization
- **Steinhaus**: Dual-slider interface for three-piece creation with case-based logic and reconstruction

**Educational Enhancement Features**
- Step-by-step algorithm walkthroughs with guided progression
- Real-time fairness property verification and violation detection
- Robertson-Webb query counting with educational explanations
- Comparative analysis tools between different algorithms
- Interactive exercises with structured learning objectives

### Mathematical Rigor & Analysis
**Formal Mathematical Framework**
- Complete proof sketches for all fairness properties with expandable content
- Theorem statements with proper mathematical notation using MathJax 3
- Complexity analysis and algorithmic trade-offs documentation
- Robertson-Webb query model integration throughout

**Computational Complexity Analysis**
- Real-time query counting during algorithm execution
- Educational overlays explaining cut vs. eval query types
- Comparative complexity analysis across algorithms
- Lower bound proofs and optimality results
- Query complexity visualization and tracking

**Advanced Mathematical Integration**
- Full MathJax 3 support for complex mathematical expressions
- Inline and display math rendering with proper formatting
- Formatted theorem environments and proof structures
- Mathematical foundations including measure theory and topology

### Comprehensive Content Management
**Educational Resource Architecture**
- Searchable glossary with 30+ key terms and cross-references
- Academic bibliography with one-click citation copying
- Algorithm flowcharts as embedded interactive diagrams
- Structured navigation between related concepts

**Research-Grade Documentation**
- Individual algorithm pages with complete theoretical analysis
- Navigation system connecting related algorithms and concepts
- Comparison matrices for algorithm properties and query complexity
- Foundational theory sections covering mathematical prerequisites

## Development Architecture

### Modular Interactive Demo System
**Core Framework Architecture**
```javascript
FairDivisionDemoSystem {
  ├── StateManager (centralized state with event system)
  ├── UIController (responsive interface management)
  ├── AnimationEngine (smooth algorithm visualizations)
  ├── CalculationEngine (real-time value computations)
  └── AlgorithmRegistry (modular algorithm loading)
}
```

**Algorithm Plugin System**
- Standardized API for algorithm implementations
- Event-driven architecture for user interactions
- Modular step-based execution with lifecycle hooks
- Real-time Robertson-Webb query counting integration

**Visual & Interaction Components**
- SVG-based geometric representations with dynamic updates
- Responsive controls that adapt to algorithm requirements
- Real-time value displays and fairness property verification
- Query complexity visualization panels with educational context

### Content Creation & Management Workflow
```
Markdown (Front Matter) → Jekyll Processing → Static HTML
├── Algorithm pages with YAML metadata and flowcharts
├── Interactive demos as standalone HTML applications
├── MathJax processing for equations and theorem environments
├── Query complexity analysis integration
├── Responsive CSS with mobile-first design
└── JavaScript modules for interactive features
```

## Content Organization & Structure

```
📁 Fair Division Algorithms Platform
├── algorithms/                    # Individual algorithm pages
│   ├── divide-and-choose.md       # Complete with proofs & complexity
│   ├── austins-moving-knife.md    # Multi-phase continuous procedure
│   ├── steinhaus-lone-divider.md  # Three-player case analysis
│   ├── selfridge-conway.md        # Envy-free with trimming
│   ├── banach-knaster-last-diminisher.md
│   ├── stromquist.md              # Continuous 3-player envy-free
│   └── brams-taylor.md            # N-player envy-free
├── theory/                        # Theoretical foundations
│   ├── index.md                   # Theory overview with key questions
│   ├── foundations.md             # Mathematical foundations & topology
│   ├── fairness-properties.md     # Comprehensive property framework
│   ├── robertson-webb-query-model.md  # Complexity model
│   ├── complexity.md              # Extended complexity analysis
│   ├── impossibility.md           # Fundamental limitations
│   └── tradeoffs.md               # Property trade-offs
├── assets/
│   ├── demos/unified/             # Modular demo system
│   │   ├── index.html             # Main demo interface
│   │   ├── core/                  # Demo system framework
│   │   │   ├── demo-system.js     # Core classes & utilities
│   │   │   └── demo-controller.js # Main controller & API
│   │   └── algorithms/            # Algorithm implementations
│   │       ├── divide-and-choose.js
│   │       ├── austins-moving-knife.js
│   │       ├── steinhaus-lone-divider.js
│   │       └── selfridge-conway.js
│   ├── flowcharts/                # Algorithm flowcharts
│   │   ├── divide-and-choose-procedure.html
│   │   ├── austin-moving-knife.html
│   │   ├── steinhaus-lone-divider.html
│   │   └── selfridge-conway-procedure.html
│   ├── exercises/                 # Interactive exercises
│   │   └── exercises.js           # Exercise framework
│   └── main.css                   # Primary stylesheet (2000+ lines)
├── exercises/                     # Interactive learning
│   └── index.md                   # Guided exercises with demo integration
├── analysis/                      # Comparative analysis
│   └── complexity-comparison.md    # Query complexity comparison tables
├── glossary/                      # Educational glossary
│   ├── index.md                   # 30+ terms with definitions
│   └── glossarySort.js            # Alphabetical sorting
├── references/                    # Academic bibliography
│   ├── index.md                   # Comprehensive reference collection
│   └── citationsFunctions.js      # Citation copying functionality
└── _layouts/                      # Jekyll templates
    └── default.html               # Main layout with MathJax integration
```

## Research Context & Impact

**Academic Foundation**
- **Primary Investigator**: Amaan Khan
- **Faculty Advisor**: Dr. Ron Cytron  
- **Institution**: Washington University in St. Louis
- **Funding**: Mozilla Educational Initiatives for responsible computer science education

**Educational Impact & Objectives**
- Bridge theoretical computer science and practical algorithmic implementation
- Support undergraduate and graduate coursework in algorithmic game theory
- Enable hands-on exploration of fairness properties and computational complexity
- Demonstrate Robertson-Webb query model applications in real-time
- Provide research-grade educational resources for academic institutions

**Research Applications & Use Cases**
- Algorithm comparison and complexity analysis platform
- Educational tool for fair division and mechanism design courses
- Demonstration resource for academic presentations and conferences
- Foundation for future algorithm implementations and research
- Query complexity analysis and visualization for theoretical computer science

## Technical Implementation Details

### Query Complexity Integration
- **Real-time Tracking**: Live query counting during algorithm execution
- **Educational Context**: Explanatory overlays for different query types
- **Comparative Analysis**: Side-by-side complexity comparisons
- **Theoretical Bounds**: Integration with lower bound proofs and optimality results

### Advanced Animation System
- **Continuous Procedures**: Smooth knife movement with variable speed
- **Discrete Steps**: Clear phase transitions with user controls
- **Synchronization**: Multi-knife coordination in complex algorithms
- **Interactive Controls**: Player stop buttons and real-time decision points

### Responsive Design Architecture
- **Mobile-First Approach**: Optimized for tablets and smartphones
- **Adaptive Layouts**: Grid systems that reflow for different screen sizes
- **Touch Support**: Gesture recognition for mobile interactions
- **Performance Optimization**: Efficient rendering for complex visualizations

## Contributing & Collaboration

This is an academic research project with specific educational and research objectives.

**Contact Information**
- **Academic Partnerships**: Through Washington University CS department
- **Technical Issues**: GitHub repository issue tracking
- **Educational Applications**: Institutional academic channels

## License & Attribution

- **License**: Creative Commons Attribution-ShareAlike 4.0 International
- **Code Components**: Open source under CC BY-SA 4.0 with full source availability
- **Academic Content**: Proper attribution required for educational and research use
- **Research Data**: Available for academic and educational purposes with citation

## Technical Requirements & Browser Support

**Development Environment**
- Ruby 2.7+ with Jekyll 4.x for static site generation
- Node.js for asset processing and development tools (optional)
- Git for version control and collaborative development

**Browser Compatibility**  
- Modern browsers with ES6+ JavaScript support
- MathJax 3 compatibility for mathematical notation rendering
- SVG support for geometric visualizations
- Responsive design supports all mobile devices and tablets

**Performance & Optimization**
- Static site generation for optimal loading speeds
- Optimized SVG assets for complex geometric visualizations
- Compressed CSS and minimized JavaScript for production
- Efficient algorithms for real-time query counting and animation

---

*Last Updated: Current development cycle focuses on completing the algorithm catalog, enhancing interactive demonstrations with advanced features, deepening Robertson-Webb computational complexity integration, and expanding educational accessibility for diverse learning environments.*

**Development Status**: Active maintenance with regular feature additions, educational content expansion, and continuous improvement of user experience and academic rigor.
