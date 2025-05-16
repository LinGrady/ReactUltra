import React, { ReactNode, useEffect, Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { routes, preloadRoute, initPreload } from '../config/routes.config';

// 延迟加载主布局组件
const Layout = lazy(() => import('../components/layout/Layout'));

// 美观的加载反馈
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">加载中...</p>
    </div>
  </div>
);

// 页面过渡动画组件
const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {children}
    </div>
  );
};

interface RouterProviderProps {
  children: ReactNode;
}

// AppRoutes 组件包含所有路由逻辑
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [prevPathname, setPrevPathname] = useState<string>('/');
  
  // 记录导航性能
  useEffect(() => {
    // 记录页面导航性能
    const trackNavigation = async () => {
      if (location.pathname !== prevPathname) {
        const navStart = performance.now();
        
        // 记录导航完成时间
        window.requestAnimationFrame(() => {
          const navEnd = performance.now();
          const navTime = navEnd - navStart;
          
          if (import.meta.env.DEV) {
            console.log(`导航到 ${location.pathname} 耗时: ${navTime.toFixed(2)}ms`);
          }
          
          // 在生产环境，可以将这些数据发送到分析服务
          setPrevPathname(location.pathname);
        });
      }
    };
    
    trackNavigation();
  }, [location.pathname, prevPathname]);
  
  // 路由变化监听，处理认证和预加载
  useEffect(() => {
    // 保存认证状态下的上一个路径
    if (isAuthenticated && location.pathname !== '/login') {
      localStorage.setItem('lastPath', location.pathname);
    }
    
    // 为所有内部链接添加预加载
    const setupPreload = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // 优化：使用事件委托来减少事件监听器数量
        link.addEventListener('mouseenter', () => {
          if (href) preloadRoute(href);
        });
        
        // 触摸设备上的预加载
        link.addEventListener('touchstart', () => {
          if (href) preloadRoute(href);
        });
      });
      
      return () => {
        links.forEach(link => {
          link.removeEventListener('mouseenter', () => {});
          link.removeEventListener('touchstart', () => {});
        });
      };
    };
    
    // 延迟设置预加载，避免阻塞初始渲染
    const timer = setTimeout(setupPreload, 1000);
    
    // 在初始加载时触发预加载
    if (prevPathname === '/') {
      initPreload();
    }
    
    return () => clearTimeout(timer);
  }, [location.pathname, isAuthenticated, prevPathname]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map((route) => {
          const RouteElement = route.element;
          let routeElement;
          
          // 检查路由守卫
          const guardsPassed = route.guards ? 
            route.guards.every(guard => guard(isAuthenticated)) : true;
            
          if (guardsPassed) {
            if (route.meta.layout === 'default') {
              routeElement = (
                <Suspense fallback={<LoadingFallback />}>
                  <Layout>
                    <PageTransition>
                      <RouteElement />
                    </PageTransition>
                  </Layout>
                </Suspense>
              );
            } else {
              routeElement = (
                <Suspense fallback={<LoadingFallback />}>
                  <PageTransition>
                    <RouteElement />
                  </PageTransition>
                </Suspense>
              );
            }
          } else if (route.redirectTo) {
            // 如果需要认证但没有认证，记住当前尝试访问的URL
            if (route.meta.auth && !isAuthenticated) {
              // 使用会话存储，这样即使刷新也能保留
              sessionStorage.setItem('redirectAfterLogin', location.pathname);
            }
            routeElement = <Navigate to={route.redirectTo} replace />;
          }
          
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={routeElement} 
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

/**
 * RouterProvider 处理应用程序的路由配置
 * 它包含了认证和非认证路由的路由守卫
 */
export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// 导出 AppRoutes 供其他组件使用
export { AppRoutes };