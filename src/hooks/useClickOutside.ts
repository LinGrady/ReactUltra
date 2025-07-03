import { useEffect, RefObject } from 'react';

/**
 * 检测点击元素外部的Hook
 * @param ref 要监听的元素引用
 * @param handler 点击外部时的回调函数
 * @param enabled 是否启用监听，默认为true
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      
      // 如果元素不存在或者点击的是元素内部，则不触发
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      
      handler(event);
    };

    // 监听鼠标和触摸事件
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, handler, enabled]);
}

/**
 * 多元素点击外部检测Hook
 * @param refs 要监听的元素引用数组
 * @param handler 点击外部时的回调函数
 * @param enabled 是否启用监听
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const isClickInside = refs.some(ref => {
        const element = ref.current;
        return element && element.contains(event.target as Node);
      });
      
      if (!isClickInside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, handler, enabled]);
} 