import { useEffect, useCallback, useMemo } from 'react';
import { 
  performanceMonitor, 
  fpsMonitor, 
  getMemoryUsage, 
  getPerformanceConfig,
  debounce,
  throttle 
} from '@/utils/performance';

interface PerformanceOptimizationOptions {
  enableMonitoring?: boolean;
  enableFPSTracking?: boolean;
  enableMemoryTracking?: boolean;
  adaptiveConfig?: boolean;
  reportInterval?: number;
}

/**
 * 综合性能优化Hook
 * 提供自动性能监控、设备适配、资源管理等功能
 */
export function usePerformanceOptimization(
  options: PerformanceOptimizationOptions = {}
) {
  const {
    enableMonitoring = true,
    enableFPSTracking = false,
    enableMemoryTracking = false,
    adaptiveConfig = true,
    reportInterval = 30000,
  } = options;

  // 获取设备适配配置
  const deviceConfig = useMemo(() => {
    return adaptiveConfig ? getPerformanceConfig() : null;
  }, [adaptiveConfig]);

  // 性能监控
  useEffect(() => {
    if (!enableMonitoring) return;

    // 开始监控
    const cleanup: (() => void)[] = [];

    // FPS监控
    if (enableFPSTracking) {
      fpsMonitor.start();
      
      const unsubscribeFPS = fpsMonitor.onFPSUpdate((fps) => {
        if (fps < 30) {
          console.warn(`⚠️ 性能警告: FPS降至 ${fps}`);
        }
      });
      
      cleanup.push(() => {
        fpsMonitor.stop();
        unsubscribeFPS();
      });
    }

    // 内存监控
    if (enableMemoryTracking) {
      const memoryCheck = setInterval(() => {
        const memory = getMemoryUsage();
        if (memory) {
          const usagePercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
          if (usagePercent > 80) {
            console.warn(`⚠️ 内存警告: 使用率 ${usagePercent.toFixed(2)}%`);
          }
        }
      }, 10000);
      
      cleanup.push(() => clearInterval(memoryCheck));
    }

    // 定期报告
    const reportTimer = setInterval(() => {
      const metrics = performanceMonitor.getMetrics();
      const memory = getMemoryUsage();
      
      console.group('📊 性能报告');
      console.log('Web Vitals:', {
        LCP: metrics.LCP?.avg ? `${metrics.LCP.avg.toFixed(2)}ms` : 'N/A',
        FID: metrics.FID?.avg ? `${metrics.FID.avg.toFixed(2)}ms` : 'N/A',
        CLS: metrics.CLS?.avg ? metrics.CLS.avg.toFixed(4) : 'N/A',
      });
      
      if (memory) {
        console.log('内存使用:', {
          usage: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        });
      }
      
      if (enableFPSTracking) {
        console.log('当前FPS:', fpsMonitor.getCurrentFPS());
      }
      
      console.groupEnd();
    }, reportInterval);
    
    cleanup.push(() => clearInterval(reportTimer));

    return () => {
      cleanup.forEach(fn => fn());
    };
  }, [enableMonitoring, enableFPSTracking, enableMemoryTracking, reportInterval]);

  // 优化工具函数
  const optimizedDebounce = useCallback(<T extends (...args: any[]) => any>(fn: T, delay: number = 300) => {
    return debounce(fn, delay);
  }, []);

  const optimizedThrottle = useCallback(<T extends (...args: any[]) => any>(fn: T, limit: number = 100) => {
    return throttle(fn, limit);
  }, []);

  // 长任务分割
  const processLargeTask = useCallback(async <T, R>(
    data: T[],
    processor: (item: T) => R,
    chunkSize?: number
  ): Promise<R[]> => {
    const { processLargeDataset } = await import('@/utils/performance');
    const adaptedChunkSize = chunkSize || (deviceConfig?.virtualListOverscan ?? 5) * 20;
    return processLargeDataset(data, processor, adaptedChunkSize);
  }, [deviceConfig]);

  // 内存清理
  const cleanupResources = useCallback(() => {
    // 清理性能监控器
    performanceMonitor.disconnect();
    
    // 强制垃圾回收（如果可用）
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, []);

  return {
    // 配置信息
    deviceConfig,
    
    // 工具函数
    debounce: optimizedDebounce,
    throttle: optimizedThrottle,
    processLargeTask,
    cleanupResources,
    
    // 监控数据
    getMetrics: () => performanceMonitor.getMetrics(),
    getMemoryUsage,
    getCurrentFPS: () => enableFPSTracking ? fpsMonitor.getCurrentFPS() : null,
  };
}

/**
 * 简化版性能优化Hook - 适用于大多数场景
 */
export function useBasicPerformanceOptimization() {
  return usePerformanceOptimization({
    enableMonitoring: true,
    enableFPSTracking: false,
    enableMemoryTracking: false,
    adaptiveConfig: true,
    reportInterval: 60000, // 1分钟报告一次
  });
}

/**
 * 高级性能监控Hook - 适用于性能敏感的应用
 */
export function useAdvancedPerformanceMonitoring() {
  return usePerformanceOptimization({
    enableMonitoring: true,
    enableFPSTracking: true,
    enableMemoryTracking: true,
    adaptiveConfig: true,
    reportInterval: 15000, // 15秒报告一次
  });
} 