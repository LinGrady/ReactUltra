import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * useTimeout Hook - 管理setTimeout
 * @param callback 回调函数
 * @param delay 延迟时间（毫秒），null表示停止
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      timeoutId.current = setTimeout(tick, delay);
      
      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [delay]);

  // 手动清除定时器
  const clear = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  }, []);

  return clear;
}

/**
 * useInterval Hook - 管理setInterval
 * @param callback 回调函数
 * @param delay 间隔时间（毫秒），null表示停止
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);
  const intervalId = useRef<NodeJS.Timeout | undefined>(undefined);

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      intervalId.current = setInterval(tick, delay);
      
      return () => {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      };
    }
  }, [delay]);

  // 手动清除定时器
  const clear = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }, []);

  return clear;
}

/**
 * 倒计时Hook
 * @param initialSeconds 初始秒数
 * @param onComplete 完成时的回调
 * @returns { seconds, start, pause, reset, isRunning }
 */
export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const savedOnComplete = useRef(onComplete);

  // 保存最新的完成回调
  useEffect(() => {
    savedOnComplete.current = onComplete;
  }, [onComplete]);

  // 倒计时逻辑
  useInterval(
    () => {
             setSeconds((prev: number) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (savedOnComplete.current) {
            savedOnComplete.current();
          }
          return 0;
        }
        return prev - 1;
      });
    },
    isRunning ? 1000 : null
  );

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setIsRunning(false);
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  return {
    seconds,
    start,
    pause,
    reset,
    isRunning,
  };
}

/**
 * 秒表Hook
 * @returns { time, start, stop, reset, isRunning }
 */
export function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef<number>(0);

  useInterval(
    () => {
      setTime(Date.now() - startTime.current);
    },
    isRunning ? 10 : null // 10ms精度
  );

  const start = useCallback(() => {
    if (!isRunning) {
      startTime.current = Date.now() - time;
      setIsRunning(true);
    }
  }, [isRunning, time]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    startTime.current = 0;
  }, []);

  return {
    time,
    start,
    stop,
    reset,
    isRunning,
  };
} 