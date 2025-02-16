export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
    debug?: boolean;
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    enableStaleWhileRevalidate?: boolean;
    cleanupInterval?: number;
}

export interface CacheEntry<T = any> {
    data: T;
    lastModified: number;
    expiresAt: number;
    tags: Set<string>;
}

export interface CacheContext {
    ttl?: number;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface CacheResult<T = any> {
    data: T | null;
    isStale: boolean;
}

export interface CacheLogger {
    error(message: string, metadata?: Record<string, any>): void;
    warn(message: string, metadata?: Record<string, any>): void;
    info(message: string, metadata?: Record<string, any>): void;
    debug(message: string, metadata?: Record<string, any>): void;
}
