import './assets/styles/index.css'
import './assets/styles/main.scss'

import VueGtag from 'vue-gtag'
import { createGtm } from '@gtm-support/vue-gtm'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import resetStore from '@/stores/plugins/resetStore'
import router from './router'
import FloatingVue from 'floating-vue'
import VueCodemirror from 'vue-codemirror'
import App from './App.vue'
import { version } from '../package.json'

const pinia = createPinia()
const app = createApp(App)
app.use(
  VueGtag,
  {
    includes: [{ id: 'AW-11259158732' }],
    config: {
      id: 'G-WXLLWRDYGJ',
      params: {
        anonymize_ip: false
      }
    }
  },
  router
)
pinia.use(resetStore)

app.use(pinia)
app.use(router)
app.use(FloatingVue)
app.use(VueCodemirror, {
  extensions: []
})

router.isReady().then(async () => {
  app.mount('#app')
})
