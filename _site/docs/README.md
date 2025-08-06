# Fair Division Algorithms: Interactive Learning and Research Platform

A comprehensive academic educational platform bridging theoretical computer science with hands-on algorithmic exploration. This Jekyll-based research platform provides interactive demonstrations, rigorous mathematical analysis, and real-time computational complexity visualization for fair division algorithms.

**🌐 [View Live Platform](https://amaan-19.github.io/fair-division-exercises/)**

## Table of Contents

- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)
- [Educational Resources](#educational-resources)
- [Academic Context](#academic-context)
- [License](#license)

## Project Overview

This platform addresses the gap between theoretical fair division concepts and practical algorithmic understanding through comprehensive interactive educational resources that serve researchers, educators, and students in computer science and mathematics.

### Educational Objectives
- Bridge theoretical computer science with hands-on algorithmic implementation
- Demonstrate Robertson-Webb query complexity model in real-time interactive settings
- Support university-level coursework in algorithmic game theory and mechanism design
- Provide research-grade educational resources for academic institutions worldwide
- Enable comparative analysis of fairness properties across algorithm families

### Key Features
- **Interactive Algorithm Demonstrations**: Real-time simulations with Robertson-Webb query complexity analysis
- **Mathematical Rigor**: Formal proofs, theorem statements, MathJax 3 integration
- **Educational Resources**: Comprehensive glossary, guided exercises, academic bibliography
- **Responsive Design**: Mobile-first approach with SVG-based geometric visualizations
- **Modular Architecture**: Plugin-based algorithm system for easy extensibility

## Quick Start

### Prerequisites
- **Ruby**: Version 3.1 or higher
- **Bundler**: For managing Ruby dependencies
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (for testing)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/amaan-19/fair-division-exercises.git
   cd fair-division-exercises
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Start the development server**
   ```bash
   bundle exec jekyll serve --livereload
   ```

4. **Open your browser**
   Navigate to `http://127.0.0.1:4000/fair-division-exercises/`

### Verifying Installation

After starting the server, you should see:
- ✅ Main platform loads without errors
- ✅ Interactive demonstrations are functional
- ✅ Mathematical notation renders correctly (MathJax)
- ✅ Responsive design adapts to different screen sizes

## Installation & Setup

### System Requirements

- **Operating System**: macOS, Linux, or Windows (with WSL recommended)
- **Ruby**: 3.1+ (managed via rbenv or RVM recommended)
- **Memory**: 4GB RAM minimum for development
- **Storage**: 500MB for complete setup with dependencies

### Detailed Installation Steps

#### 1. Ruby Environment Setup

**macOS (using Homebrew)**
```bash
# Install rbenv and ruby-build
brew install rbenv ruby-build

# Install Ruby 3.1
rbenv install 3.1.0
rbenv global 3.1.0

# Add rbenv to shell profile
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

#### 2. Project Setup

```bash
# Clone repository
git clone https://github.com/amaan-19/fair-division-exercises.git
cd fair-division-exercises

# Install bundler
gem install bundler

# Install project dependencies
bundle install

# Verify installation
bundle exec jekyll --version
```

#### 3. Development Environment

```bash
# Start development server with live reload
bundle exec jekyll serve --livereload

# Production build (for testing)
JEKYLL_ENV=production bundle exec jekyll build
```

### Troubleshooting Installation

**Common Issues and Solutions**

1. **Ruby Version Conflicts**
   ```bash
   # Check current Ruby version
   ruby --version

   # Use rbenv to manage versions
   rbenv versions
   rbenv local 3.1.0
   ```

2. **Bundle Install Failures**
   ```bash
   # Clear bundle cache
   bundle clean --force

   # Reinstall dependencies
   rm Gemfile.lock
   bundle install
   ```

3. **Jekyll Build Errors**
   ```bash
   # Clear Jekyll cache
   bundle exec jekyll clean

   # Rebuild with verbose output
   bundle exec jekyll build --verbose
   ```

4. **Port Already in Use**
   ```bash
   # Use different port
   bundle exec jekyll serve --port 4001

   # Or kill existing process
   lsof -ti:4000 | xargs kill -9
   ```

## Development Workflow

### File Structure Overview

```
fair-division-exercises/
├── _config.yml                 # Jekyll configuration
├── Gemfile                     # Ruby dependencies
├── README.md                   # This file
├── _data/                      # YAML data files
├── _includes/                  # Reusable HTML components
├── _layouts/                   # Page templates
├── _site/                      # Generated site (ignored)
├── algorithms/                 # Algorithm documentation pages
│   ├── divide-and-choose.md
│   ├── steinhaus-lone-divider.md
│   └── ...
├── assets/
│   ├── css/
│   │   ├── main.css           # Main stylesheet (2000+ lines)
│   │   └── components/        # Component-specific styles
│   ├── js/                    # Core JavaScript modules
│   ├── demos/                 # Interactive demonstration code
│   │   ├── unified/           # Unified demo system
│   │   │   ├── core/          # Core demo framework
│   │   │   ├── algorithms/    # Algorithm implementations
│   │   │   └── extensions/    # System extensions
│   │   └── legacy/            # Legacy demo implementations
│   └── images/                # Static images and graphics
├── glossary/                  # Terminology definitions
├── references/                # Academic bibliography
├── theory/                    # Theoretical background pages
└── .github/
    └── workflows/
        └── jekyll.yml         # Automated deployment
```

### Making Changes

#### Adding New Algorithms

1. **Create algorithm documentation page**
   ```bash
   touch algorithms/new-algorithm.md
   ```

2. **Use standard front matter**
   ```yaml
   ---
   layout: default
   title: New Algorithm Name
   permalink: /algorithms/new-algorithm/
   ---
   ```

3. **Implement algorithm demo**
   ```bash
   touch assets/demos/unified/algorithms/new-algorithm.js
   ```

4. **Register with demo system**
   ```javascript
   window.FairDivisionCore.register('new-algorithm', {
       // Algorithm configuration
   });
   ```

#### Modifying Styles

1. **Component-specific styles**: Edit files in `assets/css/components/`
2. **Global styles**: Modify `assets/css/main.css` (be careful, it's large!)
3. **Test responsive design**: Use browser dev tools to test multiple screen sizes

#### Adding Content

1. **Theory pages**: Add to `theory/` directory
2. **Glossary terms**: Edit `glossary/index.md`
3. **References**: Add to `references/index.md`

### Testing Your Changes

```bash
# Start local server
bundle exec jekyll serve --livereload

# Test on different devices/browsers
# - Desktop: Chrome, Firefox, Safari
# - Mobile: iOS Safari, Android Chrome
# - Accessibility: Screen reader testing

# Validate HTML
# Use browser dev tools or online validators

# Check mathematical notation
# Ensure MathJax renders correctly
```

### Deployment Process

The site uses GitHub Actions for automated deployment:

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Automatic deployment**
   - GitHub Actions runs Jekyll build
   - Site deploys to GitHub Pages
   - Available at: `https://amaan-19.github.io/fair-division-exercises/`

3. **Monitor deployment**
   - Check Actions tab in GitHub repository
   - Verify site loads correctly after deployment

## Architecture Overview

### Technology Stack

- **Jekyll 4.x**: Static site generator optimized for academic content
- **GitHub Pages**: Reliable deployment platform with version control
- **Custom CSS**: Sophisticated responsive design (2000+ lines)
- **MathJax 3**: Publication-quality mathematical notation rendering
- **Vanilla JavaScript**: Modular interactive demonstrations
- **SVG Graphics**: Dynamic geometric visualizations
- **Responsive Design**: CSS Grid and Flexbox methodologies

### Core Framework Design

```javascript
FairDivisionDemoSystem {
  ├── StateManager          // Centralized state management
  ├── UIController          // Interface management
  ├── AnimationEngine       // Algorithm visualizations
  ├── CalculationEngine     // Value computations
  ├── QueryTracker          // Robertson-Webb query counting
  └── AlgorithmRegistry     // Plugin system for algorithms
}
```

### Algorithm Plugin System

Each algorithm is implemented as a plugin with standardized API:

```javascript
const algorithmConfig = {
    name: "Algorithm Name",
    description: "Brief description",
    phases: [/* Phase definitions */],
    onInit: (state, api) => { /* Initialization */ },
    onPhaseChange: (state, api) => { /* Phase transitions */ },
    onUserAction: (state, api, action) => { /* User interactions */ }
};

window.FairDivisionCore.register('algorithm-id', algorithmConfig);
```

### Key Components

1. **Demo System Core** (`assets/demos/unified/core/`)
   - Centralized state management
   - Event-driven architecture
   - Consistent user interface patterns

2. **Algorithm Implementations** (`assets/demos/unified/algorithms/`)
   - Individual algorithm logic
   - Standardized plugin interface
   - Query complexity tracking

3. **Extensions** (`assets/demos/unified/extensions/`)
   - Indivisible goods support
   - Advanced visualization features
   - Accessibility enhancements

4. **Styling System** (`assets/css/`)
   - Component-based organization
   - Responsive design patterns
   - Mathematical notation support

## Contributing

We welcome contributions from researchers, educators, and developers! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-algorithm`
3. **Make your changes**: Follow coding standards in CONTRIBUTING.md
4. **Test thoroughly**: Ensure all demonstrations work correctly
5. **Submit a pull request**: Include detailed description of changes

### Types of Contributions

- **New Algorithms**: Implement additional fair division algorithms
- **Educational Content**: Improve explanations and theory pages
- **Bug Fixes**: Resolve issues with existing demonstrations
- **Performance Improvements**: Optimize loading times and animations
- **Accessibility**: Enhance support for diverse learning needs
- **Documentation**: Improve setup instructions and code comments

## Educational Resources

### For Students
- **Interactive Demonstrations**: Hands-on exploration of algorithms
- **Step-by-Step Explanations**: Clear procedural breakdowns
- **Query Complexity Visualization**: Real-time complexity analysis
- **Comparative Analysis**: Side-by-side algorithm comparison

### For Educators
- **Curriculum Integration**: Ready-to-use educational materials
- **Assessment Tools**: Guided exercises and learning objectives
- **Academic Standards**: Research-grade mathematical rigor
- **Customizable Content**: Adaptable for different course levels

### For Researchers
- **Implementation Reference**: Production-quality algorithm implementations
- **Complexity Analysis**: Detailed Robertson-Webb query tracking
- **Extensible Framework**: Add new algorithms and analysis tools
- **Academic Bibliography**: Comprehensive reference collection

## Academic Context

### Research Background

This platform is developed as part of ongoing research in algorithmic game theory and fair division at Washington University in St. Louis, under the guidance of Dr. Ron Cytron. The project bridges the gap between theoretical computer science research and practical educational applications.

### Key Research Areas
- **Fair Division Theory**: Cake-cutting, rent division, matching problems
- **Computational Complexity**: Robertson-Webb query model analysis
- **Algorithmic Game Theory**: Mechanism design and strategic behavior
- **Educational Technology**: Interactive learning for mathematical concepts

### Academic Usage

The platform has been designed for use in:
- **Graduate Courses**: Advanced algorithms, game theory, computational economics
- **Undergraduate Courses**: Discrete mathematics, algorithm design, complexity theory
- **Research Settings**: Algorithm development, complexity analysis, educational research
- **Self-Study**: Independent learning and exploration of fair division concepts

### Publications and References

For a complete bibliography of sources and related research, see the [References](references/) section. Key foundational texts include:

- Brams, S. J., & Taylor, A. D. (1996). *Fair Division: From Cake-Cutting to Dispute Resolution*
- Robertson, J., & Webb, W. (1998). *Cake-Cutting Algorithms: Be Fair if You Can*
- Stromquist, W. (1980). How to cut a cake fairly. *American Mathematical Monthly*

## License

See the [LICENSE](LICENSE) file for details.

### Academic Use

This platform is freely available for educational and research purposes. If you use this platform in academic work, please consider citing:

```
Khan, A., & Cytron, R. (2025). Fair Division Algorithms: Interactive Learning Platform.
Washington University in St. Louis. https://github.com/amaan-19/fair-division-exercises
```

## Acknowledgments

- **Dr. Ron Cytron**: Academic supervision and theoretical guidance
- **Washington University in St. Louis**: Institutional support
- **Mozilla Educational Initiatives**: Project funding and resources

---

**Development Team**: Amaan Khan
**Academic Supervisor**: Dr. Ron Cytron, Washington University in St. Louis
**Last Updated**: August 2025

For questions, suggestions, or collaboration opportunities, please open an issue or contact the development team.