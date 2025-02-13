const cache = new Map();

module.exports = class CacheHandler {
    constructor(options = {}) {
        this.options = {
            ttl: options.ttl || 60 * 1000, // Default: 1 minute
            maxSize: options.maxSize || 100, // Limit max items
            ...options,
        };
    }

    async get(key) {
        const entry = cache.get(key);

        if (!entry) return null;

        // Check expiration
        if (Date.now() - entry.lastModified > this.options.ttl) {
            console.log(`Cache expired for key: ${key}`);
            cache.delete(key);
            return null;
        }

        return entry.value;
    }

    async set(key, data, ctx = {}) {
        if (cache.size >= this.options.maxSize) {
            // Evict oldest entry
            const oldestKey = [...cache.keys()][0];
            console.log(`Evicting oldest entry: ${oldestKey}`);
            cache.delete(oldestKey);
        }

        console.log(`Setting cache for key: ${key}`);

        cache.set(key, {
            value: data,
            lastModified: Date.now(),
            tags: ctx.tags || [],
        });
    }

    async revalidateTag(tags) {
        tags = Array.isArray(tags) ? tags : [tags];

        for (const [key, value] of cache) {
            if (value.tags.some(tag => tags.includes(tag))) {
                console.log(`Revalidating cache for key: ${key}`);
                cache.delete(key);
            }
        }
    }

    async clear() {
        console.log('Clearing cache');
        cache.clear();
    }
};