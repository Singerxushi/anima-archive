```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 关键配置：设置基础路径为你的 GitHub 仓库名称，前后都需要有正斜杠 '/'
  base: '/anima-archive/',
})

```

