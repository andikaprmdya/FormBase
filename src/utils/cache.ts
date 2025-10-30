import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';
import { CACHE_CONFIG } from '../constants/appConstants';

/**
 * Cache entry with data and metadata
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Cache utility for offline data storage
 * Uses AsyncStorage to persist data across app sessions
 */
class CacheManager {
  private prefix = '@FormBase:';

  /**
   * Generate cache key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Set item in cache with expiry time
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  async set<T>(key: string, data: T, ttl: number = CACHE_CONFIG.EXPIRY_TIME): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };

      await AsyncStorage.setItem(this.getKey(key), JSON.stringify(entry));
      logger.log(`Cache set: ${key}`);
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  /**
   * Get item from cache
   * Returns null if not found or expired
   * @param key - Cache key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(this.getKey(key));

      if (!value) {
        logger.log(`Cache miss: ${key}`);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(value);

      if (this.isExpired(entry)) {
        logger.log(`Cache expired: ${key}`);
        await this.remove(key);
        return null;
      }

      logger.log(`Cache hit: ${key}`);
      return entry.data;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   * @param key - Cache key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
      logger.log(`Cache removed: ${key}`);
    } catch (error) {
      logger.error('Cache remove error:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
      logger.log('Cache cleared');
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }

  /**
   * Get or fetch pattern
   * Tries to get from cache first, falls back to fetch function
   * Automatically caches the result
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch fresh data
    const data = await fetchFn();
    await this.set(key, data, ttl);
    return data;
  }

  /**
   * Invalidate cache by pattern
   * Removes all cache entries matching the pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter(key =>
        key.startsWith(this.prefix) && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(matchingKeys);
      logger.log(`Invalidated cache pattern: ${pattern}`);
    } catch (error) {
      logger.error('Cache invalidate pattern error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ count: number; size: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));

      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return {
        count: cacheKeys.length,
        size: totalSize,
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return { count: 0, size: 0 };
    }
  }
}

// Export singleton instance
export const cache = new CacheManager();

// Cache keys constants
export const CACHE_KEYS = {
  FORMS: 'forms',
  FORM: (id: number) => `form_${id}`,
  FIELDS: (formId: number) => `fields_${formId}`,
  RECORDS: (formId: number) => `records_${formId}`,
} as const;
