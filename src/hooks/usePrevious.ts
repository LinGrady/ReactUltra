import { useRef, useEffect } from 'react';

/**
 * 获取前一个值的Hook
 * @param value 当前值
 * @returns 前一个值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * 比较当前值和前一个值的Hook
 * @param value 当前值
 * @param compareFn 比较函数，默认使用严格相等
 * @returns { previous, current, hasChanged }
 */
export function usePreviousComparison<T>(
  value: T,
  compareFn: (prev: T | undefined, current: T) => boolean = (prev, current) => prev !== current
) {
  const previous = usePrevious(value);
  const hasChanged = compareFn(previous, value);

  return {
    previous,
    current: value,
    hasChanged,
  };
}

/**
 * 获取多个前值的Hook
 * @param value 当前值
 * @param count 保存的历史值数量
 * @returns 历史值数组（从最新到最旧）
 */
export function usePreviousValues<T>(value: T, count: number = 5): T[] {
  const historyRef = useRef<T[]>([]);

  useEffect(() => {
    const history = historyRef.current;
    history.unshift(value);
    
    // 限制历史记录数量
    if (history.length > count) {
      history.splice(count);
    }
    
    historyRef.current = [...history];
  });

  return historyRef.current.slice(1); // 排除当前值
} 