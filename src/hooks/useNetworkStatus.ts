import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

/**
 * 网络状态监控钩子
 * @returns 网络状态信息
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      const status: NetworkStatus = {
        isOnline: navigator.onLine,
        isSlowConnection: false,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
      };

      if (connection) {
        status.connectionType = connection.type || 'unknown';
        status.effectiveType = connection.effectiveType || 'unknown';
        status.downlink = connection.downlink || 0;
        status.rtt = connection.rtt || 0;
        
        // 判断是否为慢速连接
        status.isSlowConnection = 
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          (connection.downlink && connection.downlink < 1.5);
      }

      setNetworkStatus(status);
    };

    // 初始化
    updateNetworkStatus();

    // 监听网络状态变化
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 监听连接变化（如果支持）
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}

/**
 * 网络质量评估钩子
 */
export function useNetworkQuality() {
  const networkStatus = useNetworkStatus();

  const getQualityScore = (): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' => {
    if (!networkStatus.isOnline) return 'offline';
    
    const { effectiveType, downlink, rtt } = networkStatus;
    
    // 基于有效连接类型
    if (effectiveType === '4g' && downlink > 10 && rtt < 100) return 'excellent';
    if (effectiveType === '4g' && downlink > 5) return 'good';
    if (effectiveType === '3g' || (downlink > 1.5 && rtt < 300)) return 'fair';
    
    return 'poor';
  };

  const getRecommendations = () => {
    const quality = getQualityScore();
    
    switch (quality) {
      case 'offline':
        return {
          message: '网络连接已断开',
          suggestions: ['检查网络连接', '尝试刷新页面'],
          shouldReduceQuality: true,
          shouldDisableAutoRefresh: true,
        };
      case 'poor':
        return {
          message: '网络连接较慢',
          suggestions: ['减少图片质量', '延迟非关键请求'],
          shouldReduceQuality: true,
          shouldDisableAutoRefresh: false,
        };
      case 'fair':
        return {
          message: '网络连接一般',
          suggestions: ['优化图片加载'],
          shouldReduceQuality: false,
          shouldDisableAutoRefresh: false,
        };
      default:
        return {
          message: '网络连接良好',
          suggestions: [],
          shouldReduceQuality: false,
          shouldDisableAutoRefresh: false,
        };
    }
  };

  return {
    ...networkStatus,
    quality: getQualityScore(),
    recommendations: getRecommendations(),
  };
}
