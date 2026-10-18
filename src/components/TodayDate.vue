<script setup lang="ts">
  import { computed } from 'vue'

  const { dateStr } = defineProps({
    dateStr: String
  })

  const formatted = computed(() => {
    if (!dateStr) return ''
    const [day, month, year] = dateStr.split('/')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  })
</script>

<template>
  <p class="today-date text-base font-medium tracking-wide capitalize">
    {{ formatted }}
  </p>
</template>
