import { defineConfig } from 'vite'
import baseConfig from './vite.base.config'

import VuePlugin from '@vitejs/plugin-vue'
import AutoImportComponentsPlugin from 'unplugin-vue-components/vite'
import ElectronPlugin from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  base: './',
  plugins: [
    ElectronPlugin({ entry: './electron/main.ts' }),
    VuePlugin(),
    AutoImportComponentsPlugin()
  ]
})
