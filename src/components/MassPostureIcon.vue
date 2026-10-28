<script setup lang="ts">
  import type { Posture } from '@/constants/sundayMass'

  const { posture } = defineProps<{
    posture: Posture
  }>()
</script>

<template>
  <svg
    class="mass-posture-icon"
    :class="`is-${posture}`"
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="posture === 'standing'">
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 6.5v6.5M8.5 10.5h7M9 20.5l3-7.5 3 7.5" />
    </template>
    <template v-else-if="posture === 'sitting'">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4.5M8.5 10h7M9.5 11.5l-2 4M14.5 11.5l2 4M5 19.5h14" />
    </template>
    <template v-else>
      <circle cx="13" cy="5" r="2" />
      <path d="M13 7l-3 6.5M8 16.5h6.5M10 13.5l-2 5M16.5 18.5H6" />
    </template>
  </svg>
</template>
