<script setup lang="ts">
  const { title } = defineProps<{
    title: string
  }>()
</script>

<template>
  <h1
    class="mt-8 text-center text-3xl font-semibold tracking-wide text-black md:text-3xl"
  >
    {{ title }}
  </h1>
</template>
