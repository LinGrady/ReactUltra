import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounceThrottle';

interface WindowSize {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
}

/**
 * 窗口尺寸监听Hook
 * @param debounceDelay 防抖延迟时间，默认100ms
 * @returns 窗口尺寸信息
 */
export function useWindowSize(debounceDelay = 100): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    innerWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    innerHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  // 使用防抖优化性能
  const debouncedUpdateSize = useDebounce(windowSize, debounceDelay);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    
    // 立即获取一次尺寸
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return debouncedUpdateSize;
}

/**
 * 窗口方向检测Hook
 */
export function useOrientation() {
  const { width, height } = useWindowSize();
  
  const isPortrait = height > width;
  const isLandscape = width > height;
  const aspectRatio = width / height;

  return {
    isPortrait,
    isLandscape,
    aspectRatio,
    orientation: isPortrait ? 'portrait' : 'landscape',
  };
} 