import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tauri 开发配置
  server: {
    port: 1420,
    strictPort: true,
  },
  // 阻止 Vite 在 Tauri 打开时遮盖 Rust 错误
  clearScreen: false,
})
