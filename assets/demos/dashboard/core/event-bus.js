/**
 * Event Bus System for Demo Dashboard
 * Coordinates events for smooth functioning
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.emit(EventBus.Events.BUS_READY, {});
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} handler - Event handler
     * @returns {function} Unsubscribe function
     */
    on(event, handler) {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event).push(handler);

        if (this.debug) {
            console.log(`[EventBus] Listener added for "${event}"`);
        }

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Unsubscribe from an event
     */
    off(event, handler) {
        if (!this.events.has(event)) return false;

        const handlers = this.events.get(event);
        const index = handlers.indexOf(handler);

        if (index > -1) {
            handlers.splice(index, 1);
            if (this.debug) {
                console.log(`[EventBus] Listener removed for "${event}"`);
            }
            return true;
        }

        return false;
    }

    /**
     * Emit an event to all listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data = {}) {
        console.log(`[EventBus] Emitting: ${event}`, data);

        if (this.events.has(event)) {
            const handlers = this.events.get(event);

            // Call each handler with error protection
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`[EventBus] Handler error for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Subscribe to an event once (auto-unsubscribe after first trigger)
     */
    once(event, handler) {
        const unsubscribe = this.on(event, (data) => {
            handler(data);
            unsubscribe();
        });
        return unsubscribe;
    }

    /**
     * Remove all listeners for an event (or all events)
     */
    clear(event = null) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * Create a namespaced version for widget isolation
     * @param {string} namespace - Namespace prefix
     */
    namespace(namespace) {
        return {
            on: (event, handler) => this.on(`${namespace}:${event}`, handler),
            off: (event, handler) => this.off(`${namespace}:${event}`, handler),
            emit: (event, data) => this.emit(`${namespace}:${event}`, data),
            once: (event, handler) => this.once(`${namespace}:${event}`, handler)
        };
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.clear();
        this.queryCount = 0;
        this.algorithmSteps = 0;

        if (this.debug) {
            console.log('[EventBus] Destroyed');
        }
    }

    
}

// Educational event constants for consistency
EventBus.Events = {
    // Event Bus events
    BUS_READY: 'bus-ready',

    // Layout events
    LAYOUT_MANAGER_READY: 'layout-ready',

    // Registery events
    WIDGETS_READY: 'widgets-ready',

    // Dashboard events
    DASHBOARD_READY: 'dashboard-ready',
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
} else {
    window.EventBus = EventBus;
}