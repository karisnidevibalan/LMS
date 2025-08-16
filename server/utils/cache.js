// Simple in-memory cache utility
class SimpleCache {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expires = Date.now() + this.ttl;
    this.cache.set(key, { value, expires });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clear expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instances
const courseCache = new SimpleCache(300000); // 5 minutes
const materialsCache = new SimpleCache(180000); // 3 minutes

// Cleanup expired items every 5 minutes
setInterval(() => {
  courseCache.cleanup();
  materialsCache.cleanup();
}, 300000);

module.exports = {
  courseCache,
  materialsCache
};
