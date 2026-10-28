<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RotateCcw
  } from 'lucide-vue-next'
  import MassPostureIcon from '@/components/MassPostureIcon.vue'
  import {
    MASS_PARTS,
    MASS_QUIZ,
    POSTURE_LABEL,
    type MassPartId
  } from '@/constants/sundayMass'
  import {
    initialMassGuide,
    progressOf,
    quizIsComplete,
    reduceMassGuide,
    scoreQuiz,
    stepAt,
    swipeDirection,
    type MassGuideAction,
    type MassGuideState
  } from '@/utils/massGuide'

  const state = ref<MassGuideState>(initialMassGuide())
  const direction = ref<'forward' | 'back'>('forward')
  const meaningOpen = ref(false)
  const responseOpen = ref(false)
  const prefersReducedMotion = ref(false)
  const quizNotice = ref('')
  const headingRef = ref<HTMLElement | null>(null)
  const shouldFocusHeading = ref(false)
  const touchOrigin = ref<{ x: number; y: number } | null>(null)

  let motionQuery: MediaQueryList | undefined

  const progress = computed(() => progressOf(state.value))
  const stepIndex = computed(() =>
    state.value.kind === 'steps' ? state.value.index : -1
  )
  const currentStep = computed(() =>
    stepIndex.value < 0 ? null : stepAt(stepIndex.value)
  )
  const activePartId = computed(() => currentStep.value?.partId ?? null)
  const activePart = computed(
    () => MASS_PARTS.find((part) => part.id === activePartId.value) ?? null
  )
  const answers = computed(() =>
    state.value.kind === 'steps' ? {} : state.value.answers
  )
  const quizScore = computed(() =>
    state.value.kind === 'result' ? scoreQuiz(state.value.answers) : null
  )
  const transitionName = computed(() => {
    if (prefersReducedMotion.value) return 'mass-instant'
    return direction.value === 'back' ? 'mass-back' : 'mass-forward'
  })
  const progressText = computed(() => {
    if (state.value.kind === 'quiz') return 'Quiz'
    if (state.value.kind === 'result') return 'Resultado'
    return `${progress.value.current} de ${progress.value.total}`
  })
  const progressDescription = computed(() => {
    if (!currentStep.value) return progressText.value
    return `Passo ${progress.value.current} de ${progress.value.total}: ${currentStep.value.title}`
  })

  const syncMotion = () => {
    prefersReducedMotion.value = motionQuery?.matches ?? false
  }

  const focusHeading = () => {
    if (!shouldFocusHeading.value) return
    shouldFocusHeading.value = false
    headingRef.value?.focus()
  }

  const dispatch = (action: MassGuideAction) => {
    if (action.type === 'answer') {
      state.value = reduceMassGuide(state.value, action)
      quizNotice.value = ''
      return
    }
    if (action.type === 'next' || action.type === 'finishQuiz') {
      direction.value = 'forward'
    }
    if (action.type === 'previous' || action.type === 'retryQuiz') {
      direction.value = 'back'
    }
    if (action.type === 'goToPart' && state.value.kind === 'steps') {
      const target = MASS_PARTS.findIndex((part) => part.id === action.partId)
      const current = MASS_PARTS.findIndex(
        (part) => part.id === currentStep.value?.partId
      )
      direction.value = target >= current ? 'forward' : 'back'
    }
    shouldFocusHeading.value = true
    state.value = reduceMassGuide(state.value, action)
    meaningOpen.value = false
    responseOpen.value = false
    quizNotice.value = ''
  }

  const submitQuiz = () => {
    if (state.value.kind !== 'quiz') return
    if (!quizIsComplete(state.value.answers)) {
      quizNotice.value = 'Responda todas as perguntas para ver o resultado.'
      return
    }
    void dispatch({ type: 'finishQuiz' })
  }

  const goToPart = (partId: MassPartId) => {
    void dispatch({ type: 'goToPart', partId })
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (state.value.kind !== 'steps') return
    const target = event.target
    if (
      target instanceof HTMLElement &&
      target.closest('input, textarea, select')
    ) {
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      void dispatch({ type: 'next' })
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      void dispatch({ type: 'previous' })
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    if (state.value.kind !== 'steps') return
    const target = event.target
    if (
      target instanceof Element &&
      target.closest('button, a, input, label')
    ) {
      touchOrigin.value = null
      return
    }
    const touch = event.changedTouches[0]
    if (!touch) return
    touchOrigin.value = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: TouchEvent) => {
    const origin = touchOrigin.value
    touchOrigin.value = null
    if (!origin || state.value.kind !== 'steps') return
    const touch = event.changedTouches[0]
    if (!touch) return
    const gesture = swipeDirection(
      touch.clientX - origin.x,
      touch.clientY - origin.y
    )
    if (gesture === 'next') void dispatch({ type: 'next' })
    if (gesture === 'previous') void dispatch({ type: 'previous' })
  }

  const choiceLabel = (questionId: string, choiceId: string) => {
    const question = MASS_QUIZ.find((item) => item.id === questionId)
    return (
      question?.choices.find((choice) => choice.id === choiceId)?.label ?? ''
    )
  }

  const isCorrect = (questionId: string) => {
    const question = MASS_QUIZ.find((item) => item.id === questionId)
    if (!question || state.value.kind === 'steps') return false
    return state.value.answers[questionId] === question.correctChoiceId
  }

  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncMotion()
    motionQuery.addEventListener('change', syncMotion)
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    motionQuery?.removeEventListener('change', syncMotion)
    window.removeEventListener('keydown', onKeydown)
  })
