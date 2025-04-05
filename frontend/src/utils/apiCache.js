/**
 * API Cache Utility
 *
 * This utility provides caching mechanisms for API requests to reduce
 * redundant network calls and improve application performance.
 */

class ApiCache {
  constructor(defaultTTL = 300000) {
    // Default TTL: 5 minutes in milliseconds
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const cachedItem = this.cache.get(key);
    const now = Date.now();

    // Check if cached item has expired
    if (cachedItem.expiry < now) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.value;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional, uses default if not provided)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} True if the key exists and is not expired
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }

    const cachedItem = this.cache.get(key);
    const now = Date.now();

    // Check if cached item has expired
    if (cachedItem.expiry < now) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   * @returns {Object} Cache statistics
   */
  getStats() {
    this.clearExpired();
    return {
      size: this.cache.size,
      items: Array.from(this.cache.keys()),
    };
  }
}

// Create a singleton instance
const apiCache = new ApiCache();

export default apiCache;
