<script setup lang="ts">
  import AppHeader from '@/components/AppHeader.vue'
  import PullToRefresh from '@/components/PullToRefresh.vue'
</script>

<template>
  <AppHeader />
  <PullToRefresh>
    <RouterView />
  </PullToRefresh>
</template>
