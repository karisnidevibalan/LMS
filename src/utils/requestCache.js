// Client-side request cache utility
class RequestCache {
  constructor(defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  generateKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  set(url, options, data, ttl = this.defaultTTL) {
    const key = this.generateKey(url, options);
    const expires = Date.now() + ttl;
    this.cache.set(key, { data, expires });
  }

  get(url, options) {
    const key = this.generateKey(url, options);
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
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

// Global cache instance
export const requestCache = new RequestCache();

// Cleanup every 5 minutes
setInterval(() => {
  requestCache.cleanup();
}, 300000);
