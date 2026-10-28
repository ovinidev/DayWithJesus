<script setup lang="ts">
  import { computed } from 'vue'
  import {
    ArrowRight,
    LoaderCircle,
    RotateCcw,
    Sparkles
  } from 'lucide-vue-next'
  import { useFeatureFlagActive } from '@/composables/useFeatureFlagActive'

  const props = defineProps<{
    gospelText?: string
    summary?: string
    fontScale: number
    isLoading?: boolean
    isError?: boolean
    errorMessage?: string
    generate: () => void
  }>()

  const { isFeatureFlagActive } = useFeatureFlagActive('ai_button')

  const summarySections = computed(() => {
    if (!props.summary) return []

    const lines = props.summary.split('\n')
    const sections: { title: string; paragraphs: string[] }[] = []
    const headingPattern =
      /^(Resumo do Evangelho|O que o Evangelho nos traz|Ensinamentos(?: principais)?)(?::)?$/i

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line) continue

      const heading = line.match(headingPattern)
      if (heading) {
        sections.push({ title: heading[1], paragraphs: [] })
        continue
      }

      if (sections.length === 0) {
        sections.push({ title: 'Resumo do Evangelho', paragraphs: [] })
      }
      sections[sections.length - 1].paragraphs.push(line)
    }

    return sections
  })

  const showButton = computed(
    () =>
      isFeatureFlagActive.value &&
      !props.summary &&
      !props.isLoading &&
      !props.errorMessage
  )
</script>

<template>
  <div class="ai-panel">
    <Transition name="ai-state" mode="out-in">
      <button
        v-if="showButton"
        key="ask"
        class="summary-button ai-button"
        type="button"
        @click="props.generate()"
      >
        <span class="ai-button-icon" aria-hidden="true">
          <Sparkles :size="18" />
        </span>
        <span class="ai-button-copy">
          <strong>Entender com IA</strong>
          <small>Uma explicação clara das leituras de hoje</small>
        </span>
        <ArrowRight class="ai-button-arrow" :size="18" aria-hidden="true" />
      </button>

      <p
        v-else-if="props.isLoading"
        key="loading"
        class="summary-loading"
        role="status"
      >
        <LoaderCircle class="is-spinning" :size="18" aria-hidden="true" />
        <span>
          <strong>Preparando a explicação</strong>
          Lendo as leituras e organizando os ensinamentos
        </span>
      </p>

      <div
        v-else-if="props.isError"
        key="error"
        class="summary-error"
        role="alert"
      >
        <p>{{ props.errorMessage }}</p>
        <button class="summary-retry" type="button" @click="props.generate()">
          <RotateCcw :size="15" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    </Transition>

    <Transition name="summary-reveal">
      <section
        v-if="props.summary"
        class="summary-card"
        aria-label="Explicação das leituras"
      >
        <header class="summary-header">
          <span class="summary-emblem" aria-hidden="true">
            <Sparkles :size="16" />
          </span>
          <div>
            <span class="summary-kicker">Entender com IA</span>
            <h2>Explicação das leituras</h2>
          </div>
        </header>

        <div
          class="summary-sections"
          :style="{ '--gospel-font-size': `${props.fontScale}rem` }"
        >
          <section
            v-for="(section, index) in summarySections"
            :key="index"
            class="summary-section"
          >
            <h3 v-if="index > 0 || section.title !== 'Resumo do Evangelho'">
              {{ section.title }}
            </h3>
            <p
              v-for="(paragraph, paragraphIndex) in section.paragraphs"
              :key="paragraphIndex"
            >
              {{ paragraph }}
            </p>
          </section>
        </div>
      </section>
    </Transition>
  </div>
</template>
