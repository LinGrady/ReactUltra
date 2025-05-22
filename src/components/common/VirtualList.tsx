import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface VirtualListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualList<T>({
  data,
  renderItem,
  itemHeight,
  className = '',
  overscan = 5,
  onEndReached,
  endReachedThreshold = 0.8,
  getItemKey = (_, index) => index,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: overscan * 2 });
  const totalHeight = data.length * itemHeight;
  
  // 添加底部观察元素，用于触发加载更多
  const endRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(endRef, {});
  const isVisible = !!entry?.isIntersecting;
  
  useEffect(() => {
    if (isVisible && onEndReached) {
      onEndReached();
    }
  }, [isVisible, onEndReached]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { scrollTop, clientHeight } = containerRef.current;
      const scrollBottom = scrollTop + clientHeight;
      
      // 计算可见范围
      const firstVisibleIndex = Math.floor(scrollTop / itemHeight);
      const lastVisibleIndex = Math.ceil(scrollBottom / itemHeight);
      
      // 添加缓冲区域（overscan）
      const start = Math.max(0, firstVisibleIndex - overscan);
      const end = Math.min(data.length, lastVisibleIndex + overscan);
      
      setVisibleRange({ start, end });
    };
    
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      // 初始计算
      handleScroll();
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [data.length, itemHeight, overscan]);
  
  // 获取当前可见数据
  const visibleData = data.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleData.map((item, index) => {
          const actualIndex = visibleRange.start + index;
          const key = getItemKey(item, actualIndex);
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
        {/* 底部监听元素 */}
        <div 
          ref={endRef}
          style={{ 
            position: 'absolute', 
            bottom: totalHeight * (1 - endReachedThreshold), 
            width: '100%', 
            height: 5 
          }} 
        />
      </div>
    </div>
  );
}
