const logger = require('./logger').default;

module.exports = class CacheHandler {
    /**
     * Creates an instance of CacheHandler.
     * @param {Object} options - The cache options.
     * @param {number} [options.ttl=60000] - Time to live for cache entries in milliseconds.
     * @param {number} [options.maxSize=100] - Maximum number of cache entries.
     */
    constructor(options = {}) {
        this.cache = new Map(); // Stores cache entries
        this.cacheKeys = []; // Tracks cache keys for LRU eviction
        this.options = {
            ttl: options.ttl || 60 * 1000, // Default: 1 minute
            maxSize: options.maxSize || 100, // Default max cache size
            ...options,
        };

        // Periodically clean expired cache entries
        this._cleanupInterval = setInterval(() => this.cleanupExpiredEntries(), this.options.ttl);
    }

    /**
     * Retrieves a value from the cache.
     * @param {string} key - The cache key.
     * @returns {Promise<any>} The cached value or null if not found or expired.
     * @throws {TypeError} If the key is not a string.
     */
    async get(key) {
        try {
            // tolerate non-string keys: coerce to string but warn
            if (typeof key !== 'string') {
                try {
                    logger.cache?.({ message: `Non-string cache key coerced: ${String(key)}`, service: 'CACHE', method: 'get', cacheState: 'WARN', level: 'warn' });
                } catch (e) { /* swallow logger errors */ }
                key = String(key);
            }

            const entry = this.cache.get(key);
            if (!entry) {
                try {
                    logger.cache?.({ message: `Cache miss: ${key}`, service: 'CACHE', method: 'get', cacheState: 'MISS', level: 'warn' });
                } catch (e) { /* swallow logger errors */ }
                return null;
            }

            // Check expiration
            if (Date.now() - entry.lastModified > this.options.ttl) {
                this.cache.delete(key);
                const idx = this.cacheKeys.indexOf(key);
                if (idx >= 0) this.cacheKeys.splice(idx, 1);
                try {
                    logger.cache?.({ message: `Cache expired: ${key}`, service: 'CACHE', method: 'get', cacheState: 'EXPIRED', level: 'warn' });
                } catch (e) { /* swallow logger errors */ }
                return null;
            }

            // Move key to end (most recently used)
            const idx = this.cacheKeys.indexOf(key);
            if (idx >= 0) {
                this.cacheKeys.splice(idx, 1);
            }
            this.cacheKeys.push(key);

            try {
                logger.cache?.({ message: `Cache hit: ${key}`, service: 'CACHE', method: 'get', cacheState: 'HIT', level: 'info' });
            } catch (e) { /* swallow logger errors */ }

            return entry.value;
        } catch (err) {
            // Fail safe: don't throw on cache internal errors — log and return null
            try {
                logger.cache?.({ message: `Cache get error: ${err?.message || err}`, service: 'CACHE', method: 'get', cacheState: 'ERROR', level: 'error' });
            } catch (e) { /* swallow logger errors */ }
            return null;
        }
    }

    /**
     * Stores a value in the cache.
     * If the cache exceeds its max size, it removes the least recently used (LRU) entry.
     * @param {string} key - The cache key.
     * @param {any} data - The data to cache.
     * @param {Object} [ctx={}] - The context object.
     * @param {string[]} [ctx.tags=[]] - Tags associated with the cache entry.
     * @throws {TypeError} If the key is not a string.
     * @throws {Error} If the data is undefined.
     */
    async set(key, data, ctx = {}) {
        try {
            if (typeof key !== 'string') {
                try {
                    logger.cache?.({ message: `Non-string cache key coerced: ${String(key)}`, service: 'CACHE', method: 'set', cacheState: 'WARN', level: 'warn' });
                } catch (e) { /* swallow logger errors */ }
                key = String(key);
            }
            // don't throw in production for undefined data — just log and skip
            if (data === undefined) {
                try {
                    logger.cache?.({ message: `Attempted to cache undefined value for key: ${key} — skipping`, service: 'CACHE', method: 'set', cacheState: 'SKIP', level: 'warn' });
                } catch (e) { /* swallow logger errors */ }
                return;
            }

            // If cache reaches max size, remove least recently used (LRU) entry
            if (this.cache.size >= this.options.maxSize) {
                const oldestKey = this.cacheKeys.shift(); // Remove LRU entry
                if (oldestKey) {
                    this.cache.delete(oldestKey);
                    try {
                        logger.cache?.({ message: `Evicted LRU cache: ${oldestKey}`, service: 'CACHE', method: 'set', cacheState: 'EVICTED', level: 'warn' });
                    } catch (e) { /* swallow logger errors */ }
                }
            }

            // Store new entry
            this.cache.set(key, { value: data, lastModified: Date.now(), tags: ctx.tags || [] });

            // remove existing duplicate key from keys list if present
            const existingIdx = this.cacheKeys.indexOf(key);
            if (existingIdx >= 0) this.cacheKeys.splice(existingIdx, 1);
            this.cacheKeys.push(key); // Track for LRU

            try {
                logger.cache?.({ message: `Cache set: ${key}`, service: 'CACHE', method: 'set', cacheState: 'SET', level: 'info' });
            } catch (e) { /* swallow logger errors */ }
        } catch (err) {
            // fail safe: log error but do not throw to avoid bubbling into request handlers
            try {
                logger.cache?.({ message: `Cache set error: ${err?.message || err}`, service: 'CACHE', method: 'set', cacheState: 'ERROR', level: 'error' });
            } catch (e) { /* swallow logger errors */ }
        }
    }

    /**
     * Invalidates cache entries associated with a specific tag or multiple tags.
     * @param {string|string[]} tags - The tag(s) to invalidate.
     */
    async revalidateTag(tags) {
        try {
            tags = Array.isArray(tags) ? tags : [tags];

            for (const [key, value] of this.cache) {
                try {
                    if (value.tags && value.tags.some(tag => tags.includes(tag))) {
                        this.cache.delete(key);
                        const idx = this.cacheKeys.indexOf(key);
                        if (idx >= 0) this.cacheKeys.splice(idx, 1);
                        logger.cache?.({ message: `Cache invalidated: ${key}`, service: 'CACHE', method: 'revalidateTag', cacheState: 'INVALIDATE', level: 'info' });
                    }
                } catch (e) {
                    // per-entry failure shouldn't abort rest
                    try { logger.cache?.({ message: `Error invalidating cache key ${key}: ${e?.message || e}`, service: 'CACHE', method: 'revalidateTag', cacheState: 'ERROR', level: 'error' }); } catch (_) { }
                }
            }
        } catch (err) {
            try { logger.cache?.({ message: `Cache revalidateTag error: ${err?.message || err}`, service: 'CACHE', method: 'revalidateTag', cacheState: 'ERROR', level: 'error' }); } catch (_) { }
        }
    }

    /**
     * Clears all cache entries.
     */
    async clear() {
        try {
            this.cache.clear();
            this.cacheKeys = [];
            try { logger.cache?.({ message: `All cache cleared`, service: 'CACHE', method: 'clear', cacheState: 'CLEAR', level: 'info' }); } catch (_) { }
        } catch (err) {
            try { logger.cache?.({ message: `Cache clear error: ${err?.message || err}`, service: 'CACHE', method: 'clear', cacheState: 'ERROR', level: 'error' }); } catch (_) { }
        }
    }

    /**
     * Periodically removes expired cache entries.
     */
    cleanupExpiredEntries() {
        try {
            for (const [key, entry] of this.cache) {
                if (Date.now() - entry.lastModified > this.options.ttl) {
                    this.cache.delete(key);
                    const idx = this.cacheKeys.indexOf(key);
                    if (idx >= 0) this.cacheKeys.splice(idx, 1);
                    try { logger.cache?.({ message: `Auto-cleaned expired cache: ${key}`, service: 'CACHE', method: 'cleanup', cacheState: 'EXPIRED', level: 'info' }); } catch (_) { }
                }
            }
        } catch (err) {
            try { logger.cache?.({ message: `Cache cleanup error: ${err?.message || err}`, service: 'CACHE', method: 'cleanup', cacheState: 'ERROR', level: 'error' }); } catch (_) { }
        }
    }
};