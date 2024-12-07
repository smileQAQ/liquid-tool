import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteFunctionBus from './src/util/vite-functionBus';

export default defineConfig({
  plugins: [
    viteFunctionBus(),
    TanStackRouterVite(),
    viteReact({
      babel:{
        plugins: ["@emotion/babel-plugin"]
      }
    }),
  ],
  css:{
    preprocessorOptions: {
      scss: {
        
      }
    }
  }
})