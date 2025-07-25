/**
 * Event Bus System for Fair Division Dashboard
 *
 * Centralized event management system enabling loose coupling between widgets
 * and components while maintaining educational context and debugging capabilities.
 */

class EventBus {
    constructor(options = {}) {
        this.events = new Map();
        this.middlewares = [];
        this.options = {
            debug: false,
            maxListeners: 50,
            enablePersistence: false,
            ...options
        };
        this.eventHistory = [];
        this.globalListeners = [];

        // Educational event tracking for analysis
        this.eventMetrics = {
            totalEvents: 0,
            eventsByType: new Map(),
            errorCount: 0
        };
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} handler - Event handler function
     * @param {number} priority - Handler priority (higher = runs first)
     * @param {object} options - Additional options
     * @returns {function} Unsubscribe function
     */
    on(event, handler, priority = 0, options = {}) {
        if (typeof handler !== 'function') {
            throw new Error('Event handler must be a function');
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const listeners = this.events.get(event);

        // Check max listeners limit
        if (listeners.length >= this.options.maxListeners) {
            console.warn(`Maximum listeners (${this.options.maxListeners}) reached for event: ${event}`);
        }

        const listener = {
            handler,
            priority,
            id: Symbol('listener'),
            once: options.once || false,
            context: options.context || null,
            addedAt: Date.now()
        };

        listeners.push(listener);

        // Sort by priority (highest first)
        listeners.sort((a, b) => b.priority - a.priority);

        if (this.options.debug) {
            console.log(`[EventBus] Listener added for "${event}" (priority: ${priority})`);
        }

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Subscribe to an event once (auto-unsubscribe after first trigger)
     */
    once(event, handler, priority = 0) {
        return this.on(event, handler, priority, { once: true });
    }

    /**
     * Unsubscribe from an event
     */
    off(event, handler) {
        if (!this.events.has(event)) return false;

        const listeners = this.events.get(event);
        const index = listeners.findIndex(l => l.handler === handler);

        if (index > -1) {
            listeners.splice(index, 1);

            if (this.options.debug) {
                console.log(`[EventBus] Listener removed for "${event}"`);
            }
            return true;
        }

        return false;
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @param {object} options - Emission options
     */
    emit(event, data = {}, options = {}) {
        const eventData = {
            type: event,
            data,
            timestamp: Date.now(),
            id: Symbol('event'),
            source: options.source || 'unknown'
        };

        // Update metrics
        this.eventMetrics.totalEvents++;
        this.eventMetrics.eventsByType.set(
            event,
            (this.eventMetrics.eventsByType.get(event) || 0) + 1
        );

        // Apply middleware pipeline
        let processedData = eventData;
        for (const middleware of this.middlewares) {
            try {
                const result = middleware(processedData);
                if (result !== undefined) {
                    processedData = result;
                }
            } catch (error) {
                console.error(`[EventBus] Middleware error:`, error);
                this.eventMetrics.errorCount++;
            }
        }

        // Store in history for debugging/analysis
        if (this.options.enablePersistence) {
            this.eventHistory.push({
                ...processedData,
                processedAt: Date.now()
            });

            // Keep history manageable
            if (this.eventHistory.length > 1000) {
                this.eventHistory = this.eventHistory.slice(-500);
            }
        }

        // Debug logging
        if (this.options.debug) {
            console.group(`[EventBus] Emitting: ${event}`);
            console.log('Data:', processedData.data);
            console.log('Source:', processedData.source);
            console.groupEnd();
        }

        // Call global listeners first
        this.globalListeners.forEach(listener => {
            try {
                listener(processedData);
            } catch (error) {
                console.error(`[EventBus] Global listener error:`, error);
                this.eventMetrics.errorCount++;
            }
        });

        // Call specific event listeners
        if (this.events.has(event)) {
            const listeners = [...this.events.get(event)]; // Copy to avoid mutation during iteration

            listeners.forEach(listener => {
                try {
                    // Call handler with context if provided
                    if (listener.context) {
                        listener.handler.call(listener.context, processedData.data, processedData);
                    } else {
                        listener.handler(processedData.data, processedData);
                    }

                    // Remove if it's a 'once' listener
                    if (listener.once) {
                        this.off(event, listener.handler);
                    }
                } catch (error) {
                    console.error(`[EventBus] Handler error for "${event}":`, error);
                    this.eventMetrics.errorCount++;
                }
            });
        }

        return processedData;
    }

    /**
     * Add middleware for event processing
     * @param {function} middleware - Middleware function
     */
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware must be a function');
        }

        this.middlewares.push(middleware);

        if (this.options.debug) {
            console.log(`[EventBus] Middleware added`);
        }
    }

    /**
     * Add global listener that receives all events
     */
    onAny(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Global listener must be a function');
        }

        this.globalListeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.globalListeners.indexOf(listener);
            if (index > -1) {
                this.globalListeners.splice(index, 1);
            }
        };
    }

    /**
     * Remove all listeners for an event (or all events)
     */
    removeAllListeners(event = null) {
        if (event) {
            this.events.delete(event);
            if (this.options.debug) {
                console.log(`[EventBus] All listeners removed for "${event}"`);
            }
        } else {
            this.events.clear();
            this.globalListeners = [];
            if (this.options.debug) {
                console.log(`[EventBus] All listeners removed`);
            }
        }
    }

    /**
     * Get list of all registered events
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get listener count for an event
     */
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }

    /**
     * Get comprehensive metrics and debugging information
     */
    getMetrics() {
        return {
            ...this.eventMetrics,
            eventsRegistered: this.events.size,
            totalListeners: Array.from(this.events.values()).reduce((sum, listeners) => sum + listeners.length, 0),
            globalListeners: this.globalListeners.length,
            historyLength: this.eventHistory.length,
            middlewareCount: this.middlewares.length
        };
    }

    /**
     * Get event history (if persistence enabled)
     */
    getHistory(eventType = null, limit = 100) {
        if (!this.options.enablePersistence) {
            console.warn('[EventBus] Event persistence not enabled');
            return [];
        }

        let history = this.eventHistory;

        if (eventType) {
            history = history.filter(event => event.type === eventType);
        }

        return history.slice(-limit);
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
        this.eventMetrics = {
            totalEvents: 0,
            eventsByType: new Map(),
            errorCount: 0
        };
    }

    /**
     * Create a namespaced event bus (for widget isolation)
     */
    namespace(name) {
        return {
            on: (event, handler, priority) => this.on(`${name}:${event}`, handler, priority),
            once: (event, handler, priority) => this.once(`${name}:${event}`, handler, priority),
            off: (event, handler) => this.off(`${name}:${event}`, handler),
            emit: (event, data, options) => this.emit(`${name}:${event}`, data, { ...options, source: name })
        };
    }

    /**
     * Destroy the event bus and cleanup
     */
    destroy() {
        this.removeAllListeners();
        this.middlewares = [];
        this.globalListeners = [];
        this.clearHistory();

        if (this.options.debug) {
            console.log('[EventBus] Event bus destroyed');
        }
    }
}

