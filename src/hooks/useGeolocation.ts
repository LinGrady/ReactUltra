import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface GeolocationState {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  supported: boolean;
}

interface GeolocationOptions extends PositionOptions {
  watch?: boolean; // 是否持续监听位置变化
}

/**
 * 地理位置Hook
 * @param options 地理位置选项
 * @returns 位置状态和操作方法
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    watch = false,
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 0,
    ...positionOptions
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: false,
    supported: 'geolocation' in navigator,
  });

  const watchId = useRef<number | undefined>(undefined);

  const updateState = useCallback((updates: Partial<GeolocationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const onSuccess = useCallback((position: GeolocationPosition) => {
    updateState({
      position,
      error: null,
      loading: false,
    });
  }, [updateState]);

  const onError = useCallback((error: GeolocationPositionError) => {
    updateState({
      error,
      loading: false,
    });
  }, [updateState]);

  const getCurrentPosition = useCallback(async (): Promise<GeolocationPosition> => {
    if (!state.supported) {
      throw new Error('浏览器不支持地理位置API');
    }

    updateState({ loading: true, error: null });

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSuccess(position);
          resolve(position);
        },
        (error) => {
          onError(error);
          reject(error);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
          ...positionOptions,
        }
      );
    });
  }, [state.supported, enableHighAccuracy, timeout, maximumAge, positionOptions, onSuccess, onError, updateState]);

  const startWatching = useCallback(() => {
    if (!state.supported) return;

    updateState({ loading: true, error: null });

              const id = navigator.geolocation.watchPosition(
       onSuccess,
       onError,
       {
         enableHighAccuracy,
         timeout,
         maximumAge,
         ...positionOptions,
       }
     );
     watchId.current = id;
  }, [state.supported, enableHighAccuracy, timeout, maximumAge, positionOptions, onSuccess, onError, updateState]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== undefined) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = undefined;
    }
    updateState({ loading: false });
  }, [updateState]);

  useEffect(() => {
    if (!state.supported) {
      updateState({ error: new GeolocationPositionError() as any });
      return;
    }

    if (watch) {
      startWatching();
    } else {
      getCurrentPosition().catch(() => {
        // 错误已在onError中处理
      });
    }

    return () => {
      if (watchId.current !== undefined) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [watch, state.supported]);

  return {
    ...state,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWatching: watchId.current !== undefined,
  };
}

/**
 * 简化版地理位置Hook - 只获取一次位置
 */
export function useCurrentPosition(options?: PositionOptions) {
  const { position, error, loading, getCurrentPosition } = useGeolocation({
    ...options,
    watch: false,
  });

  return {
    position,
    error,
    loading,
    refresh: getCurrentPosition,
  };
}

/**
 * 地理位置距离计算Hook
 */
export function useGeolocationDistance(targetLatitude?: number, targetLongitude?: number) {
  const { position } = useGeolocation();

  const distance = useMemo(() => {
    if (!position || targetLatitude === undefined || targetLongitude === undefined) {
      return null;
    }

    const { latitude, longitude } = position.coords;
    return calculateDistance(latitude, longitude, targetLatitude, targetLongitude);
  }, [position, targetLatitude, targetLongitude]);

  return distance;
}

/**
 * 计算两点间距离（使用Haversine公式）
 * @param lat1 起点纬度
 * @param lon1 起点经度
 * @param lat2 终点纬度
 * @param lon2 终点经度
 * @returns 距离（公里）
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
} 