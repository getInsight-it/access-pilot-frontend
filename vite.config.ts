import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@theme': '/src/theme',
      '@layouts': '/src/layouts',
      '@common': '/src/common',
      '@config': '/src/config',
      '@features': '/src/features',
      '@store': '/src/store',
      '@components': '/src/common/components',
      '@hooks': '/src/common/hooks',
      '@utils': '/src/common/utils',
      '@types': '/src/common/types',
      '@ui': '/src/common/external/ui',
      '@services': '/src/common/service',
      '@constants': '/src/common/constants',
    }
  }
})
