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
        setInterval(() => this.cleanupExpiredEntries(), this.options.ttl);
    }

    /**
     * Retrieves a value from the cache.
     * @param {string} key - The cache key.
     * @returns {Promise<any>} The cached value or null if not found or expired.
     * @throws {TypeError} If the key is not a string.
     */
    async get(key) {
        if (typeof key !== 'string') {
            throw new TypeError('Cache key must be a string');
        }

        const entry = this.cache.get(key);
        if (!entry) {
            logger.cache({ message: `Cache miss: ${key}`, service: 'CACHE', method: 'get', cacheState: 'MISS', level: 'warn' });
            return null;
        }

        // Check expiration
        if (Date.now() - entry.lastModified > this.options.ttl) {
            this.cache.delete(key);
            this.cacheKeys.splice(this.cacheKeys.indexOf(key), 1);
            logger.cache({ message: `Cache expired: ${key}`, service: 'CACHE', method: 'get', cacheState: 'EXPIRED', level: 'error' });
            return null;
        }

        // Move key to end (most recently used)
        this.cacheKeys.splice(this.cacheKeys.indexOf(key), 1);
        this.cacheKeys.push(key);

        logger.cache({ message: `Cache hit: ${key}`, service: 'CACHE', method: 'get', cacheState: 'HIT', level: 'info' });
        return entry.value;
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
        if (typeof key !== 'string') {
            throw new TypeError('Cache key must be a string');
        }
        if (data === undefined) {
            throw new Error('Cannot cache undefined value');
        }

        // If cache reaches max size, remove least recently used (LRU) entry
        if (this.cache.size >= this.options.maxSize) {
            const oldestKey = this.cacheKeys.shift(); // Remove LRU entry
            this.cache.delete(oldestKey);
            logger.cache({ message: `Evicted LRU cache: ${oldestKey}`, service: 'CACHE', method: 'set', cacheState: 'EVICTED', level: 'warn' });
        }

        // Store new entry
        this.cache.set(key, { value: data, lastModified: Date.now(), tags: ctx.tags || [] });
        this.cacheKeys.push(key); // Track for LRU

        logger.cache({ message: `Cache set: ${key}`, service: 'CACHE', method: 'set', cacheState: 'SET', level: 'info' });
    }

    /**
     * Invalidates cache entries associated with a specific tag or multiple tags.
     * @param {string|string[]} tags - The tag(s) to invalidate.
     */
    async revalidateTag(tags) {
        tags = Array.isArray(tags) ? tags : [tags];

        for (const [key, value] of this.cache) {
            if (value.tags.some(tag => tags.includes(tag))) {
                this.cache.delete(key);
                this.cacheKeys.splice(this.cacheKeys.indexOf(key), 1);
                logger.cache({ message: `Cache invalidated: ${key}`, service: 'CACHE', method: 'revalidateTag', cacheState: 'INVALIDATE', level: 'info' });
            }
        }
    }

    /**
     * Clears all cache entries.
     */
    async clear() {
        this.cache.clear();
        this.cacheKeys = [];
        logger.cache({ message: `All cache cleared`, service: 'CACHE', method: 'clear', cacheState: 'CLEAR', level: 'info' });
    }

    /**
     * Periodically removes expired cache entries.
     */
    cleanupExpiredEntries() {
        for (const [key, entry] of this.cache) {
            if (Date.now() - entry.lastModified > this.options.ttl) {
                this.cache.delete(key);
                this.cacheKeys.splice(this.cacheKeys.indexOf(key), 1);
                logger.cache({ message: `Auto-cleaned expired cache: ${key}`, service: 'CACHE', method: 'cleanup', cacheState: 'EXPIRED', level: 'info' });
            }
        }
    }
};