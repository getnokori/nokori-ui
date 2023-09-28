import { defineConfig } from 'vite'
import baseConfig from './vite.base.config'

import VuePlugin from '@vitejs/plugin-vue'
import removeConsole from 'vite-plugin-remove-console'
import AutoImportComponentsPlugin from 'unplugin-vue-components/vite'
import { splitVendorChunkPlugin } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [
    VuePlugin(),
    removeConsole(),
    AutoImportComponentsPlugin(),
    splitVendorChunkPlugin()
  ]
})
