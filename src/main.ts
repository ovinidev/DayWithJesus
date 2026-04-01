import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import './styles/main.css'

inject()

const app = createApp(App)

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 12, // 12 hours
        retry: 2
      }
    }
  }
})

app.mount('#app')
