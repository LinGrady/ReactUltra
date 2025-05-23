import React, { useState, useEffect, ComponentType, ReactNode } from 'react';

interface SplitComponentProps {
  fallback?: React.ReactNode;
  load: () => Promise<{ default: ComponentType<any> }>;
  props?: Record<string, any>;
}

/**
 * 用于异步加载组件的自定义钩子
 * @param componentPromise 组件导入的 Promise
 * @param options 选项配置
 * @returns [组件, 加载状态, 错误]
 */
export function useCodeSplitting<T extends ComponentType<any>>(
  componentPromise: () => Promise<{ default: T }>,
  options: { preload?: boolean; delay?: number } = {}
): [React.ComponentType<any> | null, boolean, Error | null] {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout | null = null;

    // 如果指定了延迟，使用 setTimeout 延迟加载
    const loadComponent = () => {
      setLoading(true);
      
      componentPromise()
        .then(module => {
          if (mounted) {
            setComponent(() => module.default);
            setLoading(false);
          }
        })
        .catch(err => {
          if (mounted) {
            console.error('加载组件失败:', err);
            setError(err);
            setLoading(false);
          }
        });
    };

    if (options.delay) {
      timer = setTimeout(loadComponent, options.delay);
    } else {
      loadComponent();
    }

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [componentPromise, options.delay]);

  return [Component, loading, error];
}

/**
 * 异步加载组件的包装组件
 */
export function AsyncComponent({ load, fallback = null, props = {} }: SplitComponentProps): ReactNode {
  const [Component, loading, error] = useCodeSplitting(load);

  if (loading) return fallback as ReactNode;
  if (error) return React.createElement('div', {}, `加载组件时出错: ${error.message}`);
  if (!Component) return null;

  return React.createElement(Component, props);
}

/**
 * 预加载组件
 * @param componentPromise 组件导入的 Promise
 */
export function preloadComponent(componentPromise: () => Promise<{ default: ComponentType<any> }>) {
  // 在后台预加载组件
  componentPromise().catch(err => {
    console.warn('组件预加载失败:', err);
  });
}