import { useState, useEffect, useRef, useCallback } from 'react';

interface IdleOptions {
  timeout?: number; // 空闲超时时间（毫秒），默认5分钟
  events?: string[]; // 要监听的事件类型
  initialState?: boolean; // 初始状态
}

const defaultEvents = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

/**
 * 用户空闲检测Hook
 * @param options 配置选项
 * @returns { isIdle, remainingTime, reset }
 */
export function useIdle(options: IdleOptions = {}) {
  const {
    timeout = 5 * 60 * 1000, // 5分钟
    events = defaultEvents,
    initialState = false,
  } = options;

  const [isIdle, setIsIdle] = useState(initialState);
  const [remainingTime, setRemainingTime] = useState(timeout);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
  const countdownId = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastActivityTime = useRef(Date.now());

  const reset = useCallback(() => {
    lastActivityTime.current = Date.now();
    setIsIdle(false);
    setRemainingTime(timeout);
    
    // 清除现有定时器
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (countdownId.current) {
      clearInterval(countdownId.current);
    }

    // 设置新的空闲定时器
    timeoutId.current = setTimeout(() => {
      setIsIdle(true);
    }, timeout);

    // 设置倒计时更新
    countdownId.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime.current;
      const remaining = Math.max(0, timeout - elapsed);
      setRemainingTime(remaining);
      
      if (remaining <= 0) {
        clearInterval(countdownId.current!);
      }
    }, 1000);
  }, [timeout]);

  useEffect(() => {
    const handleActivity = () => {
      if (isIdle) {
        setIsIdle(false);
      }
      reset();
    };

    // 绑定事件监听器
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // 初始化
    reset();

    return () => {
      // 清理事件监听器
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      // 清理定时器
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (countdownId.current) {
        clearInterval(countdownId.current);
      }
    };
  }, [events, isIdle, reset]);

  return {
    isIdle,
    remainingTime,
    reset,
  };
}

/**
 * 简化版用户空闲检测Hook
 * @param timeout 超时时间（毫秒）
 * @returns 是否空闲
 */
export function useSimpleIdle(timeout: number = 5 * 60 * 1000): boolean {
  const { isIdle } = useIdle({ timeout });
  return isIdle;
} 