// Educational middleware for query tracking integration
EventBus.QueryTrackingMiddleware = function(eventData) {
    // Track algorithm-related events for educational analysis
    if (eventData.type.includes('cut') || eventData.type.includes('eval')) {
        eventData.educationalContext = {
            queryType: eventData.type.includes('cut') ? 'cut' : 'eval',
            timestamp: eventData.timestamp,
            algorithmStep: eventData.data.step || 'unknown'
        };
    }
    return eventData;
};

// Debugging middleware
EventBus.DebugMiddleware = function(eventData) {
    if (window.FAIR_DIVISION_DEBUG) {
        console.log(`[DEBUG] Event: ${eventData.type}`, eventData);
    }
    return eventData;
};

// Performance monitoring middleware
EventBus.PerformanceMiddleware = function() {
    const startTimes = new Map();

    return function(eventData) {
        const eventType = eventData.type;

        if (eventType.endsWith('-start')) {
            startTimes.set(eventType.replace('-start', ''), performance.now());
        } else if (eventType.endsWith('-end')) {
            const baseEvent = eventType.replace('-end', '');
            const startTime = startTimes.get(baseEvent);
            if (startTime) {
                const duration = performance.now() - startTime;
                eventData.performance = { duration };
                startTimes.delete(baseEvent);
            }
        }

        return eventData;
    };
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
} else {
    window.EventBus = EventBus;
}