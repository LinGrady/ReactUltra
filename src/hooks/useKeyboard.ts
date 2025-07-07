import { useEffect, useCallback, useRef } from 'react';

interface KeyboardOptions {
  target?: HTMLElement | Document;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
}

/**
 * 键盘事件处理Hook
 * @param key 要监听的按键（支持组合键，如 'ctrl+s', 'shift+enter'）
 * @param callback 按键回调函数
 * @param options 配置选项
 */
export function useKeyboard(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: KeyboardOptions = {}
) {
  const {
    target = document,
    preventDefault = false,
    stopPropagation = false,
    enabled = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const keys = Array.isArray(key) ? key : [key];
      const pressedKey = formatKey(event);

      if (keys.some(k => k.toLowerCase() === pressedKey.toLowerCase())) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callbackRef.current(event);
      }
    },
    [key, preventDefault, stopPropagation, enabled]
  );

  useEffect(() => {
    const element = target || document;
    element.addEventListener('keydown', handleKeyDown as any);

    return () => {
      element.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [target, handleKeyDown]);
}

/**
 * 格式化按键事件为字符串
 */
function formatKey(event: KeyboardEvent): string {
  const parts: string[] = [];
  
  if (event.ctrlKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  if (event.metaKey) parts.push('meta');
  
  const key = event.key.toLowerCase();
  
  // 特殊键映射
  const keyMap: Record<string, string> = {
    ' ': 'space',
    'enter': 'enter',
    'escape': 'escape',
    'tab': 'tab',
    'backspace': 'backspace',
    'delete': 'delete',
    'arrowup': 'up',
    'arrowdown': 'down',
    'arrowleft': 'left',
    'arrowright': 'right',
  };
  
  parts.push(keyMap[key] || key);
  
  return parts.join('+');
}

/**
 * 快捷键Hook - 预定义常用快捷键
 */
export function useShortcuts() {
  const shortcuts = useRef(new Map<string, () => void>());

  const register = useCallback((key: string, callback: () => void) => {
    shortcuts.current.set(key, callback);
  }, []);

  const unregister = useCallback((key: string) => {
    shortcuts.current.delete(key);
  }, []);

  useKeyboard(
    Array.from(shortcuts.current.keys()),
    useCallback((event: KeyboardEvent) => {
      const pressedKey = formatKey(event);
      const callback = shortcuts.current.get(pressedKey);
      if (callback) {
        event.preventDefault();
        callback();
      }
    }, [])
  );

  return { register, unregister };
}

/**
 * ESC键Hook - 常用于关闭模态框等
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  useKeyboard('escape', callback, { enabled });
} 