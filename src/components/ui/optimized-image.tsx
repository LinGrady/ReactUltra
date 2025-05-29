import { useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fallback?: string;
  onLoadComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  onLoadError?: (error: string) => void;
}

// WebP 支持检测
const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
})();

// 生成优化的图片URL
function generateOptimizedSrc(src: string, width?: number, quality = 75): string {
  // 如果是外部URL，直接返回
  if (src.startsWith('http')) {
    return src;
  }
  
  // 检查是否支持WebP
  const extension = supportsWebP ? '.webp' : '.jpg';
  const baseSrc = src.replace(/\.[^/.]+$/, '');
  
  // 如果指定了宽度，生成响应式URL
  if (width) {
    return `${baseSrc}_${width}w_q${quality}${extension}`;
  }
  
  return `${baseSrc}_q${quality}${extension}`;
}

// 生成srcSet用于响应式图片
function generateSrcSet(src: string, quality = 75): string {
  const sizes = [480, 768, 1024, 1280, 1920];
  return sizes
    .map(size => `${generateOptimizedSrc(src, size, quality)} ${size}w`)
    .join(', ');
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    priority = false,
    quality = 75,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    fallback,
    onLoadComplete,
    onLoadError,
    className,
    ...props
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 懒加载逻辑
    useEffect(() => {
      if (priority || isInView) return;

      const currentImgRef = imgRef.current;
      if (!currentImgRef) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );

      observerRef.current.observe(currentImgRef);

      return () => {
        observerRef.current?.disconnect();
      };
    }, [priority, isInView]);

    // 性能监控
    useEffect(() => {
      if (!isLoaded || !imgRef.current) return;

      const img = imgRef.current;
      const loadTime = performance.now();
      
      // 记录图片加载性能
      if (onLoadComplete) {
        onLoadComplete({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      }

      // 开发环境下的性能日志
      if (import.meta.env.DEV) {
        console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
      }
    }, [isLoaded, src, onLoadComplete]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      props.onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      const errorMsg = `Failed to load image: ${src}`;
      onLoadError?.(errorMsg);
      
      // 如果有fallback图片，尝试加载
      if (fallback && imgRef.current) {
        imgRef.current.src = fallback;
      }
    };

    // 如果还没有进入视口且不是优先加载，显示占位符
    if (!isInView && !priority) {
      return (
        <div
          ref={imgRef}
          className={cn(
            'bg-muted animate-pulse',
            className
          )}
          style={{ width, height }}
          aria-label={`Loading ${alt}`}
        />
      );
    }

    const optimizedSrc = generateOptimizedSrc(src, width, quality);
    const srcSet = generateSrcSet(src, quality);

    return (
      <div className="relative overflow-hidden">
        {/* 加载状态 */}
        {!isLoaded && !hasError && (
          <div
            className={cn(
              'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
              className
            )}
            style={{ width, height }}
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 错误状态 */}
        {hasError && (
          <div
            className={cn(
              'absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground',
              className
            )}
            style={{ width, height }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <div className="text-sm">图片加载失败</div>
            </div>
          </div>
        )}

        {/* 实际图片 */}
        <img
          ref={(node) => {
            imgRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            hasError && 'hidden',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

// 导出工具函数
export { generateOptimizedSrc, generateSrcSet, supportsWebP }; 