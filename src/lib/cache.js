const cache = new Map();

module.exports = class CacheHandler {
    constructor(options) {
        this.options = options;
    }

    async get(key) {
        return cache.get(key);
    }

    async set(key, data, ctx) {
        cache.set(key, {
            value: data,
            lastModified: Date.now(),
            tags: ctx.tags
        });
    }

    async revalidateTag(tags) {
        tags = [tags].flat();

        for (let [key, value] of cache) {
            if (value.tags.some((tag) => tags.includes(tag))) {
                cache.delete(key);
            }
        }
    }

    resetRequestCache() { }
}