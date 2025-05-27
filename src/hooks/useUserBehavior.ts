import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounceThrottle';

interface UserAction {
  type: 'click' | 'scroll' | 'hover' | 'focus' | 'input' | 'navigation';
  element?: string;
  timestamp: number;
  data?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  actions: UserAction[];
  pageViews: string[];
  totalTime: number;
}

/**
 * 用户行为分析钩子
 */
export function useUserBehavior() {
  const sessionRef = useRef<UserSession | null>(null);
  const actionsBuffer = useRef<UserAction[]>([]);
  const debouncedFlush = useDebounce(flushActions, 2000);

  // 初始化会话
  useEffect(() => {
    if (!sessionRef.current) {
      sessionRef.current = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        actions: [],
        pageViews: [window.location.pathname],
        totalTime: 0,
      };
    }

    // 页面卸载时保存数据
    const handleBeforeUnload = () => {
      if (sessionRef.current) {
        sessionRef.current.totalTime = Date.now() - sessionRef.current.startTime;
        saveSession(sessionRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 记录用户行为
  const trackAction = useCallback((action: Omit<UserAction, 'timestamp'>) => {
    const fullAction: UserAction = {
      ...action,
      timestamp: Date.now(),
    };

    actionsBuffer.current.push(fullAction);
    
    // 触发防抖刷新
    debouncedFlush();
  }, [debouncedFlush]);

  // 刷新行为数据到会话
  function flushActions() {
    if (sessionRef.current && actionsBuffer.current.length > 0) {
      sessionRef.current.actions.push(...actionsBuffer.current);
      actionsBuffer.current = [];
      
      // 可以在这里发送到分析服务
      sendToAnalytics(sessionRef.current);
    }
  }

  // 跟踪点击事件
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = getElementSelector(target);
      
      trackAction({
        type: 'click',
        element,
        data: {
          x: event.clientX,
          y: event.clientY,
          button: event.button,
        },
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackAction]);

  // 跟踪滚动事件
  useEffect(() => {
    const handleScroll = () => {
      trackAction({
        type: 'scroll',
        data: {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
        },
      });
    };

    const throttledScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackAction]);

  // 跟踪页面导航
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    if (sessionRef.current && !sessionRef.current.pageViews.includes(currentPath)) {
      sessionRef.current.pageViews.push(currentPath);
      
      trackAction({
        type: 'navigation',
        data: {
          from: sessionRef.current.pageViews[sessionRef.current.pageViews.length - 2],
          to: currentPath,
        },
      });
    }
  }, [trackAction]);

  // 获取会话统计
  const getSessionStats = useCallback(() => {
    if (!sessionRef.current) return null;

    const actions = sessionRef.current.actions;
    const clickCount = actions.filter(a => a.type === 'click').length;
    const scrollCount = actions.filter(a => a.type === 'scroll').length;
    const sessionDuration = Date.now() - sessionRef.current.startTime;

    return {
      sessionId: sessionRef.current.sessionId,
      duration: sessionDuration,
      pageViews: sessionRef.current.pageViews.length,
      totalActions: actions.length,
      clickCount,
      scrollCount,
      avgActionsPerMinute: (actions.length / (sessionDuration / 60000)).toFixed(2),
    };
  }, []);

  return {
    trackAction,
    getSessionStats,
    flushActions,
  };
}

// 工具函数
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getElementSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;
  if (element.className) return `.${element.className.split(' ')[0]}`;
  return element.tagName.toLowerCase();
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

function saveSession(session: UserSession): void {
  try {
    localStorage.setItem('userSession', JSON.stringify(session));
  } catch (error) {
    console.warn('Failed to save user session:', error);
  }
}

function sendToAnalytics(session: UserSession): void {
  // 在生产环境中，可以发送到分析服务
  if (process.env.NODE_ENV === 'production') {
    // 示例：发送到 Google Analytics 或自定义分析服务
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.sessionId,
        actions: session.actions.slice(-10), // 只发送最近的10个行为
        pageViews: session.pageViews,
      }),
    }).catch(e => console.error('Analytics error:', e));
    */
  }

  // 开发环境下打印统计信息
  if (process.env.NODE_ENV === 'development') {
    console.log('User behavior stats:', {
      sessionId: session.sessionId,
      totalActions: session.actions.length,
      pageViews: session.pageViews.length,
      recentActions: session.actions.slice(-5),
    });
  }
}