const cache = new Map();
const logger = require('./logger').default;

module.exports = class CacheHandler {
    /**
     * Creates an instance of CacheHandler.
     * @param {Object} options - The cache options.
     * @param {number} [options.ttl=60000] - Time to live for cache entries in milliseconds.
     * @param {number} [options.maxSize=100] - Maximum number of cache entries.
     */
    constructor(options = {}) {
        this.options = {
            ttl: options.ttl || 60 * 1000, // Default: 1 minute
            maxSize: options.maxSize || 100, // Limit max items
            ...options,
        };
    }

    /**
     * Retrieves a value from the cache.
     * @param {string} key - The cache key.
     * @returns {Promise<any>} The cached value or null if not found or expired.
     */
    async get(key) {
        const entry = cache.get(key);

        if (!entry) {
            logger.cache({
                message: `Unable to find cache for key: ${key}`,
                service: 'CACHE',
                method: 'get',
                cacheState: 'MISS',
                level: 'warn'
            });
            return null;
        }

        // Check expiration
        if (Date.now() - entry.lastModified > this.options.ttl) {
            cache.delete(key);
            logger.cache({
                message: `The cache for key: ${key} has expired`,
                service: 'CACHE',
                method: 'get',
                cacheState: 'EXPIRED',
                level: 'error'
            });
            return null;
        }

        logger.cache({
            message: `Located cache for key: ${key}`,
            service: 'CACHE',
            method: 'get',
            cacheState: 'HIT',
            level: 'info'
        });

        return entry.value;
    }

    /**
     * Sets a value in the cache.
     * @param {string} key - The cache key.
     * @param {any} data - The data to cache.
     * @param {Object} [ctx={}] - The context object.
     * @param {string[]} [ctx.tags=[]] - Tags associated with the cache entry.
     */
    async set(key, data, ctx = {}) {
        if (cache.size >= this.options.maxSize) {
            // Evict oldest entry
            const oldestKey = [...cache.keys()][0];
            cache.delete(oldestKey);
            logger.cache({
                message: `Evicted cache for key: ${oldestKey}`,
                service: 'CACHE',
                method: 'set',
                cacheState: 'EVICTED',
                level: 'warn'
            });
        }

        cache.set(key, {
            value: data,
            lastModified: Date.now(),
            tags: ctx.tags || [],
        });

        logger.cache({
            message: `Set cache for key: ${key}`,
            service: 'CACHE',
            method: 'set',
            cacheState: 'SET',
            level: 'info'
        });
    }

    /**
     * Revalidates cache entries by tags.
     * @param {string|string[]} tags - The tags to revalidate.
     */
    async revalidateTag(tags) {
        tags = Array.isArray(tags) ? tags : [tags];

        for (const [key, value] of cache) {
            if (value.tags.some(tag => tags.includes(tag))) {
                cache.delete(key);
                logger.cache({
                    message: `Invalidated cache for key: ${key}`,
                    service: 'CACHE',
                    method: 'revalidateTag',
                    cacheState: 'INVALIDATE',
                    level: 'info'
                });
            }
        }
    }

    /**
     * Clears all cache entries.
     */
    async clear() {
        cache.clear();
        logger.cache({
            message: `Cleared all cache entries`,
            service: 'CACHE',
            method: 'clear',
            cacheState: 'CLEAR',
            level: 'info'
        });
    }
};