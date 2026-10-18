<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'

  const threshold = 82
  const startY = ref(0)
  const pullDistance = ref(0)
  const isPulling = ref(false)
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | undefined

  const indicatorStyle = computed(() => ({
    transform: `translate(-50%, ${Math.min(pullDistance.value - 48, 16)}px)`,
    opacity: Math.min(pullDistance.value / 40, 1)
  }))
  const isReadyToRefresh = computed(() => pullDistance.value >= threshold)

  const updateMobileState = () => {
    isMobile.value = Boolean(mediaQuery?.matches)
  }

  const handleTouchStart = (event: TouchEvent) => {
    if (!isMobile.value || window.scrollY > 0) return

    startY.value = event.touches[0].clientY
    isPulling.value = true
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isPulling.value) return

    const distance = event.touches[0].clientY - startY.value
    if (distance <= 0 || window.scrollY > 0) {
      pullDistance.value = 0
      return
    }

    event.preventDefault()
    pullDistance.value = Math.min(distance * 0.45, threshold + 28)
  }

  const handleTouchEnd = () => {
    if (isReadyToRefresh.value) window.location.reload()

    isPulling.value = false
    pullDistance.value = 0
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(max-width: 768px) and (pointer: coarse)')
    mediaQuery.addEventListener('change', updateMobileState)
    updateMobileState()
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updateMobileState)
  })
</script>

<template>
  <div
    class="pull-to-refresh"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div
      v-if="isMobile"
      class="pull-indicator"
      :class="{ 'is-ready': isReadyToRefresh }"
      :style="indicatorStyle"
      aria-live="polite"
    >
      <RefreshCw
        :size="18"
        :class="{ 'is-spinning': isReadyToRefresh }"
        aria-hidden="true"
      />
      <span>{{
        isReadyToRefresh ? 'Solte para atualizar' : 'Puxe para atualizar'
      }}</span>
    </div>
    <slot />
  </div>
</template>
