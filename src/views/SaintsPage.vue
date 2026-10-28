<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BookHeart, Sparkles } from 'lucide-vue-next'
  import Title from '@/components/Title.vue'
  import { useGetSaintsByDate } from '@/composables/useGetSaintsByDate'
  import { formatLocalIso, isIsoDate } from '@/utils/liturgicalDate'

  const todayDate = formatLocalIso(new Date())
  const selectedDate = ref(todayDate)
  const brokenImages = ref<Record<string, true>>({})
  const isTodaySelected = computed(() => selectedDate.value === todayDate)
  const selectedDateLabel = computed(() => {
    if (!isIsoDate(selectedDate.value)) return ''
    return new Date(`${selectedDate.value}T12:00:00`).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  })

  const { data, isLoading, isError } = useGetSaintsByDate(selectedDate)
  const saints = computed(() => data.value?.results ?? [])
  const liturgia = computed(() => data.value?.liturgia ?? '')
  const showLiturgicalDay = computed(() => {
    if (!liturgia.value) return false
    if (saints.value.length !== 1) return true
    return saints.value[0]?.nome !== liturgia.value
  })

  const returnToToday = () => {
    selectedDate.value = todayDate
  }

  const patronLabel = (nome: string) =>
    /^(?:santa|santas|nossa senhora)\b/i.test(nome) ? 'Padroeira' : 'Padroeiro'

  const hideImage = (key: string) => {
    brokenImages.value = { ...brokenImages.value, [key]: true }
  }
</script>

<template>
  <main class="page-shell">
    <article class="reading-card saints-card">
      <header class="page-header">
        <span class="eyebrow">CALENDÁRIO LITÚRGICO</span>
        <Title title="Santo do dia" />
        <span class="header-rule" aria-hidden="true"></span>
        <div class="date-picker">
          <label for="saint-date">Consultar outra data</label>
          <div class="date-picker-controls">
            <input id="saint-date" v-model="selectedDate" type="date" />
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

      <p v-if="isLoading" class="status-message" aria-live="polite">
        Carregando santo do dia...
      </p>
      <p v-else-if="isError" class="status-message error-message" role="alert">
        Não foi possível carregar o santo do dia.
      </p>

      <Transition v-else-if="data" name="daily-reveal">
        <section class="saints-content" aria-live="polite">
          <p class="saints-date">{{ selectedDateLabel }}</p>
          <p v-if="showLiturgicalDay" class="liturgical-day">{{ liturgia }}</p>

          <div v-if="saints.length" class="saints-list">
            <article
              v-for="(saint, index) in saints"
              :key="`${saint.nome}-${index}`"
              class="saint-profile"
            >
              <img
                v-if="saint.imagem && !brokenImages[`${saint.nome}-${index}`]"
                class="saint-image"
                :src="saint.imagem"
                :alt="`Imagem de ${saint.nome}`"
                @error="hideImage(`${saint.nome}-${index}`)"
              />
              <div class="saint-profile-heading">
                <span class="saint-emblem">
                  <Sparkles :size="17" aria-hidden="true" />
                </span>
                <div>
                  <p v-if="saint.grau" class="saint-rank">{{ saint.grau }}</p>
                  <h2>{{ saint.nome }}</h2>
                </div>
              </div>

              <section
                v-if="saint.nascimento || saint.morte || saint.padroeiro"
                class="saint-text-section saint-facts"
              >
                <p v-if="saint.nascimento">
                  <span class="detail-label">Nascimento</span>
                  {{ saint.nascimento }}
                </p>
                <p v-if="saint.morte">
                  <span class="detail-label">Morte</span>
                  {{ saint.morte }}
                </p>
                <p v-if="saint.padroeiro">
                  <span class="detail-label">{{
                    patronLabel(saint.nome)
                  }}</span>
                  {{ saint.padroeiro }}
                </p>
              </section>

              <section v-if="saint.historia" class="saint-text-section">
                <h3>
                  <BookHeart :size="18" aria-hidden="true" />
                  História
                </h3>
                <p>{{ saint.historia }}</p>
              </section>
              <section v-else class="saint-text-section">
                <p>A história deste santo não está disponível agora.</p>
              </section>
              <section v-if="saint.reflexao" class="saint-text-section">
                <h3>
                  <Sparkles :size="18" aria-hidden="true" />
                  Reflexão
                </h3>
                <p>{{ saint.reflexao }}</p>
              </section>
              <section
                v-if="saint.oracao"
                class="saint-text-section saint-prayer"
              >
                <h3>Oração</h3>
                <p>{{ saint.oracao }}</p>
              </section>
              <p v-if="saint.wikipediaUrl" class="saint-source">
                Texto:
                <a
                  :href="saint.wikipediaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Wikipédia</a
                >
                ·
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  >CC BY-SA</a
                >
              </p>
            </article>
          </div>
          <p v-else class="empty-state">
            Neste dia a Igreja não celebra um santo próprio.
          </p>
        </section>
      </Transition>

      <p v-else class="status-message">Escolha uma data para ver o santo.</p>
    </article>
  </main>
</template>
