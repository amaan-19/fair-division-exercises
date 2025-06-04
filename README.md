# Fair Division Algorithms: Interactive Research Platform

An academic Jekyll website developing interactive educational resources for fair division theory research and pedagogy.

## Current Status

**In Active Development** - This project is in early stages with foundational algorithms implemented and additional content planned.

### What's Working
- ✅ Jekyll site with academic styling and responsive design
- ✅ **Divide-and-Choose** algorithm with complete mathematical analysis
- ✅ Interactive geometric demo for Divide-and-Choose
- ✅ **Austin's Moving Knife** algorithm overview (basic implementation)
- ✅ Mobile-responsive design with modern UI components
- ✅ MathJax integration for mathematical notation

### In Progress
- 🔄 References and bibliography section (currently placeholder)
- 🔄 Additional fair division algorithms
- 🔄 Enhanced interactive demonstrations

## Quick Start

### Prerequisites
- Ruby 2.7+ with bundler
- Git

### Installation
```bash
git clone [your-repository-url]
cd fair-division-algorithms
bundle install
bundle exec jekyll serve --livereload
```

Visit `http://127.0.0.1:4000` to view the site locally.

## Project Structure

```
├── _config.yml                           # Jekyll configuration with MathJax
├── _layouts/default.html                 # Academic page template
├── algorithms/
│   ├── divide-and-choose.md              # Complete algorithm with proofs
│   └── austins-moving-knife.md           # Basic overview page
├── assets/
│   ├── main.css                          # Custom academic design system
│   └── demos/
│       └── divide-and-choose-demo.html   # Interactive simulation
├── index.md                              # Algorithm catalog homepage  
└── references/index.md                   # Bibliography (placeholder)
```

## Technology Stack

- **Jekyll 4.x** - Static site generator optimized for academic content
- **GitHub Pages** - Deployment target (configured in Gemfile)
- **Custom CSS** - Academic typography with Inter + Crimson Text fonts
- **MathJax 3** - Mathematical notation rendering
- **Interactive HTML/JS** - Custom demonstrations embedded via iframes

## Features

### Mathematical Rigor
- Formal proofs for algorithm properties (proportionality, envy-freeness, strategy-proofness)
- LaTeX-style mathematical notation via MathJax
- Academic formatting with proper citations

### Interactive Learning
- **Divide-and-Choose Demo**: Interactive geometric visualization where users can:
  - Adjust player valuations for colored regions
  - Position cutting lines with real-time feedback
  - Experience the full algorithm workflow
  - See mathematical properties verified

### Responsive Design
- Mobile-first CSS with academic typography
- Card-based algorithm catalog
- Accessible color schemes and proper contrast

## Development Notes

### Content Creation
- All algorithm pages use Markdown with YAML front matter
- Mathematical expressions use standard LaTeX syntax
- Interactive demos are standalone HTML files embedded via iframes

### Styling
- Custom CSS design system in `assets/main.css`
- Academic color palette with blue/gray scheme
- Responsive grid layouts for algorithm cards

## Research Context

- **Primary Investigator**: Amaan Khan
- **Faculty Advisor**: Dr. Ron Cytron  
- **Institution**: Washington University in St. Louis
- **Funding**: Mozilla Educational Initiatives for responsible computer science education
- **License**: Creative Commons Attribution-ShareAlike 4.0 International

## Contributing

This is an academic research project. For collaboration inquiries, please reach out through Washington University channels.

## Deployment

Configured for GitHub Pages deployment:
- Uses `github-pages` gem for compatibility
- Excludes development files via `_config.yml`
- Optimized asset loading with compressed Sass

---

*Last updated: Current development cycle focuses on expanding algorithm catalog and enhancing interactive demonstrations.*
