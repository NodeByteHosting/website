/**
 * Styles configuration for console messages
 */
export interface ConsoleStyles {
    /** Style for warning messages */
    warning: string;
    /** Style for danger/error messages */
    danger: string;
    /** Style for informational messages */
    info: string;
}

/**
 * Props for the DevTools component
 * Currently empty as the component doesn't accept props,
 * but can be extended in the future
 */
export interface DevToolsProps {
    enablePerformanceMonitoring?: boolean;
    enableNetworkMonitoring?: boolean;
    enableMemoryTracking?: boolean;
    enableRenderTracking?: boolean;
}

export interface ConsoleStyles {
    warning: string;
    danger: string;
    info: string;
}

// Add Performance typings for TypeScript
declare global {
    interface Performance {
        memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
        };
    }
}
