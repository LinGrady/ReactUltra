import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const sampleImages = [
  {
    src: '/images/hero-banner.jpg',
    alt: '主横幅图片',
    title: '优先加载示例',
    description: '首屏重要图片，设置priority=true',
    priority: true,
    width: 800,
    height: 400,
  },
  {
    src: '/images/product-1.jpg',
    alt: '产品图片1',
    title: '懒加载示例',
    description: '滚动到视口时才加载',
    width: 300,
    height: 300,
  },
  {
    src: '/images/product-2.jpg',
    alt: '产品图片2',
    title: '响应式图片',
    description: '根据屏幕尺寸自动选择最佳图片',
    width: 300,
    height: 300,
  },
  {
    src: '/images/invalid-image.jpg',
    alt: '无效图片',
    title: '错误处理示例',
    description: '展示图片加载失败时的处理',
    fallback: '/images/placeholder.jpg',
    width: 300,
    height: 300,
  },
];

export function ImageGallery() {
  const handleLoadComplete = (result: { naturalWidth: number; naturalHeight: number }) => {
    console.log('图片加载完成:', result);
  };

  const handleLoadError = (error: string) => {
    console.error('图片加载错误:', error);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">优化图片组件示例</h1>
        <p className="text-muted-foreground">
          展示 OptimizedImage 组件的各种功能：懒加载、WebP支持、响应式图片、错误处理等
        </p>
      </div>

      {/* 主横幅 - 优先加载 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            优先加载图片
            <Badge variant="secondary">priority=true</Badge>
          </CardTitle>
          <CardDescription>
            首屏重要图片，立即加载不等待滚动
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizedImage
            src={sampleImages[0].src}
            alt={sampleImages[0].alt}
            width={sampleImages[0].width}
            height={sampleImages[0].height}
            priority={sampleImages[0].priority}
            className="w-full h-64 object-cover rounded-lg"
            onLoadComplete={handleLoadComplete}
            onLoadError={handleLoadError}
          />
        </CardContent>
      </Card>

      {/* 图片网格 - 懒加载 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleImages.slice(1).map((image, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{image.title}</CardTitle>
              <CardDescription>{image.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                fallback={image.fallback}
                className="w-full h-48 object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoadComplete={handleLoadComplete}
                onLoadError={handleLoadError}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 性能提示 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>性能优化特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🚀 懒加载</h4>
              <p className="text-sm text-muted-foreground">
                图片进入视口前50px时才开始加载，减少初始页面加载时间
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🖼️ WebP支持</h4>
              <p className="text-sm text-muted-foreground">
                自动检测浏览器支持，优先使用WebP格式减少文件大小
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📱 响应式</h4>
              <p className="text-sm text-muted-foreground">
                根据屏幕尺寸自动选择最适合的图片分辨率
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ 性能监控</h4>
              <p className="text-sm text-muted-foreground">
                开发环境下自动记录图片加载时间，便于性能优化
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 