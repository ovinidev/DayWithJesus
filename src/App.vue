<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
  import Title from '@/components/Title.vue'
  import TodayDate from '@/components/TodayDate.vue'
  import Text from '@/components/Text.vue'
  import GospelSummary from '@/components/GospelSummary.vue'
  import WeekNavigator from '@/components/WeekNavigator.vue'
  import { useGetHomilyDiary } from '@/composables/useGetHomilyDiary'
  import { useGetHomilyWeek } from '@/composables/useGetHomilyWeek'
  import { dayColor } from '@/constants/dayColors'
  import { useGetGospelSummary } from './composables/useGetGospelSummary'

  const toDateInputValue = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayDate = toDateInputValue(new Date())
  const selectedDate = ref(todayDate)
  const isTodaySelected = computed(() => selectedDate.value === todayDate)
  const returnToToday = () => {
    selectedDate.value = todayDate
  }

  const { data, isLoading, isError } = useGetHomilyDiary(selectedDate)
  const { days: weekDays } = useGetHomilyWeek()

  const selectWeekDate = (date: string) => {
    selectedDate.value = date
  }

  const storedFontScale = Number(localStorage.getItem('gospel-font-scale'))
  const gospelFontScale = ref(
    Math.min(1.5, Math.max(0.85, storedFontScale || 1))
  )
  const storedSummaryFontScale = Number(
    localStorage.getItem('gospel-summary-font-scale')
  )
  const summaryFontScale = ref(
    Math.min(
      1.5,
      Math.max(0.85, storedSummaryFontScale || storedFontScale || 1)
    )
  )

  watch(gospelFontScale, (scale) => {
    localStorage.setItem('gospel-font-scale', String(scale))
  })

  watch(summaryFontScale, (scale) => {
    localStorage.setItem('gospel-summary-font-scale', String(scale))
  })

  const decreaseGospelFont = () => {
    gospelFontScale.value = Math.max(
      0.85,
      Number((gospelFontScale.value - 0.1).toFixed(2))
    )
  }

  const increaseGospelFont = () => {
    gospelFontScale.value = Math.min(
      1.5,
      Number((gospelFontScale.value + 0.1).toFixed(2))
    )
    summaryFontScale.value = Math.min(
      1.5,
      Number((summaryFontScale.value + 0.1).toFixed(2))
    )
  }

  const gospel = computed(() => data.value?.gospel)
  const gospelDay = computed(() => data.value?.date ?? '')
  const homilySearchUrl = computed(() => {
    const [day, month, year] = gospelDay.value.split('/')
    const date = day && month && year ? `${day}-${month}-${year}` : ''
    const query = ['Padre Adriano Zandoná', 'homilia diária', date]
      .filter(Boolean)
      .join(' ')
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  })
  const selectedDateLabel = computed(() =>
    new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString('pt-BR')
  )
  const gospelText = computed(
    () => gospel.value?.map((g) => `${g.title}\n${g.text}`).join('\n\n') ?? ''
  )

  const {
    data: gospelSummary,
    isLoading: isGospelLoading,
    isError: isGospelError,
    errorMessage: gospelErrorMessage,
    generate
  } = useGetGospelSummary(gospelText, gospelDay)
</script>

