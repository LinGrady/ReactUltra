import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 防抖钩子
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // 在下一次 useEffect 执行前清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * 防抖函数钩子
 * @param fn 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param deps 依赖数组
 * @returns 防抖处理后的函数
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500,
  deps: any[] = []
): T {
  const fnRef = useRef<T>(fn);
  
  // 更新函数引用
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((...args: Parameters<T>) => {
      fnRef.current(...args);
    }, delay) as T,
    [delay, ...deps]
  );
}

/**
 * 节流钩子
 * @param value 需要节流的值
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;
    
    if (elapsed >= delay) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, delay - elapsed);
      
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);
  
  return throttledValue;
}

/**
 * 节流函数钩子
 * @param fn 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @param deps 依赖数组
 * @returns 节流处理后的函数
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500,
  deps: any[] = []
): T {
  const fnRef = useRef<T>(fn);
  
  // 更新函数引用
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args: Parameters<T>) => {
      fnRef.current(...args);
    }, delay) as T,
    [delay, ...deps]
  );
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCalled = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    
    if (now - lastCalled >= delay) {
      lastCalled = now;
      fn.apply(this, args);
    }
  };
}