/**
 * Layout Manager for Widget Dashboard
 *
 * Manages dashboard layouts, regions, and responsive design for the educational platform.
 * Supports dynamic layout switching, widget positioning, and educational layout patterns.
 */

class LayoutManager {
    constructor(container, eventBus, options = {}) {
        // Core state
        this.container = container;
        this.eventBus = eventBus;
        this.layouts = new Map();
        this.currentLayout = null;
        this.regions = new Map();
        this.widgetPlacements = new Map();

        // Initialize options with defaults
        this.options = {
            enableResponsive: true,
            enablePersistence: false,
            defaultLayout: 'standard',
            mobileBreakpoint: 768,
            tabletBreakpoint: 1024,
            ...options
        };

        // Initialize current breakpoint
        this.currentBreakpoint = this.getCurrentBreakpoint();

        // Performance tracking
        this.layoutStats = {
            switches: 0,
            renderTimes: new Map(),
            lastSwitch: null
        };

        // Initialize with default layouts
        this.registerDefaultLayouts();

        // Setup responsive handling if enabled
        if (this.options.enableResponsive) {
            this.setupResponsiveHandling();
        }

        if (this.eventBus) {
            this.eventBus.emit('layout-manager-ready');
        }
    }

    /**
     * Get current breakpoint based on window width
     */
    getCurrentBreakpoint() {
        if (typeof window === 'undefined') return 'desktop';

        const width = window.innerWidth;
        if (width < this.options.mobileBreakpoint) {
            return 'mobile';
        } else if (width < this.options.tabletBreakpoint) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Set the main container element
     */
    setContainer(container) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }

        if (!container) {
            throw new Error('Container element not found');
        }

        this.container = container;
        this.setupContainerObserver();

