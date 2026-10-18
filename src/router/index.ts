import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import SaintsPage from '@/views/SaintsPage.vue'
import PrayersPage from '@/views/PrayersPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/santos', name: 'saints', component: SaintsPage },
    { path: '/oracoes', name: 'prayers', component: PrayersPage }
  ],
  scrollBehavior: () => ({ top: 0 })
})
