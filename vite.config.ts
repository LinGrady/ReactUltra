import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 配置 babel 以确保正确处理 JSX
      babel: {
        babelrc: false,
        configFile: false,
        // 使用项目中已安装的插件
        plugins: []
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
    imagetools({
      defaultDirectives: new URLSearchParams({
        format: 'webp',
        quality: '80',
        width: '1280'
      }),
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ReactUltra',
        short_name: 'ReactUltra',
        description: 'Enterprise-grade React Application Template',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 年
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 天
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // 减小构建体积，移除调试信息
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 构建性能优化
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 更精细的代码分割策略
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('antd')) {
              return 'vendor-antd';
            }
            if (id.includes('echarts')) {
              return 'vendor-echarts';
            }
            if (id.includes('zustand')) {
              return 'vendor-zustand';
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            // 其余的第三方库打包到一起
            return 'vendor-others';
          }
          // 按功能模块拆分业务代码
          if (id.includes('/src/pages/auth/')) {
            return 'auth';
          }
          if (id.includes('/src/components/ui/')) {
            return 'ui';
          }
        }
      }
    },
    // 开启 source map 用于生产环境调试
    sourcemap: true,
    // CSS 代码分割
    cssCodeSplit: true
  },
  // 优化预构建依赖
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@radix-ui/react-dialog',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env']
  }
});
