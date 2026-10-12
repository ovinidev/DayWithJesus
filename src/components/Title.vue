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
  <h1
    class="mt-2 text-center text-2xl font-semibold tracking-tight text-[#292723] md:text-3xl"
    @click="openYoutubeSearch"
  >
    {{ title }}
  </h1>
</template>
