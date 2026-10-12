<script setup lang="ts">
  import type { WeekDay } from '@/composables/useGetHomilyWeek'

  defineProps<{
    days: WeekDay[]
    selectedDate: string
  }>()

  const emit = defineEmits<{
    select: [date: string]
  }>()
</script>

<template>
  <nav v-if="days.length" class="week-navigator" aria-label="Próximas leituras">
    <div class="week-heading">
      <span class="video-kicker">PRÓXIMOS DIAS</span>
      <span class="week-caption">Escolha uma leitura</span>
    </div>
    <div class="week-days">
      <button
        v-for="day in days"
        :key="day.date"
        type="button"
        :class="{ 'is-selected': selectedDate === day.date }"
        :aria-pressed="selectedDate === day.date"
        :aria-label="`${day.weekday}, ${day.day}: ${day.liturgy}`"
        :title="day.liturgy"
        @click="emit('select', day.date)"
      >
        <span>{{ day.weekday }}</span>
        <strong>{{ day.day }}</strong>
      </button>
    </div>
  </nav>
</template>
