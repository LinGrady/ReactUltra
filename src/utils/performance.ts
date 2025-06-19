/**
 * 性能优化工具函数集合
 * 提供性能监控、防抖节流、内存管理等功能
 */

// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // 监控LCP
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1];
      this.recordMetric('LCP', lcp.startTime);
    });

    // 监控FID
    this.observeMetric('first-input', (entries) => {
      const fid = entries[0];
      this.recordMetric('FID', fid.processingStart - fid.startTime);
    });

    // 监控CLS
    this.observeMetric('layout-shift', (entries) => {
      let cls = 0;
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
      this.recordMetric('CLS', cls);
    });
  }

  private observeMetric(type: string, callback: (entries: any[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: any = {};
    
    for (const [name, values] of this.metrics) {
      result[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }
    
    return result;
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 内存使用监控
export function getMemoryUsage(): MemoryInfo | null {
  if (typeof window === 'undefined' || !('performance' in window)) return null;
  
  const memory = (performance as any).memory;
  return memory ? {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  } : null;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 资源预加载
export class ResourcePreloader {
  private cache = new Map<string, Promise<any>>();

  preloadScript(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });

    this.cache.set(src, promise);
    return promise;
  }

  preloadStylesheet(href: string): Promise<void> {
    if (this.cache.has(href)) {
      return this.cache.get(href)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
      document.head.appendChild(link);
    });

    this.cache.set(href, promise);
    return promise;
  }

  preloadData<T>(url: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = fetcher();
    this.cache.set(url, promise);
    return promise;
  }
}

// 空闲时间执行
export function runInIdleTime(callback: () => void, timeout = 5000) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 0);
  }
}

// 批量DOM操作
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

// 长任务优化
export function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

export async function processLargeDataset<T, R>(
  data: T[],
  processor: (item: T) => R,
  chunkSize = 100
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkResults = chunk.map(processor);
    results.push(...chunkResults);
    
    // 每处理一个chunk就让出主线程
    await yieldToMain();
  }
  
  return results;
}

// FPS监控
export class FPSMonitor {
  private fps = 0;
  private lastTime = 0;
  private frames = 0;
  private rafId: number | null = null;
  private callbacks: ((fps: number) => void)[] = [];

  start() {
    const updateFPS = (currentTime: number) => {
      this.frames++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        
        this.callbacks.forEach(callback => callback(this.fps));
      }
      
      this.rafId = requestAnimationFrame(updateFPS);
    };
    
    this.rafId = requestAnimationFrame(updateFPS);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  onFPSUpdate(callback: (fps: number) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  getCurrentFPS(): number {
    return this.fps;
  }
}

// 获取设备性能等级
export function getDevicePerformance(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'medium';

  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;
  
  // 基于内存和CPU核心数判断设备性能
  if (memory >= 8 && cores >= 8) return 'high';
  if (memory >= 4 && cores >= 4) return 'medium';
  return 'low';
}

// 根据设备性能调整配置
export function getPerformanceConfig() {
  const level = getDevicePerformance();
  
  return {
    high: {
      imageQuality: 90,
      animationDuration: 300,
      virtualListOverscan: 10,
      preloadDistance: 500,
    },
    medium: {
      imageQuality: 75,
      animationDuration: 200,
      virtualListOverscan: 5,
      preloadDistance: 300,
    },
    low: {
      imageQuality: 60,
      animationDuration: 100,
      virtualListOverscan: 3,
      preloadDistance: 100,
    },
  }[level];
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance();
export const resourcePreloader = new ResourcePreloader();
export const fpsMonitor = new FPSMonitor(); 