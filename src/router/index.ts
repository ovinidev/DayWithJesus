import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import SaintsPage from '@/views/SaintsPage.vue'
import PrayersPage from '@/views/PrayersPage.vue'
import RosaryPage from '@/views/RosaryPage.vue'
import MassGuidePage from '@/views/MassGuidePage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/santos', name: 'saints', component: SaintsPage },
    { path: '/oracoes', name: 'prayers', component: PrayersPage },
    { path: '/terco', name: 'rosary', component: RosaryPage },
    { path: '/missa', name: 'mass', component: MassGuidePage }
  ],
  scrollBehavior: () => ({ top: 0 })
})
