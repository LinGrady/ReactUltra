/**
 * 图片优化工具函数
 * 提供图片压缩、格式转换、尺寸调整等功能
 */

// 图片质量预设
export const IMAGE_QUALITY = {
  LOW: 50,
  MEDIUM: 75,
  HIGH: 90,
  LOSSLESS: 100,
} as const;

// 常用断点尺寸
export const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1920,
} as const;

// 图片格式支持检测
export const formatSupport = {
  webp: (() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })(),
  
  avif: (() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  })(),
};

/**
 * 生成优化的图片URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  } = {}
): string {
  const { width, height, quality = IMAGE_QUALITY.MEDIUM, format = 'auto' } = options;
  
  // 如果是外部URL，直接返回
  if (src.startsWith('http')) {
    return src;
  }
  
  // 确定最佳格式
  let targetFormat = format;
  if (format === 'auto') {
    if (formatSupport.avif) {
      targetFormat = 'avif';
    } else if (formatSupport.webp) {
      targetFormat = 'webp';
    } else {
      targetFormat = 'jpg';
    }
  }
  
  // 构建查询参数
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('format', targetFormat);
  params.set('quality', quality.toString());
  
  return `${src}?${params.toString()}`;
}

/**
 * 生成响应式图片的srcSet
 */
export function generateResponsiveSrcSet(
  src: string,
  options: {
    sizes?: number[];
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  } = {}
): string {
  const { 
    sizes = [BREAKPOINTS.xs, BREAKPOINTS.sm, BREAKPOINTS.md, BREAKPOINTS.lg, BREAKPOINTS.xl],
    quality = IMAGE_QUALITY.MEDIUM,
    format = 'auto'
  } = options;
  
  return sizes
    .map(size => {
      const url = getOptimizedImageUrl(src, { width: size, quality, format });
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * 生成sizes属性
 */
export function generateSizesAttribute(breakpoints: Record<string, string>): string {
  const entries = Object.entries(breakpoints);
  const conditions = entries.slice(0, -1).map(([bp, size]) => `(max-width: ${bp}) ${size}`);
  const defaultSize = entries[entries.length - 1][1];
  
  return [...conditions, defaultSize].join(', ');
}

/**
 * 预加载关键图片
 */
export function preloadImage(src: string, options: {
  as?: 'image';
  crossorigin?: 'anonymous' | 'use-credentials';
  sizes?: string;
  srcset?: string;
} = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = src;
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    if (options.sizes) {
      link.setAttribute('imagesizes', options.sizes);
    }
    
    if (options.srcset) {
      link.setAttribute('imagesrcset', options.srcset);
    }
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    document.head.appendChild(link);
  });
}

/**
 * 图片性能监控
 */
export class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor;
  private metrics: Map<string, {
    loadTime: number;
    size: { width: number; height: number };
    timestamp: number;
  }> = new Map();

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor();
    }
    return ImagePerformanceMonitor.instance;
  }

  recordLoad(src: string, loadTime: number, size: { width: number; height: number }): void {
    this.metrics.set(src, {
      loadTime,
      size,
      timestamp: Date.now(),
    });
  }

  getMetrics(): Array<{
    src: string;
    loadTime: number;
    size: { width: number; height: number };
    timestamp: number;
  }> {
    return Array.from(this.metrics.entries()).map(([src, data]) => ({
      src,
      ...data,
    }));
  }

  getAverageLoadTime(): number {
    const metrics = Array.from(this.metrics.values());
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return total / metrics.length;
  }

  clear(): void {
    this.metrics.clear();
  }
}

/**
 * 图片懒加载观察器
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}

/**
 * 常用的响应式图片配置
 */
export const RESPONSIVE_CONFIGS = {
  hero: {
    sizes: generateSizesAttribute({
      '768px': '100vw',
      '1200px': '100vw',
      default: '100vw',
    }),
    quality: IMAGE_QUALITY.HIGH,
  },
  
  card: {
    sizes: generateSizesAttribute({
      '768px': '100vw',
      '1200px': '50vw',
      default: '33vw',
    }),
    quality: IMAGE_QUALITY.MEDIUM,
  },
  
  thumbnail: {
    sizes: generateSizesAttribute({
      '768px': '50vw',
      '1200px': '25vw',
      default: '20vw',
    }),
    quality: IMAGE_QUALITY.MEDIUM,
  },
  
  avatar: {
    sizes: generateSizesAttribute({
      '768px': '10vw',
      default: '5vw',
    }),
    quality: IMAGE_QUALITY.MEDIUM,
  },
} as const; 