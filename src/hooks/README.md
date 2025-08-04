# 🪝 ReactUltra Hook 集合

这是一个完整的React Hook集合，提供了丰富的功能来提升开发效率和用户体验。

## 📋 Hook分类

### 🎯 现有Hook（已完善）

1. **`useIsMobile`** - 移动端检测
2. **`useDebounceThrottle`** - 防抖和节流
3. **`useIntersectionObserver`** - 视口监听
4. **`usePerformanceOptimization`** - 性能优化
5. **`useUserBehavior`** - 用户行为分析
6. **`useApi`** - API请求管理
7. **`useNetworkStatus`** - 网络状态监控
8. **`useLocalStorage`** - 本地存储管理

### ✨ 新增Hook（超级实用）

#### 1. **`useClipboard`** - 剪贴板操作 📋
```tsx
import { useClipboard } from '@/hooks';

function CopyButton() {
  const { copy, success, error } = useClipboard();
  
  const handleCopy = () => {
    copy('Hello World!');
  };
  
  return (
    <button onClick={handleCopy}>
      {success ? '已复制!' : '复制文本'}
      {error && <span>错误: {error}</span>}
    </button>
  );
}
```

#### 2. **`useMediaQuery`** - 响应式媒体查询 📱
```tsx
import { useMediaQuery, useBreakpoints } from '@/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { currentBreakpoint, prefersDarkMode } = useBreakpoints();
  
  return (
    <div>
      <p>当前设备: {isMobile ? '移动端' : '桌面端'}</p>
      <p>断点: {currentBreakpoint}</p>
      <p>偏好暗色主题: {prefersDarkMode ? '是' : '否'}</p>
    </div>
  );
}
```

#### 3. **`useClickOutside`** - 点击外部检测 🎯
```tsx
import { useRef } from 'react';
import { useClickOutside } from '@/hooks';

function Modal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  
  useClickOutside(modalRef, () => {
    setIsOpen(false);
  });
  
  if (!isOpen) return null;
  
  return (
    <div ref={modalRef} className="modal">
      <p>点击外部关闭</p>
    </div>
  );
}
```

#### 4. **`useWindowSize`** - 窗口尺寸监听 📏
```tsx
import { useWindowSize, useOrientation } from '@/hooks';

function WindowInfo() {
  const { width, height } = useWindowSize();
  const { orientation, aspectRatio } = useOrientation();
  
  return (
    <div>
      <p>窗口尺寸: {width} x {height}</p>
      <p>方向: {orientation}</p>
      <p>宽高比: {aspectRatio.toFixed(2)}</p>
    </div>
  );
}
```

#### 5. **`useKeyboard`** - 键盘事件处理 ⌨️
```tsx
import { useKeyboard, useShortcuts, useEscapeKey } from '@/hooks';

function KeyboardDemo() {
  const { register } = useShortcuts();
  
  // 注册快捷键
  useEffect(() => {
    register('ctrl+s', () => console.log('保存'));
    register('ctrl+z', () => console.log('撤销'));
  }, [register]);
  
  // ESC关闭
  useEscapeKey(() => {
    console.log('ESC pressed');
  });
  
  // 自定义按键
  useKeyboard('enter', (e) => {
    console.log('Enter pressed');
  });
  
  return <div>按 Ctrl+S 保存，ESC 退出</div>;
}
```

#### 6. **`useToggle`** - 状态切换 🔄
```tsx
import { useToggle, useCycleToggle, useMapToggle } from '@/hooks';

function ToggleDemo() {
  // 布尔值切换
  const [isVisible, toggle, show, hide] = useToggle(false);
  
  // 多状态循环
  const [theme, nextTheme] = useCycleToggle(['light', 'dark', 'auto']);
  
  // 映射切换
  const [status, toggleStatus] = useMapToggle({
    idle: '空闲',
    loading: '加载中',
    success: '成功',
    error: '错误'
  }, 'idle');
  
  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? '隐藏' : '显示'}
      </button>
      <button onClick={nextTheme}>
        主题: {theme}
      </button>
      <button onClick={toggleStatus}>
        状态: {status}
      </button>
    </div>
  );
}
```

#### 7. **`usePrevious`** - 获取前值 ⏮️
```tsx
import { usePrevious, usePreviousComparison } from '@/hooks';

function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  const { hasChanged } = usePreviousComparison(count);
  
  return (
    <div>
      <p>当前: {count}</p>
      <p>之前: {prevCount}</p>
      <p>是否改变: {hasChanged ? '是' : '否'}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +1
      </button>
    </div>
  );
}
```

