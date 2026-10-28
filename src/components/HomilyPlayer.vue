<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue'
  import type { HomilyVideo } from '@/utils/homilyFeed'

  const props = defineProps<{
    video: HomilyVideo
  }>()

  const playing = ref(false)
  const frame = ref<HTMLIFrameElement | null>(null)

  const play = async () => {
    playing.value = true
    await nextTick()
    frame.value?.focus()
  }

  watch(
    () => props.video.videoId,
    () => {
      playing.value = false
    }
  )

  const embedUrl = computed(() =>
    playing.value
      ? `https://www.youtube-nocookie.com/embed/${props.video.videoId}?autoplay=1&rel=0`
      : ''
  )
</script>

<template>
  <div class="homily-player">
    <div class="homily-frame">
      <button
        v-if="!playing"
        class="homily-poster"
        type="button"
        :aria-label="`Assistir ${video.title}`"
        @click="play"
      >
        <img :src="video.thumbnailUrl" alt="" width="480" height="270" />
        <span class="homily-play" aria-hidden="true">▶</span>
      </button>
      <iframe
        v-else
        ref="frame"
        :src="embedUrl"
        :title="video.title"
        tabindex="0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
    </div>
    <p class="homily-caption">{{ video.title }}</p>
  </div>
</template>
