/**
 * Log level type for the logger
 */
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * Cache state type for cache-related logs
 */
export type CacheState = 'HIT' | 'MISS' | 'SET' | 'EXPIRED' | 'EVICT' | 'CLEANUP' | 'ERROR';

/**
 * Base configuration for log messages
 */
export interface BaseLogConfig {
    message: string;
    service: string;
    details?: unknown;
    level?: LogLevel;
    method?: string;
}

/**
 * Configuration for cache-specific logs
 */
export interface CacheLogConfig extends Omit<BaseLogConfig, 'service' | 'message'> {
    message?: string;
    service?: string;
    cacheState: CacheState;
}

/**
 * Internal log configuration that includes all possible properties
 */
export interface InternalLogConfig extends BaseLogConfig {
    cacheLog?: boolean;
    cacheState?: CacheState;
}

/**
 * Logger interface defining the public API
 */
export interface ILogger {
    log(config: BaseLogConfig): void;
    info(service: string, message: string, ...details: unknown[]): void;
    warn(service: string, message: string, ...details: unknown[]): void;
    error(service: string, message: string, error?: Error | unknown): void;
    cache(config: CacheLogConfig): void;
}