#### 8. **`useIdle`** - 用户空闲检测 😴
```tsx
import { useIdle, useSimpleIdle } from '@/hooks';

function IdleTracker() {
  const { isIdle, remainingTime, reset } = useIdle({
    timeout: 30000, // 30秒
  });
  
  return (
    <div>
      <p>用户状态: {isIdle ? '空闲' : '活跃'}</p>
      <p>剩余时间: {Math.round(remainingTime / 1000)}秒</p>
      <button onClick={reset}>重置计时器</button>
    </div>
  );
}
```

#### 9. **`useTimer`** - 定时器管理 ⏰
```tsx
import { useTimeout, useInterval, useCountdown, useStopwatch } from '@/hooks';

function TimerDemo() {
  const [message, setMessage] = useState('');
  
  // 延时执行
  useTimeout(() => {
    setMessage('3秒后显示');
  }, 3000);
  
  // 倒计时
  const { seconds, start, pause, reset, isRunning } = useCountdown(10, () => {
    alert('倒计时结束!');
  });
  
  // 秒表
  const stopwatch = useStopwatch();
  
  return (
    <div>
      <p>{message}</p>
      <div>
        <p>倒计时: {seconds}秒</p>
        <button onClick={start} disabled={isRunning}>开始</button>
        <button onClick={pause} disabled={!isRunning}>暂停</button>
        <button onClick={() => reset()}>重置</button>
      </div>
      <div>
        <p>秒表: {Math.round(stopwatch.time / 1000)}秒</p>
        <button onClick={stopwatch.start}>开始</button>
        <button onClick={stopwatch.stop}>停止</button>
        <button onClick={stopwatch.reset}>重置</button>
      </div>
    </div>
  );
}
```

#### 10. **`usePermission`** - 权限管理 🔐
```tsx
import { usePermission, useGeolocationPermission, useNotificationPermission } from '@/hooks';

function PermissionDemo() {
  const { state: geoState, request: requestGeo } = usePermission('geolocation');
  const { getCurrentPosition } = useGeolocationPermission();
  const { showNotification } = useNotificationPermission();
  
  const handleGetLocation = async () => {
    try {
      const position = await getCurrentPosition();
      console.log('位置:', position.coords);
    } catch (error) {
      console.error('获取位置失败:', error);
    }
  };
  
  const handleNotify = async () => {
    try {
      await showNotification('Hello!', {
        body: '这是一个测试通知',
        icon: '/icon.png'
      });
    } catch (error) {
      console.error('通知失败:', error);
    }
  };
  
  return (
    <div>
      <p>地理位置权限: {geoState}</p>
      <button onClick={requestGeo}>请求地理位置权限</button>
      <button onClick={handleGetLocation}>获取位置</button>
      <button onClick={handleNotify}>发送通知</button>
    </div>
  );
}
```

#### 11. **`useGeolocation`** - 地理位置 🌍
```tsx
import { useGeolocation, useCurrentPosition } from '@/hooks';

function LocationDemo() {
  const { position, error, loading, startWatching, stopWatching } = useGeolocation({
    watch: false,
    enableHighAccuracy: true
  });
  
  return (
    <div>
      {loading && <p>获取位置中...</p>}
      {error && <p>错误: {error.message}</p>}
      {position && (
        <div>
          <p>纬度: {position.coords.latitude}</p>
          <p>经度: {position.coords.longitude}</p>
          <p>精度: {position.coords.accuracy}米</p>
        </div>
      )}
      <button onClick={startWatching}>开始监听</button>
      <button onClick={stopWatching}>停止监听</button>
    </div>
  );
}
```

## 🚀 使用方式

```tsx
// 导入所有Hook
import {
  useClipboard,
  useMediaQuery,
  useClickOutside,
  useKeyboard,
  useToggle,
  // ... 其他Hook
} from '@/hooks';

// 或者按需导入
import { useClipboard } from '@/hooks/useClipboard';
```

## 💡 特性亮点

- ✅ **完整的TypeScript支持**
- ✅ **高性能优化**（防抖、节流、memorization）
- ✅ **错误处理机制**
- ✅ **浏览器兼容性**
- ✅ **SSR友好**
- ✅ **内存泄漏防护**
- ✅ **详细的JSDoc文档**

这些Hook覆盖了React开发中的大部分常见需求，让您的开发更加高效！🎉 