/**
 * 智能缓存管理器
 * 支持内存缓存、localStorage、sessionStorage 和 IndexedDB
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  ttl?: number; // 生存时间（毫秒）
  storage?: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  maxSize?: number; // 最大缓存项数
  serialize?: boolean; // 是否序列化
}

class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();
  private maxMemorySize = 100;
  private dbName = 'AppCache';
  private dbVersion = 1;

  /**
   * 设置缓存
   */
  async set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const {
      ttl = 5 * 60 * 1000, // 默认5分钟
      storage = 'memory',
      serialize = true
    } = options;

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    switch (storage) {
      case 'memory':
        this.setMemoryCache(key, cacheItem);
        break;
      case 'localStorage':
        this.setWebStorage(key, cacheItem, localStorage, serialize);
        break;
      case 'sessionStorage':
        this.setWebStorage(key, cacheItem, sessionStorage, serialize);
        break;
      case 'indexedDB':
        await this.setIndexedDBCache(key, cacheItem);
        break;
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(
    key: string, 
    storage: CacheOptions['storage'] = 'memory'
  ): Promise<T | null> {
    let cacheItem: CacheItem<T> | null = null;

    switch (storage) {
      case 'memory':
        cacheItem = this.getMemoryCache(key);
        break;
      case 'localStorage':
        cacheItem = this.getWebStorage(key, localStorage);
        break;
      case 'sessionStorage':
        cacheItem = this.getWebStorage(key, sessionStorage);
        break;
      case 'indexedDB':
        cacheItem = await this.getIndexedDBCache(key);
        break;
    }

    if (!cacheItem) return null;

    // 检查是否过期
    if (this.isExpired(cacheItem)) {
      await this.delete(key, storage);
      return null;
    }

    // 更新访问统计
    cacheItem.accessCount++;
    cacheItem.lastAccessed = Date.now();

    return cacheItem.data;
  }

  /**
   * 删除缓存
   */
  async delete(
    key: string, 
    storage: CacheOptions['storage'] = 'memory'
  ): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.delete(key);
        break;
      case 'localStorage':
        localStorage.removeItem(key);
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(key);
        break;
      case 'indexedDB':
        await this.deleteIndexedDBCache(key);
        break;
    }
  }

  /**
   * 清空所有缓存
   */
  async clear(storage: CacheOptions['storage'] = 'memory'): Promise<void> {
    switch (storage) {
      case 'memory':
        this.memoryCache.clear();
        break;
      case 'localStorage':
        localStorage.clear();
        break;
      case 'sessionStorage':
        sessionStorage.clear();
        break;
      case 'indexedDB':
        await this.clearIndexedDBCache();
        break;
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(storage: CacheOptions['storage'] = 'memory') {
    switch (storage) {
      case 'memory':
        return {
          size: this.memoryCache.size,
          items: Array.from(this.memoryCache.entries()).map(([key, item]) => ({
            key,
            size: JSON.stringify(item.data).length,
            accessCount: item.accessCount,
            lastAccessed: item.lastAccessed,
            isExpired: this.isExpired(item),
          })),
        };
      default:
        return { size: 0, items: [] };
    }
  }

  /**
   * 清理过期缓存
   */
  async cleanup(storage: CacheOptions['storage'] = 'memory'): Promise<number> {
    let cleanedCount = 0;

    switch (storage) {
      case 'memory':
        for (const [key, item] of this.memoryCache.entries()) {
          if (this.isExpired(item)) {
            this.memoryCache.delete(key);
            cleanedCount++;
          }
        }
        break;
      // 其他存储类型的清理逻辑...
    }

    return cleanedCount;
  }

  // 私有方法
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
    // LRU 策略：如果超过最大大小，删除最少使用的项
    if (this.memoryCache.size >= this.maxMemorySize) {
      const lruKey = this.findLRUKey();
      if (lruKey) {
        this.memoryCache.delete(lruKey);
      }
    }

    this.memoryCache.set(key, item);
  }

  private getMemoryCache<T>(key: string): CacheItem<T> | null {
    return this.memoryCache.get(key) || null;
  }

  private setWebStorage<T>(
    key: string, 
    item: CacheItem<T>, 
    storage: Storage,
    serialize: boolean
  ): void {
    try {
      const value = serialize ? JSON.stringify(item) : item;
      storage.setItem(key, value as string);
    } catch (error) {
      console.warn('Failed to set web storage cache:', error);
    }
  }

  private getWebStorage<T>(key: string, storage: Storage): CacheItem<T> | null {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Failed to get web storage cache:', error);
      return null;
    }
  }

  private async setIndexedDBCache<T>(key: string, item: CacheItem<T>): Promise<void> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      await store.put({ key, ...item });
    } catch (error) {
      console.warn('Failed to set IndexedDB cache:', error);
    }
  }

  private async getIndexedDBCache<T>(key: string): Promise<CacheItem<T> | null> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const result = await store.get(key);
      return result || null;
    } catch (error) {
      console.warn('Failed to get IndexedDB cache:', error);
      return null;
    }
  }

  private async deleteIndexedDBCache(key: string): Promise<void> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      await store.delete(key);
    } catch (error) {
      console.warn('Failed to delete IndexedDB cache:', error);
    }
  }

  private async clearIndexedDBCache(): Promise<void> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      await store.clear();
    } catch (error) {
      console.warn('Failed to clear IndexedDB cache:', error);
    }
  }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  private isExpired<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private findLRUKey(): string | null {
    let lruKey: string | null = null;
    let oldestAccess = Date.now();

    for (const [key, item] of this.memoryCache.entries()) {
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        lruKey = key;
      }
    }

    return lruKey;
  }
}

// 导出单例实例
export const cacheManager = new CacheManager();

// 导出便捷方法
export const cache = {
  set: cacheManager.set.bind(cacheManager),
  get: cacheManager.get.bind(cacheManager),
  delete: cacheManager.delete.bind(cacheManager),
  clear: cacheManager.clear.bind(cacheManager),
  cleanup: cacheManager.cleanup.bind(cacheManager),
  getStats: cacheManager.getStats.bind(cacheManager),
};