<template>
  <main class="page-shell">
    <article class="reading-card">
      <header class="page-header">
        <span class="eyebrow">PALAVRA DE DEUS</span>
        <Title title="Evangelho do dia" />
        <span class="header-rule" aria-hidden="true"></span>
        <div class="date-picker">
          <label for="reading-date">Ver leitura de outra data</label>
          <div class="date-picker-controls">
            <input id="reading-date" v-model="selectedDate" type="date" />
            <button
              type="button"
              :disabled="isTodaySelected"
              @click="returnToToday"
            >
              Hoje
            </button>
          </div>
        </div>
      </header>

      <WeekNavigator
        :days="weekDays"
        :selected-date="selectedDate"
        @select="selectWeekDate"
      />

      <p v-if="isLoading" class="status-message">Carregando...</p>

      <p v-else-if="isError" class="status-message error-message">
        Erro ao carregar o evangelho.
      </p>

      <Transition name="daily-reveal">
        <div v-if="data" class="reading-content">
          <section class="day-details" aria-label="Informações do dia">
            <TodayDate :date-str="data.date" />
            <div class="detail-row">
              <span class="detail-label">Cor litúrgica</span>
              <span
                class="color-value"
                :style="{ color: dayColor[data.color] }"
                >{{ data?.color }}</span
              >
            </div>
            <p class="liturgy">
              <span class="detail-label">Liturgia</span>{{ data.liturgy }}
            </p>
          </section>

          <div class="section-divider" aria-hidden="true"><span>✦</span></div>

          <section
            class="gospel-reading"
            :style="{ '--gospel-font-size': `${gospelFontScale}rem` }"
          >
            <div class="reading-tools">
              <span class="reading-tools-label">Texto do Evangelho</span>
              <div
                class="font-controls"
                role="group"
                aria-label="Tamanho do texto"
              >
                <button
                  type="button"
                  aria-label="Diminuir tamanho do texto"
                  :disabled="gospelFontScale <= 0.85"
                  @click="decreaseGospelFont"
                >
                  A−
                </button>
                <span class="font-scale" aria-live="polite"
                  >{{ Math.round(gospelFontScale * 100) }}%</span
                >
                <button
                  type="button"
                  aria-label="Aumentar tamanho do texto"
                  :disabled="gospelFontScale >= 1.5"
                  @click="increaseGospelFont"
                >
                  A+
                </button>
                <button
                  type="button"
                  class="font-reset"
                  aria-label="Redefinir tamanho do texto"
                  :disabled="gospelFontScale === 1"
                  @click="gospelFontScale = 1"
                >
                  Redefinir
                </button>
              </div>
            </div>
            <div class="reading-accordions">
              <details
                v-if="data.firstReadings.length"
                class="reading-accordion"
              >
                <summary>Primeira leitura</summary>
                <Text
                  v-for="(item, index) in data.firstReadings"
                  :key="index"
                  :gospel="item"
                />
              </details>

              <details v-if="data.psalms.length" class="reading-accordion">
                <summary>Salmo responsorial</summary>
                <div
                  v-for="(psalm, index) in data.psalms"
                  :key="index"
                  class="psalm-reading"
                >
                  <p class="reading-reference">{{ psalm.reference }}</p>
                  <p class="psalm-refrain">
                    <strong>Refrão:</strong> {{ psalm.refrain }}
                  </p>
                  <p class="reading-body">{{ psalm.text }}</p>
                </div>
              </details>

              <details
                v-if="data.secondReadings.length"
                class="reading-accordion"
              >
                <summary>Segunda leitura</summary>
                <Text
                  v-for="(item, index) in data.secondReadings"
                  :key="index"
                  :gospel="item"
                />
              </details>

              <details v-if="gospel?.length" class="reading-accordion" open>
                <summary>Evangelho</summary>
                <Text
                  v-for="(item, index) in gospel"
                  :key="index"
                  :gospel="item"
                />
              </details>

              <details
                v-if="data.extraReadings.length"
                class="reading-accordion"
              >
                <summary>Leituras adicionais</summary>
                <div
                  v-for="(item, index) in data.extraReadings"
                  :key="index"
                  class="extra-reading"
                >
                  <p v-if="item.type || item.title" class="reading-reference">
                    {{ item.type || item.title }}
                  </p>
                  <p v-if="item.reference" class="reading-reference">
                    {{ item.reference }}
                  </p>
                  <p class="reading-body">{{ item.text }}</p>
                </div>
              </details>
            </div>
          </section>

          <section class="video-section" aria-labelledby="video-heading">
            <div class="video-heading-row">
              <span class="video-kicker">ASSISTA</span>
              <h2 id="video-heading">Homilia diária</h2>
            </div>
            <a
              class="video-search-link"
              :href="homilySearchUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="play-icon" aria-hidden="true">▶</span>
              <span>
                <strong
                  >Buscar a homilia de {{ selectedDateLabel }} do Padre
                  Adriano</strong
                >
                <small
                  >Resultados do canal do Padre Adriano Zandoná no
                  YouTube</small
                >
              </span>
              <span class="external-icon" aria-hidden="true">↗</span>
            </a>
          </section>

          <details class="liturgy-accordion">
            <summary>Orações e antífonas</summary>
            <div class="liturgy-texts">
              <section v-if="data.prayers.collect">
                <h3>Oração da coleta</h3>
                <p>{{ data.prayers.collect }}</p>
              </section>
              <section v-if="data.prayers.offerings">
                <h3>Oração sobre as oferendas</h3>
                <p>{{ data.prayers.offerings }}</p>
              </section>
              <section v-if="data.prayers.communion">
                <h3>Oração depois da comunhão</h3>
                <p>{{ data.prayers.communion }}</p>
              </section>
              <section
                v-for="(extra, index) in data.prayers.extras"
                :key="index"
              >
                <h3>{{ extra.title || extra.type || 'Oração adicional' }}</h3>
                <p>{{ extra.text }}</p>
              </section>
              <section v-if="data.antiphons.entrance">
                <h3>Antífona de entrada</h3>
                <p>{{ data.antiphons.entrance }}</p>
              </section>
              <section v-if="data.antiphons.communion">
                <h3>Antífona da comunhão</h3>
                <p>{{ data.antiphons.communion }}</p>
              </section>
            </div>
          </details>

          <GospelSummary
            v-if="gospel"
            :summary="gospelSummary"
            :font-scale="summaryFontScale"
            :is-loading="isGospelLoading"
            :is-error="isGospelError"
            :error-message="gospelErrorMessage"
            :generate="generate"
          />
        </div>
      </Transition>

      <footer class="page-credit">
        Feito com amor por
        <a
          href="https://github.com/ovinidev"
          target="_blank"
          rel="noopener noreferrer"
        >
          @ovinidev
        </a>
      </footer>
    </article>
  </main>

  <VueQueryDevtools button-position="bottom-right" />
</template>
