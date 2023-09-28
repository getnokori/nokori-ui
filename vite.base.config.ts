import { fileURLToPath, URL } from 'node:url'

export default {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass-mq/mq' as * with (
            $breakpoints: (
              568px: 568px,
              640px: 640px,
              768px: 768px,
              1024px: 1024px,
              1280px: 1280px,
              1360px: 1360px,
              1440px: 1440px
            )
          );
          @use './src/assets/styles/utilities/_functions.scss' as *;
          @use './src/assets/styles/utilities/_mixins.scss' as *;
        `
      }
    }
  }
}
