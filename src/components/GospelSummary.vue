<script setup lang="ts">
  import { computed } from 'vue'
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
    const headingPattern = /^(Resumo do Evangelho|O que o Evangelho nos traz|Ensinamentos(?: principais)?)(?::)?$/i

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
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      v-if="
        isFeatureFlagActive &&
        !props.summary &&
        !props.isLoading &&
        !props.errorMessage
      "
      class="summary-button my-2 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition active:scale-[0.98]"
      @click="$props.generate()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      Entender evangelho
    </button>

    <p v-if="props.isLoading" class="summary-loading">
      <span class="loading-mark" aria-hidden="true">✦</span>
      Gerando resumo...
    </p>

    <p v-if="props.isError" class="summary-error">
      {{ props.errorMessage }}
    </p>

    <Transition name="summary-reveal">
      <section v-if="props.summary" class="summary-card" aria-label="Resumo do Evangelho">
        <header class="summary-header">
          <span class="summary-emblem" aria-hidden="true">✦</span>
          <div>
            <span class="summary-kicker">PARA REFLETIR</span>
            <h2>Resumo do Evangelho</h2>
          </div>
        </header>

      <div
        class="summary-sections"
        :style="{ '--gospel-font-size': `${props.fontScale}rem` }"
      >
          <section v-for="(section, index) in summarySections" :key="index" class="summary-section">
            <h3 v-if="index > 0 || section.title !== 'Resumo do Evangelho'">{{ section.title }}</h3>
            <p v-for="(paragraph, paragraphIndex) in section.paragraphs" :key="paragraphIndex">
              {{ paragraph }}
            </p>
          </section>
        </div>
      </section>
    </Transition>
  </div>
</template>
