<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import AppHeader from '@/components/AppHeader.vue'
  import PullToRefresh from '@/components/PullToRefresh.vue'

  const route = useRoute()
</script>

<template>
  <AppHeader />
  <PullToRefresh>
    <RouterView v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </PullToRefresh>
</template>
