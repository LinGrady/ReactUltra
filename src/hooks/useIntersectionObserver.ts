import { useEffect, useState, RefObject } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * 使用 IntersectionObserver 监听元素是否进入视口
 * @param elementRef 要监听的元素引用
 * @param options IntersectionObserver 配置选项
 * @returns IntersectionObserverEntry 或 undefined
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: IntersectionObserverOptions = {},
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const element = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;
    
    if (!hasIOSupport || frozen || !element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, frozen]);
  
  return entry;
}