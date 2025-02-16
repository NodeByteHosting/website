'use client';

import React, { useEffect, useState, Component, ErrorInfo } from 'react';
import { logger } from './logger';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ConsoleStyles, DevToolsProps } from 'types/devtools';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('ErrorBoundary', 'An error occurred', { error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export function DevTools({
    enablePerformanceMonitoring = true,
    enableNetworkMonitoring = true,
    enableMemoryTracking = true,
}: DevToolsProps): null {
    const [isRouteChanging, setIsRouteChanging] = useState<boolean>(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Performance monitoring
    useEffect(() => {
        if (enablePerformanceMonitoring && typeof window !== 'undefined') {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    logger.info('Performance', `${entry.name}`, {
                        duration: `${entry.duration.toFixed(2)}ms`,
                        type: entry.entryType,
                        startTime: entry.startTime
                    });
                });
            });

            observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] });

            return () => observer.disconnect();
        }
    }, [enablePerformanceMonitoring]);

    // Network request monitoring
    useEffect(() => {
        if (enableNetworkMonitoring) {
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const startTime = performance.now();
                try {
                    const response = await originalFetch(...args);
                    const endTime = performance.now();
                    logger.info('Network', `Fetch request completed`, {
                        url: args[0],
                        duration: `${(endTime - startTime).toFixed(2)}ms`,
                        status: response.status
                    });
                    return response;
                } catch (error) {
                    logger.error('Network', 'Fetch request failed', error);
                    throw error;
                }
            };

            return () => {
                window.fetch = originalFetch;
            };
        }
    }, [enableNetworkMonitoring]);

    // Memory usage tracking
    useEffect(() => {
        if (enableMemoryTracking) {
            const trackMemory = () => {
                if (performance.memory) {
                    logger.info('Memory', 'Usage stats', {
                        usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
                        totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
                        jsHeapSizeLimit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
                    });
                }
            };

            const intervalId = setInterval(trackMemory, 10000);
            return () => clearInterval(intervalId);
        }
    }, [enableMemoryTracking]);

    // Route change detection for App Router
    useEffect(() => {
        // Log route changes
        logger.info('Router', 'URL changed', {
            pathname,
            search: searchParams?.toString() || ''
        });

        // Set loading state
        setIsRouteChanging(true);

        // Use requestAnimationFrame to delay the loading state reset
        const timeoutId = requestAnimationFrame(() => {
            setIsRouteChanging(false);
        });

        return () => {
            cancelAnimationFrame(timeoutId);
        };
    }, [pathname, searchParams]);

    // Expose the loading state to the rest of the app
    useEffect(() => {
        if (isRouteChanging) {
            logger.info('Router', 'Route change started');
            document.body.style.cursor = 'wait';
        } else {
            logger.info('Router', 'Route change completed');
            document.body.style.cursor = 'default';
        }
    }, [isRouteChanging]);

    // Add keyboard shortcut for dev tools
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                logger.info('DevTools', 'Dev tools shortcut triggered');
                console.table(performance.getEntriesByType('navigation')[0]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return null;
}

export default DevTools;