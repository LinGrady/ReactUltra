import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { cn } from '../../lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  blurEffect?: boolean;
  aspectRatio?: string;
  wrapperClassName?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  blurEffect = true,
  aspectRatio = '16/9',
  wrapperClassName,
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const imageRef = useRef<HTMLImageElement>(null);

  // 使用 IntersectionObserver 检测图片可见性
  const entry = useIntersectionObserver(imageRef as React.RefObject<Element>, {
    freezeOnceVisible: true,
    rootMargin: '100px' // 提前100px开始加载
  });
  
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    // 当图片可见时加载实际图片
    if (!isVisible || isLoaded) return;
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      // 保持使用占位图
    };
  }, [src, isVisible, isLoaded]);

  // 计算图片宽度和高度，以避免布局移动
  const [width, height] = aspectRatio.split('/').map(Number);
  const paddingBottom = `${(height / width) * 100}%`;

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted", 
        wrapperClassName
      )}
      style={{ paddingBottom }}
    >
      <img
        ref={imageRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500",
          blurEffect && !isLoaded ? "filter blur-[10px] scale-110" : "",
          className
        )}
        loading="lazy"
        decoding="async"
        {...rest}
      />
    </div>
  );
}