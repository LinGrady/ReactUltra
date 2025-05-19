# 🚀 ReactUltra

<div align="center">

<img src="https://img.shields.io/badge/react-19.0.0-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
<img src="https://img.shields.io/badge/typescript-5.7.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
<img src="https://img.shields.io/badge/vite-6.2.0-646CFF?style=for-the-badge&logo=vite" alt="Vite 6" />
<img src="https://img.shields.io/badge/shadcn/ui-latest-000000?style=for-the-badge&logo=shadcnui" alt="Shadcn UI" />

**一个面向企业级应用的 React 项目模板，集成最佳实践与创新功能**

**An enterprise-grade React project template with best practices and innovative features**

[English](#english-readme) | [中文说明](#中文说明)

</div>

---

## ✨ 主要特点 / Key Features

- 🛠️ 现代技术栈 - React 19, TypeScript 5.7, Vite 6, Shadcn UI
- 📦 企业级功能 - 身份验证, 动态路由, 国际化, 主题切换等
- 🔍 开发体验优化 - ESLint, Prettier, Husky, Commitlint
- 🚄 高性能设计 - 代码分割, 懒加载, 虚拟列表, 组件记忆化
- 🔒 TypeScript类型安全 - 完整的类型定义和实践
- 🧩 微前端支持 - 模块联邦和微应用集成
- 📱 响应式设计 - 适配各种屏幕尺寸
- 🔄 CI/CD配置 - GitHub Actions工作流和自动化部署

---

<a id="english-readme"></a>
## 🌐 English README

### Introduction

ReactUltra is an opinionated, feature-rich template for building enterprise-grade React applications. It combines the latest technologies in the React ecosystem with best practices and innovative features to help development teams deliver high-quality web applications efficiently.

Designed with scalability and maintainability in mind, ReactUltra offers a comprehensive solution for frontend development, from project initialization to deployment.

### Core Technology Stack

- **React 19.0**: Utilizing the latest React features and improvements
- **TypeScript 5.7+**: Ensuring type safety and improved developer experience
- **React Router 6.30+**: Using the latest data APIs for efficient routing
- **Vite 6.2+**: Lightning-fast development server and optimized build system
- **Shadcn UI & Radix UI**: Accessible and customizable component library
- **Zustand 4.5+**: Lightweight and intuitive state management
- **Tailwind CSS 4.0+**: Utility-first CSS framework for rapid UI development

### Project Structure

ReactUltra follows a modular, organized directory structure designed for scalability and maintainability:

```
├── public/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Shared components
│   │   ├── common/       # Common components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components (Shadcn/Radix)
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page components
│   ├── providers/        # Context providers
│   ├── services/         # API services
│   ├── stores/           # Zustand state management
│   ├── types/            # Type definitions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables
└── vite.config.ts        # Vite configuration
```

### Core Features

#### Authentication System
Complete authentication flow with login, registration, and permission management.

#### Theme Switching
Seamless toggle between light and dark modes with customizable theme colors.

#### Internationalization
Multi-language support with easy switching between languages (includes English and Chinese).

#### Dynamic Routing & Permission Control
Dynamically generate routes based on user roles and permissions.

#### Advanced Form Handling
Form validation, dynamic form generation, and complex form scenarios using React Hook Form and Zod.

#### Data Tables
Feature-rich tables with sorting, filtering, pagination, and more.

#### Chart Visualization
Beautiful data visualization using ECharts and Recharts.

#### File Upload & Management
File upload, preview, download, and management capabilities using React Dropzone.

#### Rich Text Editor
Integrated rich text editing with Slate.js for various formatting options.

#### Error Boundary & Error Handling
Robust error handling mechanisms with React Error Boundary for user-friendly error messages.

#### Responsive Layout
Adaptive design that works well on all screen sizes with mobile-first approach.

### Performance Optimization

- **Code Splitting & Lazy Loading**: Load components and pages on demand
- **Virtual Lists**: Render large data sets efficiently
- **Component Memoization**: Optimize rendering with React.memo, useMemo, and useCallback
- **Image Lazy Loading**: Improve page load time with optimized image loading
- **Service Worker Caching**: Implement effective caching strategies with Workbox
- **Pre-rendering & SSR Support**: Improve initial load and SEO

### Development Experience

- **ESLint & Prettier**: Enforce consistent code style
- **Husky & lint-staged**: Automate code quality checks before commits
- **Commitlint**: Standardize commit messages
- **Jest & React Testing Library**: Comprehensive testing setup
- **Storybook**: Interactive component documentation
- **Automated API Documentation**: Generate API docs from code

### Best Practices

- **Custom Hooks**: Encapsulate and reuse business logic
- **API Request Management**: Automatic cancellation and retry mechanisms
- **Global State Management**: Zustand best practices and patterns
- **TypeScript Type Safety**: Comprehensive type definitions and usage
- **Component Design Patterns**: Examples of effective component design
- **Performance Monitoring**: Tools and methods for monitoring performance

### Deployment & CI/CD

- **Docker Configuration**: Containerize your application
- **GitHub Actions**: Automated workflows for testing and deployment
- **Vercel/Netlify Deployment**: One-click deployment configurations
- **Environment Variable Management**: Secure handling of environment variables
- **Build Optimization**: Optimized production builds with Vite

### Innovative Features

- **Micro-Frontend Support**: Module federation and micro-app integration
- **WebSocket Real-time Communication**: Examples of real-time data exchange
- **Visual Page Designer**: Drag-and-drop interface builder
- **Advanced Animations**: High-quality motion and interaction effects with Framer Motion
- **PWA Support**: Offline capabilities and installation with Vite PWA plugin
- **Low-Code Form Builder**: Build forms without writing code

### Getting Started

#### Prerequisites
- Node.js 18.0+ 
- npm or yarn or pnpm

#### Installation

```bash
# Clone the repository
git clone https://github.com/LinGrady/ReactUltra.git
cd ReactUltra

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Documentation

For detailed documentation, please visit the `/docs` directory or the project's wiki.

### Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for more information.

### License

MIT

---

<a id="中文说明"></a>
## 🌐 中文说明

### 简介

ReactUltra 是一个功能丰富的企业级 React 应用模板，集合了 React 生态系统中的最新技术、最佳实践和创新功能，帮助开发团队高效交付高质量的 Web 应用。

该模板设计注重可扩展性和可维护性，提供了从项目初始化到部署的全面前端开发解决方案。

### 核心技术栈

- **React 19.0**：利用 React 最新特性和改进
- **TypeScript 5.7+**：确保类型安全和改善开发体验
- **React Router 6.30+**：使用最新的数据 API 实现高效路由
- **Vite 6.2+**：闪电般快速的开发服务器和优化的构建系统
- **Shadcn UI & Radix UI**：可访问性和可自定义的组件库
- **Zustand 4.5+**：轻量级直观的状态管理
- **Tailwind CSS 4.0+**：实用优先的 CSS 框架，用于快速 UI 开发

### 项目结构

ReactUltra 遵循模块化、有组织的目录结构，专为可扩展性和可维护性设计：

```
├── public/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 共享组件
│   │   ├── common/       # 通用组件
│   │   ├── layout/       # 布局组件
│   │   └── ui/           # UI组件 (Shadcn/Radix)
│   ├── config/           # 配置文件
│   ├── hooks/            # 自定义钩子
│   ├── lib/              # 工具库
│   ├── pages/            # 页面组件
│   ├── providers/        # 上下文提供者
│   ├── services/         # API服务
│   ├── stores/           # Zustand状态管理
│   ├── types/            # 类型定义
│   ├── App.tsx           # 主App组件
│   └── main.tsx          # 应用入口点
├── .env                  # 环境变量
└── vite.config.ts        # Vite配置
```

### 核心功能

#### 身份验证系统
完整的身份验证流程，包含登录、注册和权限管理。

#### 主题切换
在明亮和暗黑模式之间无缝切换，可自定义主题颜色。

#### 国际化
多语言支持，可轻松切换语言（包括英文和中文），使用 i18next。

#### 动态路由与权限控制
基于用户角色和权限动态生成路由。

#### 高级表单处理
使用 React Hook Form 和 Zod 实现表单验证、动态表单生成和复杂表单场景。

#### 数据表格
功能丰富的表格组件，支持排序、筛选、分页等特性。

#### 图表展示
使用 ECharts 和 Recharts 实现美观的数据可视化。

#### 文件上传与管理
使用 React Dropzone 实现文件上传、预览、下载和管理功能。

#### 富文本编辑器
使用 Slate.js 集成丰富文本编辑功能，提供各种格式化选项。

#### 错误边界与错误处理
使用 React Error Boundary 实现强大的错误处理机制，提供用户友好的错误信息。

#### 响应式布局
适应各种屏幕尺寸的自适应设计，采用移动优先的方法。

### 性能优化

- **代码分割与懒加载**：按需加载组件和页面
- **虚拟列表**：高效渲染大数据集
- **组件记忆化**：使用 React.memo、useMemo 和 useCallback 优化渲染
- **图片懒加载**：通过优化图片加载改善页面加载时间
- **Service Worker 缓存**：使用 Workbox 实现有效的缓存策略
- **预渲染与 SSR 支持**：改善初始加载和 SEO

### 开发体验

- **ESLint 与 Prettier**：强制一致的代码风格
- **Husky 与 lint-staged**：提交前自动检查代码质量
- **Commitlint**：规范化提交信息
- **Jest 与 React Testing Library**：全面的测试设置
- **Storybook**：交互式组件文档
- **自动化 API 文档**：从代码生成 API 文档

### 最佳实践

- **自定义钩子**：封装和复用业务逻辑
- **API 请求管理**：自动取消和重试机制
- **全局状态管理**：Zustand 最佳实践和模式
- **TypeScript 类型安全**：全面的类型定义和使用
- **组件设计模式**：有效组件设计的示例
- **性能监控**：监控性能的工具和方法

### 部署与 CI/CD

- **Docker 配置**：容器化您的应用
- **GitHub Actions**：测试和部署的自动化工作流
- **Vercel/Netlify 部署**：一键部署配置
- **环境变量管理**：安全处理环境变量
- **构建优化**：使用 Vite 优化的生产构建

### 创新功能

- **微前端支持**：模块联邦和微应用集成
- **WebSocket 实时通信**：实时数据交换示例
- **可视化页面设计器**：拖放式界面构建器
- **高级动画**：使用 Framer Motion 实现高质量的动效和交互效果
- **PWA 支持**：使用 Vite PWA 插件实现离线功能和安装能力
- **低代码表单构建器**：无需编写代码即可构建表单

### 快速开始

#### 前提条件
- Node.js 18.0+ 
- npm 或 yarn 或 pnpm

#### 安装

```bash
# 克隆仓库
git clone https://github.com/LinGrady/ReactUltra.git
cd ReactUltra

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 文档

详细文档请参阅 `/docs` 目录或项目的 wiki。

### 贡献

欢迎贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)以获取更多信息。

### 许可证

MIT