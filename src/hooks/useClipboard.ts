import { useState, useCallback } from 'react';

interface ClipboardState {
  value: string;
  success: boolean;
  error: string | null;
}

/**
 * 剪贴板操作Hook
 * 支持复制文本、读取剪贴板、状态管理
 */
export function useClipboard(timeout = 2000) {
  const [state, setState] = useState<ClipboardState>({
    value: '',
    success: false,
    error: null,
  });

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      // 优先使用现代API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级到传统方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('复制失败');
        }
      }

      setState({
        value: text,
        success: true,
        error: null,
      });

      // 自动重置状态
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, timeout);

    } catch (error) {
      setState({
        value: '',
        success: false,
        error: error instanceof Error ? error.message : '复制失败',
      });
    }
  }, [timeout]);

  const readFromClipboard = useCallback(async (): Promise<string> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText();
        setState(prev => ({ ...prev, value: text, error: null }));
        return text;
      } else {
        throw new Error('当前环境不支持读取剪贴板');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '读取剪贴板失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    copy: copyToClipboard,
    read: readFromClipboard,
    clearError,
  };
} 