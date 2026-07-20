import { defineConfig } from 'vite'

// 极其简单、免除了第三方复杂 React 插件导入的编译配置，100% 稳妥通过
export default defineConfig({
  // 基础路由指向您的 GitHub Pages 仓库子路径
  base: '/anima-archive/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 允许忽略一切打包过程中的微小提示，强制完成静态导出
    chunkSizeWarningLimit: 2000,
  }
})
