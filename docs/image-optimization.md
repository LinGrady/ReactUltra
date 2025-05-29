# 图片优化功能

这个优化为您的React应用添加了强大的图片优化功能，包括懒加载、WebP/AVIF支持、响应式图片和性能监控。

## 🚀 主要特性

- **智能懒加载**: 图片进入视口前50px时才开始加载
- **格式优化**: 自动检测并使用WebP/AVIF格式
- **响应式图片**: 根据屏幕尺寸自动选择最佳分辨率
- **性能监控**: 开发环境下自动记录加载时间
- **错误处理**: 优雅的加载失败处理和fallback支持
- **预加载支持**: 关键图片的预加载功能

## 📦 使用方法

### 基础用法

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

function MyComponent() {
  return (
    <OptimizedImage
      src="/images/hero.jpg"
      alt="英雄图片"
      width={800}
      height={400}
      className="w-full h-64 object-cover"
    />
  );
}
```

### 优先加载（首屏重要图片）

```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="英雄图片"
  width={800}
  height={400}
  priority={true} // 立即加载，不等待滚动
  className="w-full h-64 object-cover"
/>
```

### 响应式图片

```tsx
<OptimizedImage
  src="/images/product.jpg"
  alt="产品图片"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-48 object-cover"
/>
```

### 错误处理和fallback

```tsx
<OptimizedImage
  src="/images/might-not-exist.jpg"
  alt="可能不存在的图片"
  fallback="/images/placeholder.jpg"
  onLoadError={(error) => console.error('图片加载失败:', error)}
  onLoadComplete={(result) => console.log('图片加载完成:', result)}
/>
```

## 🛠️ 工具函数

### 生成优化的图片URL

```tsx
import { getOptimizedImageUrl, IMAGE_QUALITY } from '@/utils/image-optimization';

const optimizedUrl = getOptimizedImageUrl('/images/photo.jpg', {
  width: 800,
  quality: IMAGE_QUALITY.HIGH,
  format: 'auto' // 自动选择最佳格式
});
```

### 生成响应式srcSet

```tsx
import { generateResponsiveSrcSet, BREAKPOINTS } from '@/utils/image-optimization';

const srcSet = generateResponsiveSrcSet('/images/photo.jpg', {
  sizes: [BREAKPOINTS.sm, BREAKPOINTS.md, BREAKPOINTS.lg],
  quality: 75
});
```

### 预加载关键图片

```tsx
import { preloadImage } from '@/utils/image-optimization';

// 在组件挂载时预加载关键图片
useEffect(() => {
  preloadImage('/images/hero.jpg', {
    sizes: '100vw',
    srcset: generateResponsiveSrcSet('/images/hero.jpg')
  });
}, []);
```

### 性能监控

```tsx
import { ImagePerformanceMonitor } from '@/utils/image-optimization';

const monitor = ImagePerformanceMonitor.getInstance();

// 获取所有图片加载指标
const metrics = monitor.getMetrics();
console.log('平均加载时间:', monitor.getAverageLoadTime());
```

## 📱 预设配置

使用预设的响应式配置：

```tsx
import { RESPONSIVE_CONFIGS } from '@/utils/image-optimization';

// 英雄图片配置
<OptimizedImage
  src="/images/hero.jpg"
  alt="英雄图片"
  sizes={RESPONSIVE_CONFIGS.hero.sizes}
  quality={RESPONSIVE_CONFIGS.hero.quality}
/>

// 卡片图片配置
<OptimizedImage
  src="/images/card.jpg"
  alt="卡片图片"
  sizes={RESPONSIVE_CONFIGS.card.sizes}
  quality={RESPONSIVE_CONFIGS.card.quality}
/>
```

## ⚙️ Vite配置

项目已配置了`vite-imagetools`插件，支持自动图片优化：

```typescript
// vite.config.ts
imagetools({
  defaultDirectives: (url) => {
    if (url.searchParams.has('responsive')) {
      return new URLSearchParams({
        format: 'webp;jpg',
        w: '480;768;1024;1280;1920',
        quality: '75'
      });
    }
    return new URLSearchParams({
      format: 'webp',
      quality: '75'
    });
  }
})
```

## 🎯 性能优化建议

1. **首屏图片**: 使用`priority={true}`确保关键图片立即加载
2. **图片质量**: 根据用途选择合适的质量设置
   - 英雄图片: `IMAGE_QUALITY.HIGH` (90)
   - 普通图片: `IMAGE_QUALITY.MEDIUM` (75)
   - 缩略图: `IMAGE_QUALITY.LOW` (50)
3. **响应式**: 为不同屏幕尺寸提供合适的图片分辨率
4. **格式选择**: 让组件自动选择最佳格式（WebP > AVIF > JPG）
5. **预加载**: 对关键图片使用预加载功能

## 📊 性能指标

在开发环境下，组件会自动记录：
- 图片加载时间
- 图片尺寸信息
- 加载成功/失败状态

这些信息可以通过浏览器控制台查看，帮助您优化图片性能。

## 🔧 自定义配置

您可以根据项目需求自定义配置：

```tsx
// 自定义断点
const customBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1200,
  wide: 1920,
};

// 自定义质量设置
const customQuality = {
  thumbnail: 60,
  preview: 80,
  fullsize: 95,
};
```

这个图片优化功能将显著提升您应用的性能，特别是在移动设备上的加载速度和用户体验。 