<script setup lang="ts">
  const { title } = defineProps<{
    title: string
  }>()
</script>

<template>
  <h1
    class="text-center text-3xl mt-8 font-semibold tracking-wide text-black md:text-3xl"
  >
    {{ title }}
  </h1>
</template>
