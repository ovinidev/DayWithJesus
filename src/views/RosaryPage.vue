<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Sparkles
  } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
  import {
    buildRosarySteps,
    rosaryGroupForDate,
    ROSARY_MYSTERY_GROUPS,
    type RosaryMysteryGroupKey
  } from '@/constants/rosary'

  const selectedGroup = ref<RosaryMysteryGroupKey>(rosaryGroupForDate())
  const currentStepIndex = ref(0)
  const steps = computed(() => buildRosarySteps(selectedGroup.value))
  const currentStep = computed(() => steps.value[currentStepIndex.value])
  const progress = computed(
    () => ((currentStepIndex.value + 1) / steps.value.length) * 100
  )
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(
    () => currentStepIndex.value === steps.value.length - 1
  )
  const mysteryOptions = Object.entries(ROSARY_MYSTERY_GROUPS) as [
    RosaryMysteryGroupKey,
    (typeof ROSARY_MYSTERY_GROUPS)[RosaryMysteryGroupKey]
  ][]

  watch(selectedGroup, () => {
    currentStepIndex.value = 0
  })

  const previousStep = () => {
    currentStepIndex.value = Math.max(0, currentStepIndex.value - 1)
  }

  const nextStep = () => {
    currentStepIndex.value = Math.min(
      steps.value.length - 1,
      currentStepIndex.value + 1
    )
  }

  const restart = () => {
    currentStepIndex.value = 0
  }
</script>

<template>
  <main class="page-shell">
    <article class="reading-card rosary-card">
      <header class="page-header">
        <span class="eyebrow">ORAÇÃO MARIANA</span>
        <Title title="Reze o Terço" />
        <span class="header-rule" aria-hidden="true"></span>
      </header>

      <section class="rosary-content" aria-live="polite">
        <div class="rosary-select-wrap">
          <label for="mystery-group">Mistérios de hoje</label>
          <select
            id="mystery-group"
            v-model="selectedGroup"
            class="prayer-select"
          >
            <option
              v-for="[key, group] in mysteryOptions"
              :key="key"
              :value="key"
            >
              {{ group.name }}
            </option>
          </select>
        </div>

        <div class="rosary-progress" aria-label="Progresso do terço">
          <span>{{ currentStep.label }}</span>
          <span>{{ currentStepIndex + 1 }} de {{ steps.length }}</span>
          <div class="rosary-progress-track" aria-hidden="true">
            <span :style="{ width: `${progress}%` }"></span>
          </div>
        </div>

        <div class="rosary-beads" aria-label="Cinco mistérios">
          <span
            v-for="mystery in 5"
            :key="mystery"
            :class="{
              'is-current': currentStep.mysteryNumber === mystery,
              'is-complete':
                currentStep.mysteryNumber && currentStep.mysteryNumber > mystery
            }"
          ></span>
        </div>

        <div class="rosary-actions">
          <button
            class="rosary-secondary-button"
            type="button"
            :disabled="isFirstStep"
            @click="previousStep"
          >
            <ChevronLeft :size="18" aria-hidden="true" /> Voltar
          </button>
          <button
            v-if="!isLastStep"
            class="rosary-next-button"
            type="button"
            @click="nextStep"
          >
            Avançar <ChevronRight :size="18" aria-hidden="true" />
          </button>
          <button
            v-else
            class="rosary-next-button"
            type="button"
            @click="restart"
          >
            <RotateCcw :size="18" aria-hidden="true" /> Rezar novamente
          </button>
        </div>

        <article class="rosary-step-card" :class="`is-${currentStep.kind}`">
          <span class="rosary-step-icon"
            ><Sparkles :size="20" aria-hidden="true"
          /></span>
          <p class="rosary-step-label">{{ currentStep.label }}</p>
          <h2>{{ currentStep.title }}</h2>
          <p class="rosary-step-text">{{ currentStep.text }}</p>
        </article>
      </section>
    </article>
  </main>
</template>
