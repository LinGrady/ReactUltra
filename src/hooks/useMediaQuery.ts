import { useState, useEffect } from 'react';

/**
 * 媒体查询Hook
 * @param query CSS媒体查询字符串
 * @returns 是否匹配查询条件
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 设置初始值
    setMatches(mediaQuery.matches);
    
    // 监听变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // 兼容旧版本浏览器
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * 预定义的响应式断点Hook
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLarge = useMediaQuery('(min-width: 1280px)');
  const isXLarge = useMediaQuery('(min-width: 1536px)');
  
  // 偏好设置
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isHighContrast = useMediaQuery('(prefers-contrast: high)');

  return {
    // 屏幕尺寸
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    isXLarge,
    
    // 当前断点
    currentBreakpoint: isMobile ? 'mobile' : 
                     isTablet ? 'tablet' : 
                     isDesktop ? 'desktop' : 
                     isLarge ? 'large' : 'xlarge',
    
    // 用户偏好
    prefersDarkMode,
    prefersReducedMotion,
    isHighContrast,
  };
} 