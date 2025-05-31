# Foundations Directory Structure

This directory contains the foundational mathematical concepts for fair division theory. The structure is designed to be modular and extensible.

## Directory Structure

```
foundations/
├── README.md                      # This documentation
├── index.md                       # Foundations landing page
├── fairness-criteria.md           # Core fairness concepts (COMPLETE)
├── mathematical-models.md          # Coming soon
├── game-theory.md                 # Coming soon
└── computational-complexity.md    # Coming soon
```

## Data Files

- `_data/foundations.yml` - Metadata for all foundation topics
- Includes difficulty levels, status, prerequisites, and applications

## Layout and Includes

### Layouts
- `_layouts/foundation.html` - Standard layout for foundation pages
  - Includes breadcrumb navigation
  - Shows difficulty badges and prerequisites
  - Provides consistent navigation between topics

### Includes
- `_includes/foundations/topic_card.html` - Reusable topic cards
- `_includes/foundations/nav.html` - Foundation navigation component
- `_includes/foundations/section.html` - Standardized content sections

## Adding New Foundation Topics

1. **Add to data file**: Update `_data/foundations.yml` with new topic metadata
2. **Create markdown file**: Add new `.md` file in foundations directory
3. **Use foundation layout**: Set `layout: foundation` in front matter
4. **Include required metadata**: Set title, subtitle, permalink, and section

### Example Front Matter
```yaml
---
layout: foundation
title: "New Topic Title"
subtitle: "Brief description of the topic"
permalink: /foundations/new-topic/
section: foundations
next_page:
  title: "Next Topic"
  url: "/foundations/next-topic/"
---
```

## Styling Guidelines

### CSS Classes
- `.foundation-page` - Main page container
- `.foundation-header` - Page header with metadata
- `.foundation-content` - Main content area
- `.criterion-card` - Individual fairness criteria
- `.formula` - Mathematical formulations
- `.difficulty-badge` - Difficulty indicators
- `.status-badge` - Development status indicator

### Color Scheme
- **Fundamental**: Blue (#e3f2fd / #1565c0)
- **Intermediate**: Orange (#fff3e0 / #ef6c00)  
- **Advanced**: Pink (#fce4ec / #c2185b)

## Integration Points

### With Algorithms
- Foundation topics link to relevant algorithms
- Algorithm pages reference foundation concepts
- Cross-referencing through `next_page` metadata

### With Exercises
- Practice problems should reference foundation concepts
- Exercise solutions link back to theoretical foundations

### With References
- Foundation pages cite relevant academic sources
- Bibliography connects theory to literature

## Content Guidelines

### Mathematical Rigor
- Use formal definitions with precise mathematical notation
- Include theorems with proof sketches where appropriate
- Provide intuitive explanations alongside formal statements

### Educational Approach
- Start with intuitive explanations
- Build to formal mathematical definitions
- Include practical examples and applications
- Use progressive disclosure for complex topics

### Accessibility
- Clear, descriptive headings
- Alt text for mathematical diagrams
- Responsive design for mobile users
- Progressive enhancement for interactive elements

## Development Notes

### Dependencies
- Jekyll with kramdown for Markdown processing
- Custom CSS for mathematical notation styling
- No external JavaScript dependencies required

### Browser Support
- Modern browsers with CSS Grid support
- Graceful degradation for older browsers
- Mobile-first responsive design

### Performance Considerations
- CSS animations use `animation-delay` for staggered loading
- Images optimized for web delivery
- Minimal external dependencies

## Future Enhancements

### Planned Features
1. **Interactive Diagrams** - Visual representations of fairness concepts
2. **Mathematical Playground** - Interactive exploration of formulas
3. **Quiz Components** - Self-assessment tools
4. **Progress Tracking** - User progress through foundation topics

### Content Expansion
1. **Mathematical Models** - Formal preference representations
2. **Game Theory Foundations** - Strategic aspects of fair division
3. **Computational Complexity** - Algorithmic efficiency analysis
4. **Historical Perspectives** - Evolution of fair division theory

## Maintenance

### Regular Tasks
- Update status of "coming soon" topics
- Review and update cross-references
- Validate all internal links
- Test responsive design on new devices

### Content Review
- Mathematical accuracy verification
- Educational effectiveness assessment
- User feedback integration
- Academic reference updates