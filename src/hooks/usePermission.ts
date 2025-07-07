import { useState, useEffect, useCallback } from 'react';

type PermissionName = 
  | 'geolocation'
  | 'notifications'
  | 'camera'
  | 'microphone'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'persistent-storage'
  | 'background-sync'
  | 'push';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * 权限管理Hook
 * @param name 权限名称
 * @returns { state, request, revoke }
 */
export function usePermission(name: PermissionName) {
  const [state, setState] = useState<PermissionState>('unsupported');

  // 检查权限状态
  const checkPermission = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        setState('unsupported');
        return;
      }

      const result = await navigator.permissions.query({ name: name as any });
      setState(result.state as PermissionState);

      // 监听权限状态变化
      const handleChange = () => {
        setState(result.state as PermissionState);
      };

      result.addEventListener('change', handleChange);
      
      return () => {
        result.removeEventListener('change', handleChange);
      };
    } catch (error) {
      setState('unsupported');
    }
  }, [name]);

  // 请求权限
  const request = useCallback(async (): Promise<PermissionState> => {
    try {
      let result: PermissionState = 'denied';

      switch (name) {
        case 'geolocation':
          try {
            await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            result = 'granted';
          } catch {
            result = 'denied';
          }
          break;

        case 'notifications':
          if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            result = permission as PermissionState;
          }
          break;

        case 'camera':
        case 'microphone':
          try {
            const constraints = {
              video: name === 'camera',
              audio: name === 'microphone',
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            stream.getTracks().forEach(track => track.stop());
            result = 'granted';
          } catch {
            result = 'denied';
          }
          break;

        case 'clipboard-read':
        case 'clipboard-write':
          if (navigator.permissions) {
            const permissionResult = await navigator.permissions.query({ name: name as any });
            result = permissionResult.state as PermissionState;
          }
          break;

        default:
          result = 'unsupported';
      }

      setState(result);
      return result;
    } catch (error) {
      setState('denied');
      return 'denied';
    }
  }, [name]);

  useEffect(() => {
    const cleanup = checkPermission();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [checkPermission]);

  return {
    state,
    request,
  };
}

/**
 * 多权限管理Hook
 * @param permissions 权限列表
 * @returns 权限状态对象
 */
export function usePermissions(permissions: PermissionName[]) {
  const [states, setStates] = useState<Record<PermissionName, PermissionState>>({} as any);

  const requestAll = useCallback(async () => {
    const results: Record<PermissionName, PermissionState> = {} as any;
    
    for (const permission of permissions) {
      // 这里需要为每个权限创建单独的Hook实例
      // 在实际使用中，建议分别调用单个权限Hook
      results[permission] = 'prompt';
    }
    
    setStates(results);
    return results;
  }, [permissions]);

  return {
    states,
    requestAll,
  };
}

/**
 * 地理位置权限Hook
 */
export function useGeolocationPermission() {
  const { state, request } = usePermission('geolocation');
  
  const getCurrentPosition = useCallback(async () => {
    if (state !== 'granted') {
      const permissionResult = await request();
      if (permissionResult !== 'granted') {
        throw new Error('地理位置权限被拒绝');
      }
    }

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }, [state, request]);

  return {
    state,
    request,
    getCurrentPosition,
  };
}

/**
 * 通知权限Hook
 */
export function useNotificationPermission() {
  const { state, request } = usePermission('notifications');
  
  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (state !== 'granted') {
      const permissionResult = await request();
      if (permissionResult !== 'granted') {
        throw new Error('通知权限被拒绝');
      }
    }

    return new Notification(title, options);
  }, [state, request]);

  return {
    state,
    request,
    showNotification,
  };
} 