</script>

<template>
  <main class="page-shell">
    <article class="reading-card mass-card">
      <header class="page-header">
        <span class="eyebrow">MISSAL ROMANO</span>
        <h1
          class="page-title mt-2 text-center text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Missa dominical
        </h1>
        <span class="header-rule" aria-hidden="true"></span>
        <p class="mass-intro">
          Um passo de cada vez, como a Missa de domingo é celebrada no Brasil.
          Toque para ver o sentido e a resposta. No celular, deslize para o
          lado.
        </p>
      </header>

      <nav class="mass-timeline" aria-label="Partes da Missa">
        <button
          v-for="(part, partIndex) in MASS_PARTS"
          :key="part.id"
          type="button"
          :class="{ 'is-current': part.id === activePartId }"
          :aria-current="part.id === activePartId ? 'step' : undefined"
          @click="goToPart(part.id)"
        >
          <span class="mass-timeline-index" aria-hidden="true">{{
            partIndex + 1
          }}</span>
          {{ part.shortTitle }}
        </button>
      </nav>

      <div
        class="mass-progress"
        role="progressbar"
        :aria-valuemin="1"
        :aria-valuemax="progress.total"
        :aria-valuenow="progress.current"
        :aria-valuetext="progressDescription"
      >
        <span>{{ activePart?.title ?? 'Missa dominical' }}</span>
        <span>{{ progressText }}</span>
        <div class="mass-progress-track" aria-hidden="true">
          <span :style="{ width: `${progress.ratio * 100}%` }"></span>
        </div>
      </div>

      <p v-if="activePart" class="mass-part-summary">
        {{ activePart.summary }}
      </p>

      <div
        class="mass-stage"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <Transition
          :name="transitionName"
          mode="out-in"
          @after-enter="focusHeading"
        >
          <section
            v-if="currentStep"
            :key="currentStep.id"
            class="mass-step"
            :aria-labelledby="`mass-step-${currentStep.id}`"
          >
            <p class="mass-kicker">{{ currentStep.partTitle }}</p>
            <h2
              :id="`mass-step-${currentStep.id}`"
              ref="headingRef"
              class="mass-step-title"
              tabindex="-1"
            >
              {{ currentStep.title }}
            </h2>
            <p class="mass-posture">
              <MassPostureIcon :posture="currentStep.posture" />
              {{ POSTURE_LABEL[currentStep.posture] }}
            </p>
            <h3>O que acontece</h3>
            <p>{{ currentStep.happens }}</p>
            <p class="mass-faithful">{{ currentStep.faithful }}</p>

            <div class="mass-reveals">
              <button
                type="button"
                class="mass-reveal-button"
                :aria-expanded="meaningOpen"
                aria-controls="mass-meaning"
                @click="meaningOpen = !meaningOpen"
              >
                O que significa?
                <ChevronDown :size="18" aria-hidden="true" />
              </button>
              <div
                v-if="meaningOpen"
                id="mass-meaning"
                class="mass-reveal-panel"
              >
                <p>{{ currentStep.meaning }}</p>
                <p v-if="currentStep.citation" class="mass-citation">
                  <span>{{ currentStep.citation.source }}</span>
                  {{ currentStep.citation.note }}
                </p>
              </div>

              <button
                type="button"
                class="mass-reveal-button"
                :aria-expanded="responseOpen"
                aria-controls="mass-response"
                @click="responseOpen = !responseOpen"
              >
                O que eu respondo?
                <ChevronDown :size="18" aria-hidden="true" />
              </button>
              <div
                v-if="responseOpen"
                id="mass-response"
                class="mass-reveal-panel is-response"
              >
                <p>{{ currentStep.response }}</p>
              </div>
            </div>
          </section>

          <section
            v-else-if="state.kind === 'quiz'"
            key="quiz"
            class="mass-step"
          >
            <p class="mass-kicker">Para guardar</p>
            <h2 ref="headingRef" class="mass-step-title" tabindex="-1">
              Um minuto para revisar
            </h2>
            <p>
              Cinco perguntas sobre o que a assembleia faz e responde. Não é
              prova: é um jeito de levar a Missa com mais consciência.
            </p>
            <form class="mass-quiz" @submit.prevent="submitQuiz">
              <fieldset v-for="question in MASS_QUIZ" :key="question.id">
                <legend>{{ question.prompt }}</legend>
                <label v-for="choice in question.choices" :key="choice.id">
                  <input
                    type="radio"
                    :name="question.id"
                    :value="choice.id"
                    :checked="answers[question.id] === choice.id"
                    @change="
                      dispatch({
                        type: 'answer',
                        questionId: question.id,
                        choiceId: choice.id
                      })
                    "
                  />
                  {{ choice.label }}
                </label>
              </fieldset>
              <p v-if="quizNotice" class="mass-quiz-notice" role="alert">
                {{ quizNotice }}
              </p>
              <button class="mass-next-button" type="submit">
                Ver resultado
              </button>
            </form>
          </section>

          <section v-else key="result" class="mass-step">
            <p class="mass-kicker">Resultado</p>
            <h2 ref="headingRef" class="mass-step-title" tabindex="-1">
              Você acertou {{ quizScore?.correct }} de {{ quizScore?.total }}
            </h2>
            <p v-if="quizScore && quizScore.correct === quizScore.total">
              Você acompanhou a Missa com atenção. No próximo domingo, a
              assembleia reza essas palavras com você.
            </p>
            <p v-else>
              O que ficou em aberto está abaixo, com a resposta do Missal. Vale
              reler o passo e tentar de novo.
            </p>
            <ol class="mass-result-list">
              <li v-for="question in MASS_QUIZ" :key="question.id">
                <p>{{ question.prompt }}</p>
                <p v-if="isCorrect(question.id)" class="is-correct">
                  Certa resposta.
                </p>
                <p v-else class="is-review">
                  A resposta da Missa é:
                  {{ choiceLabel(question.id, question.correctChoiceId) }}
                </p>
              </li>
            </ol>
            <div class="mass-result-actions">
              <button
                class="mass-secondary-button"
                type="button"
                @click="dispatch({ type: 'retryQuiz' })"
              >
                <RotateCcw :size="18" aria-hidden="true" />
                Tentar de novo
              </button>
              <button
                class="mass-next-button"
                type="button"
                @click="dispatch({ type: 'restart' })"
              >
                Rever a Missa
              </button>
            </div>
          </section>
        </Transition>
      </div>

      <div v-if="state.kind === 'steps'" class="mass-nav">
        <button
          class="mass-secondary-button"
          type="button"
          :disabled="stepIndex === 0"
          @click="dispatch({ type: 'previous' })"
        >
          <ChevronLeft :size="18" aria-hidden="true" />
          Voltar
        </button>
        <button
          class="mass-next-button"
          type="button"
          @click="dispatch({ type: 'next' })"
        >
          {{ stepIndex === progress.total - 1 ? 'Fazer o quiz' : 'Avançar' }}
          <ChevronRight :size="18" aria-hidden="true" />
        </button>
      </div>
      <div v-else-if="state.kind === 'quiz'" class="mass-nav">
        <button
          class="mass-secondary-button"
          type="button"
          @click="dispatch({ type: 'previous' })"
        >
          <ChevronLeft :size="18" aria-hidden="true" />
          Voltar à Missa
        </button>
      </div>

      <p class="page-credit">
        Respostas conforme o Missal Romano, 3ª edição, em uso na Igreja no
        Brasil (CNBB).
      </p>
    </article>
  </main>
</template>
