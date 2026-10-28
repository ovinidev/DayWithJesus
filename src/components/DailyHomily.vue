<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import HomilyPlayer from '@/components/HomilyPlayer.vue'
  import { useGetHomilyVideo } from '@/composables/useGetHomilyVideo'
  import type { HomilyVideo } from '@/utils/homilyFeed'

  const props = defineProps<{
    date: string
  }>()

  const query = useGetHomilyVideo(toRef(props, 'date'))

  const localIsoDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const dateLabel = computed(() =>
    new Date(`${props.date}T12:00:00`).toLocaleDateString('pt-BR')
  )

  const searchUrl = computed(() => {
    const [year, month, day] = props.date.split('-')
    const dated = day && month && year ? `${day}-${month}-${year}` : ''
    const text = ['Padre Adriano Zandoná', 'homilia diária', dated]
      .filter(Boolean)
      .join(' ')
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`
  })

  const missingMessage = (reason: 'not_published' | 'outside_feed') => {
    if (reason === 'outside_feed') {
      return `A homilia de ${dateLabel.value} não está entre os vídeos recentes do canal.`
    }
    if (props.date >= localIsoDate()) {
      return `A homilia de ${dateLabel.value} ainda não foi publicada.`
    }
    return `Não encontrei a homilia de ${dateLabel.value}.`
  }

  type HomilyView =
    | { kind: 'loading' }
    | { kind: 'error' }
    | { kind: 'player'; video: HomilyVideo }
    | { kind: 'fallback'; message: string }

  const view = computed<HomilyView>(() => {
    if (query.isPending.value) return { kind: 'loading' }
    if (query.isError.value || !query.data.value) return { kind: 'error' }

    const lookup = query.data.value
    switch (lookup.kind) {
      case 'found':
        return { kind: 'player', video: lookup.video }
      case 'missing':
        return { kind: 'fallback', message: missingMessage(lookup.reason) }
      case 'unavailable':
        return { kind: 'error' }
      default: {
        const unreachable: never = lookup
        return unreachable
      }
    }
  })
</script>

<template>
  <section class="video-section" aria-labelledby="video-heading">
    <div class="video-heading-row">
      <span class="video-kicker">ASSISTA</span>
      <h2 id="video-heading">Homilia diária</h2>
    </div>

    <p v-if="view.kind === 'loading'" class="homily-status" role="status">
      Carregando homilia...
    </p>

    <p
      v-else-if="view.kind === 'error'"
      class="homily-status is-error"
      role="alert"
    >
      Não foi possível carregar a homilia.
    </p>

    <HomilyPlayer v-else-if="view.kind === 'player'" :video="view.video" />

    <p v-else-if="view.kind === 'fallback'" class="homily-note" role="status">
      {{ view.message }}
    </p>

    <a
      v-if="view.kind === 'error' || view.kind === 'fallback'"
      class="video-search-link"
      :href="searchUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="play-icon" aria-hidden="true">▶</span>
      <span>
        <strong>Buscar a homilia de {{ dateLabel }} do Padre Adriano</strong>
        <small> Resultados do canal do Padre Adriano Zandoná no YouTube </small>
      </span>
      <span class="external-icon" aria-hidden="true">↗</span>
    </a>
  </section>
</template>