        if (this.eventBus) {
            this.eventBus.emit('layout-container-set', { container });
        }
    }

    /**
     * Register a layout configuration
     */
    registerLayout(name, config) {
        if (!config.regions || typeof config.regions !== 'object') {
            throw new Error('Layout must have regions configuration');
        }

        const layout = {
            name,
            description: config.description || '',
            icon: config.icon || '📐',
            category: config.category || 'general',
            responsive: config.responsive || {},
            regions: config.regions,
            defaultWidgets: config.defaultWidgets || {},
            educational: config.educational || {},
            metadata: {
                author: config.author || 'System',
                version: config.version || '1.0.0',
                tags: config.tags || [],
                complexity: config.complexity || 'basic'
            },
            registeredAt: Date.now(),
            ...config
        };

        this.layouts.set(name, layout);

        console.log(`Layout registered: ${name}`);

        if (this.eventBus) {
            this.eventBus.emit('layout-registered', { name, layout });
        }
    }

    /**
     * Apply a layout to the container
     */
    async applyLayout(layoutName, options = {}) {
        const startTime = performance.now();

        try {
            const layout = this.layouts.get(layoutName);
            if (!layout) {
                throw new Error(`Layout not found: ${layoutName}`);
            }

            if (!this.container) {
                throw new Error('Container not set - call setContainer() first');
            }

            // Determine which layout variant to use based on screen size
            const effectiveLayout = this.getResponsiveLayout(layout);

            // ✅ FIXED: Only clear layout if NOT preserving widgets
            if (!options.preserveWidgets) {
                // Clear existing layout
                await this.clearCurrentLayout();
            } else {
                // Just update container classes without clearing content
                this.container.className = `dashboard-container layout-${layout.name} breakpoint-${this.currentBreakpoint}`;

                // Apply responsive styling to existing regions
                if (this.regions && this.regions.size > 0) {
                    this.applyResponsiveStyles(effectiveLayout);

                    // Store updated layout info
                    this.currentLayout = {
                        name: layoutName,
                        config: effectiveLayout,
                        regions: this.regions,
                        appliedAt: Date.now(),
                        breakpoint: this.currentBreakpoint
                    };

                    console.log(`Layout updated responsively: ${layoutName} (${this.currentBreakpoint})`);

                    if (this.eventBus) {
                        this.eventBus.emit('layout-updated', {
                            layoutName,
                            layout: effectiveLayout,
                            breakpoint: this.currentBreakpoint
                        });
                    }

                    return this.regions;
                }
            }

            // Apply new layout (full recreation)
            const regions = await this.createLayoutStructure(effectiveLayout, options);

            // Store current layout info
            this.currentLayout = {
                name: layoutName,
                config: effectiveLayout,
                regions,
                appliedAt: Date.now(),
                breakpoint: this.currentBreakpoint
            };

            // Apply CSS classes and styling
            this.applyLayoutStyling(effectiveLayout);

            // Place default widgets if specified
            if (options.includeDefaultWidgets !== false) {
                await this.placeDefaultWidgets(effectiveLayout);
            }

            // Track performance
            const renderTime = performance.now() - startTime;
            this.layoutStats.switches++;
            this.layoutStats.renderTimes.set(layoutName, renderTime);
            this.layoutStats.lastSwitch = Date.now();

            console.log(`Layout applied: ${layoutName} in ${renderTime.toFixed(2)}ms`);

            if (this.eventBus) {
                this.eventBus.emit('layout-applied', {
                    layoutName,
                    layout: effectiveLayout,
                    regions,
                    renderTime,
                    breakpoint: this.currentBreakpoint
                });
            }

            // Save to persistence if enabled
            if (this.options.enablePersistence) {
                this.saveLayoutPreference(layoutName);
            }

            return regions;

        } catch (error) {
            console.error(`Failed to apply layout ${layoutName}:`, error);

            if (this.eventBus) {
                this.eventBus.emit('layout-apply-failed', {
                    layoutName,
                    error: error.message
                });
            }

            throw error;
        }
    }

    applyResponsiveStyles(layout) {
        if (!this.regions || !layout.responsive) return;

        const responsive = layout.responsive[this.currentBreakpoint];
        if (!responsive || !responsive.regions) return;

        // Apply responsive styles to existing regions
        Object.entries(responsive.regions).forEach(([regionName, regionConfig]) => {
            const regionElement = this.regions.get(regionName);
            if (regionElement && regionConfig.style) {
                Object.assign(regionElement.style, regionConfig.style);
            }
        });

        console.log(`✅ Applied responsive styles for ${this.currentBreakpoint}`);
    }

    /**
     * Get responsive layout variant based on current breakpoint
     */
    getResponsiveLayout(layout) {
        if (!this.options.enableResponsive || !layout.responsive) {
            return layout;
        }

        const responsive = layout.responsive[this.currentBreakpoint];
        if (!responsive) {
            return layout;
        }

        // Merge responsive overrides with base layout
        return {
            ...layout,
            regions: {
                ...layout.regions,
                ...responsive.regions
            },
            defaultWidgets: {
                ...layout.defaultWidgets,
                ...responsive.defaultWidgets
            }
        };
    }

    /**
     * Clear the current layout
     */
    async clearCurrentLayout() {
        if (!this.container) return;

        // Emit before clearing
        if (this.eventBus && this.currentLayout) {
            this.eventBus.emit('layout-clearing', {
                currentLayout: this.currentLayout
            });
        }

        // Clear container
        this.container.innerHTML = '';
        this.container.className = 'dashboard-container';

        // Clear regions map
        this.regions.clear();

        // Clear widget placements
        this.widgetPlacements.clear();

        this.currentLayout = null;
    }

    /**
     * Create the layout structure in the DOM
     */
    async createLayoutStructure(layout, options = {}) {
        const regions = new Map();

        // Set container classes
        this.container.className = `dashboard-container layout-${layout.name} breakpoint-${this.currentBreakpoint}`;

        // Create layout wrapper
        const layoutWrapper = document.createElement('div');
        layoutWrapper.className = 'layout-wrapper';
        this.container.appendChild(layoutWrapper);

        // Special handling for standard layout to create proper nesting
        if (layout.name === 'standard') {

            // 2. Create content container
            const contentElement = this.createRegionElement('content', layout.regions.content, layout);
            layoutWrapper.appendChild(contentElement);
            regions.set('content', contentElement);

            // 3. Create visualization and sidebar INSIDE content
            const visualizationElement = this.createRegionElement('visualization', layout.regions.visualization, layout);
            const sidebarElement = this.createRegionElement('sidebar', layout.regions.sidebar, layout);

            contentElement.appendChild(visualizationElement);
            contentElement.appendChild(sidebarElement);

            regions.set('visualization', visualizationElement);
            regions.set('sidebar', sidebarElement);

        } else {
            // For other layouts, create regions sequentially (original logic)
            Object.entries(layout.regions).forEach(([regionName, regionConfig]) => {
                const regionElement = this.createRegionElement(regionName, regionConfig, layout);
                layoutWrapper.appendChild(regionElement);
                regions.set(regionName, regionElement);
            });
        }

        // Store regions
        this.regions = regions;

        return regions;
    }

    /**
     * Create a single region element
     */
    createRegionElement(regionName, regionConfig, layout) {
        const regionElement = document.createElement('div');
        regionElement.className = `layout-region region-${regionName}`;
        regionElement.id = `region-${regionName}`;
        regionElement.setAttribute('data-region', regionName);
        regionElement.setAttribute('data-layout', layout.name);

        // Apply region-specific styling
        if (regionConfig.style) {
            Object.assign(regionElement.style, regionConfig.style);
        }

        // Add CSS classes
        if (regionConfig.className) {
            regionElement.classList.add(...regionConfig.className.split(' '));
        }

        // Set accessibility attributes
        regionElement.setAttribute('role', 'region');
        regionElement.setAttribute('aria-label', `${regionName} region`);

        // Add resize handles if region is resizable
        if (regionConfig.resizable) {
            this.addResizeHandles(regionElement, regionConfig);
        }

        // Add drop zone for widgets if drag-drop enabled
        if (regionConfig.allowWidgets !== false) {
            this.setupWidgetDropZone(regionElement, regionName);
        }

        return regionElement;
    }

    /**
     * Apply layout-specific styling and CSS variables
     */
    applyLayoutStyling(layout) {
        if (!this.container) return;

        // Apply CSS custom properties for layout configuration
        if (layout.cssVariables) {
            Object.entries(layout.cssVariables).forEach(([property, value]) => {
                this.container.style.setProperty(`--${property}`, value);
            });
        }

        // Apply theme classes
        if (layout.theme) {
            this.container.classList.add(`theme-${layout.theme}`);
        }

        // Apply educational context classes
        if (layout.educational) {
            if (layout.educational.level) {
                this.container.classList.add(`edu-level-${layout.educational.level}`);
            }
            if (layout.educational.focus) {
                this.container.classList.add(`edu-focus-${layout.educational.focus}`);
            }
        }
    }

    /**
     * Place default widgets specified in layout
     */
    async placeDefaultWidgets(layout) {
        if (!layout.defaultWidgets || !this.eventBus) return;

        const placements = [];

        Object.entries(layout.defaultWidgets).forEach(([regionName, widgets]) => {
            if (Array.isArray(widgets)) {
                widgets.forEach((widgetConfig, index) => {
                    placements.push({
                        region: regionName,
                        widget: widgetConfig,
                        order: index
                    });
                });
            }
        });

        // Emit event for dashboard to handle widget creation
        if (placements.length > 0) {
            this.eventBus.emit('layout-default-widgets-requested', {
                placements,
                layout: layout.name
            });
        }
    }

    /**
     * Get a region element by name
     */
    getRegion(regionName) {
        return this.regions.get(regionName);
    }

    /**
     * Get all regions
     */
    getAllRegions() {
        return new Map(this.regions);
    }

    /**
     * Check if a region exists
     */
    hasRegion(regionName) {
        return this.regions.has(regionName);
    }

    /**
     * Add a widget to a specific region
     */
    addWidgetToRegion(widgetElement, regionName, position = 'end') {
        const region = this.getRegion(regionName);
        if (!region) {
            throw new Error(`Region not found: ${regionName}`);
        }

        // Create widget container if needed
        let widgetContainer = region.querySelector('.widget-container');
        if (!widgetContainer) {
            widgetContainer = document.createElement('div');
            widgetContainer.className = 'widget-container';
            region.appendChild(widgetContainer);
        }

        // Add widget based on position
        if (position === 'start') {
            widgetContainer.insertBefore(widgetElement, widgetContainer.firstChild);
        } else if (typeof position === 'number') {
            const children = Array.from(widgetContainer.children);
            if (position >= children.length) {
                widgetContainer.appendChild(widgetElement);
            } else {
                widgetContainer.insertBefore(widgetElement, children[position]);
            }
        } else {
            widgetContainer.appendChild(widgetElement);
        }

        // Track widget placement
        const widgetId = widgetElement.getAttribute('data-widget-id');
        if (widgetId) {
            this.widgetPlacements.set(widgetId, {
                region: regionName,
                position,
                placedAt: Date.now()
            });
        }

        if (this.eventBus) {
            this.eventBus.emit('widget-placed-in-region', {
                widgetId,
                regionName,
                position
            });
        }
    }

    /**
     * Remove a widget from its region
     */
    removeWidgetFromRegion(widgetElement) {
        const widgetId = widgetElement.getAttribute('data-widget-id');
        const placement = this.widgetPlacements.get(widgetId);

        if (widgetElement.parentNode) {
            widgetElement.parentNode.removeChild(widgetElement);
        }

        if (placement) {
            this.widgetPlacements.delete(widgetId);

            if (this.eventBus) {
                this.eventBus.emit('widget-removed-from-region', {
                    widgetId,
                    regionName: placement.region
                });
            }
        }
    }

    /**
     * Move a widget between regions
     */
    moveWidget(widgetElement, fromRegion, toRegion, position = 'end') {
        this.removeWidgetFromRegion(widgetElement);
        this.addWidgetToRegion(widgetElement, toRegion, position);
    }

    /**
     * Setup widget drop zone for drag-and-drop
     */
    setupWidgetDropZone(regionElement, regionName) {
        regionElement.classList.add('widget-drop-zone');

        regionElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            regionElement.classList.add('drag-over');
        });

        regionElement.addEventListener('dragleave', (e) => {
            if (!regionElement.contains(e.relatedTarget)) {
                regionElement.classList.remove('drag-over');
            }
        });

        regionElement.addEventListener('drop', (e) => {
            e.preventDefault();
            regionElement.classList.remove('drag-over');

            const widgetId = e.dataTransfer.getData('text/widget-id');
            if (widgetId && this.eventBus) {
                this.eventBus.emit('widget-drop-requested', {
                    widgetId,
                    targetRegion: regionName,
                    dropEvent: e
                });
            }
        });
    }

    /**
     * Add resize handles to a region
     */
    addResizeHandles(regionElement, regionConfig) {
        const handles = regionConfig.resizeHandles || ['right', 'bottom'];

        handles.forEach(direction => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${direction}`;
            handle.setAttribute('data-direction', direction);

            // Add resize cursor
            handle.style.cursor = direction === 'right' || direction === 'left' ? 'ew-resize' : 'ns-resize';

            regionElement.appendChild(handle);

            // Add resize functionality
            this.setupResizeHandler(handle, regionElement, direction);
        });
    }

    /**
     * Setup resize handler for region
     */
    setupResizeHandler(handle, regionElement, direction) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.getComputedStyle(regionElement).width, 10);
            startHeight = parseInt(window.getComputedStyle(regionElement).height, 10);

            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);

            e.preventDefault();
        });

        const handleResize = (e) => {
            if (!isResizing) return;

            if (direction === 'right') {
                const newWidth = startWidth + (e.clientX - startX);
                regionElement.style.width = `${Math.max(100, newWidth)}px`;
            } else if (direction === 'bottom') {
                const newHeight = startHeight + (e.clientY - startY);
                regionElement.style.height = `${Math.max(50, newHeight)}px`;
            }
        };

        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
    }

    /**
     * Setup responsive handling
     */
    setupResponsiveHandling() {
        if (!this.options.enableResponsive) return;

        // ✅ FIXED: Add debouncing to prevent excessive re-layouts
        let resizeTimeout;

        const checkBreakpoint = () => {
            // Clear existing timeout
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            // Debounce the resize check
            resizeTimeout = setTimeout(() => {
                const width = window.innerWidth;
                let newBreakpoint;

                if (width < this.options.mobileBreakpoint) {
                    newBreakpoint = 'mobile';
                } else if (width < this.options.tabletBreakpoint) {
                    newBreakpoint = 'tablet';
                } else {
                    newBreakpoint = 'desktop';
                }

                if (newBreakpoint !== this.currentBreakpoint) {
                    const oldBreakpoint = this.currentBreakpoint;
                    this.currentBreakpoint = newBreakpoint;

                    console.log(`📱 Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint} (${width}px)`);

                    if (this.eventBus) {
                        this.eventBus.emit('breakpoint-changed', {
                            oldBreakpoint,
                            newBreakpoint,
                            width
                        });
                    }

                    // ✅ FIXED: Re-apply current layout with widget preservation
                    if (this.currentLayout) {
                        this.applyLayout(this.currentLayout.name, {
                            preserveWidgets: true,
                            includeDefaultWidgets: false  // Don't recreate widgets
                        });
                    }
                }
            }, 100); // 100ms debounce
        };

        // Initial check
        checkBreakpoint();

        // Listen for resize events
        window.addEventListener('resize', checkBreakpoint);
    }

    /**
     * Setup container observer for dynamic sizing
     */
    setupContainerObserver() {
        if (!this.container || !window.ResizeObserver) return;

        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                if (this.eventBus) {
                    this.eventBus.emit('container-resized', {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                        entry
                    });
                }
            });
        });

        this.resizeObserver.observe(this.container);
    }

    /**
     * Get all registered layouts
     */
    getLayouts() {
        return Array.from(this.layouts.values());
    }

    /**
     * Get layout by name
     */
    getLayout(name) {
        return this.layouts.get(name);
    }

    /**
     * Get current layout info
     */
    getCurrentLayout() {
        return this.currentLayout;
    }

    /**
     * Save layout preference to localStorage
     */
    saveLayoutPreference(layoutName) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('fair-division-layout-preference', layoutName);
        }
    }

    /**
     * Load layout preference from localStorage
     */
    loadLayoutPreference() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('fair-division-layout-preference') || this.options.defaultLayout;
        }
        return this.options.defaultLayout;
    }

    /**
     * Get layout statistics
     */
    getStats() {
        const avgRenderTimes = new Map();
        this.layoutStats.renderTimes.forEach((time, layout) => {
            avgRenderTimes.set(layout, time);
        });

        return {
            totalLayouts: this.layouts.size,
            totalSwitches: this.layoutStats.switches,
            currentLayout: this.currentLayout?.name || null,
            currentBreakpoint: this.currentBreakpoint,
            avgRenderTimes: Object.fromEntries(avgRenderTimes),
            widgetPlacements: this.widgetPlacements.size,
            lastSwitch: this.layoutStats.lastSwitch
        };
    }

    /**
     * Register default layouts for educational platform
     */
    registerDefaultLayouts() {
        // Standard layout - traditional demo layout
        this.registerLayout('standard', {
            description: 'Traditional algorithm demonstration layout',
            icon: '📋',
            category: 'educational',
            educational: {
                level: 'undergraduate',
                focus: 'algorithm-demonstration'
            },
            regions: {
                header: {
                    allowWidgets: false
                },
                // Create a wrapper that contains visualization and sidebar
                content: {
                    style: {
                        display: 'flex',
                        flex: '1',
                        gap: '2rem',
                        minHeight: '600px'
                    },
                    className: 'main-content-area',
                    allowWidgets: false  // This is just a container
                },
                visualization: {
                    style: {
                        flex: '1',
                        padding: '1.5rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    },
                    allowWidgets: true,
                    resizable: true,
                    resizeHandles: ['right']
                },
                sidebar: {
                    style: {
                        width: '400px',
                        minWidth: '300px',
                        maxWidth: '600px',
                        padding: '1.5rem',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    },
                    allowWidgets: true,
                    resizable: true
                }
            },
            defaultWidgets: {
                visualization: [
                    { type: 'cake-visualization', config: { priority: 1 } },
                    { type: 'player-input', config: { priority: 2 } },
                ],
                sidebar: [
                    { type: 'algorithm-selector', config: { priority: 1 } },
                    { type: 'instructions', config: { priority: 2 } },
                    { type: 'action-buttons', config: { priority: 3 } },
                ]
            },
            responsive: {
                mobile: {
                    regions: {
                        content: {
                            style: { flexDirection: 'column', gap: '1rem' }
                        },
                        sidebar: {
                            style: {
                                width: '100%',
                                order: '-1'  // Put sidebar first on mobile
                            }
                        }
                    }
                }
            }
        });

        // Research layout - analysis-focused
        this.registerLayout('research', {
            description: 'Advanced layout for complexity analysis and research',
            icon: '🔬',
            category: 'research',
            educational: {
                level: 'graduate',
                focus: 'research-analysis'
            },
            regions: {
                header: {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e2e8f0'
                    }
                },
                mainLeft: {
                    style: {
                        flex: '2',
                        padding: '1rem',
                        backgroundColor: '#ffffff'
                    },
                    resizable: true
                },
                mainRight: {
                    style: {
                        width: '350px',
                        padding: '1rem',
                        backgroundColor: '#fff',
                        borderLeft: '1px solid #e2e8f0'
                    },
                    resizable: true
                },
                bottomLeft: {
                    style: {
                        height: '200px',
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: '#f8f9fa'
                    },
                    resizable: true
                },
                bottomRight: {
                    style: {
                        height: '200px',
                        width: '350px',
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        borderLeft: '1px solid #e2e8f0',
                        backgroundColor: '#f8f9fa'
                    }
                }
            },
            defaultWidgets: {
                header: [
                    { type: 'algorithm-selector', config: { priority: 1 } },
                    { type: 'comparison-panel', config: { priority: 2 } }
                ],
                mainLeft: [
                    { type: 'cake-visualization', config: { priority: 1 } }
                ],
                mainRight: [
                    { type: 'complexity-analyzer', config: { priority: 1 } },
                    { type: 'fairness-evaluator', config: { priority: 2 } }
                ],
                bottomLeft: [
                    { type: 'instructions', config: { priority: 1 } },
                    { type: 'action-buttons', config: { priority: 2 } }
                ],
                bottomRight: [
                    { type: 'query-tracker', config: { priority: 1 } }
                ]
            }
        });

        // Minimal layout - distraction-free
        this.registerLayout('minimal', {
            description: 'Clean, distraction-free layout for focused learning',
            icon: '⭐',
            category: 'educational',
            educational: {
                level: 'introductory',
                focus: 'concept-introduction'
            },
            regions: {
                main: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        padding: '2rem',
                        backgroundColor: '#ffffff'
                    }
                },
                center: {
                    style: {
                        maxWidth: '800px',
                        margin: '0 auto',
                        flex: '1'
                    }
                }
            },
            defaultWidgets: {
                center: [
                    { type: 'algorithm-selector', config: { priority: 1 } },
                    { type: 'cake-visualization', config: { priority: 2 } },
                    { type: 'instructions', config: { priority: 3 } }
                ]
            }
        });
    }

    /**
     * Destroy layout manager and cleanup
     */
    destroy() {
        // Clear current layout
        this.clearCurrentLayout();

        // Disconnect resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Clear all data
        this.layouts.clear();
        this.regions.clear();
        this.widgetPlacements.clear();

        this.container = null;
        this.currentLayout = null;

        console.log('Layout manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutManager;
} else {
    window.LayoutManager = LayoutManager;
}