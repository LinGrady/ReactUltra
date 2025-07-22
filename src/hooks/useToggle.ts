import { useState, useCallback } from 'react';

/**
 * 布尔值切换Hook
 * @param initialValue 初始值，默认为false
 * @returns [value, toggle, setTrue, setFalse, setValue]
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse, setValue] as const;
}

/**
 * 多状态循环切换Hook
 * @param values 状态值数组
 * @param initialIndex 初始索引，默认为0
 * @returns [currentValue, next, previous, setIndex, currentIndex]
 */
export function useCycleToggle<T>(values: readonly T[], initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);

  const next = useCallback(() => {
    setIndex(prev => (prev + 1) % values.length);
  }, [values.length]);

  const previous = useCallback(() => {
    setIndex(prev => (prev - 1 + values.length) % values.length);
  }, [values.length]);

  const setCurrent = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < values.length) {
      setIndex(newIndex);
    }
  }, [values.length]);

  return [
    values[index],
    next,
    previous,
    setCurrent,
    index
  ] as const;
}

/**
 * 映射切换Hook - 在对象的键值之间切换
 * @param map 状态映射对象
 * @param initialKey 初始键
 * @returns [currentValue, toggle, setKey, currentKey]
 */
export function useMapToggle<T extends Record<string, any>>(
  map: T,
  initialKey: keyof T
) {
  const [currentKey, setCurrentKey] = useState<keyof T>(initialKey);
  const keys = Object.keys(map);

  const toggle = useCallback(() => {
    const currentIndex = keys.indexOf(currentKey as string);
    const nextIndex = (currentIndex + 1) % keys.length;
    setCurrentKey(keys[nextIndex]);
  }, [currentKey, keys]);

  const setKey = useCallback((key: keyof T) => {
    if (key in map) {
      setCurrentKey(key);
    }
  }, [map]);

  return [
    map[currentKey],
    toggle,
    setKey,
    currentKey
  ] as const;
} 