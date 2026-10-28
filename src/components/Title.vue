<script setup lang="ts">
  const { title } = defineProps<{
    title: string
  }>()

  const openYoutubeSearch = () => {
    window.open(
      'https://www.youtube.com/results?search_query=padre+adriano+zandon%C3%A1&sp=EgQIAhAB'
    )
  }
</script>

<template>
  <h1 class="page-title" @click="openYoutubeSearch">
    {{ title }}
  </h1>
</template>
